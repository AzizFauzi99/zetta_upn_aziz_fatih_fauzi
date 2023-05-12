const express = require('express');
const app = express();

// Set up basic authentication
const basicAuth = require('express-basic-auth');
app.use(basicAuth({
  users: { 'admin': '12345' },
  challenge: true
}));

// Calculate installment price
async function calculateInstallment(totalPrice, creditTerm, additionalPrice = 0) {
  const installmentPrice = (totalPrice + additionalPrice) / creditTerm;
  const installmentTerm = [];

  for (let j = 1; j <= creditTerm; j++) {
    installmentTerm.push({
      "Term": j,
      "Price": installmentPrice.toFixed(2)
    });
  }

  return installmentTerm;
}

// Purchase Book API endpoint
app.post('/purchase-book', async (req, res) => {
  // Get request parameters
  const { title, author, price, discountPercentage, stockAmount, purchaseAmount, creditTerm, additionalPrice } = req.body;

  // Define constant tax percentage = 11%
  const taxPercentage = 11;

  // bool variabel untuk mengecek stock buku
  let isAvailable = purchaseAmount > stockAmount;

  // Check Stock
  if (isAvailable) {
    return res.status(400).json({ error: "Stok buku tidak memenuhi" });
  }

  // Inisialisasi variabel
  let totalPurchaseAmount = 0;
  let totalPrice = 0;

  // Looping selama stock masih ada dan purchase amount lebih kecil dari stock
  for (let i = 0; i < purchaseAmount && stockAmount > 0; i++) {

    // Hitung diskon and harga setelah diskon 
    let discountAmount = price * (discountPercentage / 100);
    let priceAfterDiscount = price - discountAmount;

    // Hitung tax (pajak) dan harga setelah tax
    let taxAmount = priceAfterDiscount * (taxPercentage / 100);
    let priceAfterTax = priceAfterDiscount + taxAmount;

    // Tambah ke total purchase amount dan total price
    totalPurchaseAmount++;
    totalPrice += priceAfterTax;

    // Update jumlah stock 
    stockAmount--;
  }

  // Calculate installment price
  const installmentTerm = await calculateInstallment(totalPrice, creditTerm, additionalPrice);

  // Return response
  res.json({
    title,
    author,
    price,
    discountPercentage,
    totalPurchaseAmount,
    totalPrice: totalPrice.toFixed(2),
    stockAmount,
    installmentTerm
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
