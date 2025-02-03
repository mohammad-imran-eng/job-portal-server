const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdpul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const run = async()=> {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const jobCollection = client.db("jobPortal").collection("jobs");

        app.get('/jobs',async(req,res)=> {
          const cursor = await jobCollection.find().toArray();
          res.send(cursor)
        })

        app.get('/jobs/:id',async(req,res)=> {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const cursor = await jobCollection.findOne(query);
          res.send(cursor);
        })
      }

    catch(error) {
        console.log(error);
    }
}

run()

app.get('/',(req,res)=> {
    res.send("Server is running");
})

app.listen(port,()=> {
    console.log(`Server running on: ${port}`);
})

