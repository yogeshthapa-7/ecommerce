import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
<div className="flex min-h-screen w-full bg-black">
  <SidebarProvider>
    <AppSidebar />

    <main className="flex-1 relative bg-black text-white">
      <SidebarTrigger className="absolute left-4 top-4 z-20 text-gray-400 hover:bg-gray-900 hover:text-orange-500 border border-gray-800 bg-black/70 backdrop-blur" />
      {children}
    </main>
  </SidebarProvider>
</div>
  )
}