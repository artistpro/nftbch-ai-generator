import React, { useState } from 'react';

const NFTGenerator = () => {
  const [test, setTest] = useState('Hello World - App is working!');

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">NFT Generator</h1>
        <p className="text-xl">{test}</p>
        <p className="mt-4">OpenAI Key: {import.meta.env.VITE_OPENAI_API_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
        <p>Pinata JWT: {import.meta.env.VITE_PINATA_JWT ? '✅ Configurada' : '❌ No configurada'}</p>
      </div>
    </div>
  );
};

export default NFTGenerator;