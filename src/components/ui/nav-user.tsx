"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconHelp,
  IconMoon,
  IconSun,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

function truncateEmail(email: string, maxLength: number = 20): string {
  if (email.length <= maxLength) return email
  
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  // If the email is too long, truncate the local part
  const maxLocalLength = maxLength - domain.length - 2 // -2 for '@' and '...'
  
  if (localPart.length > maxLocalLength) {
    return `${localPart.substring(0, maxLocalLength)}...@${domain}`
  }
  
  return email
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const { theme, systemTheme, setTheme } = useTheme()
  const router = useRouter()
  
  // Determine the effective theme
  const currentTheme = theme === 'system' ? systemTheme : theme
  
  // Truncate email for display
  const displayEmail = truncateEmail(user.email, 20)
  
  // Theme-dependent styles following the dashboard pattern
  const hoverBg = currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
  const cardBg = currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
  const activeBg = currentTheme === 'dark' ? 'data-[state=open]:bg-gray-800' : 'data-[state=open]:bg-gray-100'
  const dropdownHoverBg = currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'

  // Close sidebar on mobile when navigating
  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleAccountClick = () => {
    closeSidebarIfMobile()
    router.push('/profile')
  }

  const handleBillingClick = () => {
    closeSidebarIfMobile()
    router.push('/pricing')
  }

  const handleSupportClick = () => {
    closeSidebarIfMobile()
    router.push('/support')
  }



  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const handleLogout = async () => {
    try {
      
      // Redirect to homepage
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`${activeBg} data-[state=open]:text-sidebar-accent-foreground ${hoverBg} rounded-lg p-3`}
            >
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {displayEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg ${cardBg}`}
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={4}
            alignOffset={10}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className={dropdownHoverBg} onClick={handleAccountClick}>
                <IconUserCircle />
                Profile
              </DropdownMenuItem>

            </DropdownMenuGroup>


            
            <DropdownMenuItem className={dropdownHoverBg} onClick={handleThemeToggle}>
              {currentTheme === 'dark' ? <IconSun /> : <IconMoon />}
              {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={dropdownHoverBg} onClick={handleSupportClick}>
                <IconHelp />
                Support
              </DropdownMenuItem>
            <DropdownMenuItem className={dropdownHoverBg} onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
