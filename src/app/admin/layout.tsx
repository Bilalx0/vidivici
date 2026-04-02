import AdminSidebar from "@/components/layout/AdminSidebar"
import { Toaster } from "react-hot-toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-mist-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-14 sm:p-6 sm:pt-6 lg:p-10">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
