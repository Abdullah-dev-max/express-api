const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',  // Change if your MySQL is on another server
  user: 'root',
  password: '',
  database: 'test'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Sample Route: Fetch All Users
app.get('/client', (req, res) => {
  db.query('SELECT * FROM client', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database query failed');
    } else {
      res.json(results);
    }
  });
});

app.post('/client', (req, res) => {
    const { name, email, password } = req.body;  // Assuming client table has 'name' and 'email' columns
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    const query = 'INSERT INTO client (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Database insertion failed');
      } else {
        res.status(201).json({ message: 'Client added successfully', clientId: result.insertId });
      }
    });
  });
// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
