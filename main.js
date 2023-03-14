function purchaseBook(title, author, price, discountPercentage, stockAmount, purchaseAmount, creditTerm) {

    // Define constant tax percentage = 11%
    const taxPercentage = 11;

    // bool variabel untuk mengecek stock buku
    let isAvailable = purchaseAmount > stockAmount;
    
    // Check Stock
    if(isAvailable){
      console.log("Stok buku tidak memenuhi");
      return 0;
    }

    // Inisialisasi variabel
    let totalPurchaseAmount = 0;
    let totalPrice = 0;
    let installmentPrice = 0;
    let installmentTerm = [];

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

      // Hitung installment (cicilan)
      installmentPrice = totalPrice / creditTerm;
      
    }
  
    // Buat array untuk installment term objects untuk menyimpan tagihan yang harus dibayar tiap bulan
    for (let j = 1; j <= creditTerm; j++) {
      installmentTerm.push({
        "Term": j,
        "Price": installmentPrice.toFixed(2)
      });
    }

    // Display semua data
    console.log("Title: " + title);
    console.log("Author: " + author);
    console.log("Price per book: $" + price.toFixed(2));
    console.log("Discount: " + discountPercentage + "%");
    console.log("Total purchase amount: " + totalPurchaseAmount);
    console.log("Total price: $" + totalPrice.toFixed(2));
    console.log("Stock amount: " + stockAmount);
    console.log(installmentTerm);
  
    return totalPrice;
  }

  purchaseBook("Koala Kumal", "Raditya Dika", 13.49, 15, 10, 6, 6);