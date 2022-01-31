const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
	const rentals = await Rental.find().sort("-dateOut");
	if (!rentals.length) return res.status(404).send(`No movie to rent found!`);

	return res.send(rentals);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) return res.status(400).send(`Invalid Customer`);

	const movie = await Movie.findById(req.body.movieId);
	if (!movie) return res.status(400).send("Invalid Movie id..");

	let rental = await Rental.find({
		customer: {
			_id: req.body.customerId
		},
		movie: {
			_id: req.body.movieId
		}
	});

	if (rental)
		return res
			.status(400)
			.send(`The movie is already rented by the user '${customer.name}'...`);

	if (movie.numberInStock === 0)
		return res
			.status(400)
			.send(`Movie with given Id ${req.body.movieId} is not in stock!`);

	rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate
		}
	});

	try {
		new Fawn.Task()
			// one ore more operation, all these operations together will be treated as a unit.
			.save("rentals", rental) // name of the collection first, then the object of the what we are using.
			.update(
				"movies",
				{
					_id: movie._id
				},
				{
					$inc: {
						numberInStock: -1
					}
				}
			)
			.run();
	} catch (ex) {
		return res.status(500).send("Something went wrong during transaction...");
	}

	res.send(rental);
});

module.exports = router;
