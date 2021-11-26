const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');

require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhhwf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('travelers');
    const serviceCollection = database.collection('services');
    const bookingCollection = database.collection('booking');
    console.log('Connected to db');
    // GET API
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      //   console.log(services);
      res.json(services);
    });
    //GET API for individual
    app.get('/services/:id', async (req, res) => {
      console.log(req.params.id);
      const id = parseInt(req.params.id);
      const query = { id: id };
      console.log(query);
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });

    // POST services
    app.post('/services', async (req, res) => {
      console.log('Hitting the booking');
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    // booking collection post
    app.post('/bookings', async (req, res) => {
      console.log('Hitting the booking');
      const orders = req.body;
      console.log(orders);
      const result = await bookingCollection.insertOne(orders);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });
    // booking collection get api
    app.get('/bookings', async (req, res) => {
      const query = req.query;
      const cursor = bookingCollection.find(query);
      const bookingUser = await cursor.toArray();
      console.log(bookingUser);
      res.json(bookingUser);
    });

    // Post for booking
    app.post('/bookings/:id', async (req, res) => {
      console.log(req.params.id);
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'Approved',
        },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc);
      console.log(result);
      res.json(result);
    });
    //Delete for booking API
    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      console.log('Hitting Delete', result);
      res.json(result);
    });
    //GET for bookings
    app.get('/bookings', async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.json(bookings);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello Form node');
});
app.listen(port, () => {
  console.log('listening on port ' + port);
});
