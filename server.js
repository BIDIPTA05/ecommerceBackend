//create an express server
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT ;

//routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const wishlistRoutes = require('./routes/wishlist');

  
const DB = process.env.MONGO_URI;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB connection successful!")).catch(err => console.log(err));


// mongoose.connect(mongodb+srv://clusterAnything.mongodb.net/test?retryWrites=true&w=majority, { user: process.env.MONGO_USER, pass: process.env.MONGO_PASSWORD, useNewUrlParser: true, useUnifiedTopology: true })

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routing
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/wishlist', wishlistRoutes);




app.listen(port, function () {
    console.log('Server listening at port %d', port);
});



