# Jumapel 🚀

![Surreal Buildathon](https://img.shields.io/badge/Surreal-Buildathon-5f4def)
![AI Powered](https://img.shields.io/badge/AI-Powered-orange)
![Tomo Integrated](https://img.shields.io/badge/Tomo-Integrated-blue)

> Tokenize your product idea, secure its identity and creative ownership on the internet

Jumapel is a decentralised platform that uses AI to generate unique brand names and domain suggestions tailored to your needs. Users can mint their chosen names as protected on-chain IP, securing their identity and creative ownership on the internet.

<div align="center">
  <img src="/public/logo.jpg" alt="YieldStark Logo" width="200" height="170"/>
</div>

## 🎯 Problem Statement

Early-stage startup and product ideas face three major challenges:

 -Lack of ownership protection, leaving ideas vulnerable to theft or replication.

 -Brand identity struggles, with founders unable to craft distinctive, memorable names.

 -No direct path to value, as there's no system to tokenize, showcase, or monetize ideas in early stages.

## 💡 Solution

Jumapel addresses the protection and commercialization of early-stage ideas with three core components:

1. **AI-Powered Brand Intelligence**
   - Uses Artificial Intelligence to generate unique, relevant brand names
   - Context-aware suggestions based on user-submitted ideas
   - Tailored to product category, tone, and target audience
   - Generates product market value and  whitepaper based on user product's idea

2. **Onchain Idea Tokenization**
   - Mints submitted ideas and generated brand names as NFTs
   - Includes IP metadata like timestamp, wallet address, and summary
   - Ensures immutable proof of origin, powered by Story Protocol

3. **Idea Marketplace**
   - Securely lists idea NFTs for discovery or purchase
   - Enables early validation, exposure, and collaboration
   - Opens new channels for creators to monetize innovation

---

## 🧠 AI-Powered Brand & IP Creation
Jumapel leverages advanced AI and onchain protocols through multiple components:

### 1. Brand Intelligence Engine

**AI-Driven Naming & Branding**
- Context-aware brand name generation (see `src/app/api/agentTest/route.ts`)
- Creative, memorable, and relevant suggestions
- Domain availability checks (real-time)
- Market value prediction and Whitepaper generation

**Brand Metadata Enrichment**
- Product idea refinement and summarization
- Target audience and value proposition extraction
- Brand positioning insights

### 2. Onchain Tokenization Engine

```typescript
// src/app/api/agentTest/route.ts (AI agent endpoint)
const prompt = `You are a creative branding assistant. Given a product idea, suggest a catchy, unique brand name and check for an available .com domain. Reply in this JSON format: { "brandName": "...", "availableDomain": "..." }. Product idea: "${idea}"`;

// src/app/api/mintNft-resgisterIp-attachLicense/route.ts (NFT minting)
const ipMetadata = {
  name: brandName,
  description: idea,
  availableDomain,
  // ...other fields
};
const nftMetadata = {
  name: brandName,
  description: idea,
  image: logo,
  attributes: [{ key: "Available Domain", value: availableDomain }],
};
await fetch("/api/mintNft-resgisterIp-attachLicense", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ipMetadata, nftMetadata, walletAddress }),
});
```

### 3. Autonomous Features

**Effortless Brand Creation**
- One-click brand & domain generation via chat UI (`src/app/dashboard/page.tsx`)
- Automated IP metadata packaging
- Predictive Market Value based on user's product idea
- Product's Whitepaper generation

**Onchain Minting**
- Immutable proof of idea ownership
- NFT metadata includes brand, domain, and creator

**Marketplace Integration**
- List and showcase idea NFTs
- Enable collaboration and early monetization

### 4. AI & Protocol Architecture

```
┌────────────────────────────┐    ┌────────────────────────────┐    ┌────────────────────────────┐
│  AI Brand Agent (API)      │───▶│  Tokenization Engine       │───▶│  Marketplace & Discovery   │
│  (agentTest/route.ts)      │    │  (mintNft-resgisterIp...)  │    │  (marketplace/page.tsx)    │
└────────────────────────────┘    └────────────────────────────┘    └────────────────────────────┘
         ▲                              │                                 │
         │                              ▼                                 ▼
┌────────────────────────────┐    ┌────────────────────────────┐    ┌────────────────────────────┐
│  User Chat (Dashboard)     │    │  IP Metadata Packaging     │    │  Ownership & Monetization │
│  (dashboard/page.tsx)      │────▶  (NFT + Brand + Domain)   │────▶  (NFT Listing, Sale)      │
└────────────────────────────┘    └────────────────────────────┘    └────────────────────────────┘
```

### 5. Key AI Features

**Brand & Domain Generation**
- Unique, context-aware brand names
- Real-time .com domain availability

**Idea Refinement**
- Polished, concise summaries for NFTs
- Value proposition extraction

**Ownership & Proof**
- Immutable onchain minting
- Metadata includes timestamp, wallet, and summary

**Marketplace-Ready**
- Early validation and exposure
- Collaboration and monetization channels

---

## 🏗 Architecture

```plaintext
Jumapel/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agentTest/route.ts                # AI brand/domain agent endpoint
│   │   │   ├── mintNft-resgisterIp-attachLicense/route.ts  # NFT minting & IP registration
│   │   │   ├── user-nft/route.ts                 # User NFT collection API
│   │   │   └── upload-image/route.ts             # Image upload API
│   │   ├── dashboard/page.tsx                    # Dashboard & chat UI
│   │   ├── marketplace/page.tsx                  # NFT marketplace UI
│   │   ├── profile/page.tsx                      # User profile page
│   │   └── ...                                   # Other app pages
│   ├── components/
│   │   ├── Header.tsx                            # App header & navigation
│   │   ├── Card.tsx                              # UI card component
│   │   ├── UsersNftCollection.tsx                # User NFT display
│   │   └── ...                                   # Other UI components
│   ├── provider/Web3Provider.tsx                 # Web3 context provider
│   └── utils/
│       ├── openai.ts / openai.js                 # OpenAI/OpenRouter integration
│       ├── uploadJSONToIPFS.ts                   # IPFS upload utility
│       └── utils.ts                              # General utilities
├── public/                                       # Static assets (logo, NFTs, fonts)
├── README.md                                     # Project documentation
└── ...                                           # Config, lockfiles, etc.
```

---

## Tech Stack

- **Frontend**: Next.js 15.3.2, React 19.0.0
- **Styling**: Tailwind CSS
- **Blockchain**: Story Protocol
- **Wallet**: Tomo + RainbowKit

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- An EVM Compatible wallet (e.g., Metamask)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📚 Documentation

Detailed documentation is available in the `docs` directory:

- [TomoSDK Integration](docs/TOMO-INTEGRATION.md) - Details on data/price feed analysis
- [Architecture](docs/ARCHITECTURE.md) - System architecture and components
- [Development](docs/DEVELOPMENT.md) - Development setup and guidelines

## 🛣 Roadmap

### Phase 1: Core Infrastructure (Current)
- [x] AI-powered brand name generator
- [x] NFT minting on Story Protocol
- [x] Basic chat UI with idea input and name output
- [x] Onchain metadata storage

### Phase 2: Creator Tools (Q3 2025)
- [ ] Pitch deck generation from submitted ideas
- [ ] Idea collaboration feature (multi-wallet ownership)
- [ ] Advanced execution algorithms
- [ ] API access for external idea-to-NFT integrations

## 👥 Target Users
1. **Early-stage Founders**
   - Need fast idea protection
   - Looking for unique brand names
   - Want to prove ownership onchain

2. **Builders & Developers**
   - Launching new tools or dApps
   - Need instant branding
   - Prefer secure, verifiable IP

3. **Web3 Creators**
   - Explore, mint, or collect idea-NFTs
   - Participate in innovation marketplace
   - Support or co-own startup concepts


## 📢 Stay Connected
Follow us for updates, insights, and behind-the-scenes development:

🐦 Follow us on X: [@Jumapel](https://x.com/Jumapel_org)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
 - Story Protocol
 - Tomo 
 - Encode Club
