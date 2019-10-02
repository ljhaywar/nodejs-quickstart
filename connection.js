const {MongoClient} = require('mongodb');

// Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
// See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";

// The Mongo Client you will use to interact with your database
// See https://mongodb.github.io/node-mongodb-native/3.3/api/MongoClient.html for more details
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
        return {error: err};
    } else {
      console.log("Connected successfully to the server");
    } 
  
    // Access the listingsAndReviews collection that is stored in the sample_airbnb DB
    let collection = client.db("sample_airbnb").collection("listingsAndReviews");

    // Make the appropriate DB calls
    try {
        await printFiveListings(collection);
    } catch (e) {
        console.error(`Unable to print listings: ${e}`)
        return {error: e};
    }
  
    // Close the DB connection
    await client.close();
}

/**
 * Print the names of five Airbnb listings
 * @param {Collection} collection The collection to search
 */
async function printFiveListings(collection){
    const results = await collection.find({}).limit(5).toArray();

    console.log("Found Airbnb listings in the database:")
    results.forEach(result => console.log(` - ${result.name}`));
};
