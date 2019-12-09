const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const UrlController = require('./controllers/UrlController');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = mongoose.connection;

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// Url Encoded and BodyParser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/shorturl/:shortURL', UrlController.REDIRECT_URL);
app.post('/api/shorturl/new', UrlController.GENERATE_URL);

app.get('*', (req, res) =>
	res.json({ success: true, description: 'This is Another Page.', uri: `${req.baseUrl}/api/shorturl/new` })
);
app.listen(port, _ => console.log(`Server's running @ ${port}`));
