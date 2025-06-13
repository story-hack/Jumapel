import { ConnectButton } from "@tomo-inc/tomo-evm-kit";
import Link from "next/link";

function Header() {
  return (
    <header className="w-full px-6 pt-8 pb-8 bg-[#232323] border-b border-transparent">
      <div className="max-w-10xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Jumapel Logo"
            className="w-14 h-14 rounded-full bg-white object-cover"
          />
          <h1 className="text-3xl font-bold text-white">Jumapel</h1>
        </div>
        <nav className="hidden md:flex gap-10 mr-8 ">
          <Link
            href="#"
            className="text-white text-2xl hover:underline transition"
          >
            Marketplace
          </Link>
          <Link
            href="https://x.com/Jumapel_org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-2xl hover:underline transition"
          >
            Community
          </Link>
          <Link
            href="/dashboard"
            className="text-white text-2xl hover:underline transition"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-white text-2xl  hover:underline transition"
          >
            Support
          </Link>
          <Link
            href="/profile"
            className="text-white text-2xl hover:underline transition"
          >
            Profile
          </Link>
        </nav>
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </div>
    </header>
  );
}

export default Header;
