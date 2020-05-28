// we cannot use app any longer, because it's defined in the server.js file and cannot be accessed here,
// Instead, we'll use Router, which allows you to declare routes in any file as long as you use the proper middleware;
// In every routing block in the code, change app to route;
const router = require('express').Router();
// be careful in constructing relative paths to their locations. Remember that ../ is one level higher, so ../../ is two levels higher;
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');


// call filterByQuery in app.get();
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
      } else {
        res.send(404);
      }
});

// POST requests are a route to accept data to be used or stored server-side
router.post('/animals', (req, res) => {
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

// export the router at the end of the file;
module.exports  = router;