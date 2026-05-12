import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#080808]">
      <SidebarProvider>
        <AppSidebar />

        <main className="relative flex-1 bg-[#080808] text-white">
          <SidebarTrigger className="absolute left-4 top-4 z-20 border border-white/10 bg-black/70 text-white/50 backdrop-blur transition-colors hover:bg-white hover:text-black" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
