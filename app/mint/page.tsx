'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import addresses from '../../contracts/contract-address.json';
import MyNFT from '../../contracts/MyNFT.json';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MintPage() {
    const { isConnected } = useAccount();
    const [uri, setUri] = useState('');
    const router = useRouter();

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uri) return;

        writeContract({
            address: addresses.MyNFT as `0x${string}`,
            abi: MyNFT.abi,
            functionName: 'mintNFT',
            args: [uri],
        });
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-3xl font-bold mb-4">Connect Wallet to Mint NFT</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Mint Your NFT
            </h1>

            <form onSubmit={handleMint} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md space-y-6">
                <div>
                    <label className="block text-gray-400 mb-2 text-sm">Image URL / Token URI</label>
                    <input
                        type="text"
                        value={uri}
                        onChange={(e) => setUri(e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-600 mt-2">Enter an image URL to represent your NFT.</p>
                </div>

                <button
                    type="submit"
                    disabled={!uri || isPending || isConfirming}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all
            ${!uri || isPending || isConfirming
                            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                        }`}
                >
                    {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint NFT'}
                </button>

                {isConfirmed && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                        Success! NFT Minted.
                        <button onClick={() => router.push('/market')} className="underline ml-2">View in Market</button>
                    </div>
                )}
            </form>
        </div>
    );
}
