import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCryptoStore } from "@/stores/crypto-store"
import { toast } from "sonner"
import type { EncryptionMode } from "@/types/crypto"

export function MessagingTab() {
  const {
    crypto,
    hasKey,
    contacts,
    currentMode,
    selectedContactId,
    setEncryptionMode,
    setSelectedContact
  } = useCryptoStore()

  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sizeInfo = crypto.calculateMessageSize(message)

  const handleModeChange = (mode: EncryptionMode) => {
    setEncryptionMode(mode)
    setPassword("")
    setSelectedContact("")
    setResult("")
  }

  const handleEncrypt = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message to encrypt")
      return
    }

    setIsLoading(true)
    try {
      let encrypted: string
      let recipientName = ""

      if (currentMode === 'contact') {
        if (!selectedContactId) {
          toast.error("Please select a contact")
          return
        }
        
        const contact = crypto.findContact(selectedContactId)
        if (!contact) {
          toast.error("Contact not found")
          return
        }

        const key = crypto.hexToArrayBuffer(contact.keyHex)
        encrypted = crypto.encrypt(key, message)
        recipientName = contact.name
        
      } else if (currentMode === 'mykey') {
        if (!hasKey) {
          toast.error("Please generate your key first")
          return
        }
        
        const key = crypto.getKey()!
        encrypted = crypto.encrypt(key, message)
        
      } else { // password
        if (!password.trim()) {
          toast.error("Please enter a password")
          return
        }
        
        const { key: derivedKey, salt } = await crypto.deriveKey(password)
        encrypted = crypto.encrypt(derivedKey, message)
        
        // Prepend salt to encrypted data for decryption
        const saltHex = crypto.arrayBufferToHex(salt)
        encrypted = saltHex + encrypted
      }

      setResult(encrypted)
      
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(encrypted)
        toast.success(
          recipientName 
            ? `Message encrypted for ${recipientName} and copied to clipboard!`
            : "Message encrypted and copied to clipboard!"
        )
      } catch {
        toast.success("Message encrypted successfully!")
      }

    } catch (error: any) {
      toast.error(`Encryption failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecrypt = async () => {
    if (!message.trim()) {
      toast.error("Please enter an encrypted message")
      return
    }

    setIsLoading(true)
    try {
      let decrypted: string

      if (currentMode === 'contact') {
        if (!selectedContactId) {
          toast.error("Please select the contact used for encryption")
          return
        }
        
        const contact = crypto.findContact(selectedContactId)
        if (!contact) {
          toast.error("Contact not found")
          return
        }

        const key = crypto.hexToArrayBuffer(contact.keyHex)
        decrypted = crypto.decrypt(key, message)
        
      } else if (currentMode === 'mykey') {
        if (!hasKey) {
          toast.error("No key available for decryption")
          return
        }
        
        const key = crypto.getKey()!
        decrypted = crypto.decrypt(key, message)
        
      } else { // password
        if (!password.trim()) {
          toast.error("Please enter the password used for encryption")
          return
        }
        
        // Extract salt from message
        if (message.length < 32) {
          toast.error("Invalid encrypted message format")
          return
        }
        
        const saltHex = message.substring(0, 32)
        const encryptedData = message.substring(32)
        const salt = crypto.hexToArrayBuffer(saltHex)
        
        // Derive key with extracted salt
        const encoder = new TextEncoder()
        const keyMaterial = await window.crypto.subtle.importKey(
          'raw', 
          encoder.encode(password), 
          'PBKDF2', 
          false, 
          ['deriveKey']
        )
        
        const derivedKey = await window.crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt: salt, iterations: 250000, hash: 'SHA-256' },
          keyMaterial,
          { name: 'AES-GCM', length: 160 },
          true,
          ['encrypt']
        )
        
        const keyBuffer = await window.crypto.subtle.exportKey('raw', derivedKey)
        const key = new Uint8Array(keyBuffer)
        
        decrypted = crypto.decrypt(key, encryptedData)
      }

      setResult(decrypted)
      toast.success("Message decrypted successfully!")

    } catch (error: any) {
      toast.error(`Decryption failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    setMessage("")
    setPassword("")
    setResult("")
    setSelectedContact("")
  }

  const getSizeStatusBadge = () => {
    const { status, encodedBytes } = sizeInfo
    const variant = status === 'ok' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'
    const icon = status === 'ok' ? '✅' : status === 'warning' ? '⚠️' : '❌'
    const text = status === 'ok' ? 'Perfect for Meshtastic' : 
                 status === 'warning' ? 'Close to Meshtastic limit' : 
                 'Too large for Meshtastic'
    
    return (
      <Badge variant={variant} className="ml-2">
        {icon} {text} (~{encodedBytes} bytes)
      </Badge>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔐 Message Encryption & Decryption
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Encryption Mode Selection */}
        <div className="space-y-3">
          <Label className="text-accent">🔐 Encryption Mode</Label>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="encryptMode"
                value="contact"
                checked={currentMode === 'contact'}
                onChange={() => handleModeChange('contact')}
                className="w-4 h-4"
              />
              <span>Contact</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="encryptMode"
                value="mykey"
                checked={currentMode === 'mykey'}
                onChange={() => handleModeChange('mykey')}
                className="w-4 h-4"
              />
              <span>My Key</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="encryptMode"
                value="password"
                checked={currentMode === 'password'}
                onChange={() => handleModeChange('password')}
                className="w-4 h-4"
              />
              <span>Password</span>
            </label>
          </div>
        </div>

        {/* Contact Selection */}
        {currentMode === 'contact' && (
          <div className="space-y-2">
            <Label htmlFor="recipient">📬 Recipient</Label>
            <Select value={selectedContactId} onValueChange={setSelectedContact}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    🔐 {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Password Input */}
        {currentMode === 'password' && (
          <div className="space-y-2">
            <Label htmlFor="password">🔑 Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter strong password"
            />
          </div>
        )}

        {/* Message Input */}
        <div className="space-y-2">
          <Label htmlFor="message">📝 Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            rows={4}
          />
          <div className="flex items-center text-sm text-muted-foreground">
            Message: {sizeInfo.messageBytes} bytes
            {getSizeStatusBadge()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Button 
            onClick={handleEncrypt} 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            🔒 Encrypt
          </Button>
          <Button 
            onClick={handleDecrypt} 
            disabled={isLoading}
            variant="destructive"
          >
            🔓 Decrypt
          </Button>
          <Button 
            onClick={clearAll} 
            variant="outline"
          >
            🗑️ Clear
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-2">
            <Label>Result</Label>
            <div className="p-4 rounded-lg bg-muted/50 border min-h-[100px] font-mono text-sm break-all">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}