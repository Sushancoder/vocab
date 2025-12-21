'use client';

import { useState } from 'react';

export default function PronunciationButton({ audioUrl }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = (e) => {
        // Prevent event propagation if inside another clickable element
        e.stopPropagation();

        if (!audioUrl) return;

        const audio = new Audio(audioUrl);
        setIsPlaying(true);

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
            setIsPlaying(false);
            console.error("Audio playback error");
        };

        audio.play();
    };

    if (!audioUrl) return null;

    return (
        <button
            onClick={playAudio}
            className="inline-flex items-center justify-center ml-2 align-middle text-blue-600 hover:text-blue-800 transition-colors rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 w-6 h-6"
            title="Play pronunciation"
            disabled={isPlaying}
            aria-label="Play pronunciation"
        >
            <svg
                className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-blue-800' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
            </svg>
        </button>
    );
}
