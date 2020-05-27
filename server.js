const express = require('express');
const { animals } = require('./data/animals');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');

// middleware = mounts function to server that requests will pass through
// allow our route endpoint callback function more readable;
// express.urlencoded = takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
// parse incoming string or array data;
// express.json() = takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object;
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// middleware for front-end code
app.use(express.static('public'));

// take our new animal data from req.body and check if each key not only exists, but that it is also the right type of data;
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }


// filteredByQuery will take req.query as an argument and filter through animals,
// returning new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }
    return filteredResults;
}

// takes in ID and array of animals, returning single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  };


  // accepts POST route's req.body value and the array (animalsArray) we want to add data to;
  // this will be executed in app.post() callback function;
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        // write animals.json in directory of file we execute code in
        path.join(__dirname, './data/animals.json'),
        // convert to JSON data, null & 2 format data
        // null = dont want to edit any existing data
        // 2 = create white spce between value to make more readable
        // makes easier to read;
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // returned finished code to post route for response
    return animal;
}

// get() - two arguments, a string describing the route to fetch from, and a callback function that executes
// every time this route is acessed with the GET request;
// send() - (using from RESponse parameter) to send string 'Hello!' to client,
// to send JSON, change send to json();
// call filterByQuery in app.get();
app.get('/api/animals', (req, res) => {
    // accessing query property on the req object
    let result = animals;
    if (req.query) {
        result = filterByQuery(req.query, result);
    }
    res.json(result);
});

// req.params object. param route must come AFTER the other get route
// findById to return a single animal with unique ID
// filterByQuery would filter all matching animals
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
      } else {
        res.send(404);
      }
});

// POST requests are a route to accept data to be used or stored server-side
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    // the length property is always going to be one number ahead of the last 
    // index of the array so we can avoid any duplicate values;
    // This method will only work as long as we don't remove any data from animals.json. 
    // If we do, the id numbers will be thrown off and we'll end up with a duplicate value at some point
    req.body.id = animals.length.toString();
    // if nay data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.')
    } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    // req.body (animal) is where our incoming content will be
    console.log(animal);
    res.json(animal);
    }
});

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