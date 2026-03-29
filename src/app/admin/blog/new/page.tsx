"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

function NewBlogPostForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", published: false, coverImage: "", category: "News & Updates" })
  const [submitting, setSubmitting] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "")

  useEffect(() => {
    if (editId) {
      setLoadingPost(true)
      fetch(`/api/blog/${editId}`)
        .then((res) => {
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then((post) => {
          setForm({
            title: post.title || "",
            slug: post.slug || "",
            content: post.content || "",
            excerpt: post.excerpt || "",
            published: post.published || false,
            coverImage: post.coverImage || "",
            category: post.category || "News & Updates",
          })
        })
        .catch(() => {
          toast.error("Failed to load post")
        })
        .finally(() => setLoadingPost(false))
    }
  }, [editId])

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("files", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error()
      const data = await res.json()
      return data.urls?.[0] || null
    } catch {
      toast.error("Failed to upload image")
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let coverImage = form.coverImage

      // Handle file upload if a file is selected
      const fileInput = fileInputRef.current
      if (fileInput?.files?.[0]) {
        const uploadedUrl = await handleFileUpload(fileInput.files[0])
        if (uploadedUrl) {
          coverImage = uploadedUrl
        }
      }

      const payload = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt,
        published: form.published,
        coverImage,
        category: form.category,
      }

      const url = editId ? `/api/blog/${editId}` : "/api/blog"
      const method = editId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      toast.success(editId ? "Post updated successfully" : "Post created successfully")
      router.push("/admin/blog")
    } catch {
      toast.error(editId ? "Failed to update post" : "Failed to create post")
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingPost) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Edit Blog Post</h1>
        <p className="text-sm text-mist-400">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{editId ? "Edit Blog Post" : "New Blog Post"}</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div>
          <label className="text-xs text-mist-400 block mb-1">Title</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-mist-400 block mb-1">Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-mist-400 block mb-1">Excerpt</label>
          <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs text-mist-400 block mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none">
            <option>Exotic Cars</option>
            <option>Luxury Villas</option>
            <option>Events</option>
            <option>Lifestyle & Travel</option>
            <option>News & Updates</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-mist-400 block mb-1">Content</label>
          <textarea rows={15} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs text-mist-400 block mb-1">Cover Image</label>
          {form.coverImage && (
            <p className="text-xs text-mist-500 mb-1">Current: {form.coverImage}</p>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} className="text-sm text-mist-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#dbb241] file:text-black" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#dbb241]" />
          <span className="text-sm text-mist-300">Publish immediately</span>
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="bg-[#dbb241] text-black px-8 py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : "Save Post"}
          </button>
          <button type="button" onClick={() => router.back()} className="border border-[#2a2a2a] text-mist-300 px-8 py-3 rounded hover:border-[#dbb241] transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default function NewBlogPostPage() {
  return (
    <Suspense fallback={<div><h1 className="text-2xl font-bold mb-8">Blog Post</h1><p className="text-sm text-mist-400">Loading...</p></div>}>
      <NewBlogPostForm />
    </Suspense>
  )
}
