"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import ApiKeyManager from "./ApiKeyManager";
import AIModeToggle from "./AIModeToggle";
import OtherPageLink from "./OtherPageLink";
import Link from "next/link";

export default function LeftSidebar({ apiKey, onApiKeyChange, useAIMode, onAIModeToggle }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        // Auto-collapse on mobile
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pages = [
        { name: "The-Vocab", info: "Master new vocabulary with AI-powered deep dives", link: "/" },
        { name: "Chat", info: "Refine your fluency with real-time AI language coaching", link: "/chat" },
    ];

    return (
        <>
            <div
                className={`${isOpen ? 'w-full md:w-80 translate-x-0 opacity-100 p-4 h-full' : 'w-0 -translate-x-full opacity-0 p-0 h-0 md:h-full'
                    } transition-all duration-300 ease-in-out border-r border-blue-200 bg-white shadow-sm flex-shrink-0 relative overflow-hidden`}
            >
                <div className="w-full md:w-72"> {/* Fixed width inner container to prevent squashing during transition */}
                    {!(isHomePage) && <div className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-4 md:mb-8 flex-grow">
                        {/* Vocabulary Builder */}
                        <Link href="/">The-Vocab</Link>
                    </div>}
                    <ApiKeyManager onApiKeyChange={onApiKeyChange} />

                    {isHomePage && (
                        <AIModeToggle
                            useAIMode={useAIMode}
                            onToggle={onAIModeToggle}
                            hasApiKey={!!apiKey}
                        />
                    )}
                    <div className="space-y-3">
                        {pages.filter((page) => page.link !== pathname).map((page) => (
                            <OtherPageLink key={page.name} name={page.name} info={page.info} link={page.link} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Toggle Button - Positioned absolutely relative to the nearest positioned ancestor (usually the page container) */}
            <div className={`absolute top-4 z-20 transition-all duration-300 ease-in-out ${isOpen ? 'left-[21rem]' : 'left-4'}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 hover:shadow-lg transition-all border border-gray-100 backdrop-blur-sm bg-white/80"
                    title={isOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                </button>
            </div>
        </>
    );
}
