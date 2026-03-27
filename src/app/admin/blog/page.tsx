import Link from "next/link"

const posts = [
  { id: "1", title: "Luxury Winter Road Trips from Los Angeles", status: "Published", date: "Dec 15, 2024" },
  { id: "2", title: "Lamborghini Urus S vs Urus SE", status: "Published", date: "Dec 1, 2024" },
  { id: "3", title: "The FALCON Difference", status: "Draft", date: "Nov 20, 2024" },
  { id: "4", title: "5 Exotic Cars That Depreciated the Least", status: "Published", date: "Nov 10, 2024" },
]

export default function AdminBlogPage() {
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
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-mist-900">{p.title}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${p.status === "Published" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>{p.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-mist-500">{p.date}</td>
                <td className="px-6 py-4 flex gap-2">
                  <Link href={`/admin/blog/${p.id}/edit`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                  <button className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
