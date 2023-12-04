let express = require('express');
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017";
let port = process.env.port || 3000;
let collection;

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function runDBConnection() {
    try {
        await client.connect();
        collection = client.db().collection('Car');
        console.log(collection);
    } catch(ex) {
        console.error(ex);
    }
}

app.get('/', function (req,res) {
    res.render('indexMongo.html');
});

app.get('/api/cars', (req,res) => {
    getAllCars((err,result)=>{
        if (!err) {
            res.json({statusCode:200, data:result, message:'get all cars successful'});
        }
    });
});

app.post('/api/car', (req,res)=>{
    let car = req.body;
    postCar(car, (err, result) => {
        if (!err) {
            res.json({statusCode:201, data:result, message:'success'});
        }
    });
});

function postCar(car,callback) {
    collection.insertOne(car,callback);
}

function getAllCars(callback){
    collection.find({}).toArray(callback);
}

app.listen(port, ()=>{
    console.log('express server started');
    runDBConnection();
});