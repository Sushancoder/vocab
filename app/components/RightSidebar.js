"use client";

export default function RightSidebar({
    usedWords,
    onWordSelect,
    onWordDelete,
    isSending,
}) {
    return (
        <div className="hidden md:block md:w-4/12 h-[95vh] overflow-hidden">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-400 h-full flex flex-col">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
                    <h2 className="text-xl font-bold">Learned Words</h2>
                    <p className="text-sm opacity-90 mt-1">
                        Total: {usedWords.length} {usedWords.length === 1 ? 'word' : 'words'}
                    </p>
                </div>

                {/* Instructions or Empty State */}
                {usedWords.length > 0 ? (
                    <div className="p-3 bg-blue-50 border-b-2 border-blue-200 text-xs text-gray-700">
                        Click a word to view details or use the delete button to remove it.
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <svg
                            className="w-16 h-16 mx-auto mb-3 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <p className="text-sm font-medium">No words learned yet</p>
                        <p className="text-xs mt-1">Start learning to build your vocabulary!</p>
                    </div>
                )}

                {/* Words List */}
                <div
                    className={`flex-1 overflow-y-auto custom-scrollbar ${isSending ? "opacity-50 pointer-events-none" : ""
                        }`}
                >
                    {usedWords.map((word, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white hover:bg-blue-50 border-b border-blue-100 flex justify-between items-center group transition-colors duration-200"
                        >
                            <p
                                className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors flex-1"
                                onClick={() => onWordSelect(word)}
                                title="Click to view details"
                            >
                                {word}
                            </p>
                            <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-50 rounded-lg"
                                onClick={() => onWordDelete(word)}
                                title="Delete word"
                            >
                                <img
                                    src="delete-2-svgrepo-com.svg"
                                    width={24}
                                    height={24}
                                    alt="delete"
                                    className="hover:scale-110 transition-transform"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
