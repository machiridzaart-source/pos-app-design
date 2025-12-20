import { getSettings, updateSettings } from "../actions"
import { Settings, Save } from "lucide-react"

export default async function SettingsPage() {
    const settings = await getSettings()

    async function handleSave(formData: FormData) {
        "use server"
        const vatRate = parseFloat(formData.get("vatRate") as string) / 100
        const currency = formData.get("currency") as string
        await updateSettings(vatRate, currency)
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-slate-800">
                <Settings className="w-8 h-8" />
                System Settings
            </h1>

            <div className="bg-white p-6 rounded-lg shadow border">
                <form action={handleSave} className="space-y-6">

                    {/* VAT Rate */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">VAT Rate (%)</label>
                        <div className="flex items-center gap-2">
                            <input
                                required
                                name="vatRate"
                                type="number"
                                step="0.1"
                                defaultValue={(settings.vatRate * 100).toFixed(1)}
                                className="w-full border p-2 rounded"
                            />
                            <span className="text-slate-500 font-bold">%</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Default is 15%</p>
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Currency</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`flex items-center justify-center gap-2 p-3 border rounded cursor-pointer hover:bg-slate-50 ${settings.currency === 'R' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}>
                                <input type="radio" name="currency" value="R" defaultChecked={settings.currency === 'R'} className="accent-blue-600" />
                                <span className="font-bold">Rand (R)</span>
                            </label>
                            <label className={`flex items-center justify-center gap-2 p-3 border rounded cursor-pointer hover:bg-slate-50 ${settings.currency === '$' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}>
                                <input type="radio" name="currency" value="$" defaultChecked={settings.currency === '$'} className="accent-blue-600" />
                                <span className="font-bold">Dollar ($)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" /> Save Settings
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
