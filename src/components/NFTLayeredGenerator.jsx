import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Shuffle,
  Settings,
  Eye,
  Zap,
  Plus,
} from 'lucide-react';

/**
 * NFTLayeredGenerator is a React component that allows users to
 * generate unique NFT creatures from layered SVG art. It provides
 * functionality for uploading custom layers, configuring rarity
 * probabilities, generating individual NFTs or whole collections,
 * previewing the current NFT on a canvas, downloading the PNG,
 * and exporting the associated metadata for collections.
 */
const NFTLayeredGenerator = () => {
  // Canvas reference for drawing the generated NFT
  const canvasRef = useRef(null);
  // Currently generated NFT
  const [currentNFT, setCurrentNFT] = useState(null);
  // Collection of NFTs when generating multiple
  const [collection, setCollection] = useState([]);
  // Desired collection size
  const [collectionSize, setCollectionSize] = useState(10);
  // Category selected for uploading custom images
  const [selectedCategory, setSelectedCategory] = useState('cuerpo');
  // User uploaded layers, keyed by category
  const [uploadedLayers, setUploadedLayers] = useState({
    cuerpo: [],
    ojos: [],
    boca: [],
    peinado: [],
    accesorios: [],
    fondo: [],
  });
  // Rarity configuration for weighted random selection per layer
  const [rarityConfig, setRarityConfig] = useState({
    cuerpo: { común: 50, raro: 30, épico: 15, legendario: 5 },
    ojos: { común: 45, raro: 35, épico: 15, legendario: 5 },
    boca: { común: 60, raro: 25, épico: 10, legendario: 5 },
    peinado: { común: 40, raro: 35, épico: 20, legendario: 5 },
    accesorios: { común: 50, raro: 30, épico: 15, legendario: 5 },
    fondo: { común: 70, raro: 20, épico: 8, legendario: 2 },
  });

  /**
   * Demo SVG layers. These act as default art for the different
   * categories (body, eyes, mouth, hair, accessories and background).
   * Users can upload their own PNGs to override these defaults.
   */
  const demoLayers = {
    cuerpo: [
      // Cuerpo humano simple
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="200" rx="80" ry="100" fill="#ffdbac" stroke="#d4af8c" stroke-width="3"/>
        <rect x="130" y="120" width="40" height="80" fill="#ffdbac" stroke="#d4af8c" stroke-width="2" rx="20"/>
      </svg>`,
      // Cuerpo robot
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect x="100" y="150" width="100" height="120" fill="#c0c0c0" stroke="#808080" stroke-width="3" rx="10"/>
        <rect x="120" y="120" width="60" height="60" fill="#e0e0e0" stroke="#808080" stroke-width="2" rx="5"/>
        <circle cx="130" cy="180" r="8" fill="#ff0000"/>
        <circle cx="170" cy="180" r="8" fill="#00ff00"/>
      </svg>`,
      // Cuerpo alien
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="180" rx="60" ry="90" fill="#90ee90" stroke="#32cd32" stroke-width="3"/>
        <ellipse cx="150" cy="140" rx="80" ry="60" fill="#98fb98" stroke="#32cd32" stroke-width="2"/>
      </svg>`,
      // Cuerpo zombie
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="200" rx="85" ry="105" fill="#8fbc8f" stroke="#556b2f" stroke-width="3"/>
        <rect x="125" y="120" width="50" height="85" fill="#9acd32" stroke="#556b2f" stroke-width="2" rx="25"/>
        <rect x="110" y="180" width="15" height="30" fill="#654321" rx="7"/>
        <rect x="175" y="190" width="20" height="25" fill="#654321" rx="10"/>
      </svg>`,
    ],
    ojos: [
      // Ojos normales
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="130" cy="150" rx="15" ry="20" fill="#ffffff" stroke="#000" stroke-width="2"/>
        <ellipse cx="170" cy="150" rx="15" ry="20" fill="#ffffff" stroke="#000" stroke-width="2"/>
        <circle cx="130" cy="150" r="8" fill="#4169e1"/>
        <circle cx="170" cy="150" r="8" fill="#4169e1"/>
        <circle cx="132" cy="147" r="3" fill="#000000"/>
        <circle cx="172" cy="147" r="3" fill="#000000"/>
      </svg>`,
      // Ojos láser
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="130" cy="150" rx="18" ry="25" fill="#ff0000" stroke="#8b0000" stroke-width="2"/>
        <ellipse cx="170" cy="150" rx="18" ry="25" fill="#ff0000" stroke="#8b0000" stroke-width="2"/>
        <circle cx="130" cy="150" r="10" fill="#ffff00"/>
        <circle cx="170" cy="150" r="10" fill="#ffff00"/>
        <line x1="130" y1="175" x2="130" y2="220" stroke="#ff0000" stroke-width="4"/>
        <line x1="170" y1="175" x2="170" y2="220" stroke="#ff0000" stroke-width="4"/>
      </svg>`,
      // Ojos diamante
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <polygon points="130,135 145,150 130,165 115,150" fill="#87ceeb" stroke="#4682b4" stroke-width="2"/>
        <polygon points="170,135 185,150 170,165 155,150" fill="#87ceeb" stroke="#4682b4" stroke-width="2"/>
        <polygon points="130,140 140,150 130,160 120,150" fill="#ffffff" opacity="0.8"/>
        <polygon points="170,140 180,150 170,160 160,150" fill="#ffffff" opacity="0.8"/>
      </svg>`,
      // Ojos de fuego
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="130" cy="150" rx="20" ry="25" fill="#ff4500" stroke="#8b0000" stroke-width="2"/>
        <ellipse cx="170" cy="150" rx="20" ry="25" fill="#ff4500" stroke="#8b0000" stroke-width="2"/>
        <ellipse cx="130" cy="150" rx="12" ry="18" fill="#ffd700"/>
        <ellipse cx="170" cy="150" rx="12" ry="18" fill="#ffd700"/>
        <ellipse cx="130" cy="150" rx="6" ry="10" fill="#ff0000"/>
        <ellipse cx="170" cy="150" rx="6" ry="10" fill="#ff0000"/>
      </svg>`,
    ],
    boca: [
      // Sonrisa
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <path d="M 120 180 Q 150 200 180 180" stroke="#000" stroke-width="3" fill="none"/>
        <rect x="135" y="185" width="8" height="12" fill="#ffffff" rx="2"/>
        <rect x="145" y="185" width="8" height="12" fill="#ffffff" rx="2"/>
        <rect x="155" y="185" width="8" height="12" fill="#ffffff" rx="2"/>
      </svg>`,
      // Boca seria
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <line x1="130" y1="185" x2="170" y2="185" stroke="#000" stroke-width="4"/>
      </svg>`,
      // Colmillos
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="185" rx="25" ry="15" fill="#8b0000" stroke="#000" stroke-width="2"/>
        <polygon points="140,180 135,200 145,200" fill="#ffffff"/>
        <polygon points="160,180 155,200 165,200" fill="#ffffff"/>
        <rect x="142" y="185" width="6" height="8" fill="#ffffff" rx="1"/>
        <rect x="150" y="185" width="6" height="8" fill="#ffffff" rx="1"/>
        <rect x="158" y="185" width="6" height="8" fill="#ffffff" rx="1"/>
      </svg>`,
      // Boca de oro
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="185" rx="20" ry="12" fill="#ffd700" stroke="#b8860b" stroke-width="2"/>
        <rect x="140" y="182" width="6" height="8" fill="#ffff00" rx="1"/>
        <rect x="148" y="182" width="6" height="8" fill="#ffff00" rx="1"/>
        <rect x="156" y="182" width="6" height="8" fill="#ffff00" rx="1"/>
      </svg>`,
    ],
    peinado: [
      // Calvo
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="130" rx="85" ry="60" fill="#ffdbac" stroke="#d4af8c" stroke-width="2"/>
      </svg>`,
      // Afro
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="120" r="70" fill="#8b4513" stroke="#654321" stroke-width="2"/>
        <circle cx="120" cy="110" r="25" fill="#8b4513"/>
        <circle cx="180" cy="110" r="25" fill="#8b4513"/>
        <circle cx="150" cy="80" r="30" fill="#8b4513"/>
        <circle cx="130" cy="100" r="20" fill="#8b4513"/>
        <circle cx="170" cy="100" r="20" fill="#8b4513"/>
      </svg>`,
      // Punk
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect x="140" y="60" width="8" height="60" fill="#ff00ff" transform="rotate(-10 144 90)"/>
        <rect x="150" y="50" width="8" height="70" fill="#00ff00"/>
        <rect x="160" y="60" width="8" height="60" fill="#ff00ff" transform="rotate(10 164 90)"/>
        <rect x="135" y="70" width="6" height="50" fill="#ffff00" transform="rotate(-20 138 95)"/>
        <rect x="165" y="70" width="6" height="50" fill="#ffff00" transform="rotate(20 168 95)"/>
      </svg>`,
      // Corona
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,120 120,90 140,100 150,80 160,100 180,90 200,120 180,130 160,125 150,130 140,125 120,130" fill="#ffd700" stroke="#b8860b" stroke-width="2"/>
        <circle cx="130" cy="105" r="4" fill="#ff0000"/>
        <circle cx="150" cy="95" r="5" fill="#0000ff"/>
        <circle cx="170" cy="105" r="4" fill="#00ff00"/>
      </svg>`,
    ],
    accesorios: [
      // Ninguno
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"></svg>`,
      // Cadena
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="220" rx="30" ry="8" fill="#c0c0c0" stroke="#808080" stroke-width="2"/>
        <rect x="145" y="210" width="10" height="20" fill="#ffd700" stroke="#b8860b" stroke-width="1" rx="2"/>
      </svg>`,
      // Gafas
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <circle cx="130" cy="150" r="25" fill="none" stroke="#000" stroke-width="3"/>
        <circle cx="170" cy="150" r="25" fill="none" stroke="#000" stroke-width="3"/>
        <line x1="155" y1="150" x2="145" y2="150" stroke="#000" stroke-width="3"/>
        <line x1="105" y1="145" x2="90" y2="140" stroke="#000" stroke-width="2"/>
        <line x1="195" y1="145" x2="210" y2="140" stroke="#000" stroke-width="2"/>
      </svg>`,
      // Arma
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect x="200" y="170" width="40" height="8" fill="#808080" stroke="#000" stroke-width="1"/>
        <rect x="230" y="165" width="15" height="18" fill="#654321" stroke="#000" stroke-width="1"/>
        <circle cx="205" cy="174" r="3" fill="#000"/>
      </svg>`,
    ],
    fondo: [
      // Fondo simple
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#87ceeb"/>
      </svg>`,
      // Fondo espacio
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#191970"/>
        <circle cx="50" cy="50" r="2" fill="#ffffff"/>
        <circle cx="100" cy="80" r="1" fill="#ffffff"/>
        <circle cx="200" cy="60" r="1.5" fill="#ffffff"/>
        <circle cx="250" cy="100" r="1" fill="#ffffff"/>
        <circle cx="80" cy="200" r="1" fill="#ffffff"/>
        <circle cx="220" cy="220" r="2" fill="#ffffff"/>
      </svg>`,
      // Fondo jungla
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#228b22"/>
        <ellipse cx="50" cy="250" rx="30" ry="60" fill="#006400"/>
        <ellipse cx="250" cy="280" rx="40" ry="50" fill="#006400"/>
        <ellipse cx="150" cy="270" rx="35" ry="70" fill="#32cd32"/>
      </svg>`,
      // Fondo fuego
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#8b0000"/>
        <ellipse cx="100" cy="280" rx="40" ry="80" fill="#ff4500" opacity="0.8"/>
        <ellipse cx="200" cy="290" rx="50" ry="70" fill="#ff6347" opacity="0.7"/>
        <ellipse cx="150" cy="270" rx="30" ry="60" fill="#ffd700" opacity="0.6"/>
      </svg>`,
    ],
  };

  /**
   * Convert an SVG string into an Image object. The image can then
   * be drawn onto a canvas. This function returns a promise that
   * resolves once the image has loaded.
   *
   * @param {string} svgString The SVG markup as a string.
   * @returns {Promise<HTMLImageElement>} A promise resolving to an Image.
   */
  const svgToImage = (svgString) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    });
  };

  /**
   * Select a random element from an array based on weighted rarity
   * probabilities. The weights are defined per rarity level. Higher
   * rarity values correspond to less frequent selections. If no
   * option can be found for a chosen rarity bucket, the first
   * element in the options array is used as a fallback.
   *
   * @param {Array<string>} options Array of SVG strings or uploaded image URLs.
   * @param {Object} weights The rarity weights for the category.
   * @returns {string} The selected option from the options array.
   */
  const weightedRandom = (options, weights) => {
    const rarityLevels = ['común', 'raro', 'épico', 'legendario'];
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    // Iterate through rarity levels subtracting weights until the bucket is chosen
    for (const level of rarityLevels) {
      random -= weights[level];
      if (random <= 0) {
        // Determine which indices correspond to the rarity bucket
        const levelOptions = options.filter((_, index) => {
          if (level === 'común') return index < Math.ceil(options.length * 0.5);
          if (level === 'raro') return index < Math.ceil(options.length * 0.8) && index >= Math.ceil(options.length * 0.5);
          if (level === 'épico') return index < Math.ceil(options.length * 0.95) && index >= Math.ceil(options.length * 0.8);
          return index >= Math.ceil(options.length * 0.95);
        });
        // Choose randomly within the selected bucket
        return levelOptions[Math.floor(Math.random() * levelOptions.length)] || options[0];
      }
    }
    // Fallback if no selection occurred
    return options[0];
  };

  /**
   * Calculate the overall rarity of a generated NFT based on the
   * individual rarity scores of each trait. Each rarity contributes a
   * certain number of points. The sum of these points determines
   * whether the overall NFT is Común, Raro, Épico, Legendario or
   * Mítico.
   *
   * @param {Array<{trait: string, rarity: string}>} rarityScore Array of trait rarities.
   * @returns {string} The overall rarity classification.
   */
  const calculateOverallRarity = (rarityScore) => {
    const pointsMap = { Común: 1, Raro: 3, Épico: 7, Legendario: 15 };
    const points = rarityScore.reduce((total, item) => {
      return total + (pointsMap[item.rarity] || 1);
    }, 0);

    if (points >= 50) return 'Mítico';
    if (points >= 30) return 'Legendario';
    if (points >= 20) return 'Épico';
    if (points >= 10) return 'Raro';
    return 'Común';
  };

  /**
   * Render a generated NFT onto the canvas by drawing each layer
   * sequentially. Each layer is scaled from its original 300x300
   * size to fit within the 400x400 canvas. A colored frame is
   * drawn around the canvas to indicate the overall rarity. A label
   * for the rarity and the NFT ID are drawn onto the canvas.
   *
   * @param {Object} nft The NFT object containing traits and metadata.
   */
  const renderNFT = async (nft) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    try {
      // Define the order in which layers are drawn
      const layerOrder = ['fondo', 'cuerpo', 'ojos', 'boca', 'peinado', 'accesorios'];
      for (const layer of layerOrder) {
        if (nft.traits[layer]) {
          const img = await svgToImage(nft.traits[layer]);
          // Scale from 300x300 to 400x400 and center
          const scale = 400 / 300;
          const offsetX = 50;
          const offsetY = 50;
          ctx.drawImage(img, offsetX, offsetY, 300 * scale, 300 * scale);
        }
      }
      // Define rarity colors for frames and labels
      const rarityColors = {
        Común: '#6b7280',
        Raro: '#3b82f6',
        Épico: '#8b5cf6',
        Legendario: '#f59e0b',
        Mítico: '#ec4899',
      };
      ctx.strokeStyle = rarityColors[nft.overallRarity];
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 392, 392);
      // Rarity label
      ctx.fillStyle = rarityColors[nft.overallRarity];
      ctx.fillRect(10, 10, 120, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${nft.overallRarity.toUpperCase()}`, 15, 30);
      // NFT ID label
      ctx.fillStyle = rarityColors[nft.overallRarity];
      ctx.fillRect(270, 10, 120, 30);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`NFT #${nft.id}`, 330, 30);
    } catch (error) {
      // If something goes wrong, draw an error placeholder
      console.error('Error rendering NFT:', error);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Error rendering NFT', 200, 200);
    }
  };

  /**
   * Generate a single NFT using either demo layers or user-uploaded
   * images. A unique ID is assigned using the current timestamp.
   * Rarity for each trait is determined by its position within its
   * respective array. After generation, the NFT is stored in
   * state and rendered on the canvas.
   */
  const generateSingleNFT = async () => {
    const generated = {};
    const rarityScore = [];
    // Combine demo layers and uploaded layers, uploaded layers override
    const currentLayers = { ...demoLayers };
    Object.keys(uploadedLayers).forEach((key) => {
      if (uploadedLayers[key].length > 0) {
        currentLayers[key] = uploadedLayers[key];
      }
    });
    // Select a random option for each category based on rarity
    Object.keys(currentLayers).forEach((category) => {
      if (currentLayers[category].length > 0) {
        const selected = weightedRandom(currentLayers[category], rarityConfig[category]);
        generated[category] = selected;
        const index = currentLayers[category].indexOf(selected);
        const rarity =
          index >= currentLayers[category].length * 0.95
            ? 'Legendario'
            : index >= currentLayers[category].length * 0.8
            ? 'Épico'
            : index >= currentLayers[category].length * 0.5
            ? 'Raro'
            : 'Común';
        rarityScore.push({ trait: category, rarity });
      }
    });
    const nft = {
      id: Date.now(),
      traits: generated,
      rarityScore,
      overallRarity: calculateOverallRarity(rarityScore),
    };
    setCurrentNFT(nft);
    // Delay rendering slightly to allow state to update
    setTimeout(() => renderNFT(nft), 50);
  };

  /**
   * Event handler for uploading files. Only image files are accepted.
   * Uploaded images are read as data URLs and stored in state under
   * their corresponding category.
   *
   * @param {Event} event The file input change event.
   * @param {string} category The category to assign uploaded images to.
   */
  const handleFileUpload = (event, category) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedLayers((prev) => ({
            ...prev,
            [category]: [...prev[category], e.target.result],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  /**
   * Generate an entire collection of NFTs. Ensures that each NFT in
   * the collection is unique by checking the combination of traits.
   * If uniqueness cannot be achieved within a reasonable number of
   * attempts, duplicates may still appear. After generation the
   * collection is saved in state.
   */
  const generateCollection = async () => {
    const newCollection = [];
    const duplicateCheck = new Set();
    for (let i = 0; i < collectionSize; i++) {
      let attempts = 0;
      let nft;
      do {
        nft = generateUniqueNFT(i + 1);
        const signature = JSON.stringify(
          Object.keys(nft.traits)
            .sort()
            .map((k) => nft.traits[k])
        );
        if (!duplicateCheck.has(signature)) {
          duplicateCheck.add(signature);
          break;
        }
        attempts++;
      } while (attempts < 100);
      newCollection.push(nft);
    }
    setCollection(newCollection);
    alert(`✅ Colección generada: ${newCollection.length} NFTs únicos`);
  };

  /**
   * Helper to generate a unique NFT. Similar to generateSingleNFT
   * but without updating component state. Used internally when
   * building a collection.
   *
   * @param {number} id The sequential ID for the NFT in the collection.
   * @returns {Object} The generated NFT object.
   */
  const generateUniqueNFT = (id) => {
    const generated = {};
    const rarityScore = [];
    const currentLayers = { ...demoLayers };
    Object.keys(uploadedLayers).forEach((key) => {
      if (uploadedLayers[key].length > 0) {
        currentLayers[key] = uploadedLayers[key];
      }
    });
    Object.keys(currentLayers).forEach((category) => {
      if (currentLayers[category].length > 0) {
        const selected = weightedRandom(currentLayers[category], rarityConfig[category]);
        generated[category] = selected;
        const index = currentLayers[category].indexOf(selected);
        const rarity =
          index >= currentLayers[category].length * 0.95
            ? 'Legendario'
            : index >= currentLayers[category].length * 0.8
            ? 'Épico'
            : index >= currentLayers[category].length * 0.5
            ? 'Raro'
            : 'Común';
        rarityScore.push({ trait: category, rarity });
      }
    });
    return {
      id,
      traits: generated,
      rarityScore,
      overallRarity: calculateOverallRarity(rarityScore),
    };
  };

  /**
   * Download the currently displayed NFT as a PNG. If no NFT has
   * been generated yet, an alert is shown. The canvas contents are
   * converted to a data URL which is then triggered for download.
   */
  const downloadCanvas = () => {
    if (!currentNFT) {
      alert('❌ Primero genera un NFT');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `layered-nft-${currentNFT.id}-${currentNFT.overallRarity}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('✅ NFT descargado exitosamente!');
    } catch (error) {
      alert('❌ Error al descargar: ' + error.message);
    }
  };

  /**
   * Export the metadata for the entire collection in a JSON format.
   * The metadata conforms roughly to typical NFT standards with
   * fields for name, description, image and attributes. The user
   * must replace the IPFS base hash with their own.
   */
  const exportMetadata = () => {
    if (collection.length === 0) {
      alert('❌ Primero genera una colección');
      return;
    }
    const metadata = collection.map((nft) => ({
      name: `Layered Creature #${nft.id}`,
      description: `Criatura única generada con sistema de capas. Rareza: ${nft.overallRarity}`,
      image: `ipfs://YOUR_HASH/${nft.id}.png`,
      attributes: [
        ...Object.keys(nft.traits).map((traitType) => {
          const index = (demoLayers[traitType] || []).indexOf(nft.traits[traitType]);
          return {
            trait_type: traitType.charAt(0).toUpperCase() + traitType.slice(1),
            value: index >= 0 ? `Layer_${index + 1}` : 'Custom',
          };
        }),
        {
          trait_type: 'Rarity',
          value: nft.overallRarity,
        },
        {
          trait_type: 'Score',
          value: nft.rarityScore.reduce((total, item) => {
            const points = { Común: 1, Raro: 3, Épico: 7, Legendario: 15 };
            return total + (points[item.rarity] || 1);
          }, 0),
        },
      ],
    }));
    const blob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `layered-metadata-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert(`✅ Metadata exportado: ${collection.length} criaturas`);
  };

  /**
   * Update the rarity configuration for a given category and rarity
   * level. The value is parsed as an integer and defaults to zero
   * if parsing fails.
   *
   * @param {string} category The category being updated.
   * @param {string} rarity The rarity level (común, raro, épico, legendario).
   * @param {string} value The input value from the user.
   */
  const updateRarity = (category, rarity, value) => {
    setRarityConfig((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [rarity]: parseInt(value) || 0,
      },
    }));
  };

  /**
   * Given a category and an index within that category's layer array,
   * return a human-readable name for the trait. If the index is
   * unknown, a generic name is returned based on the category.
   *
   * @param {string} category The trait category.
   * @param {number} index The index within that category.
   * @returns {string} A friendly trait name.
   */
  const getTraitName = (category, index) => {
    const names = {
      cuerpo: ['Humano', 'Robot', 'Alien', 'Zombie'],
      ojos: ['Normal', 'Láser', 'Diamante', 'Fuego'],
      boca: ['Sonrisa', 'Seria', 'Colmillos', 'Oro'],
      peinado: ['Calvo', 'Afro', 'Punk', 'Corona'],
      accesorios: ['Ninguno', 'Cadena', 'Gafas', 'Arma'],
      fondo: ['Cielo', 'Espacio', 'Jungla', 'Fuego'],
    };
    return names[category]?.[index] || `${category}_${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🎨 NFT Layered Generator
          </h1>
          <p className="text-xl text-purple-200">
            Generador de criaturas con capas combinadas - ¡Ojos, bocas y cuerpos reales!
          </p>
          <div className="mt-4 bg-green-500/20 border border-green-500 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-green-300 font-semibold">
              🔥 Generador con capas SVG integradas - ¡Criaturas reales!
            </p>
            <p className="text-green-200 text-sm">
              Sistema de capas: Fondo + Cuerpo + Ojos + Boca + Peinado + Accesorios
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Panel de Control y Upload */}
          <div className="xl:col-span-1 space-y-4">
            {/* Controles principales */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Settings className="mr-2" /> Controles
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2 font-medium">Tamaño de Colección</label>
                  <input
                    type="number"
                    value={collectionSize}
                    onChange={(e) => setCollectionSize(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white border border-white/30 focus:border-purple-400 focus:outline-none"
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="space-y-2">
                  <button
                    onClick={generateSingleNFT}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center font-medium transition-all"
                  >
                    <Shuffle className="mr-2 h-4 w-4" /> Generar Criatura
                  </button>
                  <button
                    onClick={generateCollection}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg flex items-center justify-center font-medium transition-all"
                  >
                    <Zap className="mr-2 h-4 w-4" /> Generar Colección
                  </button>
                  <button
                    onClick={downloadCanvas}
                    disabled={!currentNFT}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center font-medium transition-all"
                  >
                    📥 Descargar Criatura
                  </button>
                  <button
                    onClick={exportMetadata}
                    disabled={collection.length === 0}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center font-medium transition-all"
                  >
                    <Download className="mr-2 h-4 w-4" /> Export Metadata
                  </button>
                </div>
              </div>
            </div>
            {/* Upload de capas personalizadas */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Upload className="mr-2" /> Subir Capas Personalizadas
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-white mb-2 font-medium">Seleccionar Categoría:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white border border-white/30 focus:border-purple-400 focus:outline-none"
                  >
                    <option value="cuerpo">🧍 Cuerpo</option>
                    <option value="ojos">👀 Ojos</option>
                    <option value="boca">👄 Boca</option>
                    <option value="peinado">💇 Peinado</option>
                    <option value="accesorios">🎭 Accesorios</option>
                    <option value="fondo">🌄 Fondo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2 text-sm">
                    Subir imágenes para {selectedCategory}:
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, selectedCategory)}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white border border-white/30 focus:border-purple-400 focus:outline-none text-sm"
                  />
                  <p className="text-purple-200 text-xs mt-1">
                    {uploadedLayers[selectedCategory]?.length || 0} imágenes subidas
                  </p>
                </div>
                <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3">
                  <p className="text-blue-200 text-xs">
                    💡 <strong>Tip:</strong> Sube imágenes PNG transparentes para mejores resultados.
                    Las imágenes se combinarán como capas para crear criaturas únicas.
                  </p>
                </div>
              </div>
            </div>
            {/* Configuración de Rareza */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">⚡ Configurar Rareza por Capa</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {Object.keys(rarityConfig).map((category) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-white font-medium capitalize flex items-center justify-between">
                      {category}
                      <span className="text-xs text-purple-300">
                        {(uploadedLayers[category]?.length || demoLayers[category]?.length || 0)} capas
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(rarityConfig[category]).map(([rarity, value]) => (
                        <div key={rarity}>
                          <label className="text-purple-200 capitalize block">
                            {rarity}
                          </label>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => updateRarity(category, rarity, e.target.value)}
                            className="w-full px-2 py-1 bg-white/20 rounded text-white border border-white/30 focus:border-purple-400 focus:outline-none"
                            min="0"
                            max="100"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Vista Previa de la Criatura */}
          <div className="xl:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Eye className="mr-2" /> Criatura Generada
                </span>
                {currentNFT && (
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    ID: #{currentNFT.id}
                  </span>
                )}
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="w-full max-w-md mx-auto border-2 border-white/20 rounded-lg bg-gray-900"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
              {currentNFT && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${
                        currentNFT.overallRarity === 'Mítico'
                          ? 'bg-pink-500'
                          : currentNFT.overallRarity === 'Legendario'
                          ? 'bg-yellow-500'
                          : currentNFT.overallRarity === 'Épico'
                          ? 'bg-purple-500'
                          : currentNFT.overallRarity === 'Raro'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                      } text-white`}
                    >
                      ✨ {currentNFT.overallRarity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(currentNFT.traits).map((layer) => {
                      const traitValue = currentNFT.traits[layer];
                      const index = (demoLayers[layer] || []).indexOf(traitValue);
                      return (
                        <div key={layer} className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <div className="text-purple-200 capitalize text-sm font-medium">
                            {layer}
                          </div>
                          <div className="text-white font-bold">
                            {getTraitName(layer, index)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                    <h4 className="text-white font-bold mb-2">🎨 Capas Combinadas</h4>
                    <div className="text-sm text-purple-200">
                      <p>
                        Esta criatura combina {Object.keys(currentNFT.traits).length} capas únicas:
                      </p>
                      <div className="grid grid-cols-3 gap-1 mt-2">
                        {currentNFT.rarityScore.map((item, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              item.rarity === 'Legendario'
                                ? 'bg-yellow-500 text-black'
                                : item.rarity === 'Épico'
                                ? 'bg-purple-500 text-white'
                                : item.rarity === 'Raro'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-500 text-white'
                            }`}
                          >
                            {item.trait}: {item.rarity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!currentNFT && (
                <div className="text-center text-purple-200 py-8">
                  <div className="text-6xl mb-4">🎭</div>
                  <p className="text-lg">Genera tu primera criatura</p>
                  <p className="text-sm mt-2">Combina capas para crear seres únicos</p>
                  <div className="mt-4 text-xs text-purple-300">
                    <p>🔥 Sistema de capas incluye:</p>
                    <p>Fondos • Cuerpos • Ojos • Bocas • Peinados • Accesorios</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Estadísticas y Galería */}
          <div className="xl:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">📊 Estadísticas</h2>
              {collection.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{collection.length}</div>
                    <div className="text-purple-200">Criaturas Generadas</div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-white font-medium">Distribución de Rareza:</h3>
                    {['Común', 'Raro', 'Épico', 'Legendario', 'Mítico'].map((rarity) => {
                      const count = collection.filter((nft) => nft.overallRarity === rarity).length;
                      const percentage = collection.length > 0 ? ((count / collection.length) * 100).toFixed(1) : 0;
                      return (
                        <div key={rarity} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">{rarity}</span>
                            <span className="text-white font-medium">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`rounded-full h-2 transition-all ${
                                rarity === 'Mítico'
                                  ? 'bg-pink-500'
                                  : rarity === 'Legendario'
                                  ? 'bg-yellow-500'
                                  : rarity === 'Épico'
                                  ? 'bg-purple-500'
                                  : rarity === 'Raro'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <h3 className="text-white font-medium">Últimas Criaturas:</h3>
                    {collection
                      .slice(-5)
                      .reverse()
                      .map((nft) => (
                        <div
                          key={nft.id}
                          className="bg-white/10 rounded-lg p-2 text-sm border border-white/10"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-medium">Criatura #{nft.id}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                nft.overallRarity === 'Mítico'
                                  ? 'bg-pink-500'
                                  : nft.overallRarity === 'Legendario'
                                  ? 'bg-yellow-500'
                                  : nft.overallRarity === 'Épico'
                                  ? 'bg-purple-500'
                                  : nft.overallRarity === 'Raro'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-500'
                              } text-white`}
                            >
                              {nft.overallRarity}
                            </span>
                          </div>
                          <div className="text-xs text-purple-200">
                            {Object.keys(nft.traits).length} capas combinadas
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-3">
                    <h4 className="text-yellow-200 font-bold text-sm mb-1">🎨 Capas Activas:</h4>
                    <div className="text-xs text-yellow-300">
                      {Object.keys(demoLayers).map((layer) => (
                        <div key={layer} className="flex justify-between">
                          <span className="capitalize">{layer}:</span>
                          <span>
                            {(uploadedLayers[layer]?.length || 0) +
                              (demoLayers[layer]?.length || 0)}{' '}
                            variantes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-purple-200 space-y-4">
                  <div className="text-4xl">🎭</div>
                  <div>
                    <p>Sin colección aún</p>
                    <p className="text-sm mt-2">Genera criaturas combinando capas</p>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-3">
                    <h4 className="text-purple-200 font-bold text-sm mb-2">Sistema de Capas:</h4>
                    <div className="text-xs text-purple-300 space-y-1">
                      <p>🌄 Fondo: {demoLayers.fondo?.length || 0} opciones</p>
                      <p>🧍 Cuerpo: {demoLayers.cuerpo?.length || 0} opciones</p>
                      <p>👀 Ojos: {demoLayers.ojos?.length || 0} opciones</p>
                      <p>👄 Boca: {demoLayers.boca?.length || 0} opciones</p>
                      <p>💇 Peinado: {demoLayers.peinado?.length || 0} opciones</p>
                      <p>🎭 Accesorios: {demoLayers.accesorios?.length || 0} opciones</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-400/30">
            <p className="text-green-200 text-lg font-medium mb-2">
              🎨 Generador de Criaturas con Capas SVG • 100% Funcional
            </p>
            <p className="text-green-300 text-sm">
              🔥 Capas reales • 👁️ Ojos únicos • 👄 Bocas expresivas • 🧍 Cuerpos variados • 📥 Descarga real
            </p>
            <div className="mt-3 text-xs text-green-400">
              <p>💡 Sube tus propias imágenes PNG para reemplazar las capas SVG demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTLayeredGenerator;