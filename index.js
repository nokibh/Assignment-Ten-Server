const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
// middle ware
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://assignment-10-fd8f9.web.app'],
  })
);
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
    const saTourismSpotCollection = client
      .db('saTourismDB')
      .collection('places');
    const saTourismCountryCollection = client
      .db('saTourismDB')
      .collection('countries');

    app.get('/allTourCountries', async (req, res) => {
      const cursor = saTourismCountryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/addTouristsSpot', async (req, res) => {
      const newPlace = req.body;
      const result = await saTourismSpotCollection.insertOne(newPlace);
      res.send(result);
    });

    app.get('/allTouristsSpot', async (req, res) => {
      const cursor = saTourismSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/allTouristsSpot/:id', async (req, res) => {
      const Id = req.params.id;
      const query = { _id: new ObjectId(Id) };
      const result = await saTourismSpotCollection.findOne(query);
      res.send(result);
    });

    app.get('/getSpotsByCountry/:country', async (req, res) => {
      const Country = req.params.country;
      const query = { country_Name: Country };
      const result = await saTourismSpotCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/getMine/:email', async (req, res) => {
      const Email = req.params.email;
      const query = { user_email: Email };
      const result = await saTourismSpotCollection.find(query).toArray();
      res.send(result);
    });

    app.patch('/updateSpot/:id', async (req, res) => {
      const Id = req.params.id;
      const query = { _id: new ObjectId(Id) };
      const info = req.body;
      const updateData = {
        $set: {
          image: info.image,
          tourists_spot_name: info.tourists_spot_name,
          country_Name: info.country_Name,
          location: info.location,
          short_description: info.short_description,
          average_cost: info.average_cost,
          seasonality: info.seasonality,
          travel_time: info.travel_time,
          totalVisitorsPerYear: info.totalVisitorsPerYear,
        },
      };
      const result = await saTourismSpotCollection.updateOne(query, updateData);
      res.send(result);
    });

    app.delete('/deleteSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await saTourismSpotCollection.deleteOne(query);
      res.send(result);
    });
    // const addCollection = client.db('touristDB').collection('touristSpot');
    // const spotCollection = client.db('touristDB').collection('SpotsByCountry');
    // const countryCollection = client
    //   .db('touristDB')
    //   .collection('allTourCountries');

    // // Connect the client to the server	(optional starting in v4.7)
    // // await client.connect();
    // app.post('/spots', async (req, res) => {
    //   const addAll = req.body;
    //   console.log(addAll);
    //   const result = await addCollection.insertOne(addAll);
    //   res.send(result);
    // });
    // // country

    // app.get('/allTourCountries', async (req, res) => {
    //   const cursor = countryCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // app.get('/allTouristsSpot', async (req, res) => {
    //   const cursor = countryCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // app.get('/getSpotsByCountry/:country', async (req, res) => {
    //   const Country = req.params.country;
    //   const query = { country_Name: Country };
    //   const result = await spotCollection.find(query).toArray();
    //   res.send(result);
    // });
    // // My list
    // app.get('/mylist/:email', async (req, res) => {
    //   console.log(req.params.email);
    //   const result = await addCollection
    //     .find({ email: req.params.email })
    //     .toArray();
    //   res.send(result);
    // });

    // app.put('/country/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedSpot = req.body;
    //   const spot = {
    //     $set: {
    //       name: updatedSpot.name,
    //       photo: updatedSpot.photo,
    //       country: updatedSpot.country,
    //       location: updatedSpot.location,
    //       visitor: updatedSpot.visitor,
    //       price: updatedSpot.price,
    //       travel: updatedSpot.travel,
    //       session: updatedSpot.session,

    //       description: updatedSpot.description,

    //       spot: updatedSpot.spot,
    //     },
    //   };
    //   const result = await addCollection.updateOne(filter, spot, options);
    //   res.send(result);
    // });
    // // delete oparetion;
    // app.delete('/mylist/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await addCollection.deleteOne(query);
    //   res.send(result);
    // });

    // app.get('/allTouristsSpot/:id', async (req, res) => {
    //   const Id = req.params.id;
    //   const query = { _id: new ObjectId(Id) };
    //   const result = await countryCollection.findOne(query);
    //   res.send(result);
    // });
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
