"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Monitor, FileText, Settings, ArrowLeft, HelpCircle } from "lucide-react"

const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Package, label: "Inventory", href: "/inventory" },
    { icon: Monitor, label: "POS Terminal", href: "/terminal" },
    { icon: FileText, label: "Receipts", href: "/receipts" },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-screen w-14 flex flex-col bg-slate-900 text-white z-50">
            <div className="flex h-14 items-center justify-center border-b border-slate-700">
                <ArrowLeft className="h-4 w-4 text-slate-400" />
            </div>
            <nav className="flex-1 py-4 flex flex-col items-center gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            title={item.label}
                            className={`flex h-10 w-10 items-center justify-center rounded-sm transition-colors ${isActive ? "bg-yellow-400 text-slate-900" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                        </Link>
                    )
                })}
            </nav>
            <div className="py-4 flex flex-col items-center gap-2 border-t border-slate-700">
                <button className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <HelpCircle className="h-4 w-4" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <Settings className="h-4 w-4" />
                </button>
            </div>
        </aside>
    )
}
