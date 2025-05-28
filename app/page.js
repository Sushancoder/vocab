'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function VocabularyApp() {
    // State for client-side rendering
    const [isClient, setIsClient] = useState(false);

    // App state
    const [showWord, setShowWord] = useState(false);
    const [usedWords, setUsedWords] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState();
    const [showWords, setShowWords] = useState(false);
    const [apiKeyExists, setApiKeyExists] = useState(false);

    // Word data state
    const [wordData, setWordData] = useState({
        word: " ",
        definition: " ",
        pronunciation: " ",
        synonyms: [" ", " ", " "],
        correctSynonym: " ",
        etymology: " ",
        examples: [" ", " "],
        origin: " ",
        mnemonic: " ",
        imageGen: " "
    });

    // Set client flag and initialize from localStorage
    useEffect(() => {
        setIsClient(true);

        // Only run in browser
        if (typeof window === 'undefined') return;

        // Initialize API key from localStorage
        const storedApiKey = window.localStorage.getItem('apiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
            setApiKeyExists(true);
        }

        // Initialize used words from localStorage
        const storedUsedWords = window.localStorage.getItem('usedWords');
        if (storedUsedWords) {
            try {
                setUsedWords(JSON.parse(storedUsedWords));
            } catch (e) {
                console.warn('Failed to parse usedWords from localStorage', e);
            }
        }
    }, []);

    // Show loading state until client-side initialization is complete
    if (!isClient) {
        return null; // or a loading spinner
    }

    // Save new words to localstorage
    const newUsedWords = (newword) => {
        if (typeof window === 'undefined') return;

        const updatedWords = usedWords ? [...usedWords, newword] : [newword];
        setUsedWords(updatedWords);

        try {
            window.localStorage.setItem('usedWords', JSON.stringify(updatedWords));
        } catch (e) {
            console.error('Failed to save to localStorage', e);
        }
    }

    const deleteWord = (word) => {
        if (typeof window === 'undefined') return;

        const updatedWords = usedWords.filter((w) => w !== word);
        setUsedWords(updatedWords);

        try {
            window.localStorage.setItem('usedWords', JSON.stringify(updatedWords));
        } catch (e) {
            console.error('Failed to save to localStorage', e);
        }
    }


    const handleGetWord = async (type) => {
        try {
            setStatus({ type: 'info', message: 'Getting Word...' });

            const response = await fetch('/api/sender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usedWords, apiKey, type }),
            });
            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: data.message,
                });

                const wordDataReceived = data.data[0]
                setWordData(wordDataReceived);
                if (type == "random123") {
                    newUsedWords(wordDataReceived.word)
                }

                return wordDataReceived;
            } else {
                throw new Error(data.error || 'Failed to get word');
            }
        } catch (error) {
            console.error('Error in handleNewWord:', error);
            toast.error(error.message || 'Failed to get a new word. Please try again.');
            setStatus({
                type: 'error',
                message: error.message || 'An error occurred while getting a new word'
            });
        } finally {
            setIsSending(false);
        }
    };


    const getImage = async () => {
        if (!wordData?.imageGen) {
            console.error('No image generation prompt available');
            setStatus({
                type: 'error',
                message: 'No image generation data available for this word'
            });
            return null;
        }

        try {
            const response = await fetch(`/api/imaginer?prompt=${encodeURIComponent(wordData.imageGen)}&apiKey=${encodeURIComponent(apiKey)}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to get image');
            }

            const data = await response.json();

            setWordData(prev => ({
                ...prev,
                imageUrl: data.image
            }));
            return data;
        } catch (error) {
            console.error('Error fetching image:', error);
            const errorMessage = error.message || 'An error occurred while generating the image';
            toast.error(errorMessage);
            setStatus({
                type: 'error',
                message: errorMessage
            });
            return null;
        }
    }

    const handleNewWord = async (typeOfWord) => {
        if (isSending) return; // Prevent multiple clicks

        setIsSending(true);
        setShowExplanation(false);
        setSelectedOption(null);

        try {
            const success = await handleGetWord(typeOfWord);
            if (success) {
                setShowWord(true);
            }
        } catch (error) {
            console.error('Error in handleNewWord:', error);
            setStatus({
                type: 'error',
                message: error.message || 'Failed to load word. Please try again.'
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        // console.log(usedWords)
        setShowExplanation(true);
        getImage();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-center text-blue-800 mb-8 flex-grow ">Vocabulary Builder</div>

                    <div className="text-xl font-bold text-center text-gray-600 mb-8 relative rounded-2xl p-2 cursor-pointer shadow-md shadow-blue-300 group"
                        onMouseEnter={() => setShowWords(true)}
                        onClick={() => setShowWords(!showWords)}
                        onMouseLeave={() => setShowWords(false)}>
                        <div> ••• </div>

                        <div className={`absolute top-10 right-0 rounded-lg text-black bg-gray-200 min-w-64 z-30 border-2 border-blue-400 shadow-md shadow-blue-300 transform transition-all duration-300 ease-in-out origin-top-right ${showWords ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'} ${isSending ? 'opacity-0 cursor-not-allowed' : ''}`}>
                            {/* All learnt words */}

                            {(usedWords.length > 0) ? (
                                <>
                                    <div className="p-3 bg-white shadow-gray-400 rounded-t-lg text-xs font-thin text-black cursor-default">
                                        Click the word to know it's details or the delete button to delete it.
                                    </div>
                                    <div className="p-3 text-sm font-thin text-black cursor-default bg-white shadow-lg shadow-gray-400 ">
                                        Total words: {usedWords.length}
                                    </div>
                                </>
                            ) : (
                                <div className="p-3 bg-white shadow-gray-400 rounded-t-lg text-xs font-thin text-black cursor-default">
                                    Your learnt words will be shown here
                                </div>
                            )}

                            <div className={`overflow-x-hidden max-h-[48vh] rounded-b-lg ${isSending ? 'overflow-hidden' : 'overflow-auto'} custom-scrollbar`}>
                                {usedWords.map((word, index) => (
                                    <div key={index} className={`p-3 cursor-default bg-white overflow-y-hidden overscroll-x-auto hover:bg-gray-100 border-t-2  border-blue-400 flex justify-between`}>
                                        <p className="font-semibold cursor-pointer" onClick={() => handleNewWord(word)} title='Know details'>{word}</p>
                                        <div className="flex items-center cursor-pointer" title='Delete' ><img src="delete-2-svgrepo-com.svg" width={30} height={30} alt="delete" onClick={() => deleteWord(word)} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>



                <div className="mb-8 p-4 bg-white rounded-lg border-2 border-green-200 ">
                    {/* <div className="mb-8 p-4 bg-white rounded-lg border-2 border-blue-400 shadow-md shadow-blue-200"> */}
                    {apiKeyExists ? (
                        <div className="keyExists">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                                    <span className="text-gray-700">API Key is saved</span>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("apiKey");
                                        setApiKey('');
                                        setApiKeyExists(false);
                                    }}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                                >
                                    Remove API Key
                                </button>
                            </div>
                            <div className="text-xs text-gray-500   ">
                                <p>
                                    Your API key is stored locally in your browser and only sent to the API server.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type={apiKey.length > 0 ? 'password' : 'text'}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your Gemini API Key"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                                />
                                <button
                                    onClick={() => {
                                        if (apiKey.trim()) {
                                            localStorage.setItem("apiKey", apiKey);
                                            setApiKeyExists(true);
                                        }
                                    }}
                                    disabled={!apiKey.trim()}
                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${apiKey.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                                    Save API Key
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center justify-around">
                                <a href="https://aistudio.google.com/apikey" target="_blank" className='text-blue-600 hover:text-blue-700 font-semibold'>Get the Gemini API key for free. </a>
                                <p>
                                    Your API key is stored locally in your browser and only sent to the API server.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mb-8">
                    <button
                        onClick={() => handleNewWord("random123")}
                        disabled={isSending || !apiKeyExists}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform ${isSending || !apiKeyExists ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 '}`}
                    >
                        {showWord ? 'Get Another Word' : 'Get New Word'}
                    </button>
                </div>

                {/* {
                    isSending ? <div className="flex items-center justify-center h-12">
                        <p className="text-black animate-pulse">Loading your word...</p>
                    </div>
                        : null
                } */}

                {showWord && (

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