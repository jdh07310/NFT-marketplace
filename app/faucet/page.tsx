'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import addresses from '../../contracts/contract-address.json';
import MyToken from '../../contracts/MyToken.json';
import { useState, useEffect } from 'react';

export default function FaucetPage() {
    const { address, isConnected } = useAccount();
    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const { data: balance, refetch } = useReadContract({
        address: addresses.MyToken as `0x${string}`,
        abi: MyToken.abi,
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: !!address,
        },
    });

    useEffect(() => {
        if (isConfirmed) {
            refetch();
        }
    }, [isConfirmed, refetch]);

    const handleClaim = () => {
        writeContract({
            address: addresses.MyToken as `0x${string}`,
            abi: MyToken.abi,
            functionName: 'faucet',
            gas: BigInt(300000), // Force gas limit to avoid estimation errors
        });
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-3xl font-bold mb-4">Connect Wallet to Claim Tokens</h1>
                <p className="text-gray-400">Please connect your wallet to access the faucet.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Token Faucet
            </h1>
            <p className="text-gray-400">Claim 1,000 MTK tokens for free to use in the marketplace.</p>

            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md text-center">
                <div className="mb-6">
                    <h2 className="text-gray-500 text-sm uppercase tracking-wide mb-1">Your Balance</h2>
                    <div className="text-3xl font-mono font-bold">
                        {balance ? formatEther(balance as bigint) : '0'} MTK
                    </div>
                </div>

                <button
                    onClick={handleClaim}
                    disabled={isPending || isConfirming}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all
            ${isPending || isConfirming
                            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25'
                        }`}
                >
                    {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Claim 1,000 MTK'}
                </button>

                {isConfirmed && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                        Success! Tokens have been sent to your wallet.
                    </div>
                )}
            </div>
        </div>
    );
}
