const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const cors = require("cors");

const port = 5000;
const CONNECTION_URL = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "PingPong";

var corsOptions = {
    origin: ["http://localhost:3000","http://localhost"],
    optionsSuccessStatus: 200
};

var app = Express();
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.use(cors(corsOptions)); //enable requests from port 3000 on this computer

var database, playersCollection, gamesCollection;

console.log(`Starting server on port ${port} \n`);
app.listen(port, () => {
    MongoClient.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology:true}
        , (error, client) => {

        if(error){
            throw error;
        }

        database = client.db(DATABASE_NAME);
        playersCollection = database.collection("Players");
        gamesCollection = database.collection("Games");
        console.log("Connected to " + DATABASE_NAME + "\n");
    });
});

app.get("/Players", (request,response) =>{
    var sortFilter = {wins: -1, totalPoints: 1};
    playersCollection.find({}).sort(sortFilter).toArray((error,result) =>{
        if(error){
            return response.status(500).send(error);
        }
        
        return response.send(result);
    });
});

app.post("/Players", (request,response) =>{
    //expects to recieve an array of player docs in body

    console.log(request.body);
    
    playersCollection.insertMany(request.body, (error,result) =>{
        if(error){
            return response.status(500).send(error);
        }
        return response.send(result);
    });
});

app.put("/Players", (request,response) =>{
    //this only updates a SINGLE player
    console.log(request.body);
    
    playersCollection.updateOne({name: request.body.name},
         {$set: {wins:request.body.wins , totalPoints:request.body.totalPoints }},
         (error,result)=>{
        if(error){
            return response.status(500).send(error);
        }
        return response.send(result);
    });
});

app.post("/Games", (request,response) =>{
    console.log("here");
    const gameObject = request.body;
    delete gameObject._id;
    gamesCollection.insertOne(gameObject,(error,result) =>{
        if(error){
            return response.status(500).send(error);
        }
        return response.send(result);
    });

});

app.put("/Games", (request,response) =>{
    console.log(request.body);
    //const options = {upsert: true};
    const query = {_id : new ObjectId(request.body._id)}; //use built-in unique id for game document
    const update = {$set : {
        gameStarted: request.body.gameStarted,
        gameDone: request.body.gameDone,
        player1Name: request.body.player1Name,
        player2Name: request.body.player2Name,
        player1Score: request.body.player1Score,
        player2Score: request.body.player2Score
    }};

    gamesCollection.updateOne(query,update, (error,result) =>{
        if(error){
            return response.status(500).send(error);
        }
        return response.send(result);
    });
});

app.get("/Games", (request,response) =>{
    gamesCollection.find({}).toArray((error,result) =>{
        if(error){
            return response.status(500).send(error);
        }
        
        return response.send(result);
    });
});
