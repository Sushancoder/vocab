'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DefaultChatTransport } from 'ai';
import ChatMessage from '../components/ChatMessage';
import LeftSidebar from '../components/LeftSidebar';

export default function Page() {
  const [apiKey, setApiKey] = useState("");
  const [input, setInput] = useState('');
  const [reqcount, setreqcount] = useState(0);
  const inputRef = useRef(null);

  const MAX_FREE_REQUESTS = 15;
  const MAX_INPUT_LENGTH = 2000;

  // Helper function to check if it's a new day
  const isNewDay = (timestamp) => {
    if (!timestamp) return true;
    const lastDate = new Date(timestamp);
    const today = new Date();
    return lastDate.toDateString() !== today.toDateString();
  };

  // Load API key and request count from localStorage on mount
  useEffect(() => {
    const storedApiKey = window.localStorage.getItem("apiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }

    // Load request count and check if it's a new day
    const storedCount = window.localStorage.getItem("reqcount");
    const storedTimestamp = window.localStorage.getItem("requestTimestamp");

    if (isNewDay(storedTimestamp)) {
      // Reset count for new day
      setreqcount(0);
      window.localStorage.setItem("reqcount", "0");
      window.localStorage.setItem("requestTimestamp", new Date().toISOString());
    } else if (storedCount) {
      // Use stored count from today
      setreqcount(parseInt(storedCount, 10));
      window.localStorage.setItem("requestTimestamp", new Date().toISOString());

    }
  }, []);

  const [error, setError] = useState(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // Use a function that returns headers - this gets called on each request
      headers: () => ({
        'x-goog-api-key': localStorage.getItem("apiKey") || '',
        'x-request-count': reqcount.toString(),
      }),
    }),
    onError: (error) => {
      console.error('Chat error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is already typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      // If it's a character key (length 1) and not a modifier combo
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
        setInput((prev) => prev + e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle message submission with request limit check
  const handleSendMessage = () => {
    // Clear any previous errors
    setError(null);

    // Check if limit reached when no API key
    if (!apiKey && reqcount >= MAX_FREE_REQUESTS) {
      return;
    }

    if (input.trim() && status === 'ready') {
      sendMessage({ text: input });
      setInput('');

      // Increment request count only if no API key
      if (!apiKey) {
        const newCount = reqcount + 1;
        setreqcount(newCount);
        window.localStorage.setItem("reqcount", newCount.toString());
      }
    }
  };

  return (
    <div className='h-screen bg-slate-50 flex overflow-hidden'>
      {/* Sidebar - now self-managed */}
      <LeftSidebar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col h-full relative min-w-0'>
        {/* Messages - conditionally shown */}
        {messages.length > 0 && (
          <div className='flex-1 overflow-y-auto p-4 md:p-8 pt-16'>
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </div>
        )}

        {/* Input Area - Centered when empty, bottom when active */}
        <div className={`
             transition-all duration-300 ease-in-out
             ${messages.length === 0
            ? 'flex-1 flex flex-col items-center justify-center p-4'
            : 'p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent'}
        `}>

          {/* Empty State Hero */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-gray-400 mb-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Image src="/send-arrow.svg" alt="Chat" width={32} height={32} className="invert" />
              </div>
              <p className="text-xl md:text-2xl font-semibold text-gray-700">What's on your mind?</p>
            </div>
          )}

          <div className={`w-full transition-all duration-500 ease-in-out ${messages.length === 0 ? 'max-w-2xl' : 'max-w-3xl mx-auto'}`}>
            <form
              className={`flex gap-3 border border-blue-100 bg-white shadow-lg rounded-2xl p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-100`}
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <textarea
                rows={1}
                ref={inputRef}
                className='flex-1 rounded-xl p-3 focus:outline-none resize-none bg-transparent placeholder-gray-400 text-gray-700'
                value={input}
                maxLength={MAX_INPUT_LENGTH}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={messages.length === 0 ? "Ask anything..." : "Type your message..."}
                style={{ minHeight: '44px', maxHeight: '200px' }}
              />
              <button type="submit"
                disabled={status !== 'ready' || (!apiKey && reqcount >= MAX_FREE_REQUESTS)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center justify-center ${status === 'ready' && (apiKey || reqcount < MAX_FREE_REQUESTS)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-blue-400 cursor-not-allowed'
                  }`}
              >
                {status === 'ready' ? (
                  <Image src="/send-arrow.svg" alt="Send" width={20} height={20} className="invert brightness-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            </form>

            {/* Character Counter */}
            {input.length > 0 && (
              <div className="text-right text-xs mt-1">
                <span className={`${input.length >= MAX_INPUT_LENGTH ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
                  {input.length}/{MAX_INPUT_LENGTH}
                </span>
              </div>
            )}

            {/* API Key Warning & Request Limit Info */}
            {!apiKey && (
              <div className="text-center text-xs mt-3 space-y-1">
                {reqcount >= MAX_FREE_REQUESTS ? (
                  <p className="text-red-600 font-semibold animate-pulse">
                    ⚠️ Free request limit reached ({MAX_FREE_REQUESTS}/{MAX_FREE_REQUESTS}).
                    <br />Come back tomorrow or add an API key to continue.
                  </p>
                ) : (
                  <>
                    <p className="text-amber-600">
                      Free requests(per day) : {reqcount}/{MAX_FREE_REQUESTS} used
                    </p>
                    <p className="text-gray-500">
                      Add an API key in the sidebar for unlimited access to powerful models.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Error Message Display */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">⚠</span>
                  <p>{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors ml-2"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
