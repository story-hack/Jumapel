# 🏗 Jumapel Architecture

Jumapel is a decentralized platform that leverages AI and blockchain to help users generate unique brand names, check domain availability, and mint their ideas as on-chain NFTs. The architecture is modular, scalable, and designed for seamless integration between AI services, blockchain protocols, and a modern web UI.

---

## 1. High-Level Overview

Jumapel consists of three main layers:

- **AI Brand Intelligence Layer**: Handles idea refinement, brand name generation, and domain availability checks using OpenAI/OpenRouter.
- **Onchain Tokenization Layer**: Mints ideas and brands as NFTs, storing metadata on IPFS and registering IP onchain via Story Protocol.
- **Web Application Layer**: Provides a user-friendly interface for idea submission, chat-based brand creation, NFT minting, and marketplace listing.

---

## 2. Main Components

### a. API Endpoints (`src/app/api/`)
- **`agentTest/route.ts`**: Receives product ideas, prompts the AI agent, and returns a brand name and available domain in JSON format.
- **`mintNft-resgisterIp-attachLicense/route.ts`**: Handles NFT minting and IP registration. Uploads metadata to IPFS, hashes content, and interacts with Story Protocol smart contracts.
- **`user-nft/route.ts`**: Fetches NFTs owned by a user.
- **`upload-image/route.ts`**: Handles image uploads for NFT metadata.

### b. Utilities (`src/utils/`)
- **`openai.ts` / `openai.js`**: Integrates with OpenAI/OpenRouter for AI-powered brand and domain generation.
- **`uploadJSONToIPFS.ts`**: Uploads JSON metadata to IPFS.
- **`utils.ts`**: General utility functions.

### c. Frontend Pages (`src/app/`)
- **`dashboard/page.tsx`**: Main user interface for submitting ideas, chatting with the AI agent, and minting NFTs.
- **`marketplace/page.tsx`**: Displays minted idea NFTs for discovery and purchase.
- **`profile/page.tsx`**: Shows user profile and owned NFTs.
- **`form/page.tsx`, `mint-success/page.tsx`**: Additional flows for minting and feedback.

### d. Components (`src/components/`)
- **`Header.tsx`**: Navigation and branding.
- **`Card.tsx`, `UsersNftCollection.tsx`, `ImageUploadForm.tsx`, `Loader.tsx`**: Reusable UI components.

### e. Providers
- **`provider/Web3Provider.tsx`**: Handles wallet connection and blockchain context.

---

## 3. Data Flow & Sequence

1. **User submits a product idea via the dashboard chat UI.**
2. **Frontend sends the idea to `/api/agentTest`.**
3. **AI agent returns a brand name and available domain.**
4. **User reviews and confirms to mint as NFT.**
5. **Frontend sends metadata to `/api/mintNft-resgisterIp-attachLicense`.**
6. **API uploads metadata to IPFS, hashes content, and calls Story Protocol smart contracts to mint NFT and register IP.**
7. **NFT and IP details are returned and displayed to the user.**
8. **NFT is listed in the marketplace for discovery, collaboration, or purchase.**

---

## 4. File & Directory Structure

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

## 5. Integration Diagram

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

---

## 6. Technology Stack

- **Frontend**: Next.js (React), Tailwind CSS
- **AI Integration**: OpenAI/OpenRouter (via API)
- **Blockchain**: Story Protocol, EVM-compatible chains, viem, wagmi
- **Storage**: IPFS (Pinata)
- **Wallet**: Tomo EVM Kit, wagmi
- **Other**: TypeScript, dotenv, ESLint, etc.

---

## 7. Extensibility & Best Practices

- Modular API endpoints for easy feature addition
- Reusable React components for UI consistency
- Environment variables for secrets and config
- Clear separation of AI, blockchain, and UI logic
- Designed for scalability and future protocol integrations

---

For more details, see the [README.md](../README.md) and other docs in the `docs/` directory.
