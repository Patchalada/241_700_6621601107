const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8000;

app.use(bodyParser.json());

let users = []

let conn=null

const initMySQL = async () => {
   conn= await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
 
  })
}

app.get('/users',async (req, res) => {
  const results = await conn.query('SELECT * FROM user')
  res.json(results[0])
})

app.post('/users',async (req, res) => {
  let user = req.body;
  const results= await conn.query('INSERT INTO users SET ?', user)
  console.log('results', results)
  res.json({
    message: 'Create user successfully',
    data: results[0]
  })
})

app.get('/users/:id', (req, res) => {
  let id = req.params.id;
 
  let selectedIndex = users.findIndex(user => user.id == id)


  res.json(users[selectedIndex])
})

app.put('/users/:id', (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  let selectedIndex = users.findIndex(user => user.id == id)

  users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
  users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
  users[selectedIndex].age = updateUser.age || users[selectedIndex].age
  users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender
 
  res.json({
    message: 'Update user successfully',
    data: {
        user: updateUser,
        indexUpdate: selectedIndex
    }
  })
})


app.delete('/users/:id', (req, res) => {
  let id = req.params.id;

  let selectedIndex = users.findIndex(user => user.id == id)

  users.splice(selectedIndex, 1)
  res.json({
    message: 'Delete user successfully',
      indexDeleted: selectedIndex
  })
})

app.listen(port,async (req, res) => {
  await initMySQL()
  console.log('http server is running on port' + port)
});