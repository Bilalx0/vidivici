"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", published: false })
  const [submitting, setSubmitting] = useState(false)

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">New Blog Post</h1>
      <form onSubmit={async (e) => { e.preventDefault(); setSubmitting(true); /* API call */ router.push("/admin/blog") }} className="max-w-3xl space-y-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Title</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Excerpt</label>
          <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Content</label>
          <textarea rows={15} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Cover Image</label>
          <input type="file" accept="image/*" className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#dbb241] file:text-black" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#dbb241]" />
          <span className="text-sm text-gray-300">Publish immediately</span>
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="bg-[#dbb241] text-black px-8 py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : "Save Post"}
          </button>
          <button type="button" onClick={() => router.back()} className="border border-[#2a2a2a] text-gray-300 px-8 py-3 rounded hover:border-[#dbb241] transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  )
}
