const MongoClient = require('mongodb').MongoClient;

// Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
// See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";

// The Mongo Client you will use to interact with your database
// See https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html for more details
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// The MongoDB collection you will use
let collection;

// Connect to the database
client.connect(makeDbCalls);

/**
 * Handle any DB connection errors, make DB calls, and close the DB connection
 * @param {Error} err 
 */
async function makeDbCalls(err){
    // Handle any DB connection errors
    if(err){
        console.error(`An error occurred while connecting to the MongoClient: ${err}`);
        process.exit(1);
    } else {
      console.log("Connected successfully to the server");
    } 
  
    // Access the listingsAndReviews collection that is stored in the sample_airbnb DB
    try{
        collection = client.db("sample_airbnb").collection("listingsAndReviews");
    } catch(e){
        console.error(`An error occurred while connecting to the Airbnb collection: ${err}`);
        process.exit(1);
    }
  
    // Make the appropriate DB calls
    await printFiveListings();
  
    // Close the DB connection
    client.close();
}

/**
 * Print the names of five Airbnb listings
 */
async function printFiveListings(){
    try {
        const results = await collection.find({}).limit(5).toArray();

        console.log("Found Airbnb listings in the database:")
        results.forEach(function(result){
            console.log(` - ${result.name}`);
        });

    } catch (e) {
        console.error(`Unable to print listings: ${e}`)
        return {error: e};
    }
};
