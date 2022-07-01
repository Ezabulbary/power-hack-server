const express = require('express')
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://power-hack:FxQXsSMqgC1b7bO5@cluster0.8nreq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const dataCollection = client.db("power-hack").collection("data");

        console.log('db connected');

        app.get('/data', async (req, res) => {
            const allData = await dataCollection.find().toArray();
            res.send(allData);
        });

        app.get('/dataCount', async (req, res) => {
            const query = {};
            const cursor = dataCollection.find(query);
            const count = await cursor.count();
            res.send({count});
        })

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