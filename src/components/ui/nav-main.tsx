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
  if (path === "/") return pathname === "/"
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
  const activeBg = "bg-primary/15"
  const activeTextColor = "text-primary font-semibold"
  const activeIndicator = "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:rounded-full before:bg-primary"

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
                  className={`${isActive ? activeBg : hoverBg} rounded-lg transition-all duration-200 px-3 py-2.5 pl-4 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!items-center group-data-[collapsible=icon]:!justify-center ${
                    isActive ? `relative ${activeIndicator}` : ''
                  }`}
                >
                  <Link href={item.url} onClick={handleLinkClick} className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon className={`!h-7 !w-7 shrink-0 group-data-[collapsible=icon]:!h-5 group-data-[collapsible=icon]:!w-5 ${isActive ? activeTextColor : ''}`} />
                    )}
                    <span className={`font-medium text-sm group-data-[collapsible=icon]:hidden ${isActive ? activeTextColor : ''}`}>
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
