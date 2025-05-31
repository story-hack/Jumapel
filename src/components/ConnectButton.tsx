"use client";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";

const ConnectButton = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <button
      onClick={openConnectModal}
      className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
    >
      Connect Wallet
    </button>
  );
};

export default ConnectButton;
