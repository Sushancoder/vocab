'use client';

import Image from 'next/image';

export default function WordQuiz({ 
    wordData, 
    showExplanation, 
    selectedOption, 
    onOptionSelect, 
    isSending 
}) {
    if (!wordData) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in border-2 border-blue-200 shadow-blue-300">
            {!isSending && (
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {wordData.word}
                </h2>
            )}

            {!showExplanation ? (
                <div className="space-y-4">
                    {!isSending ? (
                        <>
                            <p className="text-gray-600 text-center mb-6">Select the most appropriate synonym:</p>
                            <div className="space-y-3">
                                {wordData.synonyms.map((synonym, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onOptionSelect(synonym)}
                                        className="w-full text-left p-4 border-2 border-gray-200 text-gray-600 rounded-lg hover:border-blue-400 transition-colors duration-200"
                                    >
                                        {synonym}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-12">
                            <p className="text-black animate-pulse">Loading your word...</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${selectedOption === wordData.correctSynonym ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                        <div className="font-medium">
                            {selectedOption === wordData.correctSynonym ? '✓ Correct!' : '✗ Incorrect!'}
                            <p className="text-gray-700">
                                <span className="font-semibold">Correct Answer:</span> {wordData.correctSynonym}
                            </p>
                        </div>
                        <p className="text-gray-700">
                            <span className="font-semibold">Definition:</span> {wordData.definition}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Pronunciation:</span> {wordData.pronunciation}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800">Etymology:</h3>
                            <p className="text-gray-600">{wordData.etymology}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800">Examples:</h3>
                            {wordData.examples.map((example, index) => (
                                <p key={index} className="text-gray-600">{example}</p>
                            ))}
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800">Origin:</h3>
                            <p className="text-gray-600">{wordData.origin}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800">Mnemonic:</h3>
                            <p className="text-gray-600 italic">"{wordData.mnemonic}"</p>
                        </div>

                        <div className="relative flex items-center justify-center h-full w-full rounded-lg overflow-hidden mt-4">
                            <Image
                                src={wordData.imageUrl || '/Spinner@1x-1.0s-200px-200px.gif'}
                                alt={wordData.word}
                                height={500}
                                width={500}
                                className="object-cover border-2 border-green-200 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="p-3 bg-white shadow-gray-400 rounded-t-lg text-xs font-thin text-black cursor-default">
                        Sometimes AI art is quite abstract. Enjoy the surprises!
                    </div>
                </div>
            )}
        </div>
    );
} 