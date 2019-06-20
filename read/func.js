const fdk = require('@fnproject/fdk');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

fdk.handle( async function(input){
    if( !pool ) {
        pool = await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.CONNECT_STRING,
        });
    }
    const connection = await pool.getConnection();
    const records = await connection.execute("select * from json_demo");
    const result = records.rows.map((row) => {
        return {
            id: row.ID,
            capturedAt: row.CAPTURED_AT,
            data: JSON.parse(row.DATA),
        }
    });
    await connection.close();
    return result;
}, {});