const fdk = require('@fnproject/fdk');
const oracledb = require('oracledb');
const dateFormat = require('dateformat');

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
    const insert = await connection.execute("insert into json_demo (data, captured_at) values (:data, to_timestamp(:capturedAt, 'yyyy-mm-dd HH24:mi:ss'))",
      {
        data: JSON.stringify(input),
        capturedAt:  dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
      },
      { autoCommit: true }
    );
    await connection.close();
    return {insert: insert, complete: true};
}, {});