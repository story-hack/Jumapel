# 🛠 Jumapel Development Guide

This document provides setup instructions and development guidelines for contributors to the Jumapel project.

---

## 1. Prerequisites

- **Node.js** (v18+ recommended)
- **npm**, **yarn**, **pnpm**, or **bun** (choose one)
- **Git**
- (Optional) **VS Code** with recommended extensions: Prettier, ESLint, Tailwind CSS IntelliSense

---

## 2. Getting Started

### a. Clone the Repository
```powershell
# In PowerShell
git clone https://github.com/story-hack/Jumapel.git
cd Jumapel
```

### b. Install Dependencies
Choose your preferred package manager:
```powershell
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### c. Environment Variables
- Copy `example.env` to `.env.local` and fill in required secrets (e.g., OpenAI API key, Pinata keys):
```powershell
cp example.env .env.local
# Edit .env.local and set your keys
```

---

## 3. Running the App

### a. Development Server
```powershell
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

### b. Build for Production
```powershell
npm run build
npm start
```

---

## 4. Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed breakdown.

---

## 5. Code Style & Linting
- **TypeScript** is used throughout.
- **ESLint** and **Prettier** are recommended for code quality and formatting.
- Run lint checks:
```powershell
npm run lint
```
- Use consistent naming and file organization.

---

## 6. Contributing

1. **Fork** the repo and create a feature branch:
   ```powershell
   git checkout -b feature/your-feature
   ```
2. **Make your changes** and commit with clear messages.
3. **Push** to your fork and open a Pull Request.
4. Follow code review feedback and keep your branch up to date with `main`.

---

## 7. Testing
- (No test framework is set up yet. Jest or Vitest is recommended for future testing.)

---

## 8. Useful Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Run linter

---

## 9. Support
- For questions, open an issue or contact the Jumapel team.
- See [README.md](../README.md) for project overview and links.
