const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




app.get('/', (req, res) => {
    res.send('Fashion server is running')
})

app.listen(port, () => {
    console.log(`Fashion Server is running on port: ${port}`)
})
