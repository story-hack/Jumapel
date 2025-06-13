export default function MintSuccessPage() {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ Success!</h1>
        <p className="mt-4 text-lg">
          Your NFT brand has been minted and registered as IP.
        </p>
        <p className="text-md mt-2">
          Go to your <a href="/profile" className="text-blue-600 underline">profile</a> to view them.
        </p>
      </div>
    );
  }
  