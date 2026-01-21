
export default function AIModeToggle({ useAIMode, onToggle, hasApiKey }) {
    return (
        <div className="my-5 p-4 bg-white rounded-lg shadow-md border-t-2 border-blue-400">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-800">AI Mode: For better results</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {useAIMode ? 'Using AI-powered features' : 'Using free dictionary'}
                    </p>
                </div>
                <button
                    onClick={onToggle}
                    disabled={!hasApiKey}
                    title={!hasApiKey ? "Add API key to enable AI mode" : "Toggle AI mode"}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${useAIMode && hasApiKey ? 'bg-blue-600' : 'bg-gray-300'
                        } ${!hasApiKey ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-90'}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${useAIMode && hasApiKey ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>
            {!hasApiKey && (
                <p className="text-xs text-red-500 mt-2 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Add API key to enable AI mode
                </p>
            )}
        </div>
    );
}
