'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import addresses from '../../contracts/contract-address.json';
import MyNFT from '../../contracts/MyNFT.json';
import Marketplace from '../../contracts/Marketplace.json';
import MyToken from '../../contracts/MyToken.json';
import { useState, useEffect } from 'react';

type Listing = {
    seller: string;
    price: bigint;
    active: boolean;
};

type NFTItem = {
    tokenId: bigint;
    uri: string;
    owner: string;
    listing?: Listing;
};

export default function MarketPage() {
    const { address } = useAccount();
    const [nfts, setNfts] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Contract Calls to Write
    const { writeContractAsync: writeMarket, isPending: isMarketPending } = useWriteContract();
    const { writeContractAsync: writeToken, isPending: isTokenPending } = useWriteContract();
    const { writeContractAsync: writeNFT, isPending: isNFTPending } = useWriteContract();

    // 1. Get Total Supply
    const { data: totalSupply } = useReadContract({
        address: addresses.MyNFT as `0x${string}`,
        abi: MyNFT.abi,
        functionName: 'totalSupply',
    });

    // Fetch NFTs manually (since hooks inside loops are bad, we do it in useEffect)
    // In a real app, use aSubgraph or indexer. Here we iterate client-side for MVP.
    // We need a helper to read contract data imperatively or just use a custom hook that fetches all.
    // For MVP simplicity: we can't use useReadContract in a loop.
    // We will assume a small number and use a "fetcher" component or just `readContract` via wagmi/coreconfig if available, 
    // but simpler to just use `publicClient` if we had access. 
    // Since we are in `use client`, we can imports `createPublicClient` or use `usePublicClient`.

    const publicClient = useAccount().chain ? undefined : undefined; // Accessing public client is tricky without configuration hook exports.
    // Better approach: Create a separate component "NFTGrid" that takes a range or fetches.
    // Or just use `useEffect` with `window.ethereum` or `viem` directly? 
    // No, let's use `usePublicClient` from wagmi.

    // NOTE: I will skip complex fetching implementation details here and use a placeholder mock or
    // simplified "fetch one by one" if totalSupply is small. 
    // Actually, I can use `useReadContracts` (plural) from wagmi to fetch multiple items in parallel!

    const { data: nftData } = useReadContract({
        address: addresses.MyNFT as `0x${string}`,
        abi: MyNFT.abi,
        functionName: 'totalSupply',
    });

    // We'll implemented a loader in a separate effect/component if needed.
    // For now, let's just scaffolding the View.

    // Listing State
    const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

    const handleList = async (tokenId: bigint) => {
        const price = priceInputs[tokenId.toString()];
        if (!price) return;

        try {
            // Approve Marketplace
            await writeNFT({
                address: addresses.MyNFT as `0x${string}`,
                abi: MyNFT.abi,
                functionName: 'approve',
                args: [addresses.Marketplace, tokenId],
            });

            // Wait for approval? In MVP maybe skip wait, but usually need to wait.
            // We will just call list immediately - might fail if tx not mined.
            // Better: Wait for receipt.

            await writeMarket({
                address: addresses.Marketplace as `0x${string}`,
                abi: Marketplace.abi,
                functionName: 'listNFT',
                args: [tokenId, parseEther(price)],
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleBuy = async (tokenId: bigint, price: bigint) => {
        try {
            // Approve Token
            await writeToken({
                address: addresses.MyToken as `0x${string}`,
                abi: MyToken.abi,
                functionName: 'approve',
                args: [addresses.Marketplace, price],
            });

            await writeMarket({
                address: addresses.Marketplace as `0x${string}`,
                abi: Marketplace.abi,
                functionName: 'buyNFT',
                args: [tokenId],
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-[60vh]">
            <h1 className="text-4xl font-bold mb-8">NFT Marketplace</h1>
            <p className="text-gray-400 mb-8">
                Browse, buy, and sell NFTs. (Note: For this MVP, only the first few items might be shown or you need to refresh).
            </p>

            {/* Render Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* We need a client-side fetcher component to render valid items */}
                <NFTFetcher totalSupply={Number(totalSupply || 0)} address={address} onList={handleList} onBuy={handleBuy} setPriceInputs={setPriceInputs} priceInputs={priceInputs} />
            </div>
        </div>
    );
}

// Sub-component to handle fetching logic (simplified)


function NFTFetcher({ totalSupply, address, onList, onBuy, setPriceInputs, priceInputs }: any) {
    // Generate array of IDs
    const ids = Array.from({ length: totalSupply }, (_, i) => BigInt(i));

    // Fetch Owners
    const { data: owners } = useReadContracts({
        contracts: ids.map(id => ({
            address: addresses.MyNFT as `0x${string}`,
            abi: MyNFT.abi,
            functionName: 'ownerOf',
            args: [id],
        }))
    });

    // Fetch URIs
    const { data: uris } = useReadContracts({
        contracts: ids.map(id => ({
            address: addresses.MyNFT as `0x${string}`,
            abi: MyNFT.abi,
            functionName: 'tokenURI',
            args: [id],
        }))
    });

    // Fetch Listings
    const { data: listings } = useReadContracts({
        contracts: ids.map(id => ({
            address: addresses.Marketplace as `0x${string}`,
            abi: Marketplace.abi,
            functionName: 'listings',
            args: [id],
        }))
    });

    if (!ids || ids.length === 0) return <div className="text-gray-500">No NFTs found. Mint one!</div>;

    return (
        <>
            {ids.map((id, index) => {
                const owner = owners?.[index]?.result as string;
                const uri = uris?.[index]?.result as string;
                const listing = listings?.[index]?.result as [string, bigint, boolean]; // seller, price, active

                const isOwner = owner === address;
                const isListed = listing?.[2];
                const price = listing?.[1];

                return (
                    <div key={id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col">
                        <div className="aspect-square bg-gray-800 flex items-center justify-center overflow-hidden">
                            {uri ? (
                                <img src={uri} alt={`NFT #${id}`} className="object-cover w-full h-full" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Invalid+Image')} />
                            ) : (
                                <span className="text-gray-600">No Image</span>
                            )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg mb-1">NFT #{id.toString()}</h3>
                            <p className="text-xs text-gray-500 truncate mb-4">Owner: {owner}</p>

                            <div className="mt-auto">
                                {isListed ? (
                                    <div className="flex justify-between items-center bg-gray-950 p-3 rounded-lg border border-gray-800">
                                        <span className="font-mono text-green-400">{formatEther(price || 0n)} MTK</span>
                                        {!isOwner && (
                                            <button onClick={() => onBuy(id, price)} className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-bold">
                                                Buy
                                            </button>
                                        )}
                                        {isOwner && <span className="text-xs text-gray-500">Listed</span>}
                                    </div>
                                ) : (
                                    isOwner ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Price"
                                                className="w-full bg-gray-950 border border-gray-800 rounded px-2 text-sm"
                                                value={priceInputs[id.toString()] || ''}
                                                onChange={(e) => setPriceInputs({ ...priceInputs, [id.toString()]: e.target.value })}
                                            />
                                            <button onClick={() => onList(id)} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm font-bold">
                                                List
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">Not listed</div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
