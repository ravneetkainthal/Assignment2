/******************************************************************************
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: _____RAVNEET KAUR____ Student ID: ___N01530780__ Date: __Feb 26, 2024__________________
*
*
******************************************************************************/ 
//IMPORTING ALL REQUIRED MODULES
var express = require('express');
var path = require('path');
var app = express();

//DEFINING PORT AND CHECKING IF PORT VARIABLE  EXIST OR NOT AND HANDLEBARS 
const exphbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();
const port = process.env.port || 3000;

//DEFINING WHERE THE FILE EXIST OF CURRENT MODULE
app.use(express.static(path.join(__dirname, 'public')));

// CUSTOM HANDLEBARS
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',

  // DEFINE HELPER FUNCTIONS STEP 9
  helpers: {
    valueNotZero: function(reviewValue) {
      return reviewValue != 0;}
      //FOR STEP 10 I COMMENTED BELOW LINE AND CHANGE COLOR FOR ROW WITH REVIEW 0
    ,
    valueChangeToZero: function(reviewValue) {
      if(reviewValue == "0")
      return "N/A";
    else
      return reviewValue;
    }
  }
});

app.engine('.hbs', hbs.engine);

/*AFTER DEFINING CUSTOPM HANDLEBARS I DON'T NEED THE BELOW LINE
SETING HANDLEBAR ENGINE WITH PROVIDED FILE PATH
app.engine('.hbs', exphbs.engine({
   extname: '.hbs',
   defaultLayout: "main" 
  }));//faced error in this line then updated it by including layout type*/

//SETTING VIEW ENGINE FOR EXPRESS
app.set('view engine', 'hbs');


//ROUTE, ROOT URL WHEN THIS HIT IT'LL GO TO INDEX FILE WITH GIVEN PATH
app.get('/', function(req, res) { 
  res.render('index', { title: 'Express' });//error 2 becaue route was incorrect
});

//ROUTE,  WHEN THIS HIT IT'LL RESPOND WITH A MESSAGE TO CLIENT
app.get('/users', function(req, res) { 
  res.send('respond with a resource');
});


//ADDING ASSIGNMENT 1 ROUTES

//LOAD JSON DATA LOCALLY
const data = require('./datasetB.json');

//PATH FOR ALL DATA
app.get('/data', (req, res) => {//defining route with callback function
  console.log("JSON data is loaded and ready!");//console message
  console.log(data); // displaying data in console

  res.render('partials/data', {title: 'Data Page'});//server message with title
});

//ROUTE FOR DATA USING INDEX
app.get('/data/product/:index', (req, res) => {
  const index= req.params.index;//here we'll fetch original index value and assign it to index variable
  const product= data[index];//here we'll fetch the product data based on above retrieved index from JSON file
  if (product){//check if product exist at given location
      res.render('partials/productIndex', {product});//we'll send its id to server
  } else{// else we'll throw error
      res.status(404).send('<h1>Product Id is wrong</h1>');
  }
  });


//ROUTE FOR  GETTING PRODUCT FORM USING PRODUCT ID
app.get('/data/search/prdID/', (req, res) => {
  res.render('partials/productForm');
});

// Route for fetching product details using form by ID
app.get('/data/search/prdID/result', (req,res) => {
  const productId = req.query.productId;
  const product = data.find(item => item.asin === productId);
  if (product) {
    res.render('partials/productFormData', { product });
  } else {
    res.status(404).send('<h1>Product Not Available!!<br>Please check Entered ASIN or Product ID</h1>');
  }
});


// Route for form to get product details by name
app.get('/data/search/prdName/', (req, res) => {
  res.render('partials/productNameForm');
});


// Route for fetching product details using form by name
app.get('/data/search/prdName/result', (req, res) => {
  const productName = req.query.productName.toLowerCase();
  const foundProducts = data.filter(item => item.title.toLowerCase().includes(productName));
  if (foundProducts.length > 0) {
    res.render('partials/productNameResult', { foundProducts });
  } else {
    res.status(404).send('<h1>No products found matching the entered product name</h1>');
  }
});

//ASSIGNMENT 1 PART ENDS HERE


//STEP 7 definining a new route for all products
app.get('/allData', (req, res) => {
  // Render all products info in an HTML table using Handlebars
  res.render('partials/allData', { products: data, title: 'All Products In HTML Table' });
});


//ROUTE TO  HANDLE ALL WRONG ROUTE WITH GIVEN MESSAGE IN PROVIDED FILE
app.get('*', function(req, res) {
  res.render('error', { title: 'Error', message:'Wrong Route' });
});

//START THE SERVER WITH CONSOLE MESSAGE
app.listen(port, () => { //DEFINING PORT
  console.log(`Example app listening at http://localhost:${port}`)
})