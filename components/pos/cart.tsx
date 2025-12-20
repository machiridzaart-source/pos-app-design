"use client"

import type React from "react"

import { Minus, Plus, Trash2, CreditCard, Banknote, QrCode, ArrowRight } from "lucide-react"
import type { CartItem } from "@/app/page"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onClearCart: () => void
}

export function Cart({ items, onUpdateQuantity, onClearCart }: CartProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>("card")

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <aside className="flex w-96 flex-col border-l border-blue-gray/30 bg-white">
      {/* Cart Header */}
      <div className="flex items-center justify-between border-b border-blue-gray/30 px-4 py-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-navy">Current Order</h2>
          <p className="text-[10px] text-blue-gray mt-0.5">{items.length} items</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-blue-gray">
            <div className="rounded-full bg-blue-light p-4 mb-3">
              <Trash2 className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs mt-1">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} />
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {items.length > 0 && (
        <div className="border-t border-blue-gray/30 p-4 space-y-4">
          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-blue-gray">
              <span>Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-blue-gray">
              <span>Tax (8%)</span>
              <span className="font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-blue-gray/30" />
            <div className="flex justify-between text-lg font-bold text-navy">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-gray mb-2">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              <PaymentButton
                icon={<CreditCard className="h-4 w-4" />}
                label="Card"
                selected={selectedPayment === "card"}
                onClick={() => setSelectedPayment("card")}
              />
              <PaymentButton
                icon={<Banknote className="h-4 w-4" />}
                label="Cash"
                selected={selectedPayment === "cash"}
                onClick={() => setSelectedPayment("cash")}
              />
              <PaymentButton
                icon={<QrCode className="h-4 w-4" />}
                label="QR"
                selected={selectedPayment === "qr"}
                onClick={() => setSelectedPayment("qr")}
              />
            </div>
          </div>

          {/* Checkout Button */}
          <button className="flex w-full items-center justify-center gap-2 rounded bg-yellow py-3 text-sm font-bold uppercase tracking-wider text-navy transition-colors hover:bg-yellow/80">
            Complete Sale
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  )
}

function CartItemRow({
  item,
  onUpdateQuantity,
}: { item: CartItem; onUpdateQuantity: (id: string, quantity: number) => void }) {
  return (
    <div className="flex items-center gap-3 rounded border border-blue-gray/20 bg-off-white p-3">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-navy text-sm truncate">{item.name}</h4>
        <p className="text-[10px] font-mono text-blue-gray">{item.sku}</p>
        <p className="text-sm font-semibold text-navy mt-1">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="flex h-7 w-7 items-center justify-center rounded border border-blue-gray/30 text-blue-gray hover:bg-blue-light hover:text-navy transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-8 text-center font-mono text-sm font-semibold text-navy">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="flex h-7 w-7 items-center justify-center rounded border border-blue-gray/30 text-blue-gray hover:bg-blue-light hover:text-navy transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function PaymentButton({
  icon,
  label,
  selected,
  onClick,
}: { icon: React.ReactNode; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded border p-2 text-[10px] font-semibold uppercase tracking-wide transition-colors",
        selected
          ? "border-navy bg-navy text-white"
          : "border-blue-gray/30 text-blue-gray hover:border-navy hover:text-navy",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
