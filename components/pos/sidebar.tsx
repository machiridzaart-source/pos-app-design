"use client"

import type React from "react"

import {
  LayoutGrid,
  Coffee,
  Croissant,
  Leaf,
  Snowflake,
  Package,
  Settings,
  Users,
  BarChart3,
  Receipt,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  All: <LayoutGrid className="h-5 w-5" />,
  Coffee: <Coffee className="h-5 w-5" />,
  Pastry: <Croissant className="h-5 w-5" />,
  Tea: <Leaf className="h-5 w-5" />,
  Iced: <Snowflake className="h-5 w-5" />,
  Other: <Package className="h-5 w-5" />,
}

export function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="flex w-20 flex-col bg-navy text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-navy-light">
        <div className="flex h-10 w-10 items-center justify-center bg-yellow text-navy font-bold text-lg">POS</div>
      </div>

      {/* Categories */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        <div className="mb-4">
          <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-blue-gray">Menu</span>
        </div>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "flex w-full flex-col items-center gap-1 rounded p-2 text-[10px] font-medium uppercase tracking-wide transition-colors",
              selectedCategory === category
                ? "bg-yellow text-navy"
                : "text-blue-gray hover:bg-navy-light hover:text-white",
            )}
          >
            {categoryIcons[category] || <Package className="h-5 w-5" />}
            <span className="truncate">{category}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-navy-light p-2 space-y-1">
        <button className="flex w-full flex-col items-center gap-1 rounded p-2 text-[10px] font-medium uppercase tracking-wide text-blue-gray hover:bg-navy-light hover:text-white transition-colors">
          <BarChart3 className="h-5 w-5" />
          <span>Reports</span>
        </button>
        <button className="flex w-full flex-col items-center gap-1 rounded p-2 text-[10px] font-medium uppercase tracking-wide text-blue-gray hover:bg-navy-light hover:text-white transition-colors">
          <Receipt className="h-5 w-5" />
          <span>Orders</span>
        </button>
        <button className="flex w-full flex-col items-center gap-1 rounded p-2 text-[10px] font-medium uppercase tracking-wide text-blue-gray hover:bg-navy-light hover:text-white transition-colors">
          <Users className="h-5 w-5" />
          <span>Staff</span>
        </button>
        <button className="flex w-full flex-col items-center gap-1 rounded p-2 text-[10px] font-medium uppercase tracking-wide text-blue-gray hover:bg-navy-light hover:text-white transition-colors">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
        <button className="flex w-full flex-col items-center gap-1 rounded p-2 text-[10px] font-medium uppercase tracking-wide text-yellow hover:bg-navy-light transition-colors">
          <HelpCircle className="h-5 w-5" />
          <span>Help</span>
        </button>
      </div>
    </aside>
  )
}
