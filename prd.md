# Product Requirements Document: Ascon-80pq Secure Messaging PWA

## 1. Project Overview

### 1.1 Project Name
**SecureAscon** - Post-Quantum Lightweight Messaging PWA

### 1.2 Purpose
Convert existing vanilla HTML/JS Ascon-80pq PWA into a production-ready, type-safe, secure messaging application using modern web technologies optimized for Meshtastic and constrained networks.

### 1.3 Target Users
- Ham radio operators
- Meshtastic network users
- IoT/LoRa developers
- Security-conscious users requiring post-quantum cryptography
- Emergency communication teams

## 2. Technical Stack Requirements

### 2.1 Core Technologies
- **Runtime**: Bun 1.0+ (package manager, bundler, runtime)
- **Build Tool**: Vite 5.0+
- **Framework**: React 18+ with TypeScript 5.0+
- **UI Library**: Shadcn/ui with Radix UI primitives
- **Styling**: TailwindCSS 3.4+
- **Validation**: Zod 3.22+
- **Cryptography**: ascon-js (official NIST implementation)

### 2.2 PWA Requirements
- **Service Worker**: Workbox 7+
- **Manifest**: Web App Manifest v3
- **Offline**: Full offline functionality
- **Caching**: Aggressive asset caching
- **Background Sync**: Message queue for offline encryption/decryption

## 3. Security Requirements

### 3.1 Cryptographic Standards
- **Algorithm**: Ascon-80pq (160-bit post-quantum security)
- **Key Derivation**: PBKDF2-SHA256 (250,000+ iterations)
- **Random Generation**: Web Crypto API only
- **Salt**: Unique random salt per operation

### 3.2 Security Measures
- **CSP**: Strict Content Security Policy
- **SRI**: Subresource Integrity for all external resources
- **Storage**: Session-only key storage, encrypted contact storage
- **XSS Prevention**: Strict input sanitization, textContent usage
- **Timing Attacks**: Constant-time comparisons
- **Memory**: Secure key wiping after use

### 3.3 Compliance
- **NIST**: Lightweight Cryptography Standard compliance
- **OWASP**: Top 10 security recommendations
- **CSP Level 3**: Modern security headers

## 4. Feature Requirements

