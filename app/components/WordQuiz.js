'use client';

import { useState, useEffect } from 'react';
import PronunciationButton from "./PronunciationButton";

export default function WordQuiz({
    wordData,
    showExplanation,
    selectedOption,
    onOptionSelect,
    isSending
}) {
    const [animationClass, setAnimationClass] = useState('');

    // Apply animation class when showExplanation changes
    useEffect(() => {
        setAnimationClass(showExplanation ? 'show' : '');
    }, [showExplanation]);

    if (!wordData) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in border-2 border-blue-200 shadow-blue-300 grow-transition">
            {!isSending && (
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {wordData.word}
                </h2>
            )}

            {!showExplanation && isSending && (
                <div className="flex items-center justify-center h-12">
                    <p className="text-black animate-pulse">Loading your word...</p>
                </div>
            )}

            {!showExplanation && !isSending && (
                <div className="space-y-4">
                    {wordData.synonyms && wordData.synonyms.length > 0 ? (
                        <>
                            <p className="text-gray-600 text-center mb-6">Which of these is a synonym?</p>
                            <div className="space-y-3">
                                {wordData.synonyms.map((synonym, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onOptionSelect(synonym)}
                                        className="w-full text-left p-4 border-2 border-gray-200 text-gray-600 rounded-lg hover:border-blue-400 transition-colors duration-200 scale-hover"
                                    >
                                        {synonym}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-500 mb-4 italic">Interactive quiz not available for this word.</p>
                            <button
                                onClick={() => onOptionSelect(null)} // null option triggers explanation view
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                            >
                                Reveal Definition
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showExplanation && (
                <div className={`space-y-6 explanation-transition ${animationClass}`}>
                    <div className={`p-4 rounded-lg transition-smooth ${!selectedOption ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                        selectedOption === wordData.correctSynonym ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'
                        }`}>
                        <div className="font-medium mb-2">
                            {!selectedOption ? 'Definition Revealed' :
                                selectedOption === wordData.correctSynonym ? '✓ Correct!' : '✗ Incorrect!'}

                            {selectedOption && (
                                <p className="text-gray-700 mt-1">
                                    <span className="font-semibold">Correct Answer:</span> {wordData.correctSynonym}
                                </p>
                            )}
                        </div>
                        <p className="text-gray-700">
                            <span className="font-semibold">Definition:</span> {wordData.definition}
                        </p>
                        <p className="text-gray-700 mt-1 flex items-center">
                            <span className="font-semibold mr-1">Pronunciation:</span> {wordData.pronunciation}
                            <PronunciationButton audioUrl={wordData.audio} />
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800">Etymology:</h3>
                            <p className={`text-gray-600 ${wordData.etymology?.includes("Use AI") ? "italic text-sm text-gray-400" : ""}`}>
                                {wordData.etymology}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800">Examples:</h3>
                            {wordData.examples && wordData.examples.length > 0 ? (
                                wordData.examples.map((example, index) => (
                                    <p key={index} className="text-gray-600 mb-1">• {example}</p>
                                ))
                            ) : (
                                <p className="text-gray-400 italic text-sm">No examples available</p>
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800">Origin:</h3>
                            <p className={`text-gray-600 ${wordData.origin?.includes("Use AI") ? "italic text-sm text-gray-400" : ""}`}>
                                {wordData.origin}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800">Mnemonic:</h3>
                            <p className={`text-gray-600 ${wordData.mnemonic?.includes("Use AI") ? "italic text-sm text-gray-400" : "italic"}`}>
                                "{wordData.mnemonic}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}