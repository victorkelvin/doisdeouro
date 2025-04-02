import React from "react"

import { Menu, LogOut, User, Settings } from "lucide-react"
import LogoAcademia from "./LogoAcademia"
import { useSidebar } from "../contexts/SidebarContext"

function TopBar({ userId , onLogout }) {
  const { toggleSidebar } = useSidebar()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm">
      {/* Sidebar toggle button */}

      <div className="flex items-center gap-4">
        <button
          id="sidebar-toggle"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={toggleSidebar}

          
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        <LogoAcademia className="hidden md:flex" />

        <LogoAcademia className="flex md:hidden" />

      </div>


      <div className="flex items-center gap-2">
        {/* User dropdown */}

        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-accent/50"
            onClick={toggleDropdown}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {userId.substring(0, 2).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium md:inline-block">{userId}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover text-popover-foreground shadow-md">
              <div className="p-2 text-sm font-medium">Minha Conta</div>
              <div className="h-px bg-border" />
              <div className="p-1">
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    // Handle profile click
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    // Handle settings click
                  }}
                >
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </button>
              </div>
              <div className="h-px bg-border" />
              <div className="p-1">
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent hover:text-destructive"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    if (onLogout) onLogout()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
