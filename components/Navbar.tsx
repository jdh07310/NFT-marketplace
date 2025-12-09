'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
    return (
        <nav className="flex items-center justify-between py-4 border-b border-gray-800">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    NFT Market
                </Link>
                <div className="hidden md:flex gap-6">
                    <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                    <Link href="/faucet" className="hover:text-blue-400 transition-colors">Token Drop</Link>
                    <Link href="/mint" className="hover:text-blue-400 transition-colors">Mint NFT</Link>
                    <Link href="/market" className="hover:text-blue-400 transition-colors">Marketplace</Link>
                </div>
            </div>
            <div>
                <ConnectButton />
            </div>
        </nav>
    );
}
