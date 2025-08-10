import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCryptoStore } from "@/stores/crypto-store"
import { toast } from "sonner"
import QRCode from "qrcode"

export function KeyManagementTab() {
  const { crypto, hasKey, generateKey, importKey, clearAll } = useCryptoStore()
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [showQR, setShowQR] = useState(false)
  const [keyResult, setKeyResult] = useState("")
  const [isLoading, setIsLoading] = useState({
    generate: false,
    import: false,
    export: false,
    share: false,
    clear: false,
  })

  const handleGenerateKey = async () => {
    setIsLoading(prev => ({ ...prev, generate: true }))
    try {
      setKeyResult("🔄 Generating Ascon-80pq key...")
      await generateKey()
      setKeyResult("✅ Ascon-80pq key generated! (160-bit post-quantum)")
      toast.success("New Ascon-80pq key generated successfully!")
    } catch (error: any) {
      setKeyResult(`❌ Error: ${error.message}`)
      toast.error("Failed to generate key")
    } finally {
      setIsLoading(prev => ({ ...prev, generate: false }))
    }
  }

  const handleShareKey = async () => {
    setIsLoading(prev => ({ ...prev, share: true }))
    try {
      if (!hasKey) {
        toast.error("Generate a key first")
        return
      }

      const key = crypto.getKey()!
      const keyHex = crypto.arrayBufferToHex(key)
      
      const qrDataUrl = await QRCode.toDataURL(keyHex, { width: 200, margin: 2 })
      setQrCodeUrl(qrDataUrl)
      setShowQR(true)
      
      setKeyResult(`📤 Ascon-80pq Key: ${keyHex}`)

      try {
        await navigator.clipboard.writeText(keyHex)
        toast.success("Key copied to clipboard!")
      } catch {
        toast.success("Key ready for sharing!")
      }
    } catch (error: any) {
      toast.error(`Failed to share key: ${error.message}`)
    } finally {
      setIsLoading(prev => ({ ...prev, share: false }))
    }
  }

  const handleExportKey = () => {
    setIsLoading(prev => ({ ...prev, export: true }))
    try {
      if (!hasKey) {
        toast.error("No key to export")
        return
      }
      const exportData = crypto.exportKey()
      if (!exportData) {
        toast.error("Failed to export key"); return
      }

      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ascon80pq_key_${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success("Key exported successfully!")
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`)
    } finally {
      setIsLoading(prev => ({ ...prev, export: false }))
    }
  }

  const handleImportKey = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsLoading(prev => ({ ...prev, import: true }))
      try {
        const content = await file.text()
        if (await importKey(content)) {
          toast.success("Key imported successfully!")
          setKeyResult("✅ Key imported and ready for use")
        } else {
          toast.error("Invalid key file format")
        }
      } catch (error: any) {
        toast.error(`Import failed: ${error.message}`)
      } finally {
        setIsLoading(prev => ({ ...prev, import: false }))
      }
    }
    input.click()
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete ALL data? This is irreversible.")) {
      setIsLoading(prev => ({...prev, clear: true}));
      try {
        clearAll();
        toast.success("All data has been cleared.");
        setKeyResult("Vault cleared. Restart the app or refresh the page.");
      } catch (error: any) {
        toast.error(`Failed to clear data: ${error.message}`);
      } finally {
        setIsLoading(prev => ({...prev, clear: false}));
      }
    }
  }

  const getKeyStatusBadge = () => {
    if (hasKey) {
      return <Badge className="bg-green-600 hover:bg-green-700">✅ Key Ready</Badge>
    }
    return <Badge variant="destructive">❌ No Ascon-80pq key</Badge>
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardContent className="pt-6 text-center">{getKeyStatusBadge()}</CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>🔐 Key Management</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button onClick={handleGenerateKey} disabled={isLoading.generate || hasKey} className="bg-green-600 hover:bg-green-700">
              {isLoading.generate ? 'Generating...' : '🔄 Generate'}
            </Button>
            <Button onClick={handleShareKey} disabled={!hasKey || isLoading.share}>
              {isLoading.share ? '...' : '📱 Share'}
            </Button>
            <Button onClick={handleExportKey} disabled={!hasKey || isLoading.export}>
              {isLoading.export ? '...' : '📤 Export'}
            </Button>
            <Button onClick={handleImportKey} disabled={isLoading.import || hasKey}>
              {isLoading.import ? 'Importing...' : '📥 Import'}
            </Button>
            <Button onClick={handleClearData} variant="destructive" className="sm:col-span-2" disabled={isLoading.clear}>
              {isLoading.clear ? 'Clearing...' : '💥 Clear All Data'}
            </Button>
          </div>

          {keyResult && (
            <div className="p-4 rounded-lg bg-muted/50 border min-h-[60px] text-sm">{keyResult}</div>
          )}

          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogContent>
              <DialogHeader><DialogTitle className="text-center">Share Key</DialogTitle></DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded-lg"/>}
                <p className="text-sm text-muted-foreground text-center">Scan this QR code to share</p>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h4 className="font-semibold text-blue-400 mb-2">🔒 Security Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your key and contacts are encrypted with your master password.</li>
              <li>• All data is stored locally in your browser's local storage.</li>
              <li>• Ascon-80pq provides 160-bit post-quantum security.</li>
              <li>• Remember your master password. It cannot be recovered.</li>
              <li>• "Clear All Data" will permanently delete everything.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}