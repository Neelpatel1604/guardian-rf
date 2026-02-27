"use client"

import { type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
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
  const { theme, systemTheme } = useTheme()
  const { isMobile, setOpenMobile } = useSidebar()
  
  // Determine the effective theme
  const currentTheme = theme === 'system' ? systemTheme : theme
  
  // Theme-dependent styles following the dashboard pattern
  const hoverBg = currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
  const activeBg = currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
  const activeTextColor = currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
  const activeBorderColor = currentTheme === 'dark' ? 'border-blue-500' : 'border-blue-600'

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="space-y-1">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActivePath(item.url, pathname)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  className={`${isActive ? activeBg : hoverBg} rounded-lg transition-colors duration-200 px-3 py-2.5 relative ${
                    isActive ? 'border-l-2 ' + activeBorderColor : ''
                  }`}
                >
                  <Link href={item.url} onClick={handleLinkClick} className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon className={`h-5 w-5 ${isActive ? activeTextColor : ''}`} />
                    )}
                    <span className={`font-medium group-data-[collapsible=icon]:hidden ${isActive ? activeTextColor : ''}`}>
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
