"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { UserIcon, LogOutIcon, LogIn, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from 'aws-amplify/auth';
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useAuth } from "../auth/AuthContext";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";
import { TermsAgreementBanner } from "../auth/TermsAgreementBanner";

interface LayoutProps {
  children: ReactNode;
}

// Helper function to check if a path is active (including subpaths)
const isActivePath = (path: string, pathname: string) => {
  if (path === '/' && pathname === '/') {
    return true;
  }
  return pathname.startsWith(path);
};

// Style constants
const STYLES = {
  activeLink: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium",
  hoverEffect: "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400"
} as const;

export function PublicLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  // Theme constants
  const bgColor = currentTheme === 'dark' ? 'bg-gray-950' : 'bg-white';
  const borderColor = currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = currentTheme === 'dark' ? 'text-gray-50' : 'text-gray-900';
  const mutedTextColor = currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`flex flex-col min-h-screen ${bgColor}`}>
      {/* Header with navigation */}
      <header className={`border-b ${borderColor} ${bgColor} py-4 px-6`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <h1 className={`text-xl font-bold ${textColor} ${STYLES.hoverEffect}`}>Moorcheh</h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="group text-sm font-medium">
                <span className={isActivePath('/dashboard', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Dashboard
                </span>
              </Link>
              
              <Link href="/namespaces" className="group text-sm font-medium">
                <span className={isActivePath('/namespaces', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Namespaces
                </span>
              </Link>
              <Link href="/playground" className="group text-sm font-medium">
                <span className={isActivePath('/playground', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Playground
                </span>
              </Link>
              <Link href="/api-keys" className="group text-sm font-medium">
                <span className={isActivePath('/api-keys', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  API Keys
                </span>
              </Link>
              <a href="https://docs.moorcheh.ai" target="_blank" rel="noopener noreferrer" className="group text-sm font-medium">
                <span className={`${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Documentation
                </span>
              </a>
              <Link href="/pricing" className="group text-sm font-medium">
                <span className={isActivePath('/pricing', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Pricing
                </span>
              </Link>
            </nav>

            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { user, needsTermsAgreement, refreshUser } = useAuth();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [showTermsBanner, setShowTermsBanner] = useState(false);
  
  // Show terms banner when user needs to agree to terms
  useEffect(() => {
    setShowTermsBanner(needsTermsAgreement);
  }, [needsTermsAgreement]);
  
  // Theme constants
  const bgColor = currentTheme === 'dark' ? 'bg-gray-950' : 'bg-white';
  const borderColor = currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = currentTheme === 'dark' ? 'text-gray-50' : 'text-gray-900';
  const mutedTextColor = currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const dropdownBgColor = currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const dropdownBorderColor = currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const dropdownTextColor = currentTheme === 'dark' ? 'text-gray-50' : 'text-gray-900';
  const separatorColor = currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to homepage or auth page if needed
      window.location.href = '/'; 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ')
      .map((part: string) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex flex-col min-h-screen ${bgColor}`}>
      {/* Header with navigation */}
      <header className={`border-b ${borderColor} ${bgColor} py-4 px-6`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <h1 className={`text-xl font-bold ${textColor} ${STYLES.hoverEffect}`}>Moorcheh</h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="group text-sm font-medium">
                <span className={isActivePath('/dashboard', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Dashboard
                </span>
              </Link>
              <Link href="/namespaces" className="group text-sm font-medium">
                <span className={isActivePath('/namespaces', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Namespaces
                </span>
              </Link>
              <Link href="/playground" className="group text-sm font-medium">
                <span className={isActivePath('/playground', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Playground
                </span>
              </Link>
              <Link href="/api-keys" className="group text-sm font-medium">
                <span className={isActivePath('/api-keys', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  API Keys
                </span>
              </Link>
              <a href="https://docs.moorcheh.ai" target="_blank" rel="noopener noreferrer" className="group text-sm font-medium">
                <span className={`${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Documentation
                </span>
              </a>
              <Link href="/pricing" className="group text-sm font-medium">
                <span className={isActivePath('/pricing', pathname) ? STYLES.activeLink : `${mutedTextColor} ${STYLES.hoverEffect}`}>
                  Pricing
                </span>
              </Link>
            </nav>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.picture || undefined} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`w-56 ${dropdownBgColor} ${dropdownBorderColor} ${dropdownTextColor} border`}>
                <DropdownMenuLabel className={dropdownTextColor}>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className={separatorColor} />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer group">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span className={`${dropdownTextColor} ${STYLES.hoverEffect}`}>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="cursor-pointer group">
                    <span className="mr-2">💳</span>
                    <span className={`${dropdownTextColor} ${STYLES.hoverEffect}`}>Pricing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/support" className="cursor-pointer group">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span className={`${dropdownTextColor} ${STYLES.hoverEffect}`}>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-400 hover:text-red-500 focus:text-red-500 rounded-sm"
                >
                  <div className="flex items-center gap-2 px-2 py-1 w-full">
                    <LogOutIcon className="h-4 w-4" />
                    <span>Sign out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
      
      {/* Terms Agreement Banner */}
      {showTermsBanner && (
        <TermsAgreementBanner
          onClose={() => setShowTermsBanner(false)}
          onAgree={() => {
            refreshUser();
            setShowTermsBanner(false);
          }}
        />
      )}
    </div>
  );
}
