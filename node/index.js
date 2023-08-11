const express = require('express')
const mysql = require('mysql')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const app = express()
const port = 3000
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
}
let connection

async function connect() {
  await sleep(3000);
  connection = mysql.createConnection(config)
  const sqlTable = `CREATE TABLE people (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id)
  )`
  connection.query(sqlTable, (error, results, fields) => {
    if (error) console.log('tabela já existe')
  });
}

app.get('/', (req,res) => {
  if(connection.state === 'disconnected'){
    return res.send(`Aguarde a conexão com o mysql ser estabelecida` )
  }
  const sql = `INSERT INTO people(name) values('Carlos')`
  connection.query(sql)
  connection.query('select * from people', (error, results, fields) => {
    if (error) res.send(`error: ${error}` )
    results = JSON.stringify(results)
    return res.send(`<h1>Full Cycle</h1>-${results}` )
  });
})

async function main() {
  app.listen(port, () => {
    console.log('Rodando na porta ' + port)
  })
  await connect()
}


main()