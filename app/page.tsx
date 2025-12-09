export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
        Future NFT Market
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl">
        Experience the next generation of digital asset trading.
        Get free tokens, mint your unique NFTs, and trade with others in a decentralized ecosystem.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500 transition-all group">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400">Token Drop</h3>
          <p className="text-gray-500">Claim free MTK tokens to start your journey.</p>
        </div>
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500 transition-all group">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400">Mint NFT</h3>
          <p className="text-gray-500">Create and register your own unique digital assets.</p>
        </div>
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-pink-500 transition-all group">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-pink-400">Marketplace</h3>
          <p className="text-gray-500">Buy and sell NFTs securely using MTK tokens.</p>
        </div>
      </div>
    </div>
  );
}
