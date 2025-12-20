import { getProducts, getSettings } from "../actions"
import TerminalInterface from "@/components/TerminalInterface"

export default async function TerminalPage() {
  const products = await getProducts()
  const settings = await getSettings()

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <TerminalInterface initialProducts={products} settings={settings} />
    </div>
  )
}
