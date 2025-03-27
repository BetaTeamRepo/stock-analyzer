"use client";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 bg-blue-600 text-white text-center text-lg font-semibold">
        Chat
      </header>
      <div className="flex-grow flex flex-col justify-center items-center">
        <p className="text-gray-700">Your conversations will appear here.</p>
      </div>
     
    </div>
  );
};

export default Chat;
