import { getSales, getSettings } from "../actions"
import { FileText, Printer, Clock } from "lucide-react"

export default async function ReceiptsPage() {
    const sales = await getSales()
    const settings = await getSettings()

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-slate-800">
                <FileText className="w-8 h-8" />
                Transaction History
            </h1>

            <div className="space-y-4">
                {sales.length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 rounded-lg text-slate-500 border border-dashed">
                        No transactions recorded yet.
                    </div>
                ) : (
                    sales.map((sale) => {
                        // Try to parse receipt content to check for stored currency
                        let storedCurrency = settings.currency
                        try {
                            if (sale.receipt?.content) {
                                const parsed = JSON.parse(sale.receipt.content)
                                if (parsed.currency) storedCurrency = parsed.currency
                            }
                        } catch (e) {
                            // ignore parse error
                        }

                        return (
                            <div key={sale.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                {/* Header */}
                                <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b bg-slate-50/50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">ID: {sale.id.slice(0, 8)}</span>
                                            <span className="text-xs font-semibold text-blue-600 px-2 py-1 rounded bg-blue-50 uppercase border border-blue-100">{sale.paymentMethod}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {new Date(sale.timestamp).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold font-mono text-slate-900">
                                            {storedCurrency} {sale.totalAmount.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {sale.items.length} items
                                        </div>
                                    </div>
                                </div>

                                {/* Item Breakdown */}
                                <div className="p-4 bg-white">
                                    <table className="w-full text-sm">
                                        <thead className="text-xs text-slate-400 uppercase tracking-wider text-left">
                                            <tr>
                                                <th className="pb-2 font-medium">Item</th>
                                                <th className="pb-2 font-medium text-center">Qty</th>
                                                <th className="pb-2 font-medium text-right">Price</th>
                                                <th className="pb-2 font-medium text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {sale.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="py-2 text-slate-700 font-medium">
                                                        {item.product ? item.product.name : <span className="text-slate-400 italic">Unknown Product</span>}
                                                    </td>
                                                    <td className="py-2 text-center text-slate-500">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="py-2 text-right font-mono text-slate-500">
                                                        {storedCurrency} {item.priceAtSale.toFixed(2)}
                                                    </td>
                                                    <td className="py-2 text-right font-mono text-slate-700 font-medium">
                                                        {storedCurrency} {(item.priceAtSale * item.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-slate-50 px-4 py-2 flex justify-end">
                                    <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition" title="Print Receipt">
                                        <Printer className="w-4 h-4" /> Print Receipt
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
