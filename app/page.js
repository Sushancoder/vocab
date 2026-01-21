"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import WordFetcher from "./components/WordFetcher";
import WordQuiz from "./components/WordQuiz";
import WordHistory from "./components/WordHistory";
import WordSearch from "./components/WordSearch";
import MobileMenu from "./components/MobileMenu";
import RightSidebar from "./components/RightSidebar";
import LeftSidebar from "./components/LeftSidebar";
import Image from "next/image";

export default function VocabularyApp() {
  // State for client-side rendering
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // App state
  const [showWord, setShowWord] = useState(false);
  const [usedWords, setUsedWords] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [useAIMode, setUseAIMode] = useState(false);
  const [status, setStatus] = useState();
  const [showWords, setShowWords] = useState(false);

  // Word data state
  const [wordData, setWordData] = useState({
    word: " ",
    definition: " ",
    pronunciation: " ",
    synonyms: [" ", " ", " "],
    correctSynonym: " ",
    etymology: " ",
    examples: [" ", " ", " "],
    audio: " ",
    origin: " ",
    mnemonic: " ",
  });

  const freeTrialWord = () => {
    setShowWord(true);
    setWordData({
      word: "Serendipity",
      definition:
        "The occurrence and development of events by chance in a happy or beneficial way; or the faculty or phenomenon of finding valuable or agreeable things not sought for.",
      pronunciation: "ˈsɛrəndɪpəti",
      synonyms: ["Luck", "Fortuity", "Chance"],
      correctSynonym: "Fortuity",
      etymology:
        "Coined by Horace Walpole in 1754, inspired by a Persian fairy tale, 'The Three Princes of Serendip'. The princes were always making discoveries, by accidents and sagacity, of things they were not in quest of.",
      examples: [
        "I was lucky to find that book on the shelf.",
        "The chance meeting with my old friend was a serendipitous event.",
        "Finding a twenty-dollar bill on the sidewalk was pure serendipity.",
      ],
      audio: "https://api.dictionaryapi.dev/media/pronunciations/en/serendipity-us.mp3",
      origin:
        "First known use in 1754, derived from 'Serendip', an old name for Sri Lanka, combined with the suffix '-ity'.",
      mnemonic:
        "Think of a prince from a Persian fairy tale stumbling upon a hidden treasure chest filled with gold and jewels, while seemingly lost in an enchanted forest. The scene should evoke a sense of wonder and unexpected fortune.",
    });
  };

  // Set client flag and initialize from localStorage
  useEffect(() => {
    setIsClient(true);

    // Initialize used words from localStorage
    const storedUsedWords = window.localStorage.getItem("usedWords");
    if (storedUsedWords) {
      try {
        setUsedWords(JSON.parse(storedUsedWords));
      } catch (e) {
        console.warn("Failed to parse usedWords from localStorage", e);
      }
    }


    // Check if API key exists in localStorage
    const storedApiKey = window.localStorage.getItem("apiKey");

    // Initialize AI mode from localStorage
    const storedAIMode = window.localStorage.getItem("useAIMode");
    if (storedAIMode !== null) {
      setUseAIMode(JSON.parse(storedAIMode));
    } else {
      // Default to true if API key exists, false otherwise
      setUseAIMode(!!storedApiKey);
    }

    // Only show free trial word if no API key is stored and no words learned yet
    if (!storedApiKey && (!storedUsedWords || JSON.parse(storedUsedWords).length === 0)) {
      freeTrialWord();
    }
  }, []); // Run only once on mount


  // Show loading state until client-side initialization is complete
  if (!isClient) {
    return null;
  }

  // Save new words to localstorage
  const newUsedWords = (newword) => {
    if (typeof window === "undefined") return;

    // Check if the word already exists in the usedWords array
    if (usedWords && usedWords.includes(newword)) return;

    const updatedWords = usedWords ? [...usedWords, newword] : [newword];
    setUsedWords(updatedWords);

    try {
      window.localStorage.setItem("usedWords", JSON.stringify(updatedWords));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const deleteWord = (word) => {
    if (typeof window === "undefined") return;

    const updatedWords = usedWords.filter((w) => w !== word);
    setUsedWords(updatedWords);

    try {
      window.localStorage.setItem("usedWords", JSON.stringify(updatedWords));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const handleGetWord = async (type) => {
    try {
      setStatus({ type: "info", message: "Getting Word..." });

      const data = await WordFetcher({ usedWords, apiKey, type, useAIMode });

      setStatus({
        type: "success",
        message: data.message,
      });

      const wordDataReceived = data.data;
      setWordData(wordDataReceived);
      // if (type == "random123") {
      newUsedWords(wordDataReceived.word);
      // }

      return wordDataReceived;
    } catch (error) {
      console.error("Error in handleNewWord:", error);
      toast.error(error.message || "Failed to get a new word. Try again.");
      setStatus({
        type: "error",
        message: error.message || "An error occurred while getting a new word",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleNewWord = async (typeOfWord) => {
    if (isSending) return;

    // Only block if in AI mode and no API key
    if (useAIMode && !apiKey) {
      toast.error("Add an API key to enable AI features.");
      return;
    }

    setIsSending(true);
    setShowExplanation(false);
    setSelectedOption(null);

    try {
      const success = await handleGetWord(typeOfWord);
      if (success) {
        setShowWord(true);
      }
    } catch (error) {
      console.error("Error in handleNewWord:", error);
      setStatus({
        type: "error",
        message: error.message || "Failed to load word. Try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setShowExplanation(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showAPIKeyIssue = () => {
    if (useAIMode && !apiKey) {
      toast.error("Add an API key to enable AI features.");
      return;
    }
  };

  const handleAIModeToggle = () => {
    const newMode = !useAIMode;
    setUseAIMode(newMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("useAIMode", JSON.stringify(newMode));
    }

    if (newMode && !apiKey) {
      toast("Add API key to use AI mode", { icon: "🔑" });
    } else {
      toast.success(`Switched to ${newMode ? "AI Mode" : "Free Dictionary Mode"}`);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden relative">
      {/* Left Sidebar - API Key Manager */}
      <LeftSidebar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        useAIMode={useAIMode}
        onAIModeToggle={handleAIModeToggle}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative min-w-0 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            {/* Mobile Menu Component */}
            <MobileMenu
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              useAIMode={useAIMode}
              onAIModeToggle={handleAIModeToggle}
              isMenuOpen={isMenuOpen}
              onMenuToggle={toggleMenu}
            />

            <div className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-4 md:mb-1 flex-grow">
              {/* Vocabulary Builder */}
              The-Vocab
            </div>

            {/* Mobile-only WordHistory (three-dot menu) */}
            <div className="md:hidden">
              <WordHistory
                showWords={showWords}
                setShowWords={setShowWords}
                usedWords={usedWords}
                onWordSelect={handleNewWord}
                onWordDelete={deleteWord}
                isSending={isSending}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10" onMouseEnter={() => showAPIKeyIssue()}>
            <button
              onClick={() => handleNewWord("random123")}
              disabled={isSending || (useAIMode && !apiKey)}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform 
                  ${isSending || (useAIMode && !apiKey) ? "cursor-not-allowed opacity-50" : "hover:scale-105 hover:-translate-y-0.5"}`}
              title={`${useAIMode && !apiKey ? "Add API key" : ""}`}
            >
              {showWord ? "Get Another Word" : "Get New Word"}
            </button>

            <WordSearch
              onSearch={handleNewWord}
              isDisabled={isSending || (useAIMode && !apiKey)}
            />
          </div>

          {/* Word Quiz Content */}
          {showWord && (
            <WordQuiz
              wordData={wordData}
              showExplanation={showExplanation}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
              isSending={isSending}
            />
          )}

          {/* Empty State */}
          {!showWord && (
            <div className="flex flex-col items-center justify-center text-gray-400 mt-20 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Image src="/book-open.svg" alt="Learn" width={40} height={40} className="invert brightness-0" />
              </div>
              <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">Ready to expand your vocabulary?</p>
              <p className="text-sm text-gray-500">Click the button above to start learning new words!</p>
            </div>
          )}
        </div>
      </div>



      {/* Desktop Right Sidebar */}
      <div className="hidden md:block overflow-x-hidden">
        <RightSidebar
          usedWords={usedWords}
          onWordSelect={handleNewWord}
          onWordDelete={deleteWord}
          isSending={isSending}
        />
      </div>
    </div>
  );
}
