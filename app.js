const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/bookPurchasing", isAuth, async (req, res) => {
  let bookDetails = req.body.bookDetails;
  let termOfCredit = req.body.termOfCredit;
  let purchasedAmount = req.body.purchasedAmount;
  let additionalPrice = req.body.additionalPrice;

  const tax = 5;
  let originPrice = 0;
  let discountPrice = 0;
  let taxPrice = 0;
  let totalPrice = 0;

  // check data
  if (!bookDetails.title) {
    return res.status(400).json({
      error: `Title is null`,
    });
  }
  if (!bookDetails.writer) {
    return res.status(400).json({
      error: `Writer is null`,
    });
  }
  if (!bookDetails.price) {
    return res.status(400).json({
      error: `Price is null`,
    });
  }
  if (!bookDetails.discount) {
    return res.status(400).json({
      error: `Discount is null`,
    });
  }
  if (!bookDetails.publisher) {
    return res.status(400).json({
      error: `Publisher is null`,
    });
  }
  if (!bookDetails.stock) {
    return res.status(400).json({
      error: `Stock is null`,
    });
  }
  if (!termOfCredit) {
    return res.status(400).json({
      error: `Term of Credit is null`,
    });
  }
  if (!purchasedAmount) {
    return res.status(400).json({
      error: `Purchased Amount is null`,
    });
  }
  if (!additionalPrice) {
    return res.status(400).json({
      error: `Additional Price is null`,
    });
  }

  if (purchasedAmount > bookDetails.stock) {
    return res.status(200).json({
      error: `Stok Tidak Cukup.`,
    });
  } else {
    originPrice = bookDetails.price * purchasedAmount;
    discountPrice = countDiscount(
      bookDetails.price,
      purchasedAmount,
      bookDetails.discount
    ); 
    taxPrice = countTax(discountPrice, tax);
    creditPayment = await countCredit(taxPrice, termOfCredit, additionalPrice);
    totalPrice = taxPrice + additionalPrice * termOfCredit;
  }

  // save ke object
  finalData = {
    bookDetails: {
      title: bookDetails.title,
      writer: bookDetails.writer,
      publisher: bookDetails.publisher,
      price: bookDetails.price,
      discountPercent: bookDetails.discount,
      remainStock: bookDetails.stock - purchasedAmount,
    },
    purchasedAmount: purchasedAmount,
    totalOriginPrice: originPrice,
    totalPriceAfterDiscount: discountPrice,
    taxPercent: tax,
    totalPriceAfterTax: taxPrice,
    termOfCredit: termOfCredit,
    additionalPrice: additionalPrice,
    totalAdditionalPrice: additionalPrice * purchasedAmount,
    totalPrice: totalPrice,
    creditPayment: creditPayment,
  };

  // write object finelData into file text.txt
  await fs.writeFile(`zetta.txt`, JSON.stringify(finalData));

  return res.status(200).json({
    finalData,
  });
});

app.get("/readFileWithPromiseAwait", isAuth, async (req, res) => {
  try {
    const data = await readFileWithPromise("zetta.txt", "utf8");
    console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/readFileWithPromise", isAuth, (req, res) => {
  readFileWithPromise("zetta.txt", "utf8")
    .then((data) => {
      console.log(data);
      return res.status(200).json({
        data,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: "Internal server error",
      });
    });
});

app.listen(3000, () => console.log("API Server is running..."));

function isAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth === "your_password") {
    next();
  } else {
    res.status(401);
    res.send("Access forbidden");
  }
}

function readFileWithPromise(file, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function countDiscount(price, piece, percent) {
  percent /= 100; // division assignment
  price -= price * percent; // subtraction assignment
  return price * piece;
}

function countTax(price, tax) {
  return (price *= 1 + tax / 100); // multiplication assignment
}

function countTax(price, tax) {
  return (price *= 1 + tax / 100); // multiplication assignment
}

async function countCredit(taxPrice, termOfCredit, additionalPrice) {
  let arrMonth = [];
  let arrCredit = [];
  let arrAdditional = [];
  let arrCreditPlusAdditional = [];
  for (var i = 0; i < termOfCredit; i++) {
    arrMonth.push(i + 1);
    arrCredit.push(taxPrice / termOfCredit);
    arrAdditional.push(additionalPrice);
    arrCreditPlusAdditional.push(arrCredit[i] + additionalPrice);
  }

  let objCredit = [];
  let remainingBalance = taxPrice;
  for (var i = 0; i < termOfCredit; i++) {
    remainingBalance -= arrCredit[i];

    await objCredit.push({
      month: arrMonth[i],
      credit: arrCredit[i],
      additional: arrAdditional[i],
      totalCreditMustPay: arrCreditPlusAdditional[i],
      remainingBalance: remainingBalance,
    });
  }

  const sumCredit = arrCredit.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );
  console.log(`Total\t\t: ${sumCredit}`);

  return objCredit;
}
