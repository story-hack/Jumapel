"use client";

import React, { useState } from "react";

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content:
        "Hi, there 👋\nTell us your product idea, and we'll handle the rest.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/agentTest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input }),
      });
      if (!res.ok) throw new Error("Agent error");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: `Brand: ${data.brandName}\nDomain: ${data.domain}`,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Sorry, something went wrong. Please try again." },
      ]);
      setError("Agent error");
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <main className="min-h-screen w-full flex">
      <section className="w-1/2 min-h-screen flex flex-col justify-center items-center bg-[#181818] p-12">
        <div className="w-full flex gap-6">
        
          <div className="flex-1 bg-gradient-to-br from-[#232323] to-[#111] rounded-2xl p-6 shadow-lg text-white min-w-[220px] max-w-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#8ecaff] to-[#3b6eea] flex items-center justify-center text-lg font-bold">1</div>
                <span className="font-semibold text-base">Connect Wallet</span>
              </div>
              <div className="text-sm text-gray-300">Connect your crypto wallet to get started and enable NFT minting.</div>
            </div>
          </div>
      
          <div className="flex-1 bg-white rounded-2xl p-6 shadow text-[#232323] min-w-[220px] max-w-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#8ecaff] to-[#3b6eea] flex items-center justify-center text-lg font-bold">2</div>
                <span className="font-semibold text-base">Prompt the Agent</span>
              </div>
              <div className="text-sm text-gray-700">Describe your product idea in detail. The AI agent will suggest a brand name and available domain.</div>
            </div>
          </div>
   
          <div className="flex-1 bg-white rounded-2xl p-6 shadow text-[#232323] min-w-[220px] max-w-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#8ecaff] to-[#3b6eea] flex items-center justify-center text-lg font-bold">3</div>
                <span className="font-semibold text-base">Mint as NFT</span>
              </div>
              <div className="text-sm text-gray-700">Review the AI's suggestion and mint your idea, brand, and domain as an NFT onchain.</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-1/2 min-h-screen flex flex-col justify-center items-center bg-[#232323] p-0">
        <div className="w-full h-screen flex flex-col bg-[#222] rounded-none shadow-none">
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`w-full mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 max-w-[80%] whitespace-pre-line shadow ${
                      msg.role === "user"
                        ? "bg-[#0080ff] text-white self-end"
                        : "bg-[#232323] text-white border border-[#333] self-start"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="w-full flex justify-start mb-4">
                  <div className="rounded-2xl px-5 py-3 bg-[#232323] text-white border border-[#333] max-w-[80%] animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </div>
          <form
            className="w-full flex gap-2 p-6 bg-[#232323] border-t border-[#333] fixed bottom-0 right-0 max-w-[50vw]"
            style={{ zIndex: 10 }}
            onSubmit={handleSend}
          >
            <input
              type="text"
              className="flex-1 rounded-lg text-lg px-4 py-2 bg-[#181818] text-white border border-[#333] focus:outline-none"
              placeholder="Type your product idea..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-[#0080ff] text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-[#005fa3] transition"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
