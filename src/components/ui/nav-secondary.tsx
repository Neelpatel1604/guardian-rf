"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { theme, systemTheme } = useTheme()
  const { isMobile, setOpenMobile } = useSidebar()

  // Determine the effective theme
  const currentTheme = theme === 'system' ? systemTheme : theme
  
  // Theme-dependent styles following the dashboard pattern
  const hoverBg = currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="space-y-1">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.title}
                className={`${hoverBg} rounded-lg transition-colors duration-200 px-3 py-2.5`}
              >
                <Link href={item.url} onClick={handleLinkClick} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
