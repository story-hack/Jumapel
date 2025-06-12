"use client";
import { ConnectButton } from "@tomo-inc/tomo-evm-kit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  // Watch for wallet connection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        const address = window.localStorage.getItem("tomo-evm-kit:address");
        if (address) {
          router.push("/dashboard");
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [router]);

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#ece9f6] to-[#e7f0fa] p-0">
        <section className="w-full bg-[#232323] rounded-none flex flex-col md:flex-row overflow-hidden shadow-xl min-h-[80vh]">
          <div className="flex-1 flex flex-col justify-start pl-15 px-5 pt-40 pb-16 text-white">
            <div className="mb-5">
              <h1 className="text-7xl font-semibold md:text-6xl mb-6">
                Tokenize your idea{" "}
                <span className="text-[#bfe3fa]">
                  — unlock value, ownership, and opportunity.
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-4 ">
                Jumapel is your gateway to the decentralized creator economy. Effortlessly transform your unique ideas, art, or intellectual
                property into secure, tradable digital tokens on the blockchain.
              </p>

              <div className="flex items-center gap-4 mt-8">
                <div className="bg-[#0080ff] hover:bg-[#005fcc] transition-colors duration-200 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg cursor-pointer select-none">
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
                <button className="bg-white text-[#232323] font-semibold text-lg px-8 py-3 rounded-full shadow hover:bg-gray-200 transition-colors duration-200">
                  Learn more
                </button>
              </div>
            </div>
            {/* Story Protocol Marquee Box in Hero Left */}
            <div className="w-full max-w-md bg-black rounded-2xl px-6 py-4 flex items-center overflow-hidden relative mt-10">
              <img src="/story%20logo.png" alt="Story Protocol Logo" className="w-10 h-10 mr-4 rounded-lg object-contain bg-white p-1" />
              <div className="relative w-full overflow-hidden">
                <div className="animate-marquee whitespace-nowrap text-white text-lg font-semibold tracking-wide">
                  Built on Story Protocol &nbsp;•&nbsp; Built on Story Protocol &nbsp;•&nbsp; Built on Story Protocol &nbsp;•&nbsp; Built on Story Protocol
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 bg-[#28282b] p-10 animate-slideImages rounded-l-3xl relative overflow-hidden">
            <img src="/nft1.png" alt="NFT 1" className="rounded-xl object-cover w-full h-full aspect-square shadow-md animate-float" style={{animationDelay: '0s'}} />
            <img src="/nft2.png" alt="NFT 2" className="rounded-xl object-cover w-full h-full aspect-square shadow-md animate-float" style={{animationDelay: '0.5s'}} />
            <img src="/nft3.png" alt="NFT 3" className="rounded-xl object-cover w-full h-full aspect-square shadow-md animate-float" style={{animationDelay: '1s'}} />
            <img src="/nft1.png" alt="NFT 1 repeat" className="rounded-xl object-cover w-full h-full aspect-square shadow-md animate-float" style={{animationDelay: '1.5s'}} />
          </div>
        </section>
      </main>
      {/* Features Section */}
      <section className="w-full bg-[#f8f8ff] py-20 px-4 flex flex-col items-center">
        <h2 className="text-5xl font-bold mb-16 text-[#232323] text-center">Features</h2>
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="col-span-2 bg-[#f6f5fd] rounded-3xl p-10 shadow-sm border border-[#ece9f6] mb-4">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-3xl font-semibold mb-4 text-[#232323]">AI-Powered Brand Creation</h3>
            <p className="text-xl text-[#232323]">Jumapel uses cutting-edge AI to turn your idea into a complete brand—instantly generating names, functionality tags, and available domains tailored for web3.</p>
          </div>
          <div className="bg-[#f6f5fd] rounded-3xl p-10 shadow-sm border border-[#ece9f6] flex flex-col items-start">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-semibold mb-3 text-[#232323]">Effortless Launch, Maximum Impact</h3>
            <p className="text-lg text-[#232323]">From brand generation to onchain minting, Jumapel handles it all—so you can focus on building while your idea is already out in the world as a tradable NFT.</p>
          </div>
          <div className="bg-[#f6f5fd] rounded-3xl p-10 shadow-sm border border-[#ece9f6] flex flex-col items-start">
            <div className="text-4xl mb-4">🧬</div>
            <h3 className="text-2xl font-semibold mb-3 text-[#232323]">Built on Story Protocol</h3>
            <p className="text-lg text-[#232323]">Jumapel leverages Story Protocol to tokenize your ideas into NFTs—making them ownable, remixable, and monetizable—preserving your creativity onchain forever.</p>
          </div>
        </div>
      </section>
      <footer className="w-full bg-[#232323] py-6 flex justify-center items-center mt-0">
        <img
          src="/logo.jpg"
          alt="Jumapel Logo"
          className="w-10 h-10 rounded-full bg-white object-cover mr-3"
        />
        <span
          className="text-white text-lg"
          style={{ fontFamily: "Archivo Black, sans-serif" }}
        >
          Jumapel &copy; {new Date().getFullYear()}
        </span>
      </footer>
    </>
  );
}