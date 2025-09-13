import React from 'react';
import NFTLayeredGenerator from './components/NFTLayeredGenerator.jsx';

/**
 * The main application component. This component simply renders the
 * NFTLayeredGenerator which contains all the functionality for
 * generating layered NFT creatures based on SVG layers and user
 * uploads.
 */
const App = () => {
  return <NFTLayeredGenerator />;
};

export default App;