'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Create a custom event name for API key changes
const API_KEY_CHANGE_EVENT = 'apiKeyChange';

export default function ApiKeyManager({ onApiKeyChange }) {
    const [apiKey, setApiKey] = useState("");
    const [apiKeyExists, setApiKeyExists] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedApiKey = window.localStorage.getItem('apiKey');
        // console.log("Stored API Key using localstorage: ", storedApiKey);
        // console.log("onApiKeyChange : ", onApiKeyChange);  
        if (storedApiKey) {
            setApiKey(storedApiKey);
            setApiKeyExists(true);
            onApiKeyChange(storedApiKey);
        }

        // Listen for custom API key change events
        const handleApiKeyChange = (e) => {
            const newApiKey = e.detail || '';
            setApiKey(newApiKey);
            setApiKeyExists(!!newApiKey);
        };

        // Add event listener
        window.addEventListener(API_KEY_CHANGE_EVENT, handleApiKeyChange);

        // Clean up
        return () => {
            window.removeEventListener(API_KEY_CHANGE_EVENT, handleApiKeyChange);
        };
    }, [onApiKeyChange]);

    const handleSaveApiKey = () => {
        if (!apiKey.trim()) {
            toast.error("API key is invalid.");
            return;
        }

        if (apiKey.length < 10) {
            toast.error("API key is invalid.");
            return;
        }

        if (apiKey.length > 40) {
            toast.error("API key is invalid.");
            return;
        }

        localStorage.setItem("apiKey", apiKey);
        setApiKeyExists(true);
        onApiKeyChange(apiKey);
        setError("");

        // Dispatch custom event to notify other instances
        window.dispatchEvent(new CustomEvent(API_KEY_CHANGE_EVENT, {
            detail: apiKey
        }));

        toast.success("API key saved successfully");
    };

    const handleRemoveApiKey = () => {
        localStorage.removeItem("apiKey");
        setApiKey("");
        setApiKeyExists(false);
        onApiKeyChange("");
        setError("");

        // Dispatch custom event to notify other instances
        window.dispatchEvent(new CustomEvent(API_KEY_CHANGE_EVENT, {
            detail: ''
        }));

        toast.error("Removed api key");
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setApiKey(value);

        // Clear error when user starts typing again
        if (error) setError("");
    };

    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden transition-all duration-300 hover:shadow-md group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>

            {apiKeyExists ? (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-700 dark:text-gray-200 font-medium truncate">Gemini API Key is active</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleRemoveApiKey}
                            className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 text-sm font-medium border border-red-100 dark:border-red-900/30"
                        >
                            Remove Key
                        </button>
                        <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">Stored locally in browser</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Connect Google Gemini</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enter your API key to unlock unlimited AI features.</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="relative w-full group/input">
                            <input
                                type={apiKey.length > 0 ? 'password' : 'text'}
                                value={apiKey}
                                onChange={handleInputChange}
                                placeholder="Paste your API key here..."
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 group-hover/input:bg-white dark:group-hover/input:bg-gray-800"
                                maxLength={40}
                            />
                        </div>
                        <button
                            onClick={handleSaveApiKey}
                            disabled={!apiKey.trim()}
                            className={`w-full px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm ${apiKey.trim()
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:translate-y-[-1px]'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Save Key
                        </button>
                         <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">Stored locally in browser</p>
                    </div>

                    {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}

                    <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-gray-500 dark:text-gray-400 px-1">
                        <a
                            href="https://aistudio.google.com/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors'
                        >
                            <span>Get a free API key</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}