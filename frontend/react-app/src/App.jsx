import React, { useState } from 'react';

// Helper component for the loading spinner
const Spinner = () => (
  <div className="w-6 h-6 border-4 border-white border-t-blue-500 border-solid rounded-full animate-spin"></div>
);

// Main Application Component
export default function App() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handles the click event of the "Summarize" button.
   * It calls the Gemini API to summarize the text entered by the user.
   */
  const handleSummarize = async () => {
    // Reset previous states
    setSummary('');
    setError('');

    if (!inputText.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setIsLoading(true);

    // NEW CODE
    try {
      // The URL of YOUR backend server
      const backendUrl = 'http://localhost:5001/api/summarize';

      // The only data we need to send is the text
      const payload = { text: inputText };

      // Make the API call to your backend
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      // The backend sends back a simple object: { summary: "..." }
      setSummary(result.summary);

    } catch (err) {
      console.error("Error during API call:", err);
      setError(`An error occurred: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Research Paper Summarizer
          </h1>
          <p className="text-gray-400 mt-2">
            Paste your research paper content below and let Gemini provide a concise summary.
          </p>
        </header>

        <main>
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
            {/* Text Input Area */}
            <div className="mb-4">
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">
                Your Text
              </label>
              <textarea
                id="text-input"
                rows="10"
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                placeholder="Enter or paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              ></textarea>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSummarize}
                disabled={isLoading}
                className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? <Spinner /> : 'Summarize Content'}
              </button>
            </div>
          </div>

          {/* Output Display Area */}
          {(summary || error || isLoading) && (
            <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-200 mb-4">
                Summary
              </h2>
              {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-2 text-gray-400">Generating summary...</p>
                    </div>
                </div>
              )}
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">
                  <p>{error}</p>
                </div>
              )}
              {summary && (
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {summary}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
