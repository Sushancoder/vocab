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
                            onChange={handleInputChange}
                            placeholder="Enter your Gemini API Key for unlimited use"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                            maxLength={40}
                        />
                        <button
                            onClick={handleSaveApiKey}
                            disabled={!apiKey.trim()}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${apiKey.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            Save API Key
                        </button>
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <div className="text-xs text-gray-500 flex items-center justify-around">
                        <a href="https://aistudio.google.com/apikey" target="_blank" className='text-blue-600 hover:text-blue-700 font-semibold underline'>
                            Get the free Gemini API key from AI Studio.
                        </a>
                        <p>Your API key is stored locally in your browser and only sent to the API server.</p>
                    </div>
                </div>
            )}
        </div>
    );
} 