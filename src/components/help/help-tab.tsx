import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function HelpTab() {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-cyan-500/20 bg-cyan-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            ❓ Help & Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step-by-Step Tutorial */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              🚀 Step-by-Step Tutorial
            </h4>
            <div className="p-4 rounded-lg bg-muted/30 border">
              <ol className="space-y-3 text-sm">
                <li><strong>1. Create Your Secure Vault:</strong> When you first open the app, you'll be asked to create a master password. Choose a strong, memorable password. <strong className="text-red-400">This password cannot be recovered!</strong></li>
                <li><strong>2. Generate Your Private Key:</strong> Go to the <Badge variant="outline">🔑 Keys</Badge> tab and click "🔄 Generate". This creates your unique, quantum-resistant private key, now saved in your vault.</li>
                <li><strong>3. Share & Add Contacts:</strong> On the <Badge variant="outline">🔑 Keys</Badge> tab, click "📱 Share" to get your key. Securely send it to contacts. Then, go to the <Badge variant="outline">👥 Contacts</Badge> tab to add their keys.</li>
                <li><strong>4. Manage Your Data:</strong> Use the "📥 Import" and "📤 Export" buttons on the Keys and Contacts tabs to back up and restore your data.</li>
                <li><strong>5. Send a Secure Message:</strong> Go to the <Badge variant="outline">📝 Message</Badge> tab, choose an encryption mode, type your message, encrypt, and copy the result.</li>
              </ol>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              ❓ Frequently Asked Questions (FAQ)
            </h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium text-accent mb-1">What is the master password?</div>
                <p className="text-muted-foreground">It's the password you create to encrypt and lock your private key and contacts in a secure vault in your browser. It's the only way to access your data.</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium text-accent mb-1">What happens if I forget my master password?</div>
                <p className="text-muted-foreground"><strong className="text-red-400">Your data will be permanently inaccessible.</strong> There is no recovery option. We cannot help you as the password is never stored.</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium text-accent mb-1">Where is my data stored?</div>
                <p className="text-muted-foreground">Your encrypted data is stored in your browser's local storage. It stays on your device and is never sent to a server.</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium text-accent mb-1">How do I move my data to a new device?</div>
                <p className="text-muted-foreground">Use the "Export" feature on both the Keys and Contacts tabs on your old device. Then on the new device, create a vault and use the "Import" feature.</p>
              </div>
            </div>
          </div>

          {/* Meshtastic Integration */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              📡 Meshtastic Integration
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="font-medium text-blue-400 mb-1">Manual Method</div>
                <div className="text-sm text-muted-foreground">
                  Encrypt here → Copy → Paste in Meshtastic app
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="font-medium text-green-400 mb-1">API Integration</div>
                <div className="text-sm text-muted-foreground">
                  Use Meshtastic Python API with this crypto library
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="font-medium text-purple-400 mb-1">Overhead</div>
                <div className="text-sm text-muted-foreground">
                  Only +32 bytes per message (nonce + authentication tag)
                </div>
              </div>
            </div>
          </div>

          {/* Why Ascon-80pq */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              🔐 Why Ascon-80pq?
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="text-sm">
                  <div className="font-medium text-accent mb-1">🏆 NIST Standard</div>
                  <div className="text-muted-foreground">
                    Official lightweight cryptography standard
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="text-sm">
                  <div className="font-medium text-accent mb-1">🛡️ Quantum Resistant</div>
                  <div className="text-muted-foreground">
                    160-bit key resists quantum attacks
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="text-sm">
                  <div className="font-medium text-accent mb-1">⚡ IoT Optimized</div>
                  <div className="text-muted-foreground">
                    Perfect for LoRa/IoT constraints
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="text-sm">
                  <div className="font-medium text-accent mb-1">🔒 Authenticated</div>
                  <div className="text-muted-foreground">
                    Prevents tampering and forgery
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Size Limits */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              📏 Size Limits & Constraints
            </h4>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-muted/30 border">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Meshtastic total limit:</span>
                    <Badge variant="outline">237 bytes</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ascon-80pq overhead:</span>
                    <Badge variant="outline">+32 bytes</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Base64 encoding:</span>
                    <Badge variant="outline">+33% size</Badge>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-medium">Max message length:</span>
                    <Badge className="bg-green-600">~205 characters</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-400">Green: Perfect for Meshtastic (≤200 bytes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-yellow-400">Yellow: Close to limit (201-237 bytes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-red-400">Red: Too large for Meshtastic (&gt;237 bytes)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              🛡️ Security Best Practices
            </h4>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Remember your master password.</strong> It cannot be recovered.</li>
                <li>• <strong>Verify contact keys</strong> in person or through a trusted channel.</li>
                <li>• <strong>Regularly back up</strong> your private key and contacts using the Export functions.</li>
                <li>• <strong>Use "Clear All Data"</strong> and clear browser history if using a shared computer.</li>
                <li>• <strong>Generate a new key</strong> if you suspect your old one is compromised.</li>
              </ul>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              🔧 Technical Details
            </h4>
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium mb-1">AEAD Algorithm</div>
                <div className="text-muted-foreground">Ascon-80pq</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium mb-1">Vault Encryption</div>
                <div className="text-muted-foreground">AES-GCM (256-bit)</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium mb-1">Key Derivation</div>
                <div className="text-muted-foreground">PBKDF2 (SHA-256)</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium mb-1">PBKDF2 Iterations</div>
                <div className="text-muted-foreground">300,000 rounds</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium mb-1">Storage</div>
                <div className="text-muted-foreground">Encrypted Local Storage</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="font-medium mb-1">Ascon-80pq Key Size</div>
                <div className="text-muted-foreground">160 bits (20 bytes)</div>
              </div>
            </div>
          </div>

          {/* Links & Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
              🔗 Links & Support
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              <a 
                href="https://github.com/ngmisl/ascontastic"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🐙</div>
                  <div>
                    <div className="font-medium group-hover:text-cyan-400 transition-colors">GitHub Repository</div>
                    <div className="text-sm text-muted-foreground">Source code & issues</div>
                  </div>
                </div>
              </a>
              <a 
                href="https://fourzerofour.fkey.id"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <div className="font-medium group-hover:text-cyan-400 transition-colors">Support</div>
                    <div className="text-sm text-muted-foreground">Get help & assistance</div>
                  </div>
                </div>
              </a>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}