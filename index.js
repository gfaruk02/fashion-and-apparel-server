

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjs4f1h.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product')
    const brandCollection = client.db('productDB').collection('brand')
    const cardCollection = client.db('productDB').collection('card')

    //database theke data server a niye asha get kore
    app.get('/brand', async(req, res)=>{
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })
    app.get('/product', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })
  //get for specific items
    app.get('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result)
  })
    //update 
    app.put('/product/:id',async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedproduct = req.body;
      const product = {
        $set: {
          name: updatedproduct.name, 
          brand: updatedproduct.brand, 
          type: updatedproduct.type, 
          price: updatedproduct.price,
          category: updatedproduct.category,
          description: updatedproduct.description,
          rating: updatedproduct.rating,
          photo: updatedproduct.photo,
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    })

    app.post('/product', async(req, res)=>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })
    app.get('/myCard', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const result = await cardCollection.find(query).toArray();
      res.send(result);
  })

    app.post('/card', async(req, res)=>{
        const newCard = req.body;
        console.log(newCard);
        const result = await cardCollection.insertOne(newCard);
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Fashion server is running')
})

app.listen(port, () => {
    console.log(`Fashion Server is running on port: ${port}`)
})