const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.8nreq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const billingCollection = client.db("power-hack").collection("billing");

        console.log('db connected');

        app.get('/billing-list', async (req, res) => {
            const allBill = await billingCollection.find().toArray();
            res.send(allBill);
        });

        app.get('/billing-list-count', async (req, res) => {
            const query = {};
            const cursor = billingCollection.find(query);
            const count = await cursor.count();
            res.send({count});
        });

        app.post('/add-billing', async (req, res) => {
            const newBillingData = req.body;
            const result = await billingCollection.insertOne(newBillingData);
            res.send(result);
        });

        app.put('/update-billing/:id', async (req, res) => {
            const id = req.params.id;
            const billingData = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upset: true };
            const updateDoc = {
                $set: billingData,
            };
            const result = await billingCollection.updateOne(filter, updateDoc, options);
            // const item = await billingCollection.findOne(filter);
            res.send({ result });
        });

        app.delete('/delete-billing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await billingCollection.deleteOne(query);
            res.send(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})