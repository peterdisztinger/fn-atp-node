const fdk = require('@fnproject/fdk');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

fdk.handle( async function(input){
  const connection = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.CONNECT_STRING,
  });
  const records = await connection.execute("select * from json_demo");
  const result = records.rows.map((row) => {
    return {
      id: row.ID,
      capturedAt: row.CAPTURED_AT,
      data: JSON.parse(row.DATA),
    }
  });
  connection.close();
  return result;
}, {});