// orders.js
const cuid = require('cuid')

const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product', // ref will automatically fetch associated products for us
    index: true,
    required: true
  }],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

async function list(options = {}) {

    const { offset = 0, limit = 25, productId, status } = options;
  
    const productQuery = productId ? {
      products: productId
    } : {}
  
    const statusQuery = status ? {
      status: status
    } : {}
  
    const query = {
      ...productQuery,
      ...statusQuery
    }
  
    const orders = await Order.find(query)
      .sort({ _id: 1 })
      .skip(offset)
      .limit(limit)
  
    return orders
  }

  async function get (_id) {
    const order = await Order.findById(_id)
    .populate('products')
    .exec()
  
  return order
  }
  async function create (fields) {
    const order = await new Order(fields).save()
    await order.populate('products')
    return order
  }

  // orders.js

const orders = require('./data/orders'); // Assuming orders data source or model import
const { ObjectId } = require('mongodb'); // Use ObjectId if using MongoDB, otherwise adjust accordingly

// Edit an existing order
async function edit(_id, change) {
    try {
        const result = await orders.findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { $set: change },
            { returnDocument: 'after' } // Returns the updated document
        );
        return result.value;
    } catch (error) {
        throw new Error(`Unable to edit order: ${error.message}`);
    }
}

// Destroy an existing order
async function destroy(_id) {
    try {
        await orders.deleteOne({ _id: new ObjectId(_id) });
    } catch (error) {
        throw new Error(`Unable to delete order: ${error.message}`);
    }
}

module.exports = { edit, destroy }; // Export methods

  module.exports = {
    list,
    get,
    create,
  }