const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Return 401 is client is not logged in

// Return 400 if customerId is not provided

// Return 400 if movieId is not provided

// Return 404 if no rental is there for the given customer and movie ID

// Return 400 if rental is already processed.

// Return 200 if it is valid request 

// Set the return date and
// Calculate the rental fee
// Increase the stock 
// Return the rental