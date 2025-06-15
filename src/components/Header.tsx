import { ConnectButton } from "@tomo-inc/tomo-evm-kit";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="sticky top-0 w-full px-4 sm:px-6 py-4 
                      bg-[#232323]/90 dark:bg-[#232323]/95 
                      backdrop-blur-lg border-b border-white/10 dark:border-white/5 
                      z-50 transition-all duration-300 ease-out
                      shadow-lg shadow-black/5
                      animate-slideDown">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <Link href="/" className="transform transition-all duration-300 hover:scale-105">
            <Image 
              width={56}
              height={56}
              src="/logo.jpg"
              alt="Jumapel Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 
                       object-cover ring-2 ring-white/20 
                       transition-all duration-300 
                       group-hover:ring-white/30
                       shadow-lg shadow-black/10
                       backdrop-blur-sm"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white 
                        tracking-tight transition-all duration-300
                        group-hover:text-white/90">
            Jumapel
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/form", label: "Form" },
            { href: "/marketplace", label: "Marketplace" },
            { href: "https://x.com/Jumapel_org", label: "Community", external: true },
            { href: "/profile", label: "Profile" }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-white/80 dark:text-white/80 text-base lg:text-lg font-medium 
                       hover:text-white dark:hover:text-white 
                       transition-all duration-300 ease-out
                       relative after:absolute after:bottom-0 after:left-0 
                       after:h-0.5 after:w-0 after:bg-white/80 
                       hover:after:w-full after:transition-all after:duration-300
                       hover:translate-y-[-1px] hover:shadow-lg hover:shadow-white/5
                       px-2 py-1 rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="transform transition-all duration-300 hover:scale-105">
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
      </div>
    </header>
  );
}

export default Header;
