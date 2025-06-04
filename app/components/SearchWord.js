'use client';

import { useState } from 'react';

export default function SearchWord({ onSearch, isSending }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() && !isSending) {
            onSearch(searchTerm.trim());
            // Don't clear the search term after submission to show what was searched
        }
    };

    return (
        <div className="mb-6">
            <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a specific word..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                    disabled={isSending}
                />
                <button
                    type="submit"
                    disabled={!searchTerm.trim() || isSending}
                    className={`px-4 py-2 rounded-r-md font-medium transition-colors ${
                        !searchTerm.trim() || isSending
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    Search
                </button>
            </form>
        </div>
    );
} 