const fdk = require('@fnproject/fdk');
const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];
oracledb.autoCommit = true;

fdk.handle( async function(input){

    let connection;
    const result = [];

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.CONNECT_STRING,
        });

        const soda = connection.getSodaDatabase();
        const collectionName = 'soda_collection';
        const collection = await soda.createCollection(collectionName);

        const document = input;
        await collection.insertOne(document);

        const documents = await collection.find().getDocuments();

        documents.forEach(function(element) {
            result.push( {
                id: element.key,
                createdOn: element.createdOn,
                lastModified: element.lastModified,
                document: element.getContent(),
            } );
        });
    }
    catch(err) {
        console.error(err);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch(err) {
                console.error(err);
            }
        }
    }

  return result;
}, {});