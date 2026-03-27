import AdminSidebar from "@/components/layout/AdminSidebar"
import { Toaster } from "react-hot-toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-10">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
