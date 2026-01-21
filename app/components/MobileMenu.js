"use client";

import { usePathname } from "next/navigation";
import ApiKeyManager from "./ApiKeyManager";
import AIModeToggle from "./AIModeToggle";

export default function MobileMenu({
  apiKey,
  onApiKeyChange,
  useAIMode,
  onAIModeToggle,
  isMenuOpen,
  onMenuToggle,
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {/* Show full width API Key Manager when no API key exists */}

      {/* Hamburger Menu Button - Show only when API key exists */}
      {
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      }

      {/* Overlay Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMenuToggle}
        >
          <div
            className="fixed left-0 top-0 h-full w-11/12 max-w-sm bg-white shadow-lg transform transition-transform duration-300 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-4 md:mb-8 flex-grow">
                Features
              </div>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={onMenuToggle}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="pt-4">
                <ApiKeyManager onApiKeyChange={onApiKeyChange} />
                {isHomePage && (
                  <AIModeToggle
                    useAIMode={useAIMode}
                    onToggle={onAIModeToggle}
                    hasApiKey={!!apiKey}
                  />
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
