function purchaseBook(title, author, price, discountPercentage, taxPercentage) {
    // Constants
    const TAX_RATE = 0.01;
  
    // Calculate discount and price after discount
    const discountAmount = price * (discountPercentage / 100);
    const priceAfterDiscount = price - discountAmount;
  
    // Calculate tax and price after tax
    const taxAmount = priceAfterDiscount * (taxPercentage / 100);
    const priceAfterTax = priceAfterDiscount + taxAmount;
  
    // Display all parameters with additional data
    console.log("Title: " + title);
    console.log("Author: " + author);
    console.log("Price: $" + price.toFixed(2));
    console.log("Discount: " + discountPercentage + "%");
    console.log("Discount amount: $" + discountAmount.toFixed(2));
    console.log("Price after discount: $" + priceAfterDiscount.toFixed(2));
    console.log("Tax: " + taxPercentage + "%");
    console.log("Tax amount: $" + taxAmount.toFixed(2));
    console.log("Price after tax: $" + priceAfterTax.toFixed(2));
  
    return priceAfterTax;
  }

  purchaseBook("The Great Gatsby", "F. Scott Fitzgerald", 12.99, 20, 7);