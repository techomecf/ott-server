const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const genres = await Genre.find().sort("name");
	if (!genres.length)
		return res.status(404).send("There are no genres in the DB!");
	res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
	const genre = await Genre.findById({
		_id: req.params.id
	});
	if (!genre)
		return res
			.status(404)
			.send(`Genre with given id ${req.params.id} is not found!`);

	res.send(genre);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let genre = await Genre.findOne({
		name: req.body.name
	});

	if (genre)
		return res
			.status(409)
			.send(`The genre '${req.body.name}' already exits in the db!`);

	genre = new Genre({
		name: req.body.name
	});

	await genre.save();
	res.send(genre);
});

router.put("/:id", [validateObjectId, auth], async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name
		},
		{
			new: true
		}
	);

	if (!genre) return res.status(404).send("Genre not found with the given id!");
	return res.send(genre);
});

// delete

router.delete("/:id", [validate, auth, admin], async (req, res) => {
	let genre = await Genre.findById(req.params.id);

	if (!genre) return res.status(404).send("Genre not found with the given id");

	genre = await genre.delete();

	res.send(genre);
});

module.exports = router;
