const fdk = require('@fnproject/fdk');
const oracledb = require('oracledb');
const dateFormat = require('dateformat');

oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

fdk.handle( async function(input){
  const connection = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.CONNECT_STRING,
  });
  await sleep(5000)
  let slowInsert = await connection.execute("insert into json_demo (data, captured_at) values (:data, to_timestamp(:capturedAt, 'yyyy-mm-dd HH24:mi:ss'))",
      {
          data: JSON.stringify(input),
          capturedAt:  dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
      }
  );
  console.log( slowInsert );
  await connection.commit();
  connection.close();
  return {insert: slowInsert, complete: true};
}, {});

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}