import { useState, useEffect } from 'react';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { SignClient } from '@walletconnect/sign-client';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

export const useWalletConnect = () => {
  const [web3wallet, setWeb3wallet] = useState(null);
  const [session, setSession] = useState(null);
  const [uri, setUri] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  // Initialize Wallet Connect
  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        const signClient = await SignClient.init({
          projectId,
          metadata: {
            name: 'BCH NFT Generator',
            description: 'Generate AI-powered NFTs on Bitcoin Cash',
            url: 'https://nftbch.com',
            icons: ['https://walletconnect.com/walletconnect-logo.png'],
          },
        });

        setWeb3wallet(signClient);

        // Listen for session connections
        signClient.on('session_connect', (event) => {
          const session = event.session;

          setSession(session);
          setUri('');
          setIsConnecting(false);

          // Extract wallet address from session
          if (session?.namespaces?.bch?.accounts?.[0]) {
            const address = session.namespaces.bch.accounts[0].split(':')[2];
            setWalletAddress(address);
          }
        });

        // Listen for session deletions
        signClient.on('session_delete', () => {
          setSession(null);
          setWalletAddress('');
        });

      } catch (err) {
        console.error('Error initializing Wallet Connect:', err);
        setError('Failed to initialize Wallet Connect');
      }
    };

    if (projectId) {
      initWalletConnect();
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (!web3wallet) {
      setError('Wallet Connect not initialized');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const pairing = await web3wallet.pair({ uri });
      setUri('');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    if (!web3wallet || !session) return;

    try {
      await web3wallet.disconnect({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
      setSession(null);
      setWalletAddress('');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };

  // Generate QR code URI for pairing
  const generateUri = async () => {
    if (!web3wallet) return;

    try {
      const { uri } = await web3wallet.connect({
        requiredNamespaces: {
          bch: {
            methods: ['bch_signMessage', 'bch_signTransaction', 'bch_sendTransaction'],
            chains: ['bch:mainnet'],
            events: ['accountsChanged', 'chainChanged']
          }
        }
      });
      setUri(uri);
      return uri;
    } catch (err) {
      console.error('Error generating URI:', err);
      setError('Failed to generate pairing URI');
    }
  };

  return {
    signClient: web3wallet,
    session,
    uri,
    isConnecting,
    error,
    walletAddress,
    isConnected: !!session,
    connectWallet,
    disconnectWallet,
    generateUri,
    setUri,
  };
};