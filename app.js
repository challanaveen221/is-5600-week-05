const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')


// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.use(bodyParser.json())
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.post('/products', api.createProduct)

app.get('/orders', api.listOrders)
app.get('/orders/', api.createOrder)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

// app.js

const express = require('express');
const app = express();
const ordersController = require('./orders'); // Import the orders module

app.use(express.json()); // Ensure JSON body parsing middleware is used

// Route to edit an order
app.put('/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await ordersController.edit(req.params.id, req.body);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete an order
app.delete('/orders/:id', async (req, res) => {
    try {
        await ordersController.destroy(req.params.id);
        res.status(204).send(); // No Content response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Example of other route registrations
// const productsRouter = require('./products');
// app.use('/products', productsRouter);

// Start the server (assuming standard setup)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
