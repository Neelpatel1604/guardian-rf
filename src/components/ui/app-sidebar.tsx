"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconDashboard,
  IconDatabase,
  IconKey,
  IconSparkles,
  IconBook,
} from "@tabler/icons-react"
import { PanelLeft, PanelLeftClose } from "lucide-react"
import { useTheme } from "next-themes"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { NavMain } from "@/components/ui/nav-main"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Namespaces",
      url: "/namespaces",
      icon: IconDatabase,
    },
    {
      title: "API Keys",
      url: "/api-keys",
      icon: IconKey,
    },
    {
      title: "Playground",
      url: "/playground",
      icon: IconSparkles,
    },
    {
      title: "Documentation",
      url: "https://docs.moorcheh.ai",
      icon: IconBook,
      external: true,
    },
  ],
  navSecondary: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar()
  const { theme, systemTheme } = useTheme()

  
  // Determine the effective theme
  const currentTheme = theme === 'system' ? systemTheme : theme
  
  // Theme-dependent styles following the dashboard pattern
  const textColor = currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedTextColor = currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const hoverBg = currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
  const sidebarBg = currentTheme === 'dark' ? 'bg-gray-950' : 'bg-white'
  const borderColor = currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" {...props} className={`${sidebarBg} ${textColor} ${borderColor} border-r`}>
      <SidebarHeader className={`${sidebarBg} border-b ${borderColor} px-4 py-3`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center w-full justify-between">
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-0 flex-1 hover:bg-transparent"
              >
                <a onClick={() => toggleSidebar()} className="flex items-center gap-3 min-w-0">
                  <div className="group/logo relative flex-shrink-0 w-8 h-8 -ml-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <Image
                        src="/image.png"
                        alt="Guardian RF"
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    </div>
                    {/* Show expand button on hover when collapsed - only when sidebar is collapsed */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute inset-0 h-8 w-8 p-0 ${mutedTextColor} ${sidebarBg} opacity-0 group-hover/logo:opacity-100 transition-opacity duration-200 group-data-[collapsible=icon]:block hidden rounded-lg`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSidebar();
                      }}
                    >
                      <PanelLeft className=" ml-1 h-7 w-7" />
                    </Button>
                  </div>
                  <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">Guardian RF</span>
                </a>
              </SidebarMenuButton>
              {/* Show collapse button only when expanded */}
              <Button
                variant="ghost"
                size="sm"
                className={`${mutedTextColor} ${hoverBg} shrink-0 h-8 w-8 p-0 group-data-[collapsible=icon]:hidden`}
                onClick={toggleSidebar}
              >
                <PanelLeftClose className=" h-7 w-7" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={`${sidebarBg} flex-1 px-2 py-4`}>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className={`${sidebarBg} border-t ${borderColor} p-2`}>
        <NavUser
          user={{
            name: "Guardian Operator",
            email: "operator@guardianrf.app",
            avatar: "/avatars/user.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
