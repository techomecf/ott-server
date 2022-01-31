const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
	console.log(req);
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({
		email: req.body.email
	});
	if (user) return res.status(400).send("User is already registered!");

	user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	const token = await user.generateAuthToken();

	res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
