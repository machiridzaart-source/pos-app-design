"use client"

import { Package, Plus } from "lucide-react"
import type { Product } from "@/app/page"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard label="Total Products" value={products.length.toString()} change="+3%" />
        <StatCard label="Low Stock Items" value="4" change="-12%" negative />
        <StatCard label="Categories" value="5" />
        <StatCard
          label="Avg. Price"
          value={`$${(products.reduce((a, b) => a + b.price, 0) / products.length).toFixed(2)}`}
        />
      </div>

      {/* Products Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-navy uppercase tracking-wide">Products</h2>
          <p className="text-sm text-blue-gray">{products.length} items available</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded border border-blue-gray/30 px-3 py-1.5 text-xs font-medium text-navy hover:bg-blue-light transition-colors uppercase tracking-wide">
            Grid
          </button>
          <button className="rounded border border-blue-gray/30 px-3 py-1.5 text-xs font-medium text-blue-gray hover:bg-blue-light hover:text-navy transition-colors uppercase tracking-wide">
            List
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
        ))}
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  change,
  negative,
}: { label: string; value: string; change?: string; negative?: boolean }) {
  return (
    <div className="rounded border border-blue-gray/30 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-gray">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <span className="text-2xl font-bold text-navy">{value}</span>
        {change && (
          <span className={cn("text-xs font-semibold", negative ? "text-red-500" : "text-green-600")}>{change}</span>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const isLowStock = product.stock < 30

  return (
    <div className="group relative overflow-hidden rounded border border-blue-gray/30 bg-white transition-all hover:border-navy hover:shadow-lg">
      {/* Product Image Placeholder */}
      <div className="relative aspect-square bg-blue-light/50 flex items-center justify-center">
        <Package className="h-12 w-12 text-blue-gray/50" />
        {isLowStock && (
          <span className="absolute top-2 right-2 rounded bg-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-navy">
            Low Stock
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-navy leading-tight">{product.name}</h3>
            <p className="mt-0.5 text-[10px] font-mono text-blue-gray">{product.sku}</p>
          </div>
          <span className="text-lg font-bold text-navy">${product.price.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                product.stock > 50 ? "bg-green-500" : product.stock > 20 ? "bg-yellow" : "bg-red-500",
              )}
            />
            <span className="text-[10px] text-blue-gray">{product.stock} in stock</span>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="flex items-center gap-1 rounded bg-navy px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy-light"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
