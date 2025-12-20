import { getProducts, addProduct, deleteProduct, getSettings } from "../actions"
import { revalidatePath } from "next/cache"
import { Package, Trash2, Plus } from "lucide-react"
import InventoryList from "@/components/InventoryList"

export default async function InventoryPage() {
    const products = await getProducts()
    const settings = await getSettings()

    async function handleAddProduct(formData: FormData) {
        "use server"
        const name = formData.get("name") as string
        const price = parseFloat(formData.get("price") as string)
        const stock = parseInt(formData.get("stock") as string)
        const category = formData.get("category") as string

        if (!name || !price || isNaN(stock)) return

        await addProduct({ name, price, stock, category })
    }

    async function handleDelete(id: string) {
        "use server"
        await deleteProduct(id)
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Package className="w-8 h-8" /> Inventory
                </h1>
                <div className="bg-slate-100 px-4 py-2 rounded text-sm">
                    Total Items: <strong>{products.length}</strong>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* ADD FORM */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-xl font-semibold mb-4">Add Product</h2>
                    <form action={handleAddProduct} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Name</label>
                            <input required name="name" placeholder="e.g. Coffee" className="w-full border p-2 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Price ({settings.currency})</label>
                                <input required name="price" type="number" step="0.01" placeholder="0.00" className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Stock</label>
                                <input required name="stock" type="number" placeholder="0" className="w-full border p-2 rounded" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="category" className="w-full border p-2 rounded">
                                <option value="Beverage">Beverage</option>
                                <option value="Food">Food</option>
                                <option value="Merch">Merchandise</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </form>
                </div>

                {/* INVENTORY LIST */}
                <div className="md:col-span-2">
                    <InventoryList products={products} settings={settings} />
                </div>
            </div>
        </div>
    )
}
