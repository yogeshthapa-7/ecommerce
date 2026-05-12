import {
  Calendar,
  ClipboardCheck,
  Home,
  Inbox,
  PackageSearch,
  Settings,
  UsersRound,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Category", url: "/admin/categories", icon: Inbox },
  { title: "Customers", url: "/admin/customers", icon: UsersRound },
  { title: "Orders", url: "/admin/orders", icon: ClipboardCheck },
  { title: "Products", url: "/admin/products", icon: PackageSearch },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-[#080808]">
      <SidebarContent className="bg-[#080808]">
        <div className="px-5 py-6 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
              N
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-black uppercase tracking-normal text-white">Nike Admin</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Control room</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent className="px-3 py-4 group-data-[collapsible=icon]:px-2">

            <SidebarMenu className="space-y-1">
              {items.map((item, idx) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="group flex h-12 items-center gap-3 rounded-xl px-3 text-white/48 transition-colors hover:bg-white hover:text-black group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0"
                    >
                      <item.icon className="size-5 flex-shrink-0 transition-colors group-hover:text-black" />
                      <span className="text-sm font-bold tracking-normal group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom CTA Section */}
        <div className="mt-auto p-4 group-data-[collapsible=icon]:hidden">
          <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
            <h3 className="mb-1 text-sm font-black uppercase tracking-normal text-white">
              Admin v1.0
            </h3>
            <p className="text-xs font-medium leading-relaxed text-white/45">
              Fast catalog, orders, and customer control.
            </p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
