import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessagingTab } from "@/components/messaging/messaging-tab"
import { KeyManagementTab } from "@/components/crypto/key-management-tab"
import { ContactsTab } from "@/components/contacts/contacts-tab"
import { HelpTab } from "@/components/help/help-tab"

function App() {
  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(217 32% 34%) 100%)"
    }}>
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">
            🔐 SecureAscon
          </h1>
          <p className="text-muted-foreground text-lg">
            Post-quantum lightweight messaging
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="message" className="flex items-center gap-2">
              📝 Message
            </TabsTrigger>
            <TabsTrigger value="keys" className="flex items-center gap-2">
              🔑 Keys
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              👥 Contacts
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              ❓ Help
            </TabsTrigger>
          </TabsList>

          <TabsContent value="message">
            <MessagingTab />
          </TabsContent>

          <TabsContent value="keys">
            <KeyManagementTab />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab />
          </TabsContent>

          <TabsContent value="help">
            <HelpTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
