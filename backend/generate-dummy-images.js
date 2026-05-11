const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

// Create products folder if it doesn't exist
const productsDir = path.join(__dirname, '../frontend/public/products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
  console.log('Created products folder');
}

// Read product data
const dataPath = path.join(__dirname, '../frontend/public/luxury_products_dataset.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const products = JSON.parse(rawData);

console.log(`Generating ${products.length} dummy images...`);

async function generateImages() {
  for (let index = 0; index < products.length; index++) {
    try {
      const product = products[index];

      // Create a new image 1000x1400 with dark grey background
      const image = await new Jimp({ width: 1000, height: 1400, color: 0x2d2d2dff });

      // Save image
      const filename = `${product._id}.jpg`;
      const filepath = path.join(productsDir, filename);
      await image.write(filepath);

      if ((index + 1) % 10 === 0) {
        console.log(`Generated ${index + 1}/${products.length} images`);
      }
    } catch (error) {
      console.error(`Error generating image for ${products[index]._id}:`, error.message);
    }
  }

  console.log('✓ All dummy images generated successfully!');
  console.log(`Images saved to: ${productsDir}`);
}

generateImages();
