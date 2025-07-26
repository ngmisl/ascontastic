import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCryptoStore } from "@/stores/crypto-store"
import { toast } from "sonner"
import QRCode from "qrcode"

export function KeyManagementTab() {
  const { crypto, hasKey, generateKey } = useCryptoStore()
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [showQR, setShowQR] = useState(false)
  const [keyResult, setKeyResult] = useState("")

  const handleGenerateKey = () => {
    try {
      setKeyResult("🔄 Generating Ascon-80pq key...")
      generateKey()
      setKeyResult("✅ Ascon-80pq key generated! (160-bit post-quantum)")
      toast.success("New Ascon-80pq key generated successfully!")
    } catch (error: any) {
      setKeyResult(`❌ Error: ${error.message}`)
      toast.error("Failed to generate key")
    }
  }

  const handleShareKey = async () => {
    try {
      if (!hasKey) {
        toast.error("Generate a key first")
        return
      }

      const key = crypto.getKey()!
      const keyHex = crypto.arrayBufferToHex(key)
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(keyHex, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeUrl(qrDataUrl)
      setShowQR(true)
      
      setKeyResult(`📤 Ascon-80pq Key: ${keyHex}`)

      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(keyHex)
        toast.success("Key copied to clipboard!")
      } catch {
        toast.success("Key ready for sharing!")
      }
    } catch (error: any) {
      toast.error(`Failed to share key: ${error.message}`)
    }
  }

  const handleExportKey = () => {
    try {
      if (!hasKey) {
        toast.error("No key to export")
        return
      }

      const exportData = crypto.exportKey()
      if (!exportData) {
        toast.error("Failed to export key")
        return
      }

      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ascon80pq_key_${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Key exported successfully!")
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`)
    }
  }

  const handleImportKey = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          if (crypto.importKey(content)) {
            toast.success("Key imported successfully!")
            setKeyResult("✅ Key imported and ready for use")
          } else {
            toast.error("Invalid key file format")
          }
        } catch (error: any) {
          toast.error(`Import failed: ${error.message}`)
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }

  const getKeyStatusBadge = () => {
    if (hasKey) {
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          ✅ Ascon-80pq key ready (post-quantum secure)
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          ❌ No Ascon-80pq key - Generate for secure messaging
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Status */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center">
            {getKeyStatusBadge()}
          </div>
        </CardContent>
      </Card>

      {/* Key Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔐 Ascon-80pq Key Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap justify-center">
            <Button 
              onClick={handleGenerateKey}
              className="bg-green-600 hover:bg-green-700"
            >
              🔄 Generate Key
            </Button>
            <Button 
              onClick={handleShareKey}
              disabled={!hasKey}
              variant="outline"
            >
              📱 Share Key
            </Button>
            <Button 
              onClick={handleExportKey}
              disabled={!hasKey}
              variant="outline"
            >
              📤 Export
            </Button>
            <Button 
              onClick={handleImportKey}
              variant="outline"
            >
              📥 Import
            </Button>
          </div>

          {/* Result Display */}
          {keyResult && (
            <div className="p-4 rounded-lg bg-muted/50 border min-h-[60px] text-sm">
              {keyResult}
            </div>
          )}

          {/* QR Code Dialog */}
          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  📱 Share this Ascon-80pq key:
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code or copy the key manually to share with contacts
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Key Security Information */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h4 className="font-semibold text-blue-400 mb-2">🔒 Security Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Keys are stored in session storage only (cleared when browser closes)</li>
              <li>• Ascon-80pq provides 160-bit post-quantum security</li>
              <li>• Each key is 20 bytes (40 hex characters)</li>
              <li>• Keys are generated using cryptographically secure random bytes</li>
              <li>• Export your key to backup before closing the browser</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}