'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages from the API
  const fetchMessages = async () => {
    const response = await fetch('/api/messages');
    const data = await response.json();
    setMessages(data.messages);
    console.log(data.messages)
  };

  // Publish a new message to Redis
  const publishMessage = async () => {
    if (newMessage.trim()) {
      await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });
      setNewMessage('');
      fetchMessages(); // Refresh the message list after publishing
    }
  };

  // Fetch messages when the page loads
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Real-Time Notifications</h1>

        <div className="flex flex-col space-y-4">
          {/* Input and Publish Button */}
          <div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={publishMessage}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Publish Message
          </button>
          <button
            onClick={fetchMessages}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            fetch Message
          </button>

          {/* Messages List */}
          <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
            {messages?.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet</p>
            ) : (
              messages?.map((msg, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">{msg}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
