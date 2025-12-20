"use client"

import { useState } from "react"
import { processSale } from "../app/actions"
import { ShoppingCart, Plus, Minus, CreditCard, Banknote, QrCode } from "lucide-react"

type Product = {
    id: string
    name: string
    price: number
    stock: number
    category: string
}

type Settings = {
    vatRate: number
    currency: string
}

type CartItem = {
    product: Product
    quantity: number
}

export default function TerminalInterface({ initialProducts, settings }: { initialProducts: Product[], settings: Settings }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [paymentMethod, setPaymentMethod] = useState("Card")
    const [processing, setProcessing] = useState(false)

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    const tax = subtotal * settings.vatRate
    const total = subtotal + tax

    const addToCart = (product: Product) => {
        if (product.stock <= 0) return

        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id)
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // Prevent overselling
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { product, quantity: 1 }]
        })
    }

    const adjustQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.reduce<CartItem[]>((acc, item) => {
            if (item.product.id === productId) {
                const newQty = item.quantity + delta
                if (newQty <= 0) return acc // Remove item
                // Check stock limit if adding
                if (delta > 0 && newQty > item.product.stock) return [...acc, item]
                return [...acc, { ...item, quantity: newQty }]
            }
            return [...acc, item]
        }, []))
    }

    const clearCart = () => setCart([])

    const handleCheckout = async () => {
        if (cart.length === 0) return
        setProcessing(true)

        const itemsPayload = cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
        }))

        const result = await processSale(itemsPayload, paymentMethod)

        if (result.success) {
            alert("Sale Complete! Receipt generated.")
            setCart([])
        } else {
            alert("Transaction Failed: " + result.error)
        }
        setProcessing(false)
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* PRODUCTS GRID */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                <h2 className="text-xl font-bold mb-6 text-slate-800">Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {initialProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                            className={`p-4 rounded-lg border shadow-sm flex flex-col items-start transition-all hover:shadow-md ${product.stock <= 0 ? 'opacity-50 bg-slate-100' : 'bg-white hover:border-blue-500'}`}
                        >
                            <div className="w-full h-24 bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-300">
                                {/* Placeholder Image */}
                                <span className="text-xs">IMG</span>
                            </div>
                            <h3 className="font-semibold text-slate-800 w-full text-left truncate">{product.name}</h3>
                            <p className="text-slate-500 text-xs mb-2">{product.category}</p>
                            <div className="flex justify-between w-full items-center mt-auto">
                                <span className="font-mono font-bold text-slate-900">{settings.currency} {product.price.toFixed(2)}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.stock > 0 ? `${product.stock} Left` : 'Out'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* CART SIDEBAR */}
            <div className="w-96 bg-white border-l shadow-xl flex flex-col z-10">
                {/* Header */}
                <div className="p-4 border-b bg-slate-800 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-bold tracking-wide">CURRENT ORDER</span>
                    </div>
                    {cart.length > 0 && (
                        <button onClick={clearCart} className="text-xs text-slate-300 hover:text-white underline">
                            Clear
                        </button>
                    )}
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                            <ShoppingCart className="w-12 h-12 opacity-20" />
                            <p>No items in cart</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center p-3 bg-slate-50 rounded border">
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-slate-800">{item.product.name}</h4>
                                    <p className="text-slate-500 text-xs font-mono">{settings.currency} {item.product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white border rounded px-1 py-0.5">
                                    <button onClick={() => adjustQuantity(item.product.id, -1)} className="p-1 hover:text-red-600">
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => adjustQuantity(item.product.id, 1)} className="p-1 hover:text-green-600">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="w-16 text-right font-mono font-medium text-sm">
                                    {settings.currency} {(item.product.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Payment & Totals */}
                <div className="p-6 bg-slate-50 border-t space-y-4">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-mono">{settings.currency} {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>VAT ({(settings.vatRate * 100).toFixed(0)}%)</span>
                            <span className="font-mono">{settings.currency} {tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-slate-900 border-t border-slate-200 pt-2 mt-2">
                            <span>Total</span>
                            <span className="font-mono">{settings.currency} {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="grid grid-cols-3 gap-2">
                        {['Card', 'Cash', 'QR'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`flex flex-col items-center justify-center py-2 rounded border text-xs font-medium transition-colors ${paymentMethod === method
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {method === 'Card' && <CreditCard className="w-4 h-4 mb-1" />}
                                {method === 'Cash' && <Banknote className="w-4 h-4 mb-1" />}
                                {method === 'QR' && <QrCode className="w-4 h-4 mb-1" />}
                                {method}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className="w-full bg-yellow-400 text-slate-900 font-bold py-3 rounded-md shadow-sm hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide transition-colors"
                    >
                        {processing ? "Processing..." : "Complete Sale"}
                    </button>
                </div>
            </div>
        </div>
    )
}
