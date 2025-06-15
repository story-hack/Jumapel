# 🦾 TomoSDK Integration

This document details how Jumapel integrates the TomoSDK for wallet connection, authentication, and outlines the planned approach for social (Twitter, Discord) verification in user profiles.

---

# TomoSDK Integration with Jumapel

This document outlines how TomoSDK's wallet and social verification features are integrated into the Jumapel platform, enabling secure wallet authentication and planned social (Twitter, Discord) verification for user profiles.

## Architecture Overview

The integration follows a modular, multi-layered approach:

```
┌───────────────┐    ┌────────────────────┐    ┌──────────────────────┐
│ EVM Wallets   │───▶│ Tomo EVM Kit       │───▶│ Jumapel App          │
└───────────────┘    └────────────────────┘    │  (Header, Dashboard) │
                                              └──────────────────────┘
         ▲                    │                        │
         │                    ▼                        ▼
┌───────────────┐    ┌────────────────────┐    ┌──────────────────────┐
│ Social OAuth  │───▶│ Tomo Social        │───▶│ User Profile         │
│ (Twitter,     │    │ Connectors         │    │  (Planned)           │
│  Discord)     │    └────────────────────┘    └──────────────────────┘
```

## Key Components

### 1. Tomo EVM Kit (Wallet Integration)
- Provides seamless EVM wallet connection (MetaMask, WalletConnect, etc.)
- Handles account display, balance, and transaction signing
- Manages authentication state and session
- Used in `src/components/Header.tsx`, `src/app/dashboard/page.tsx`

### 2. Tomo Social Connectors (Social Verification)
- Enables OAuth-based verification for Twitter and Discord
- Will allow users to link and verify social accounts in their profile
- Planned for `src/app/profile/page.tsx`

## Implementation Details

### Wallet Integration
- Install Tomo EVM Kit:
  ```bash
  npm install @tomo-inc/tomo-evm-kit
  ```
- Use the `ConnectButton` in your React components:
  ```tsx
  import { ConnectButton } from "@tomo-inc/tomo-evm-kit";
  // ...
  <ConnectButton
    accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
    showBalance={{ smallScreen: false, largeScreen: true }}
  />
  ```
- The user's wallet address is stored in localStorage (`tomo-evm-kit:address`) and used for onchain actions (minting, profile, etc).
- Wallet connection is required for dashboard access and NFT minting.

### Social Verification 
- Used Tomo's social connector APIs to initiate OAuth for Twitter/Discord.
- On success, store the user's social handles and verification status in their profile.
- Display verified badges in the UI.
- Example (planned):
  ```tsx
  import { useTomoSocial } from "@tomo-inc/tomo-evm-kit";
  // ...
  <button onClick={verifyTwitter}>Verify Twitter</button>
  <button onClick={verifyDiscord}>Verify Discord</button>
  {socialAccounts.twitter?.verified && <span>✔ Twitter Verified</span>}
  {socialAccounts.discord?.verified && <span>✔ Discord Verified</span>}
  ```

## Setup

1. **Install dependencies:**
   ```bash
   npm install @tomo-inc/tomo-evm-kit
   ```
2. **Add the ConnectButton to your header or dashboard.**
3. **(Planned) Add social verification buttons to the profile page.**

## Configuration
- No special config is needed for basic wallet connection.
- For social verification, you may need to set up OAuth credentials with Tomo and supported social platforms (see Tomo docs).

## Benefits
- Seamless wallet onboarding for all EVM users
- Secure authentication and transaction signing
- (Planned) Social verification for trust, sybil resistance, and social-powered features

## References
- [Tomo EVM Kit Documentation](https://docs.tomo.inc/tomo-sdk/tomoevmkit)
- [Tomo Social Connectors](https://docs.tomo.inc/social-connectors/overview)
- [Jumapel Source Code](../src/app/provider/Web3Provider.tsx, ../src/components/Header.tsx)

---

For questions or contributions, see the main [README.md](../README.md) or contact the Jumapel team.