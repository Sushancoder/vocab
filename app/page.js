"use client";
import { useState } from 'react';

export default function Home() {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);
  
  const handleSendEmail = async () => {
    // try {
    //   setIsSending(true);
    //   setStatus({ type: 'info', message: 'Sending email...' });

    //   const response = await fetch('/api/sender');
    //   const data = await response.json();

    //   if (response.ok) {
    //     setStatus({
    //       type: 'success',
    //       message: data.message,
    //       messageId: data.messageId
    //     });
    //   } else {
    //     throw new Error(data.error || 'Failed to send email');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   setStatus({
    //     type: 'error',
    //     message: error.message || 'An error occurred while sending the email'
    //   });
    // } finally {
    //   setIsSending(false);
    // }
  };

  // Status message styling
  const statusStyles = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Email Sender</h1>
        <p className="text-center text-gray-600 mb-8">Click the button below to send a test email</p>

        <button
          onClick={handleSendEmail}
          disabled={isSending}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSending
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isSending ? 'Sending...' : 'Send Test Email'}
        </button>

        {/* {status && (
          <div className={`mt-6 p-4 rounded-md ${statusStyles[status.type] || 'bg-gray-100'}`}>
            <p className="text-center">
              {status.message}
              {status.messageId && (
                <span className="block text-xs mt-2 opacity-75">Message ID: {status.messageId}</span>
              )}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
