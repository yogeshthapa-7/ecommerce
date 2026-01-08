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
    <Sidebar className="bg-black border-r border-gray-800/50">
      <SidebarContent className="bg-black">
        {/* Nike Logo Section */}
        <div className="relative py-6 px-6">
          <div className="flex items-center justify-center mb-2">
            <img
              src="https://i.pinimg.com/736x/00/41/dd/0041ddfa1ba9700a2cf389244e3f4ae7.jpg"
              alt="Nike"
              className="h-20 w-30"
            />
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
              Nike Admin Portal
            </p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent className="px-4 py-5">
            <SidebarMenu className="space-y-1">
              {items.map((item, idx) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="group relative flex items-center gap-3 px-4 py-5 rounded-lg transition-all duration-200 text-gray-400 hover:text-black hover:bg-gray-900 overflow-hidden"
                      style={{
                        animation: `slideRight 0.4s ease-out ${idx * 0.05}s backwards`
                      }}
                    >
                      {/* Hover accent line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      {/* Icon */}
                      <item.icon
                        size={20}
                        className="relative z-10 text-gray-500 group-hover:text-orange-500 transition-colors duration-200 flex-shrink-0"
                      />
                      
                      {/* Text */}
                      <span className="relative z-10 font-bold text-sm tracking-tight">
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
        <div className="mt-auto p-4">
          <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-orange-600 to-red-600">
            <div className="relative z-10">
              <h3 className="text-white font-black text-base uppercase tracking-tight mb-1">
                Just Do It
              </h3>
              <p className="text-white/90 text-xs font-medium">
                Nike Admin v1.0
              </p>
            </div>
            
            {/* Decorative swoosh element */}
            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          </div>
        </div>
      </SidebarContent>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      ` }} />
    </Sidebar>
  )
}