const mongoose = require('mongoose');
require('dotenv').config();

// Sample clothing products
const clothingProducts = [
  // MEN TOPS
  {
    _id: "men_top_001",
    name: "Classic White T-Shirt",
    price: 890,
    gender: "MEN",
    category: "TOP",
    description: "Premium quality white t-shirt made from 100% organic cotton. Perfect for everyday wear with a modern minimalist design.",
    details: {
      description: "Premium quality white t-shirt made from 100% organic cotton. Perfect for everyday wear with a modern minimalist design.",
      materials: [
        { type: "Cotton", value: 100 }
      ],
      care: "Machine wash cold. Do not bleach. Tumble dry low."
    },
    variants: [
      {
        color: "WHITE",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
        color: "BLACK",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
      }
    ],
    media: { featured: "/products/men_top_001.jpg" }
  },
  {
    _id: "men_top_002",
    name: "Linen Button-Up Shirt",
    price: 1290,
    gender: "MEN",
    category: "TOP",
    description: "Lightweight linen shirt perfect for warm weather. Breathable fabric with classic collar and front button closure.",
    details: {
      description: "Lightweight linen shirt perfect for warm weather. Breathable fabric with classic collar and front button closure.",
      materials: [
        { type: "Linen", value: 100 }
      ],
      care: "Machine wash warm. Hang to dry. Iron on medium heat."
    },
    variants: [
      {
        color: "BEIGE",
        sizes: ["XS", "S", "M", "L", "XL"]
      },
      {
        color: "NAVY",
        sizes: ["XS", "S", "M", "L", "XL"]
      }
    ],
    media: { featured: "/products/men_top_002.jpg" }
  },

  // MEN BOTTOMS
  {
    _id: "men_bottom_001",
    name: "Tailored Black Trousers",
    price: 1890,
    gender: "MEN",
    category: "BOTTOMS",
    description: "Perfectly tailored black trousers with a modern silhouette. Made from high-quality wool blend for durability and comfort.",
    details: {
      description: "Perfectly tailored black trousers with a modern silhouette. Made from high-quality wool blend for durability and comfort.",
      materials: [
        { type: "Wool", value: 80 },
        { type: "Polyester", value: 20 }
      ],
      care: "Dry clean only. Press with medium heat."
    },
    variants: [
      {
        color: "BLACK",
        sizes: ["28", "30", "32", "34", "36", "38"]
      }
    ],
    media: { featured: "/products/men_bottom_001.jpg" }
  },
  {
    _id: "men_bottom_002",
    name: "Raw Denim Jeans",
    price: 1590,
    gender: "MEN",
    category: "BOTTOMS",
    description: "Premium raw denim jeans with a classic five-pocket design. Will develop a unique patina over time.",
    details: {
      description: "Premium raw denim jeans with a classic five-pocket design. Will develop a unique patina over time.",
      materials: [
        { type: "Cotton", value: 100 }
      ],
      care: "Wash inside out with cold water. Dry naturally."
    },
    variants: [
      {
        color: "INDIGO",
        sizes: ["28", "30", "32", "34", "36", "38"]
      }
    ],
    media: { featured: "/products/men_bottom_002.jpg" }
  },

  // MEN ACCESSORIES
  {
    _id: "men_acc_001",
    name: "Grained Leather Belt",
    price: 2190,
    gender: "MEN",
    category: "ACCESSORIES",
    description: "Handcrafted leather belt with a minimalist buckle. Made from premium grained leather that ages beautifully.",
    details: {
      description: "Handcrafted leather belt with a minimalist buckle. Made from premium grained leather that ages beautifully.",
      materials: [
        { type: "Leather", value: 100 }
      ],
      care: "Clean with soft cloth. Condition with leather cream occasionally."
    },
    variants: [
      {
        color: "BLACK",
        sizes: ["28", "30", "32", "34", "36"]
      },
      {
        color: "BROWN",
        sizes: ["28", "30", "32", "34", "36"]
      }
    ],
    media: { featured: "/products/men_acc_001.jpg" }
  },

  // MEN SHOES
  {
    _id: "men_shoe_001",
    name: "Minimal White Sneaker",
    price: 2890,
    gender: "MEN",
    category: "SHOES",
    description: "Clean white leather sneaker with minimal design. Comfortable for everyday wear with premium leather construction.",
    details: {
      description: "Clean white leather sneaker with minimal design. Comfortable for everyday wear with premium leather construction.",
      materials: [
        { type: "Leather", value: 80 },
        { type: "Rubber", value: 20 }
      ],
      care: "Wipe with damp cloth. Air dry. Do not machine wash."
    },
    variants: [
      {
        color: "WHITE",
        sizes: ["7", "8", "9", "10", "11", "12", "13"]
      }
    ],
    media: { featured: "/products/men_shoe_001.jpg" }
  },

  // WOMEN TOPS
  {
    _id: "women_top_001",
    name: "Silk Camisole",
    price: 1090,
    gender: "WOMEN",
    category: "TOP",
    description: "Luxurious silk camisole with delicate straps. Perfect as a layering piece or standalone for special occasions.",
    details: {
      description: "Luxurious silk camisole with delicate straps. Perfect as a layering piece or standalone for special occasions.",
      materials: [
        { type: "Silk", value: 100 }
      ],
      care: "Hand wash in cool water. Lay flat to dry. Do not wring."
    },
    variants: [
      {
        color: "IVORY",
        sizes: ["XS", "S", "M", "L"]
      },
      {
        color: "BLACK",
        sizes: ["XS", "S", "M", "L"]
      }
    ],
    media: { featured: "/products/women_top_001.jpg" }
  },
  {
    _id: "women_top_002",
    name: "Fitted Mock Neck",
    price: 990,
    gender: "WOMEN",
    category: "TOP",
    description: "Sleek fitted mock neck top in premium ribbed fabric. Versatile piece that works for any season.",
    details: {
      description: "Sleek fitted mock neck top in premium ribbed fabric. Versatile piece that works for any season.",
      materials: [
        { type: "Cotton", value: 95 },
        { type: "Elastane", value: 5 }
      ],
      care: "Machine wash cold. Lay flat to dry."
    },
    variants: [
      {
        color: "BLACK",
        sizes: ["XS", "S", "M", "L", "XL"]
      },
      {
        color: "GREY",
        sizes: ["XS", "S", "M", "L", "XL"]
      }
    ],
    media: { featured: "/products/women_top_002.jpg" }
  },

  // WOMEN BOTTOMS
  {
    _id: "women_bottom_001",
    name: "High-Waist Trousers",
    price: 1690,
    gender: "WOMEN",
    category: "BOTTOMS",
    description: "Elegant high-waisted trousers with a flattering silhouette. Made from structured fabric for all-day comfort.",
    details: {
      description: "Elegant high-waisted trousers with a flattering silhouette. Made from structured fabric for all-day comfort.",
      materials: [
        { type: "Wool", value: 70 },
        { type: "Polyester", value: 30 }
      ],
      care: "Dry clean recommended. Can hand wash in cool water."
    },
    variants: [
      {
        color: "BLACK",
        sizes: ["XS", "S", "M", "L", "XL"]
      },
      {
        color: "CAMEL",
        sizes: ["XS", "S", "M", "L", "XL"]
      }
    ],
    media: { featured: "/products/women_bottom_001.jpg" }
  },
  {
    _id: "women_bottom_002",
    name: "Minimal Skirt",
    price: 1290,
    gender: "WOMEN",
    category: "BOTTOMS",
    description: "A-line midi skirt with clean lines and premium drape. Perfect for creating effortless styled looks.",
    details: {
      description: "A-line midi skirt with clean lines and premium drape. Perfect for creating effortless styled looks.",
      materials: [
        { type: "Cotton", value: 60 },
        { type: "Linen", value: 40 }
      ],
      care: "Machine wash cold. Hang to dry."
    },
    variants: [
      {
        color: "WHITE",
        sizes: ["XS", "S", "M", "L", "XL"]
      },
      {
        color: "BLACK",
        sizes: ["XS", "S", "M", "L", "XL"]
      }
    ],
    media: { featured: "/products/women_bottom_002.jpg" }
  },

  // WOMEN ACCESSORIES
  {
    _id: "women_acc_001",
    name: "Leather Crossbody Bag",
    price: 3290,
    gender: "WOMEN",
    category: "ACCESSORIES",
    description: "Timeless leather crossbody bag with adjustable strap. Perfect for daily use with premium leather quality.",
    details: {
      description: "Timeless leather crossbody bag with adjustable strap. Perfect for daily use with premium leather quality.",
      materials: [
        { type: "Leather", value: 100 }
      ],
      care: "Clean with soft cloth. Condition with leather cream regularly."
    },
    variants: [
      {
        color: "BLACK",
        sizes: ["ONE SIZE"]
      },
      {
        color: "TAN",
        sizes: ["ONE SIZE"]
      }
    ],
    media: { featured: "/products/women_acc_001.jpg" }
  },

  // WOMEN SHOES
  {
    _id: "women_shoe_001",
    name: "Minimal White Sneaker",
    price: 2590,
    gender: "WOMEN",
    category: "SHOES",
    description: "Clean white leather sneaker designed for women. Comfortable everyday sneaker with premium construction.",
    details: {
      description: "Clean white leather sneaker designed for women. Comfortable everyday sneaker with premium construction.",
      materials: [
        { type: "Leather", value: 85 },
        { type: "Rubber", value: 15 }
      ],
      care: "Wipe with damp cloth. Air dry. Do not machine wash."
    },
    variants: [
      {
        color: "WHITE",
        sizes: ["5", "6", "7", "8", "9", "10", "11"]
      }
    ],
    media: { featured: "/products/women_shoe_001.jpg" }
  }
];

async function insertClothing() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/the-raw';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    const result = await collection.insertMany(clothingProducts);
    console.log(`✓ Successfully inserted ${result.insertedCount} clothing products`);

    console.log('\nInserted products:');
    clothingProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ฿${product.price} (${product.gender} / ${product.category})`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error inserting products:', error);
    process.exit(1);
  }
}

insertClothing();
