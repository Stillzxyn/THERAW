const mongoose = require('mongoose');
require('dotenv').config();

// Perfume products data
const perfumeProducts = [
  {
    _id: "perf001",
    name: "Essence Noir",
    price: 145,
    gender: "PERFUMERY",
    category: "Eau de Parfum",
    description: "A sophisticated blend of oud, sandalwood, and vetiver. Rich, warm, and intensely luxurious with a 12-hour wear time.",
    material_composition: "Top Notes: Bergamot, Black Pepper\nHeart Notes: Oud, Ambroxan\nBase Notes: Sandalwood, Vetiver, Musk",
    fragrance_type: "Eau de Parfum (EDP)",
    volume: "100ml",
    longevity: "12 hours",
    media: {
      featured: "/products/perf001.jpg"
    }
  },
  {
    _id: "perf002",
    name: "Minimal Grace",
    price: 125,
    gender: "PERFUMERY",
    category: "Eau de Toilette",
    description: "Clean, understated elegance. Crisp citrus notes combined with white musks and subtle florals. Perfect for everyday luxury.",
    material_composition: "Top Notes: Lemon, Grapefruit\nHeart Notes: Lily of the Valley, Jasmine\nBase Notes: White Musk, Cedar",
    fragrance_type: "Eau de Toilette (EDT)",
    volume: "100ml",
    longevity: "6-8 hours",
    media: {
      featured: "/products/perf002.jpg"
    }
  },
  {
    _id: "perf003",
    name: "Raw Intensity",
    price: 155,
    gender: "PERFUMERY",
    category: "Eau de Parfum",
    description: "Bold and uncompromising. Spicy iris, leather, and tobacco create an unforgettable statement. For the audacious.",
    material_composition: "Top Notes: Pink Pepper, Cardamom\nHeart Notes: Iris, Leather Accord\nBase Notes: Tobacco, Amber, Patchouli",
    fragrance_type: "Eau de Parfum (EDP)",
    volume: "100ml",
    longevity: "14 hours",
    media: {
      featured: "/products/perf003.jpg"
    }
  },
  {
    _id: "perf004",
    name: "Serenity Bloom",
    price: 135,
    gender: "PERFUMERY",
    category: "Eau de Parfum",
    description: "Ethereal and calming. Peony, tuberose, and pink pepper create a soft, enveloping floral experience. Modern romance.",
    material_composition: "Top Notes: Pink Pepper, Freesia\nHeart Notes: Peony, Tuberose\nBase Notes: Heliotrope, White Amber, Musk",
    fragrance_type: "Eau de Parfum (EDP)",
    volume: "100ml",
    longevity: "10 hours",
    media: {
      featured: "/products/perf004.jpg"
    }
  },
  {
    _id: "perf005",
    name: "Urban Pulse",
    price: 130,
    gender: "PERFUMERY",
    category: "Eau de Toilette",
    description: "Modern and energetic. A blend of juniper, mint, and ambroxan that feels fresh, clean, and distinctly contemporary.",
    material_composition: "Top Notes: Mint, Ginger, Juniper\nHeart Notes: Lavender, Green Tea\nBase Notes: Ambroxan, Cedarwood, Musk",
    fragrance_type: "Eau de Toilette (EDT)",
    volume: "100ml",
    longevity: "7-9 hours",
    media: {
      featured: "/products/perf005.jpg"
    }
  },
  {
    _id: "perf006",
    name: "Timeless Amber",
    price: 150,
    gender: "PERFUMERY",
    category: "Eau de Parfum",
    description: "Warm, enveloping, and deeply sensual. Amber, vanilla, and cashmeran create an addiction-worthy fragrance for all seasons.",
    material_composition: "Top Notes: Orange, Cinnamon\nHeart Notes: Amber, Benzoin\nBase Notes: Cashmeran, Vanilla, Sandalwood",
    fragrance_type: "Eau de Parfum (EDP)",
    volume: "100ml",
    longevity: "13 hours",
    media: {
      featured: "/products/perf006.jpg"
    }
  },
  {
    _id: "perf007",
    name: "Crystal Water",
    price: 120,
    gender: "PERFUMERY",
    category: "Eau de Toilette",
    description: "Transparent and refreshing. Aquatic notes with hints of sea salt and driftwood. Like a cool ocean breeze in a bottle.",
    material_composition: "Top Notes: Sea Salt, Ginger, Bergamot\nHeart Notes: Aquatic Accord, Driftwood\nBase Notes: Ambrette, Mineral Musks",
    fragrance_type: "Eau de Toilette (EDT)",
    volume: "100ml",
    longevity: "6-7 hours",
    media: {
      featured: "/products/perf007.jpg"
    }
  },
  {
    _id: "perf008",
    name: "Raw Eden",
    price: 160,
    gender: "PERFUMERY",
    category: "Eau de Parfum",
    description: "Nature refined. Green florals, moss, and woods create an earthy, sophisticated fragrance that feels grounded and luxurious.",
    material_composition: "Top Notes: Petrichor, Green Leaves, Galbanum\nHeart Notes: Moss, Vetiver, Geranium\nBase Notes: Virginia Cedar, Patchouli, Oakmoss",
    fragrance_type: "Eau de Parfum (EDP)",
    volume: "100ml",
    longevity: "14 hours",
    media: {
      featured: "/products/perf008.jpg"
    }
  }
];

// Connect to MongoDB and insert products
async function insertPerfumes() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/the-raw';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get the products collection
    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Insert the perfume products
    const result = await collection.insertMany(perfumeProducts);
    console.log(`✓ Successfully inserted ${result.insertedCount} perfume products`);

    console.log('\nInserted products:');
    perfumeProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });

    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error inserting products:', error);
    process.exit(1);
  }
}

insertPerfumes();
