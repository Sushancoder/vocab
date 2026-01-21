'use client';

import { useState } from 'react';

export default function WordSearch({ onSearch, isDisabled }) {
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
            setSearchTerm('');
        }
    };

    return (
        <div className="relative">
            {showSearch ? (
                <form onSubmit={handleSearch} className="flex items-center animate-fade-in">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for a word..."
                        className="px-4 py-3 border border-gray-300 rounded-l-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isDisabled || !searchTerm.trim()}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-r-2xl transition-colors ${
                            isDisabled || !searchTerm.trim() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowSearch(false)}
                        className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                        aria-label="Close search"
                    >
                        ✕
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setShowSearch(true)}
                    disabled={isDisabled}
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 transform ${
                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="ml-1">Search</span>
                </button>
            )}
        </div>
    );
} 