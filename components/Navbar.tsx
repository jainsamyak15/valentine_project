'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Home, PlusCircle, PlayCircle } from "lucide-react";

export default function Navbar() {
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
            <nav className="bg-white/80 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg border border-pink-100 left-1/2 transform -translate-x-1/2">
                <ul className="flex items-center space-x-8">
                    <li>
                        <Link href="/" className="text-gray-600 hover:text-red-500 transition-colors">
                            <Home className="w-6 h-6" />
                        </Link>
                    </li>
                    <li>
                        <Link href="/create-quiz" className="text-gray-600 hover:text-red-500 transition-colors">
                            <PlusCircle className="w-6 h-6" />
                        </Link>
                    </li>
                    <li className="relative">
                        <Link href="/" className="bg-red-500 p-4 rounded-full shadow-lg block hover:bg-red-600 transition-colors">
                            <Heart className="w-6 h-6 text-white" />
                        </Link>
                    </li>
                    <li>
                        <Link href="/take-quiz" className="text-gray-600 hover:text-red-500 transition-colors">
                            <PlayCircle className="w-6 h-6" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </motion.div>
    );
}