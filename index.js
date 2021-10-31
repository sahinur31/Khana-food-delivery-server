const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

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
       const ordersCollection = client
       .db("delivery-service")
       .collection("orders");
        
       //post api for food menu service insert
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await foodCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // GET API for show data
        app.get('/services', async (req, res) => {
            const cursor = foodCollection.find({}).limit(6);
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Food menu service id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await foodCollection.findOne(query);
            res.json(service);
        })
        // Add Orders API
        app.post('/placeorder', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        // show my orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const product = await cursor.toArray();
            res.send(product);
        });
        // cancel an order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('deleting user with id ', result);
            res.json(result);
          })
        // show my orders
        app.get("/myorders/:email", async (req, res) => {
            const result = await ordersCollection.find({
            email: req.params.email,
            }).toArray();
            res.send(result);
        });
        // cancel an order
        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('deleting user with id ', result);
            res.json(result);
          })
            // dynamic api for update products
            app.get('/orders/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const order = await ordersCollection.findOne(query);
                console.log('load user with id: ', id);
                res.send(order);
            })
            
        // update status
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
            $set: {
                status: updatedOrder.status,
            },
        };
        const result = await ordersCollection.updateOne(filter, updateDoc, options)
        console.log('updating', id)
        res.json(result)
        })

    }finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running my khana food delivery  server')
})
app.listen(port, () => {
    console.log('listening on port', port);
});


