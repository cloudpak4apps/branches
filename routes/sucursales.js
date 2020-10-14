const MongoClient = require("mongodb").MongoClient;

let dbServerAddress = process.env.MONGO_SERVER_ADDR;
let dbPort = process.env.MONGO_SERVER_PORT;
let database = process.env.MONGO_DB;
let username = process.env.MONGO_USERNAME;
let passwd = process.env.MONGO_PASSWD;

let connectionString = 'mongodb://' + username + ':' + passwd + '@' + dbServerAddress + ':' + dbPort + '/' + database ;

/**
 * TODO: Fix the console handler to logger handler to enable/disable the log
 *  - ALA
*/
console.log('connectionString --> ' + connectionString);

module.exports = function(app) {
  MongoClient.connect(connectionString, {
    useUnifiedTopology: true
  })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('demo');

    app.get('/branches', (req, res) => {
      db.collection('sucursales').find().toArray()
      .then(results => {
        res.send(results);
      })
      .catch(error => console.error(error));
    });

    /**
     * TODO: Add a range parameter to handle the radius of zip code searching
     * - ALA
    */
    app.get('/branches/find/cp/:cp', (req, res) => {
        let cp = Number(req.params.cp);
        let cpMin = cp - 50;
        let cpMax = cp + 50;

        /**
         * TODO: Fix the console handler to logger handler to enable/disable the log
         * - ALA
        */
        console.log('cp --> ' + cp);
        console.log('cpMin --> ' + cpMin);
        console.log('cpMax --> ' + cpMax);

        //console.log('Query object prepared');

        db.collection('sucursales').find({
          cp: {
            $gte: cpMin,
            $lte: cpMax
          }
        }).toArray()
        .then(results => {
            res.send(results);
          })
        .catch(error => console.error(error));
    });

  })
  .catch(error => console.error(error));
};