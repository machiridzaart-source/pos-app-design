import {
  Package,
  Monitor,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { getSales, getSettings } from "./actions"

export default async function POSPage() {
  const sales = await getSales()
  const settings = await getSettings()

  // Calculate stats
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0
  const recentTransactions = sales.slice(0, 5)

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-medium text-navy tracking-wide uppercase mb-1">Point of Sale System</h1>
          <p className="text-navy/60 text-sm flex items-center gap-2">
            <ArrowRight className="h-3 w-3" />
            <span className="tracking-wide">Optimized Workflow</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Main Dashboard Card */}
          <div className="bg-white border border-blue-gray/30 shadow-sm">
            {/* Card Header */}
            <div className="flex items-center justify-between p-4 border-b border-blue-gray/20">
              <div className="flex items-center gap-4">
                <span className="text-xs text-navy/60 uppercase tracking-wider">Active sales</span>
                <span className="text-xs font-mono text-navy">{sales.length} TRX</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Settings Link */}
                <Link href="/settings" className="p-1.5 hover:bg-blue-light rounded transition-colors" title="Settings">
                  <SettingsIcon className="h-4 w-4 text-navy/40" />
                </Link>
              </div>
            </div>

            {/* Tabs (Visual only for now) */}
            <div className="flex border-b border-blue-gray/20">
              <button className="px-4 py-2 text-xs font-medium bg-navy text-white">ALL</button>
              <button className="px-4 py-2 text-xs text-navy/60 hover:bg-blue-light transition-colors">Today</button>
              <button className="px-4 py-2 text-xs text-navy/60 hover:bg-blue-light transition-colors">Week</button>
            </div>

            {/* Data Table */}
            <div className="divide-y divide-blue-gray/20">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-4 py-2 text-xs text-navy/50 uppercase tracking-wider">
                <span>ID</span>
                <span>Method</span>
                <span>Date</span>
                <span>Amount</span>
              </div>
              {/* Table Rows (Real Data) */}
              {recentTransactions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No transactions found</div>
              ) : (
                recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="grid grid-cols-4 gap-4 px-4 py-3 text-sm hover:bg-blue-light/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="font-mono text-xs text-navy">{txn.id.slice(0, 8)}</span>
                    </div>
                    <span className="text-navy/70 text-xs uppercase">{txn.paymentMethod}</span>
                    <span className="font-mono text-xs text-navy/60">{new Date(txn.timestamp).toLocaleDateString()}</span>
                    <span className="font-mono text-xs text-navy font-bold">
                      {settings.currency} {txn.totalAmount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 p-4 border-t border-blue-gray/20">
              <div className="border border-blue-gray/30 p-3">
                <div className="text-xs text-navy/50 uppercase tracking-wider mb-2">Total Revenue</div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-navy/40 font-mono">avg {settings.currency}{averageSale.toFixed(0)}</span>
                  <span className="text-lg font-semibold text-navy">{settings.currency} {totalRevenue.toFixed(2)}</span>
                </div>
              </div>
              <div className="border border-blue-gray/30 p-3">
                <div className="text-xs text-navy/50 uppercase tracking-wider mb-2">Recent Activity</div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-navy/40 font-mono">Count</span>
                  <span className="text-lg font-semibold text-navy">{sales.length} Sales</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="p-4 border-t border-blue-gray/20 flex gap-2">
              <Link
                href="/terminal"
                className="inline-flex items-center gap-1 bg-yellow text-navy text-xs font-medium px-3 py-1.5 uppercase tracking-wider hover:bg-yellow/80 transition-colors"
              >
                Terminal <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/inventory"
                className="inline-flex items-center gap-1 bg-navy text-white text-xs font-medium px-3 py-1.5 uppercase tracking-wider hover:bg-navy-light transition-colors"
              >
                Inventory <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Right Column - Navigation Cards */}
          <div className="space-y-4">
            {/* Inventory Card */}
            <Link href="/inventory" className="block bg-white border border-blue-gray/30 shadow-sm hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between p-4 border-b border-blue-gray/20">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-navy" />
                  <span className="text-sm font-medium text-navy uppercase tracking-wide">Inventory</span>
                </div>
                <ChevronRight className="h-4 w-4 text-navy/40" />
              </div>
              <div className="p-4">
                <p className="text-xs text-navy/60">Manage products, stock levels, and pricing.</p>
              </div>
            </Link>

            {/* Terminal Card */}
            <Link href="/terminal" className="block bg-white border border-blue-gray/30 shadow-sm hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between p-4 border-b border-blue-gray/20">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-navy" />
                  <span className="text-sm font-medium text-navy uppercase tracking-wide">Terminal</span>
                </div>
                <ChevronRight className="h-4 w-4 text-navy/40" />
              </div>
              <div className="p-4">
                <p className="text-xs text-navy/60">Process sales and add items to cart efficiently.</p>
              </div>
            </Link>

            {/* History Card */}
            <Link href="/receipts" className="block bg-white border border-blue-gray/30 shadow-sm hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between p-4 border-b border-blue-gray/20">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-navy" />
                  <span className="text-sm font-medium text-navy uppercase tracking-wide">History</span>
                </div>
                <ChevronRight className="h-4 w-4 text-navy/40" />
              </div>
              <div className="p-4">
                <p className="text-xs text-navy/60">View sales history and compliance receipts.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
