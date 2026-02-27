"use client"

import { type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Helper function to check if a path is active (including subpaths)
function isActivePath(path: string, pathname: string) {
  if (path === '/' && pathname === '/') {
    return true
  }
  return pathname.startsWith(path)
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    external?: boolean
  }[]
}) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  // Use token-based Guardian RF palette so theme toggle changes colors via CSS vars
  const hoverBg = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  const activeBg = "bg-sidebar-accent"
  const activeTextColor = "text-sidebar-accent-foreground"
  const activeBorderColor = "border-sidebar-primary"

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="space-y-3">
        <SidebarMenu className="gap-3">
          {items.map((item) => {
            const isActive = isActivePath(item.url, pathname)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`${isActive ? activeBg : hoverBg} rounded-xl transition-colors duration-200 px-5 py-4 relative ${
                    isActive ? 'border-l-2 ' + activeBorderColor : ''
                  }`}
                >
                  <Link href={item.url} onClick={handleLinkClick} className="flex items-center gap-4">
                    {item.icon && (
                      <item.icon className={`h-10 w-10 ${isActive ? activeTextColor : ''}`} />
                    )}
                    <span className={`font-semibold text-base group-data-[collapsible=icon]:hidden ${isActive ? activeTextColor : ''}`}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
