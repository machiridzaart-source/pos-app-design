"use client"

import { useState } from "react"
import { updateProduct, deleteProduct } from "../app/actions"
import { Trash2, Edit2, Save, X, Check } from "lucide-react"

type Product = {
    id: string
    name: string
    price: number
    stock: number
    category: string
}

type Settings = {
    currency: string
}

export default function InventoryList({ products, settings }: { products: Product[], settings: Settings }) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<Product>>({})
    const [loading, setLoading] = useState(false)

    // Start editing
    const handleEditClick = (product: Product) => {
        setEditingId(product.id)
        setEditForm({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category
        })
    }

    // Cancel editing
    const handleCancel = () => {
        setEditingId(null)
        setEditForm({})
    }

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : name === 'stock' ? parseInt(value) : value
        }))
    }

    // Save changes
    const handleSave = async (id: string) => {
        if (!editForm.name || !editForm.price || editForm.price < 0 || editForm.stock === undefined) return

        setLoading(true)
        const result = await updateProduct(id, {
            name: editForm.name,
            price: editForm.price,
            stock: editForm.stock,
            category: editForm.category || "Other"
        })

        setLoading(false)
        if (result.success) {
            setEditingId(null)
            setEditForm({})
        } else {
            alert("Failed to update product")
        }
    }

    // Delete product
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        await deleteProduct(id)
    }

    return (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="p-4 font-semibold text-sm">Product</th>
                        <th className="p-4 font-semibold text-sm">Category</th>
                        <th className="p-4 font-semibold text-sm">Price ({settings.currency})</th>
                        <th className="p-4 font-semibold text-sm">Stock</th>
                        <th className="p-4 font-semibold text-sm text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500">No products found. Add one on the left.</td>
                        </tr>
                    ) : (
                        products.map((p) => {
                            const isEditing = editingId === p.id

                            return (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    {isEditing ? (
                                        <>
                                            <td className="p-2">
                                                <input
                                                    name="name"
                                                    value={editForm.name}
                                                    onChange={handleChange}
                                                    className="w-full border p-1 rounded text-sm"
                                                    autoFocus
                                                />
                                            </td>
                                            <td className="p-2">
                                                <select
                                                    name="category"
                                                    value={editForm.category}
                                                    onChange={handleChange}
                                                    className="w-full border p-1 rounded text-sm"
                                                >
                                                    <option value="Beverage">Beverage</option>
                                                    <option value="Food">Food</option>
                                                    <option value="Merch">Merch</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    name="price"
                                                    type="number"
                                                    step="0.01"
                                                    value={editForm.price}
                                                    onChange={handleChange}
                                                    className="w-24 border p-1 rounded text-sm font-mono"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    name="stock"
                                                    type="number"
                                                    value={editForm.stock}
                                                    onChange={handleChange}
                                                    className="w-20 border p-1 rounded text-sm font-mono"
                                                />
                                            </td>
                                            <td className="p-2 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => handleSave(p.id)}
                                                        disabled={loading}
                                                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                        title="Save"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="p-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-4 font-medium">{p.name}</td>
                                            <td className="p-4 text-slate-500 text-sm">{p.category}</td>
                                            <td className="p-4 font-mono">{settings.currency} {p.price.toFixed(2)}</td>
                                            <td className={`p-4 font-mono ${p.stock < 10 ? 'text-red-600 font-bold' : ''}`}>
                                                {p.stock}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(p)}
                                                        className="text-blue-500 hover:text-blue-700 p-1"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
    )
}
