const express = require('express');
const { MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bgr9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
       await client.connect();
       const database= client.db('delivery-service');
       const foodCollection = database.collection('services'); 

        
       app.get('/services', async (req, res) => {
        const cursor = foodCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
        });



    }finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running my khana food delivery service server')
})
app.listen(port, () => {
    console.log('listening on port', port);
});


