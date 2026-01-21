"use client";

import { useState } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import Image from "next/image";

export default function RightSidebar({
    usedWords,
    onWordSelect,
    onWordDelete,
    isSending,
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <div className={`transition-all duration-300 ease-in-out h-full flex-shrink-0 ${isOpen ? 'w-80 opacity-100 ml-4' : 'w-0 opacity-0 ml-0 p-0 overflow-hidden'
                }`}>
                <div className="bg-white shadow-lg border-2 border-blue-400 h-full flex flex-col w-80">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <h2 className="text-xl font-bold">Learned Words</h2>
                        <p className="text-sm opacity-90 mt-1">
                            Total: {usedWords.length} {usedWords.length === 1 ? 'word' : 'words'}
                        </p>
                    </div>

                    {/* Instructions or Empty State */}
                    {usedWords.length > 0 ? (
                        <div className="p-3 bg-blue-50  border-b-2 border-blue-200 text-xs text-gray-700">
                            Click a word to view details or use the delete button to remove it.
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                            <Image src="/book-open.svg" alt="" width={64} height={64} />
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
                                className="p-1 bg-white hover:bg-blue-50 border-b border-blue-100 flex justify-between items-center group transition-colors duration-200"
                            >
                                <p
                                    className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors flex-1 p-4 break-all"
                                    onClick={() => onWordSelect(word)}
                                    title="Click to view details"
                                >
                                    {word}
                                </p>
                                <button
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-2 hover:bg-red-50 rounded-xl"
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

            {/* Toggle Button */}
            <div className={`absolute top-4 z-20 transition-all duration-300 ease-in-out ${isOpen ? 'right-[21.5rem]' : 'right-4'
                }`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 hover:shadow-lg transition-all border border-gray-100 backdrop-blur-sm bg-white/80"
                    title={isOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    {isOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
                </button>
            </div>
        </>
    );
}
