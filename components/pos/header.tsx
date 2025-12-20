"use client"

import { Search, Bell, User, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b border-blue-gray/30 bg-white px-6">
      {/* Left Section - Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-gray" />
          <Input
            placeholder="Search products, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-80 border-blue-gray/30 bg-off-white pl-10 text-navy placeholder:text-blue-gray focus:border-navy focus:ring-navy"
          />
        </div>
      </div>

      {/* Center - Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-medium text-navy">Terminal Active</span>
        </div>
        <div className="h-6 w-px bg-blue-gray/30" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
        <div className="text-sm text-muted-foreground font-mono">
          {currentTime.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Right Section - User */}
      <div className="flex items-center gap-4">
        <button className="relative rounded p-2 text-blue-gray hover:bg-blue-light hover:text-navy transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-yellow" />
        </button>
        <div className="h-6 w-px bg-blue-gray/30" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-navy">John Doe</p>
            <p className="text-[10px] uppercase tracking-wider text-blue-gray">Cashier</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded bg-navy text-white">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  )
}
