"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

// --- Products ---

export async function getProducts() {
    try {
        return await prisma.product.findMany({
            orderBy: { name: 'asc' }
        })
    } catch (error) {
        console.error("Failed to fetch products:", error)
        return []
    }
}

export async function addProduct(data: { name: string; price: number; stock: number; category: string }) {
    try {
        await prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                stock: data.stock,
                category: data.category,
            },
        })
        revalidatePath("/inventory")
        revalidatePath("/terminal")
        return { success: true }
    } catch (error) {
        console.error("Failed to add product:", error)
        return { success: false, error: "Failed to add product" }
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } })
        revalidatePath("/inventory")
        revalidatePath("/terminal")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete product:", error)
        return { success: false, error: "Failed to delete product" }
    }
}

export async function updateStock(id: string, newStock: number) {
    try {
        await prisma.product.update({
            where: { id },
            data: { stock: newStock },
        })
        revalidatePath("/inventory")
        revalidatePath("/terminal")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update stock" }
    }
}

export async function updateProduct(id: string, data: { name: string; price: number; stock: number; category: string }) {
    try {
        await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                price: data.price,
                stock: data.stock,
                category: data.category,
            },
        })
        revalidatePath("/inventory")
        revalidatePath("/terminal")
        return { success: true }
    } catch (error) {
        console.error("Failed to update product:", error)
        return { success: false, error: "Failed to update product" }
    }
}

// --- Settings ---

export async function getSettings() {
    try {
        let settings = await prisma.settings.findUnique({ where: { id: "default" } })
        if (!settings) {
            settings = await prisma.settings.create({
                data: { id: "default", vatRate: 0.15, currency: "R" }
            })
        }
        return settings
    } catch (error) {
        // Fallback default if DB fails (e.g. during build)
        return { vatRate: 0.15, currency: "R" }
    }
}

export async function updateSettings(vatRate: number, currency: string) {
    try {
        await prisma.settings.upsert({
            where: { id: "default" },
            update: { vatRate, currency },
            create: { id: "default", vatRate, currency }
        })

        revalidatePath("/")
        revalidatePath("/terminal")
        revalidatePath("/receipts")
        revalidatePath("/inventory")
        revalidatePath("/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to save settings:", error)
        return { success: false, error: "Failed to update settings" }
    }
}

// --- Sales ---

export async function processSale(items: { productId: string; quantity: number, price: number }[], paymentMethod: string) {
    try {
        // Fetch current settings for VAT
        const settings = await getSettings()
        const vatMultiplier = 1 + settings.vatRate

        // 1. Calculate total
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        // Add dynamic tax
        const finalTotal = totalAmount * vatMultiplier;

        // 2. Create Sale and SaleItems transactionally
        const sale = await prisma.$transaction(async (tx) => {
            // Create Sale
            const newSale = await tx.sale.create({
                data: {
                    totalAmount: finalTotal,
                    paymentMethod,
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            priceAtSale: item.price
                        }))
                    }
                }
            })

            // Update Stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            // Create Receipt Link
            await tx.receipt.create({
                data: {
                    saleId: newSale.id,
                    content: JSON.stringify({ items, total: finalTotal, date: new Date(), currency: settings.currency })
                }
            })

            return newSale
        })

        revalidatePath("/terminal")
        revalidatePath("/receipts")
        revalidatePath("/inventory")
        revalidatePath("/") // Dashboard

        return { success: true, saleId: sale.id }

    } catch (error) {
        console.error("Sale processing failed:", error)
        return { success: false, error: "Transaction failed" }
    }
}

export async function getSales() {
    try {
        return await prisma.sale.findMany({
            include: {
                items: {
                    include: { product: true }
                },
                receipt: true
            },
            orderBy: { timestamp: 'desc' }
        })
    } catch (error) {
        return []
    }
}
