"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

interface BlogPost {
  id: string
  title: string
  published: boolean
  createdAt: string
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/blog?limit=100&published=all")
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      toast.error("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Post deleted successfully")
      fetchPosts()
    } catch {
      toast.error("Failed to delete post")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
          + New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-mist-500 border-b border-gray-200">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-mist-500">Loading...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-mist-500">No blog posts found.</td>
              </tr>
            ) : (
              posts.map((p) => {
                const status = p.published ? "Published" : "Draft"
                const date = new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-mist-900">{p.title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${status === "Published" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>{status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-mist-500">{date}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => router.push(`/admin/blog/new?edit=${p.id}`)} className="text-xs text-black font-medium hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p.id, p.title)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
