"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Search, Plus, FileText } from "lucide-react"

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
  const [search, setSearch] = useState("")

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-mist-900">Manage Blog Posts</h1>
        <Link href="/admin/blog/new" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-mist-800 transition-colors">
          <Plus size={14} /> New Post
        </Link>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
        <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-mist-200 rounded-lg text-sm text-mist-900 placeholder:text-mist-400 outline-none focus:border-black transition" />
      </div>

      {(() => {
        const q = search.toLowerCase()
        const filtered = posts.filter(p => !q || p.title.toLowerCase().includes(q))

        return loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-mist-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><FileText size={40} className="mx-auto text-mist-300 mb-3" /><p className="text-mist-400 text-sm">No blog posts found</p></div>
        ) : (
          <div className="bg-white border border-mist-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-mist-500 border-b border-mist-200 bg-mist-50/50">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const status = p.published ? "Published" : "Draft"
                  const date = new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  return (
                    <tr key={p.id} className="border-b border-mist-100 hover:bg-mist-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-mist-400 flex-shrink-0" />
                          <span className="text-sm text-mist-900">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded ${status === "Published" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>{status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-mist-500 hidden sm:table-cell">{date}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => router.push(`/admin/blog/new?edit=${p.id}`)} className="text-xs text-black font-medium hover:underline">Edit</button>
                          <button onClick={() => handleDelete(p.id, p.title)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })()}
    </div>
  )
}
