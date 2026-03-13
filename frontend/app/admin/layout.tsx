import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
     <div className="flex min-h-screen w-full">
    <SidebarProvider>
         
      <AppSidebar />
      
      <main className="flex-1 relative">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    </div>
  )
}