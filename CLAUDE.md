# SecureAscon - Post-Quantum Lightweight Messaging PWA

## Project Overview
Modern React/TypeScript PWA implementing Ascon-80pq post-quantum cryptography for secure messaging optimized for Meshtastic and constrained networks.

## Technology Stack
- **Runtime**: Bun 1.0+
- **Build Tool**: Vite 5.0+
- **Framework**: React 18+ with TypeScript 5.0+
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: TailwindCSS 3.4+
- **Validation**: Zod 3.22+
- **Cryptography**: ascon-js (NIST implementation)
- **PWA**: Workbox 7+
- **State Management**: Zustand

## Quick Start

### Prerequisites
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### Project Setup
```bash
# Create new Vite React TypeScript project
bun create vite . --template react-ts

# Install dependencies
bun install

# Install shadcn/ui
bunx shadcn@latest init

# Add core shadcn/ui components
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add tabs
bunx shadcn@latest add input
bunx shadcn@latest add textarea
bunx shadcn@latest add select
bunx shadcn@latest add label
bunx shadcn@latest add dialog
bunx shadcn@latest add toast
bunx shadcn@latest add badge
bunx shadcn@latest add separator

# Install additional dependencies
bun add ascon-js zod zustand qrcode workbox-window class-variance-authority clsx tailwind-merge

# Install dev dependencies
bun add -D @types/qrcode vite-plugin-pwa @vitejs/plugin-react autoprefixer postcss tailwindcss
```

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
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

## Development Commands

### Core Commands
```bash
# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun preview

# Type checking
bun run type-check

# Linting
bun run lint

# Fix linting issues
bun run lint:fix

# Format code
bun run format
```

### Testing Commands
```bash
# Run unit tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage

# Run crypto security tests
bun test:crypto

# Run PWA functionality tests
bun test:pwa
```

### Build & Deployment
```bash
# Production build with optimizations
bun run build:prod

# Analyze bundle size
bun run analyze

# Generate PWA assets
bun run pwa:generate

# Deploy to GitHub Pages
bun run deploy:gh-pages

# Create Docker image
bun run docker:build
```

## Configuration Files

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:prod": "tsc && vite build --mode production",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:crypto": "vitest run src/lib/crypto",
    "test:pwa": "vitest run src/workers",
    "analyze": "vite-bundle-analyzer",
    "pwa:generate": "vite build --mode pwa",
    "deploy:gh-pages": "gh-pages -d dist",
    "docker:build": "docker build -t secureascon ."
  }
}
```

### Environment Variables
```bash
# Development
VITE_APP_NAME=SecureAscon
VITE_APP_VERSION=1.0.0
VITE_CRYPTO_WORKER_URL=/crypto-worker.js
VITE_ENABLE_PWA=true

# Production
VITE_CSP_ENABLED=true
VITE_SRI_ENABLED=true
VITE_AUDIT_LOG=true
```

## Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "ascon-js": "^1.0.4",
  "zod": "^3.22.4",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-select": "latest",
  "@radix-ui/react-toast": "latest",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "zustand": "^4.4.7",
  "qrcode": "^1.5.3",
  "workbox-window": "^7.0.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@types/qrcode": "^1.5.5",
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
  "postcss": "^8.4.31",
  "vitest": "^1.0.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^6.0.0"
}
```

## Crypto Implementation

### Key Features
- **Algorithm**: Ascon-80pq (160-bit post-quantum security)
- **Key Derivation**: PBKDF2-SHA256 (250,000+ iterations)
- **Random Generation**: Web Crypto API only
- **Storage**: Session-only key storage, encrypted contact storage

### Security Measures
- Strict Content Security Policy
- Input sanitization with Zod validation
- Constant-time comparisons
- Secure memory wiping
- XSS prevention via textContent usage

## Meshtastic Integration

### Size Constraints
- **Meshtastic Limit**: 237 bytes total
- **Ascon Overhead**: +32 bytes
- **Base64 Encoding**: +33% size
- **Max Message**: ~205 characters

### Integration Methods
1. **Manual**: Encrypt → Copy → Paste in Meshtastic
2. **API**: Use Meshtastic Python API with crypto functions
3. **Direct**: Browser extension integration (future)

## PWA Features

### Offline Capabilities
- Complete offline operation
- Background sync queue
- Cached operations
- Offline key generation

### Installation
- Web App Manifest
- Service Worker registration
- Install prompts
- Update notifications

## Security Compliance

### Standards
- **NIST**: Lightweight Cryptography Standard
- **OWASP**: Top 10 security recommendations
- **CSP Level 3**: Modern security headers

### Audit Requirements
- Cryptographic correctness testing
- XSS prevention validation
- Timing attack resistance
- Memory security verification

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb dist
bun install

# Type checking issues
bun run type-check

# Crypto worker issues
bun run test:crypto
```

#### PWA Issues
```bash
# Service worker registration
bun run pwa:generate

# Manifest validation
bunx pwa-asset-generator --help

# Offline functionality
bun run test:pwa
```

#### Performance Issues
```bash
# Bundle analysis
bun run analyze

# Memory leaks
bun run test:coverage

# Crypto performance
bun run test:crypto
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write tests for crypto functions

### Security Guidelines
- Never log or expose keys
- Use constant-time comparisons
- Validate all inputs with Zod
- Follow OWASP guidelines

### Testing Requirements
- Unit tests for all crypto functions
- Component tests with Testing Library
- Integration tests for workflows
- Security tests for vulnerabilities

## Deployment

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

### IPFS
```bash
bun run build:prod
ipfs add -r dist/
```

## License
MIT License - See LICENSE file for details

## Security Reporting
Report security vulnerabilities to: security@secureascon.dev