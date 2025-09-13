import React, { useState } from 'react';
import { Upload, Zap, Coins, Globe, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import OpenAI from 'openai';

const NFTGenerator = () => {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [nftTxId, setNftTxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);

  // Generación de imagen con Stability AI (API gratuita)
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt para generar la imagen');
      return;
    }

    if (!import.meta.env.VITE_STABILITY_API_KEY) {
      setError('API key de Stability AI no configurada. Contacta al administrador.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 20,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.artifacts && result.artifacts[0]) {
        const base64Image = result.artifacts[0].base64;
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setGeneratedImage({
          url: imageUrl,
          prompt: prompt
        });
        setStep(2);
        setLoading(false);
      } else {
        throw new Error('No se recibió imagen en la respuesta');
      }

    } catch (err) {
      setError('Error generando la imagen: ' + err.message);
      setLoading(false);
    }
  };

  // Upload a IPFS con Pinata
  const uploadToIPFS = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'ai-generated-image.png');

      const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      });

      const result = await pinataResponse.json();

      if (result.IpfsHash) {
        setIpfsHash(result.IpfsHash);
        setStep(3);
        setLoading(false);
      } else {
        setError('Error subiendo a IPFS: ' + JSON.stringify(result));
        setLoading(false);
      }

    } catch (err) {
      setError('Error subiendo a IPFS: ' + err.message);
      setLoading(false);
    }
  };

  // Simulación de conexión de wallet (placeholder)
  const connectWallet = async () => {
    setLoading(true);
    try {
      // Aquí iría la integración real con wallets BCH
      setTimeout(() => {
        setWalletConnected(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error conectando wallet: ' + err.message);
      setLoading(false);
    }
  };

  // Simulación de minting NFT (placeholder)
  const mintNFT = async () => {
    if (!walletConnected) {
      setError('Por favor conecta tu wallet primero');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Aquí iría la llamada real para mint en BCH
      setTimeout(() => {
        const mockTxId = Math.random().toString(36).substring(2, 20);
        setNftTxId(mockTxId);
        setStep(4);
        setLoading(false);
      }, 4000);

    } catch (err) {
      setError('Error minteando NFT: ' + err.message);
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setPrompt('');
    setGeneratedImage(null);
    setIpfsHash('');
    setNftTxId('');
    setError('');
  };

  const StepIndicator = ({ currentStep }) => {
    const steps = [
      { num: 1, title: 'Generar', icon: Zap },
      { num: 2, title: 'IPFS', icon: Globe },
      { num: 3, title: 'Wallet', icon: Coins },
      { num: 4, title: 'NFT', icon: CheckCircle }
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = currentStep >= s.num;
          const isCurrent = currentStep === s.num;

          return (
            <React.Fragment key={s.num}>
              <div className={`flex flex-col items-center ${isCurrent ? 'scale-110' : ''} transition-all`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`text-xs mt-2 ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > s.num ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            NFT Generator
          </h1>
          <p className="text-xl text-gray-600">
            Genera imágenes con IA → IPFS → Bitcoin Cash NFT
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* Step 1: Generate Image */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">Genera tu imagen con IA</h2>

              <div className="mb-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe la imagen que quieres generar... Ej: Un dragon dorado volando sobre montañas al atardecer, estilo fantasía épica"
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={generateImage}
                disabled={loading || !prompt.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Generando imagen...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2" size={20} />
                    Generar Imagen
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: IPFS Upload */}
          {step === 2 && generatedImage && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">Imagen generada</h2>

              <div className="mb-6">
                <img
                  src={generatedImage.url}
                  alt={generatedImage.prompt}
                  className="max-w-md mx-auto rounded-lg shadow-md"
                />
                <p className="text-gray-600 mt-4 italic">"{generatedImage.prompt}"</p>
              </div>

              <button
                onClick={uploadToIPFS}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Subiendo a IPFS...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2" size={20} />
                    Subir a IPFS
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Wallet Connection */}
          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">Conecta tu Wallet BCH</h2>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">Hash IPFS:</p>
                  <p className="font-mono text-sm break-all">{ipfsHash}</p>
                </div>
                <p className="text-gray-600">
                  Tu imagen está ahora almacenada de forma descentralizada en IPFS
                </p>
              </div>

              <div className="space-y-4">
                {!walletConnected ? (
                  <button
                    onClick={connectWallet}
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center mx-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Coins className="mr-2" size={20} />
                        Conectar Wallet BCH
                      </>
                    )}
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <CheckCircle className="text-green-500 mr-2" size={24} />
                      <span className="text-green-600 font-semibold">Wallet Conectada</span>
                    </div>
                    <button
                      onClick={mintNFT}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center mx-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          Minteando NFT...
                        </>
                      ) : (
                        <>
                          <Coins className="mr-2" size={20} />
                          Mintear NFT
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: NFT Created */}
          {step === 4 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6 text-green-600">¡NFT Creado Exitosamente!</h2>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID:</p>
                    <p className="font-mono text-sm break-all">{nftTxId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IPFS Hash:</p>
                    <p className="font-mono text-sm break-all">{ipfsHash}</p>
                  </div>
                </div>
              </div>

              {generatedImage && (
                <img
                  src={generatedImage.url}
                  alt="NFT"
                  className="max-w-sm mx-auto rounded-lg shadow-md mb-6"
                />
              )}

              <button
                onClick={resetFlow}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Crear Otro NFT
              </button>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Estado del Prototipo</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-800">✅ APIs reales</p>
              <p className="text-green-700">OpenAI DALL-E y Pinata IPFS integradas</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-800">📦 Tecnologías</p>
              <p className="text-blue-700">React, IPFS, Bitcoin Cash</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-semibold text-yellow-800">🚀 Próximos pasos</p>
              <p className="text-yellow-700">Integrar wallet real y minting BCH</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTGenerator;