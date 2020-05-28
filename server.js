const express = require('express');
const { animals } = require('./data/animals');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
// require() statements will read the index.js files in each of the directories,
// mechanism works the same way as directory navigation does in a website
// If we navigate to a directory that doesn't have an index.html file, then the contents are displayed in a directory listing;
// if there's an index.html file, then it is read and its HTML is displayed instead,
// with require(), the index.js file will be the default file read if no other file is provided;
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// middleware = mounts function to server that requests will pass through
// allow our route endpoint callback function more readable;
// express.urlencoded = takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
// parse incoming string or array data;
// express.json() = takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object;
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes;
app.use('/api', apiRoutes);
// If / is the endpoint, then the router will serve back our HTML routes
app.use('/', htmlRoutes);
// middleware for front-end code
app.use(express.static('public'));

// get() - two arguments, a string describing the route to fetch from, and a callback function that executes
// every time this route is acessed with the GET request;
// send() - (using from RESponse parameter) to send string 'Hello!' to client,
// to send JSON, change send to json();

// GET sending index.html file to display in browser
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET sending animals.html file to display in browser
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// GET sending zookeepers.html file to display in browser
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  });

// Listens for port number
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// ===================================================================
// ==                           NOTES                               ==
// == 'req.query' is multifaceted, often combining multiple         ==
// == parameters, whereas 'req.param' is specific to a single       ==
// == property, often intended to retrieve a single record;         ==
// == 'fs.writeFileSync()' method, which is the synchronous version ==
// == of 'fs.writeFile()' and doesn't require a callback function;  ==
// ===================================================================