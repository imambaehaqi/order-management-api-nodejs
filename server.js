const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'orders' // Ganti dengan nama database Anda
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint untuk mendapatkan semua pemesanan barang
app.get('/orders', (req, res) => {
  connection.query('SELECT * FROM orders', (error, results) => {
    if (error) {
      console.error('Error querying orders from database: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan pemesanan barang berdasarkan ID
app.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  connection.query('SELECT * FROM orders WHERE id = ?', orderId, (error, results) => {
    if (error) {
      console.error('Error querying order from database: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Endpoint untuk menambah pemesanan barang baru
app.post('/orders', (req, res) => {
  const newOrder = req.body;
  connection.query('INSERT INTO orders SET ?', newOrder, (error, results) => {
    if (error) {
      console.error('Error inserting order into database: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    newOrder.id = results.insertId;
    res.status(201).json(newOrder);
  });
});

// Endpoint untuk mengupdate data pemesanan barang
app.put('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const updatedOrder = req.body;
  connection.query('UPDATE orders SET ? WHERE id = ?', [updatedOrder, orderId], (error, results) => {
    if (error) {
      console.error('Error updating order in database: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      res.json(updatedOrder);
    }
  });
});

// Endpoint untuk menghapus pemesanan barang
app.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  connection.query('DELETE FROM orders WHERE id = ?', orderId, (error, results) => {
    if (error) {
      console.error('Error deleting order from database: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      res.sendStatus(204);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});