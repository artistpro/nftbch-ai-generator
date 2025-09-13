import React, { useState } from 'react';

const NFTGenerator = () => {
  const [test, setTest] = useState('Hello World - App is working!');

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
  const svgToImage = (source) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Determine whether the source is an inline SVG or a URL/data URL
      if (typeof source === 'string' && source.trim().startsWith('<svg')) {
        const svgBlob = new Blob([source], { type: 'image/svg+xml' });
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
      } else {
        // Assume it's a normal image URL or a data URI (e.g. uploaded PNG)
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = source;
      }
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
   * Remove an uploaded file from a specific category.
   *
   * @param {string} category The category of the file.
   * @param {number} index The index of the file to remove.
   */
  const removeUploadedFile = (category, index) => {
    setUploadedLayers((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
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

  // Generación de imagen con OpenAI
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt para generar la imagen');
      return;
    }

    if (!openai) {
      setError('API key de OpenAI no configurada. Contacta al administrador.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      const imageUrl = response.data[0].url;
      setGeneratedImage({
        url: imageUrl,
        prompt: prompt
      });
      setStep(2);
      setLoading(false);

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

export default NFTLayeredGenerator;