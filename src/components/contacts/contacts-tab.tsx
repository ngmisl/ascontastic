import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCryptoStore } from "@/stores/crypto-store"
import { toast } from "sonner"
import type { Contact } from "@/types/crypto"

export function ContactsTab() {
  const { contacts, addContact, removeContact, exportContacts, importContacts } = useCryptoStore()
  const [contactName, setContactName] = useState("")
  const [contactKey, setContactKey] = useState("")
  const [isLoading, setIsLoading] = useState({
    add: false,
    import: false,
    export: false,
  })
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleAddContact = async () => {
    if (!contactName.trim() || contactKey.length !== 40) return
    setIsLoading(prev => ({ ...prev, add: true }))
    try {
      await addContact(contactName.trim(), contactKey.trim())
      setContactName("")
      setContactKey("")
      toast.success("✅ Contact added successfully!")
    } catch (error: any) {
      toast.error(`Failed to add contact: ${error.message}`)
    } finally {
      setIsLoading(prev => ({ ...prev, add: false }))
    }
  }

  const handleExportContacts = () => {
    setIsLoading(prev => ({ ...prev, export: true }))
    try {
      const exportData = exportContacts()
      if (!exportData) {
        toast.info("No contacts to export.")
        return
      }
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ascon_contacts_${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success("Contacts exported successfully!")
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`)
    } finally {
      setIsLoading(prev => ({ ...prev, export: false }))
    }
  }

  const handleImportContacts = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsLoading(prev => ({ ...prev, import: true }))
      try {
        const content = await file.text()
        const result = await importContacts(content)
        toast.success(`Import complete: ${result.imported} new contacts added.`, {
          description: `${result.duplicates} duplicates were ignored.`,
        })
      } catch (error: any) {
        toast.error(`Import failed: ${error.message}`)
      } finally {
        setIsLoading(prev => ({ ...prev, import: false }))
      }
    }
    input.click()
  }

  const handleRemoveContact = async (contact: Contact) => {
    if (window.confirm(`Remove contact "${contact.name}"?`)) {
      setRemovingId(contact.id)
      try {
        await removeContact(contact.id)
        toast.success(`Contact "${contact.name}" removed`)
      } catch (error: any) {
        toast.error(`Failed to remove contact: ${error.message}`)
      } finally {
        setRemovingId(null)
      }
    }
  }

  const handleScanQR = () => {
    toast.info("QR scanning requires camera access. Please paste the key manually for now.")
  }

  const formatKeyPreview = (keyHex: string) => {
    return `${keyHex.substring(0, 8)}...${keyHex.substring(32)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Add Contact */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👥 Add Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">👤 Contact Name</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter contact name"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactKey">🔑 Ascon-80pq Key (40 hex chars)</Label>
            <Input
              id="contactKey"
              value={contactKey}
              onChange={(e) => setContactKey(e.target.value.toLowerCase())}
              placeholder="Paste 40-character hex key"
              maxLength={40}
              className="font-mono"
            />
            <div className="text-xs text-muted-foreground">
              Key length: {contactKey.length}/40 characters
              {contactKey.length === 40 && (
                <Badge variant="default" className="ml-2 text-xs">
                  ✅ Valid length
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleAddContact}
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading.add || !contactName.trim() || contactKey.length !== 40}
            >
              {isLoading.add ? 'Adding...' : '➕ Add Contact'}
            </Button>
            <Button 
              onClick={handleScanQR}
              variant="outline"
              disabled
            >
              📷 Scan QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact List */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              📇 Contact List
              <Badge variant="secondary" className="ml-2">
                {contacts.length}
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleImportContacts} variant="outline" size="sm" disabled={isLoading.import}>
                {isLoading.import ? '...' : '📥 Import'}
              </Button>
              <Button onClick={handleExportContacts} variant="outline" size="sm" disabled={isLoading.export || contacts.length === 0}>
                {isLoading.export ? '...' : '📤 Export'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">👥</div>
              <p>No contacts added yet</p>
              <p className="text-sm">Add contacts to encrypt messages for specific people</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contacts.map((contact, index) => (
                <div key={contact.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-accent truncate">
                          {contact.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          🔐 Ascon-80pq
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        Key: {formatKeyPreview(contact.keyHex)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Added: {formatDate(contact.added)}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(contact.keyHex)
                          toast.success(`${contact.name}'s key copied to clipboard`)
                        }}
                        variant="outline"
                        size="sm"
                      >
                        📋
                      </Button>
                      <Button
                        onClick={() => handleRemoveContact(contact)}
                        variant="destructive"
                        size="sm"
                        disabled={removingId === contact.id}
                      >
                        {removingId === contact.id ? '...' : '🗑️'}
                      </Button>
                    </div>
                  </div>
                  {index < contacts.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      {contacts.length > 0 && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-semibold text-amber-400 mb-2">💡 Contact Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Share your key from the Keys tab with trusted contacts</li>
                <li>• Verify keys in person or through secure channels</li>
                <li>• Each contact needs your key to decrypt messages you send</li>
                <li>• Keys are case-insensitive but stored in lowercase</li>
                <li>• Remove contacts you no longer communicate with</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}