### 4.1 Core Features
1. **Key Management**
   - Generate Ascon-80pq keypairs
      - Export/import keys (encrypted)
         - QR code sharing
            - Key fingerprinting

            2. **Contact Management**
               - Add/remove contacts
                  - Key validation
                     - Contact encryption status
                        - Contact grouping

                        3. **Messaging**
                           - Encrypt/decrypt messages
                              - Multiple encryption modes (contact, personal key, password)
                                 - Size optimization for Meshtastic
                                    - Batch operations

                                    4. **Meshtastic Integration**
                                       - Packet size validation
                                          - LoRa constraint warnings
                                             - Export for Meshtastic API
                                                - Size calculator

                                                ### 4.2 Advanced Features
                                                1. **Offline Functionality**
                                                   - Complete offline operation
                                                      - Background sync queue
                                                         - Cached operations
                                                            - Offline key generation

                                                            2. **Security Features**
                                                               - Key backup/recovery
                                                                  - Encrypted local storage
                                                                     - Audit logging
                                                                        - Security notifications

                                                                        3. **Developer Features**
                                                                           - API integration helpers
                                                                              - Batch encryption tools
                                                                                 - Performance monitoring
                                                                                    - Debug mode

                                                                                    ## 5. File Structure

                                                                                    ```
                                                                                    src/
                                                                                    ├── components/           # Reusable UI components
                                                                                    │   ├── ui/              # Shadcn/ui components
                                                                                    │   ├── crypto/          # Crypto-specific components
                                                                                    │   ├── contacts/        # Contact management
                                                                                    │   └── messaging/       # Message components
                                                                                    ├── lib/                 # Core libraries
                                                                                    │   ├── crypto/          # Ascon crypto wrapper
                                                                                    │   ├── storage/         # Secure storage layer
                                                                                    │   ├── validation/      # Zod schemas
                                                                                    │   └── utils/           # Utility functions
                                                                                    ├── hooks/               # React hooks
                                                                                    ├── stores/              # State management (Zustand)
                                                                                    ├── types/               # TypeScript definitions
                                                                                    ├── workers/             # Service worker & crypto workers
                                                                                    └── App.tsx              # Main application
                                                                                    ```

                                                                                    ## 6. Implementation Plan

                                                                                    ### 6.1 Phase 1: Foundation (Week 1-2)
                                                                                    - **Setup**: Vite + Bun project initialization
                                                                                    - **Core**: TypeScript configuration, ESLint, Prettier
                                                                                    - **UI**: Shadcn/ui setup, TailwindCSS configuration
                                                                                    - **PWA**: Basic service worker, manifest
                                                                                    - **Crypto**: Ascon-js integration, basic wrapper

                                                                                    ### 6.2 Phase 2: Core Features (Week 3-4)
                                                                                    - **Validation**: Zod schemas for all data structures
                                                                                    - **Storage**: Secure storage layer with encryption
                                                                                    - **Components**: Basic UI components (buttons, forms, modals)
                                                                                    - **Key Management**: Key generation, storage, export
                                                                                    - **Contact Management**: Add/remove contacts with validation

                                                                                    ### 6.3 Phase 3: Messaging (Week 5-6)
                                                                                    - **Encryption**: Multi-mode encryption implementation
                                                                                    - **UI**: Message interface with mode selection
                                                                                    - **Validation**: Input validation and sanitization
                                                                                    - **Size Calculator**: Real-time Meshtastic constraints
                                                                                    - **Error Handling**: Comprehensive error management

                                                                                    ### 6.4 Phase 4: Security & Polish (Week 7-8)
                                                                                    - **Security Audit**: Penetration testing, code review
                                                                                    - **PWA Enhancement**: Offline queue, background sync
                                                                                    - **Performance**: Optimization, lazy loading
                                                                                    - **Testing**: Unit tests, integration tests, E2E
                                                                                    - **Documentation**: API docs, user guide

                                                                                    ## 7. Dependencies

                                                                                    ### 7.1 Production Dependencies
                                                                                    ```json
                                                                                    {
                                                                                      "react": "^18.2.0",
                                                                                        "react-dom": "^18.2.0",
                                                                                          "ascon-js": "^1.0.4",
                                                                                            "zod": "^3.22.4",
                                                                                              "@radix-ui/react-*": "latest",
                                                                                                "class-variance-authority": "^0.7.0",
                                                                                                  "clsx": "^2.0.0",
                                                                                                    "tailwind-merge": "^2.0.0",
                                                                                                      "zustand": "^4.4.7",
                                                                                                        "qrcode": "^1.5.3",
                                                                                                          "workbox-window": "^7.0.0"
                                                                                                          }
                                                                                                          ```

                                                                                                          ### 7.2 Development Dependencies
                                                                                                          ```json
                                                                                                          {
                                                                                                            "@types/react": "^18.2.0",
                                                                                                              "@types/react-dom": "^18.2.0",
                                                                                                                "@typescript-eslint/eslint-plugin": "^6.0.0",
                                                                                                                  "@typescript-eslint/parser": "^6.0.0",
                                                                                                                    "eslint": "^8.45.0",
                                                                                                                      "eslint-plugin-react-hooks": "^4.6.0",
                                                                                                                        "eslint-plugin-react-refresh": "^0.4.3",
                                                                                                                          "typescript": "^5.0.2",
                                                                                                                            "vite": "^5.0.0",
                                                                                                                              "vite-plugin-pwa": "^0.17.0",
                                                                                                                                "@vitejs/plugin-react": "^4.0.3",
                                                                                                                                  "tailwindcss": "^3.4.0",
                                                                                                                                    "autoprefixer": "^10.4.16",
                                                                                                                                      "postcss": "^8.4.31"
                                                                                                                                      }
                                                                                                                                      ```

                                                                                                                                      ## 8. Configuration Files

                                                                                                                                      ### 8.1 Vite Configuration
                                                                                                                                      - PWA plugin with Workbox
                                                                                                                                      - TypeScript path aliases
                                                                                                                                      - Build optimization
                                                                                                                                      - Security headers
                                                                                                                                      - Asset optimization

                                                                                                                                      ### 8.2 TypeScript Configuration
                                                                                                                                      - Strict mode enabled
                                                                                                                                      - Path mapping
                                                                                                                                      - React JSX support
                                                                                                                                      - Modern ES features

                                                                                                                                      ### 8.3 TailwindCSS Configuration
                                                                                                                                      - Shadcn/ui integration
                                                                                                                                      - Custom design tokens
                                                                                                                                      - Dark mode support
                                                                                                                                      - Animation utilities

                                                                                                                                      ## 9. Security Implementation

                                                                                                                                      ### 9.1 Content Security Policy
                                                                                                                                      ```typescript
                                                                                                                                      const csp = {
                                                                                                                                        "default-src": ["'self'"],
                                                                                                                                          "script-src": ["'self'", "'wasm-unsafe-eval'"],
                                                                                                                                            "style-src": ["'self'", "'unsafe-inline'"],
                                                                                                                                              "img-src": ["'self'", "data:", "blob:"],
                                                                                                                                                "connect-src": ["'self'"],
                                                                                                                                                  "worker-src": ["'self'", "blob:"]
                                                                                                                                                  }
                                                                                                                                                  ```

                                                                                                                                                  ### 9.2 Key Storage Schema
                                                                                                                                                  ```typescript
                                                                                                                                                  const KeyStorageSchema = z.object({
                                                                                                                                                    id: z.string().uuid(),
                                                                                                                                                      keyType: z.enum(['ascon80pq', 'derived']),
                                                                                                                                                        algorithm: z.literal('Ascon-80pq'),
                                                                                                                                                          keySize: z.literal(160),
                                                                                                                                                            createdAt: z.date(),
                                                                                                                                                              encryptedKey: z.string(),
                                                                                                                                                                salt: z.string(),
                                                                                                                                                                  iterations: z.number().min(250000)
                                                                                                                                                                  })
                                                                                                                                                                  ```

                                                                                                                                                                  ### 9.3 Message Schema
                                                                                                                                                                  ```typescript
                                                                                                                                                                  const MessageSchema = z.object({
                                                                                                                                                                    id: z.string().uuid(),
                                                                                                                                                                      type: z.enum(['contact', 'password', 'key']),
                                                                                                                                                                        recipient: z.string().optional(),
                                                                                                                                                                          ciphertext: z.string(),
                                                                                                                                                                            nonce: z.string(),
                                                                                                                                                                              timestamp: z.date(),
                                                                                                                                                                                size: z.number().max(237) // Meshtastic limit
                                                                                                                                                                                })
                                                                                                                                                                                ```

                                                                                                                                                                                ## 10. Performance Requirements

                                                                                                                                                                                ### 10.1 Bundle Size
                                                                                                                                                                                - **Initial**: <500KB gzipped
                                                                                                                                                                                - **Crypto Worker**: <100KB
                                                                                                                                                                                - **Service Worker**: <50KB
                                                                                                                                                                                - **Lazy Chunks**: <200KB each

                                                                                                                                                                                ### 10.2 Runtime Performance
                                                                                                                                                                                - **Key Generation**: <2 seconds
                                                                                                                                                                                - **Encryption**: <100ms per message
                                                                                                                                                                                - **Decryption**: <100ms per message
                                                                                                                                                                                - **UI Response**: <16ms frame time

                                                                                                                                                                                ## 11. Testing Strategy

                                                                                                                                                                                ### 11.1 Unit Tests
                                                                                                                                                                                - Crypto functions
                                                                                                                                                                                - Validation schemas
                                                                                                                                                                                - Utility functions
                                                                                                                                                                                - React hooks

                                                                                                                                                                                ### 11.2 Integration Tests
                                                                                                                                                                                - Component interactions
                                                                                                                                                                                - Storage operations
                                                                                                                                                                                - Crypto workflows
                                                                                                                                                                                - PWA functionality

                                                                                                                                                                                ### 11.3 Security Tests
                                                                                                                                                                                - Cryptographic correctness
                                                                                                                                                                                - XSS prevention
                                                                                                                                                                                - CSRF protection
                                                                                                                                                                                - Timing attack resistance

                                                                                                                                                                                ## 12. Deployment

                                                                                                                                                                                ### 12.1 Build Process
                                                                                                                                                                                - Bun build with Vite
                                                                                                                                                                                - Asset optimization
                                                                                                                                                                                - PWA manifest generation
                                                                                                                                                                                - Service worker compilation

                                                                                                                                                                                ### 12.2 Distribution
                                                                                                                                                                                - GitHub Pages deployment
                                                                                                                                                                                - IPFS distribution
                                                                                                                                                                                - Offline installer package
                                                                                                                                                                                - Docker container

                                                                                                                                                                                ## 13. Maintenance

                                                                                                                                                                                ### 13.1 Dependencies
                                                                                                                                                                                - Monthly security updates
                                                                                                                                                                                - Quarterly feature updates
                                                                                                                                                                                - Annual major version updates
                                                                                                                                                                                - Continuous vulnerability monitoring

                                                                                                                                                                                ### 13.2 Browser Support
                                                                                                                                                                                - Chrome 90+
                                                                                                                                                                                - Firefox 88+
                                                                                                                                                                                - Safari 14+
                                                                                                                                                                                - Edge 90+

                                                                                                                                                                                This PRD provides comprehensive guidance for converting the existing PWA into a production-ready, secure, type-safe application optimized for modern development workflows and Meshtastic constraints.