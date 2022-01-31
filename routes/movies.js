const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
	const movies = await Movie.find().sort("name");
	if (!movies.length) return res.status(404).send("No movies found in the db..");

	return res.send(movies);
});

router.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id);
	if (!movie)
		return res
			.status(400)
			.send(`No movie find with the given id ${req.params.id}`);

	return res.send(movie);
});

router.post("/", auth, async (req, res) => {
	/**
	 * TODO: Handle Duplicacy, status code : 409
	 */
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre)
		return res
			.status(400)
			.send(`Genre with given id ${req.params.genreId} does not exist in db...`);

	const movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate
	});

	// movie = await movie.save(); // There is no need of resetting it because it is being done even before saving.
	await movie.save();
	return res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre)
		return res
			.status(400)
			.send(`Genre with given id ${req.params.genreId} does not exist in db...`);

	let movie = await Movie.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			genre: {
				_id: genre._id,
				name: genre.name
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate
		},
		{
			new: true
		}
	);
	if (!movie)
		return res.status(404).send("The movie with the given ID was not found.");
	return res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
	const movie = await Movie.findByIdAndDelete(req.params.id);
	if (!movie) return res.status(400).send("Movie not found");

	return res.send(`Deleted the Movie with id: ${movie._id}`);
});
module.exports = router;
