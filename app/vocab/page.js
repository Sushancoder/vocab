'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function VocabularyApp() {
    const [showWord, setShowWord] = useState(false);
    const [usedWords, setUsedWords] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState();
    // Mock data - in a real app, this would come from an API
    const [wordData, setWordData] = useState({
        word: " ",
        definition: " ",
        pronunciation: " ",
        synonyms: [" ", " ", " "],
        correctSynonym: " ",
        etymology: " ",
        examples: [" ", " ",],
        origin: " ",
        mnemonic: " ",
        imageGen: " "
    });


    // Get usedwords from localstorage
    useEffect(() => {
        const storedUsedWords = localStorage.getItem('usedWords');
        if (storedUsedWords) {
            setUsedWords(JSON.parse(storedUsedWords));
        }
    }, []);

    // Save newwords to localstorage
    const newUsedWords = (newword) => {
        if (usedWords) {
            setUsedWords([...usedWords, newword])
            localStorage.setItem("usedWords", JSON.stringify([...usedWords, newword]))
        } else {
            setUsedWords([newword])
            localStorage.setItem("usedWords", JSON.stringify([newword]))
        }
    }


    const handleGetWord = async () => {
        try {
            setStatus({ type: 'info', message: 'Getting Word...' });

            const response = await fetch('/api/sender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usedWords }),
            });
            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: data.message,
                });

                const wordDataReceived = data.data[0]
                setWordData(wordDataReceived);
                newUsedWords(wordDataReceived.word)

                return wordDataReceived;
            } else {
                throw new Error(data.error || 'Failed to get word');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({
                type: 'error',
                message: error.message || 'An error occurred while getting the word'
            });
        }
    };


    const getImage = async () => {
        try {
            const response = await fetch(`/api/imaginer?prompt=${wordData.imageGen}`);
            const data = await response.json();

            if (response.ok) {
                setWordData({
                    ...wordData, imageUrl: data.image
                });
                return data;
            } else {
                throw new Error(data.error || 'Failed to get image');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({
                type: 'error',
                message: error.message || 'An error occurred while getting the image'
            });
        }
    }

    const handleNewWord = async () => {
        setIsSending(true);
        await handleGetWord();
        setIsSending(false);
        setShowWord(true);
        setSelectedOption(null);
        setShowExplanation(false);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        console.log(usedWords)
        setShowExplanation(true);
        getImage();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Vocabulary Builder</h1>

                <div className="text-center mb-8">
                    <button
                        onClick={handleNewWord}
                        disabled={isSending}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        {showWord ? 'Get Another Word' : 'Get New Word'}
                    </button>
                </div>

                {showWord && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            {wordData.word}
                        </h2>

                        {!showExplanation ? (
                            <div className="space-y-4">
                                <p className="text-gray-600 text-center mb-6">Select the correct synonym:</p>
                                <div className="space-y-3">
                                    {wordData.synonyms.map((synonym, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionSelect(synonym)}
                                            className="w-full text-left p-4 border-2 border-gray-200 text-gray-600 rounded-lg hover:border-blue-400 transition-colors duration-200"
                                        >
                                            {synonym}
                                        </button>
                                    ))}
                                </div>
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
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!showWord && (
                    <div className="text-center text-gray-500 mt-12">
                        <p>Click the button above to start learning new words!</p>
                    </div>
                )}
            </div>
        </div>
    );
}