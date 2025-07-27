# 🔐 SecureAscon - Post-Quantum Messaging PWA

A modern, production-ready Progressive Web App implementing **Ascon-80pq** post-quantum cryptography for secure messaging optimized for Meshtastic and constrained networks.

![Built with](https://img.shields.io/badge/Built_with-React_18+-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite)
![Bun](https://img.shields.io/badge/Bun-1.0+-000000?style=flat&logo=bun)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)[![CodeQL](https://github.com/ngmisl/ascontastic/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/ngmisl/ascontastic/actions/workflows/github-code-scanning/codeql)

## ✨ Features

### 🔐 **Post-Quantum Cryptography**
- **Ascon-80pq AEAD** - NIST lightweight cryptography standard
- **160-bit security** - Quantum-resistant encryption
- **Authenticated encryption** - Prevents tampering and forgery
- **Optimized for IoT** - Perfect for LoRa/Meshtastic constraints

### 📱 **Modern PWA**
- **Offline-first** - Full functionality without internet
- **Installable** - Native app experience on all devices  
- **Fast loading** - Optimized bundles and code splitting
- **Service worker** - Background sync and caching

### 🎨 **Beautiful UI**
- **Dark theme** - Optimized for low-light environments
- **Glass morphism** - Modern backdrop blur effects
- **Responsive design** - Mobile and desktop optimized
- **shadcn/ui components** - Accessible and beautiful

### ⚡ **Core Functionality**
- **Three encryption modes**: Contact-based, Personal key, Password-based
- **Key management**: Generate, share, export, import with QR codes
- **Contact management**: Add, validate, and organize trusted contacts  
- **Real-time validation**: Meshtastic size constraints and feedback
- **Comprehensive help**: Built-in documentation and best practices

## 🚀 Quick Start

### Prerequisites
```bash
# Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### Development
```bash
# Clone the repository
git clone https://github.com/ngmisl/ascontastic
cd ascontastic

# Install dependencies
bun install

# Start development server
bun dev
# Opens http://localhost:5173/

# Type checking
bun run type-check

# Linting
bun run lint
```

### Production Build
```bash
# Build for production
bun run build

# Preview production build
bun preview

# Build with PWA optimizations
bun run build:prod
```

## 📋 Usage Guide

### 1. **Generate Your Key**
- Navigate to the **Keys** tab
- Click **Generate Key** to create a new Ascon-80pq keypair
- Your key is stored securely in session storage only

### 2. **Share Your Key**
- Click **Share Key** to display your public key
- Copy the 40-character hex string or scan the QR code
- Share this key securely with your contacts

### 3. **Add Contacts**
- Go to the **Contacts** tab  
- Enter contact name and their 40-character hex key
- Keys are validated and stored for easy messaging

### 4. **Send Encrypted Messages**
- Use the **Message** tab to encrypt/decrypt
- Choose encryption mode: Contact, My Key, or Password
- Real-time size validation shows Meshtastic compatibility
- Copy encrypted messages for use in Meshtastic apps

## 🔧 Technical Details

### Architecture
- **Runtime**: Bun 1.0+ (package manager, bundler, runtime)
- **Framework**: React 18+ with TypeScript 5.0+
- **Build Tool**: Vite 5.0+ with optimizations
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: TailwindCSS 4.0+ with custom dark theme
- **State Management**: Zustand for crypto operations
- **Validation**: Zod schemas for type-safe validation
- **PWA**: Workbox service worker with offline support

### Security Implementation
- **Algorithm**: Ascon-80pq AEAD (160-bit security)
- **Key Storage**: Session-only storage (cleared on browser close)
- **Key Derivation**: PBKDF2-SHA256 (250,000 iterations)
- **Random Generation**: Web Crypto API only
- **Input Validation**: Comprehensive XSS prevention
- **Memory Security**: Secure key wiping after use

### Meshtastic Integration
- **Size Constraints**: Real-time validation for 237-byte limit
- **Overhead**: Only +32 bytes per message (nonce + auth tag)
- **Encoding**: Base64 with size calculations
- **Integration**: Manual copy/paste or API integration

### Bundle Size (Gzipped)
```
📄 HTML:        0.50 kB
🎨 CSS:         3.03 kB  
🔧 Vendor:      0.38 kB
🔐 Crypto:      2.03 kB
🧩 UI:         33.14 kB
⚛️  App:        93.00 kB
──────────────────────
📦 Total:     ~130 kB
```

## 🛡️ Security Best Practices

### For Users
- **Verify keys in person** or through secure channels
- **Export and backup** your keys before closing the browser
- **Use strong passwords** for password-based encryption
- **Clear browser data** when using shared computers
- **Generate new keys** if compromise is suspected

### For Developers
- Keys are never logged or exposed in console
- All inputs are validated with Zod schemas
- XSS prevention through proper sanitization
- Constant-time comparisons for security operations
- Secure memory handling with explicit key wiping

## 📡 Meshtastic Integration

### Manual Method
1. Encrypt your message in SecureAscon
2. Copy the encrypted output
3. Paste into your Meshtastic app
4. Send over the mesh network

### API Integration  
```python
# Example with Meshtastic Python API
import meshtastic
from secureascon import encrypt_message

# Encrypt with SecureAscon
encrypted = encrypt_message(key, "Hello mesh!")

# Send via Meshtastic
interface = meshtastic.SerialInterface()
interface.sendText(encrypted)
```

### Size Constraints
- 🟢 **Green** (≤200 bytes): Perfect for Meshtastic
- 🟡 **Yellow** (201-237 bytes): Close to limit, may work
- 🔴 **Red** (>237 bytes): Too large, will be rejected

## 🧪 Testing

```bash
# Run all tests
bun test

# Test with coverage
bun test:coverage

# Test crypto functions only
bun test:crypto

# Test PWA functionality
bun test:pwa
```

## 🚢 Deployment

### GitHub Pages
```bash
bun run build:prod
bun run deploy:gh-pages
```

### Docker
```bash
bun run docker:build
docker run -p 3000:3000 secureascon
```

### Static Hosting
The `dist/` folder can be deployed to any static hosting service:
- Netlify
- Vercel  
- GitHub Pages
- Cloudflare Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript strict mode
- Follow ESLint configuration  
- Write tests for crypto functions
- Maintain security best practices
- Document security-critical changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NIST** for the Ascon lightweight cryptography standard
- **Meshtastic** community for mesh networking innovation
- **shadcn/ui** for beautiful, accessible components
- **Radix UI** for primitive UI components
- **Bun** for fast JavaScript runtime and tooling

## 📞 Support

- 📖 **Documentation**: See the Help tab in the application
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ngmisl/ascontastic/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ngmisl/ascontastic/discussions)
- 💬 **Donate❤️**: [https://fourzerofour.fkey.id](https://fourzerofour.fkey.id)

---

**⚠️ Security Notice**: This application provides post-quantum cryptography for experimental and educational use. While Ascon-80pq is a NIST standard, always verify implementations and conduct security audits before using in production environments.
