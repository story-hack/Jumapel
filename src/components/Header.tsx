import { ConnectButton } from "@tomo-inc/tomo-evm-kit";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="sticky top-0 w-full px-4 sm:px-6 py-4 bg-[#232323]/90 dark:bg-[#232323]/95 backdrop-blur-md border-b border-white/10 dark:border-white/5 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image 
              width={56}
              height={56}
              src="/logo.jpg"
              alt="Jumapel Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white object-cover ring-2 ring-white/10 transition-transform hover:scale-105"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white tracking-tight">Jumapel</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/marketplace"
            className="text-white/90 dark:text-white/90 text-base lg:text-lg font-medium hover:text-white dark:hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Marketplace
          </Link>
          <Link
            href="https://x.com/Jumapel_org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 dark:text-white/90 text-base lg:text-lg font-medium hover:text-white dark:hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Community
          </Link>
          <Link
            href="/dashboard"
            className="text-white/90 dark:text-white/90 text-base lg:text-lg font-medium hover:text-white dark:hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-white/90 dark:text-white/90 text-base lg:text-lg font-medium hover:text-white dark:hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Support
          </Link>
          <Link
            href="/profile"
            className="text-white/90 dark:text-white/90 text-base lg:text-lg font-medium hover:text-white dark:hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Profile
          </Link>
          <Link
            href="/form"
            className="text-white/90 dark:text-white/90 text-base lg:text-lg font-medium hover:text-white dark:hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Form
          </Link>
        </nav>
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}

export default Header;
