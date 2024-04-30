const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0w7vnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const addCollection = client.db('touristDB').collection('touristSpot');
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    app.post('/spots', async (req, res) => {
      const addAll = req.body;
      console.log(addAll);
      const result = await addCollection.insertOne(addAll);
      res.send(result);
    });
    // country
    app.get('/country', async (req, res) => {
      const cursor = addCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // My list
    app.get('/mylist/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await addCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    delete oparetion;
    app.delete('/mylist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/country/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCollection.findOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Assignment server has been running');
});
app.listen(port, () => {
  console.log(`Assignment server port is running ${port}`);
});
