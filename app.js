const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const productRouter = require('./app/product/routes');
const productRouterV2 = require('./app/product_v2/routes');

const port = 7777;

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public/images')));
app.use('/api/v1', productRouter);
app.use('/api/v2', productRouterV2);

app.use((req, res, next) => {
    res.status(404);
    res.send({
        status: 'failed',
        message: 'Resource ' + req.originalUrl + ' not found'
    });
});


// app.listen(process.env.PORT || port, () => console.log('Server : Running Success'));
app.listen(process.env.PORT || port, () => console.log(`Server : http://localhost:${port}`));