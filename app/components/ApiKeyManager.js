'use client';

import { useState, useEffect } from 'react';

export default function ApiKeyManager({ onApiKeyChange }) {
    const [apiKey, setApiKey] = useState('');
    const [apiKeyExists, setApiKeyExists] = useState(false);

    useEffect(() => {
        const storedApiKey = window.localStorage.getItem('apiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
            setApiKeyExists(true);
            onApiKeyChange(storedApiKey);
        }
    }, [onApiKeyChange]);

    const handleSaveApiKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem("apiKey", apiKey);
            setApiKeyExists(true);
            onApiKeyChange(apiKey);
        }
    };

    const handleRemoveApiKey = () => {
        localStorage.removeItem("apiKey");
        setApiKey('');
        setApiKeyExists(false);
        onApiKeyChange('');
    };

    return (
        <div className="mb-8 p-4 bg-white rounded-lg border-2 border-green-200">
            {apiKeyExists ? (
                <div className="keyExists">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-gray-700">API Key is saved</span>
                        </div>
                        <button
                            onClick={handleRemoveApiKey}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                            Remove API Key
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-3">
                        <p>Your API key is stored locally in your browser and only sent to the API server.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type={apiKey.length > 0 ? 'password' : 'text'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API Key for unlimited use"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                        />
                        <button
                            onClick={handleSaveApiKey}
                            disabled={!apiKey.trim()}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${apiKey.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            Save API Key
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-around">
                        <a href="https://aistudio.google.com/apikey" target="_blank" className='text-blue-600 hover:text-blue-700 font-semibold'>
                            Get the Gemini API key for free (AI Studio).
                        </a>
                        <p>Your API key is stored locally in your browser and only sent to the API server.</p>
                    </div>
                </div>
            )}
        </div>
    );
} 