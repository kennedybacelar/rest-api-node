const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
 
mongoose.connect(
    'mongodb+srv://kennedy:' + 
    process.env.MONGO_ATLAS_PW +
    '@cluster0-35wpj.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true, useUnifiedTopology: true
    }
);
mongoose.Promise = global.Promise;


app.use(morgan('dev')); //midleware to treat routes
//The below commands provides info about the request
app.use(bodyParser.urlencoded({extended: false})); //another midleware to treat requests
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers", 
        "origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;