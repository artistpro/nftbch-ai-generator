import { useState, useEffect } from 'react';
import { Core } from '@walletconnect/core';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { WalletKit } from '@reown/walletkit';

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
        const core = new Core({
          projectId,
          relayUrl: 'wss://relay.walletconnect.com',
        });

        const web3walletInstance = await WalletKit.init({
          core,
          metadata: {
            name: 'BCH NFT Generator',
            description: 'Generate AI-powered NFTs on Bitcoin Cash',
            url: 'https://nftbch.com',
            icons: ['https://walletconnect.com/walletconnect-logo.png'],
          },
        });

        setWeb3wallet(web3walletInstance);

        // Listen for session proposals
        web3walletInstance.on('session_proposal', async (event) => {
          const { id, params } = event;

          try {
            // For BCH, we need to approve the session with BCH-specific namespaces
            const approvedNamespaces = buildApprovedNamespaces({
              proposal: params,
              supportedNamespaces: {
                bch: {
                  chains: ['bch:mainnet'],
                  methods: ['bch_signMessage', 'bch_signTransaction', 'bch_sendTransaction'],
                  events: ['accountsChanged', 'chainChanged'],
                  accounts: [`bch:mainnet:${walletAddress || 'placeholder'}`],
                },
              },
            });

            const sessionNamespace = await web3walletInstance.approveSession({
              id,
              namespaces: approvedNamespaces,
            });

            setSession(sessionNamespace);
            setUri('');
            setIsConnecting(false);

            // Extract wallet address from session
            if (sessionNamespace?.bch?.accounts?.[0]) {
              const address = sessionNamespace.bch.accounts[0].split(':')[2];
              setWalletAddress(address);
            }
          } catch (err) {
            console.error('Error approving session:', err);
            await web3walletInstance.rejectSession({
              id,
              reason: getSdkError('USER_REJECTED'),
            });
          }
        });

        // Listen for session deletions
        web3walletInstance.on('session_delete', () => {
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
      await web3wallet.disconnectSession({
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
      const { uri } = await web3wallet.pair();
      setUri(uri);
      return uri;
    } catch (err) {
      console.error('Error generating URI:', err);
      setError('Failed to generate pairing URI');
    }
  };

  return {
    web3wallet,
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