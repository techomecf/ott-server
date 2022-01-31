const Joi = require("@hapi/joi");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
	console.log(req, "auth");
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({
		email: req.body.email
	});
	if (!user) return res.status(400).send("Invalid email or password!");

	// Validate the pasword.
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid email or password!");

	const token = await user.generateAuthToken();
	return res.send(token);
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string()
			.required()
			.min(3)
			.email(),
		password: Joi.string()
			.required()
			.min(3)
	});

	return schema.validate(req);
}

module.exports = router;
