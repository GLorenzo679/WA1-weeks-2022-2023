"use strict";

// imports
const express = require("express");
const morgan = require("morgan");
const { check, validationResult } = require("express-validator");
const cors = require("cors");
const dao = require("./qa-dao");
const userDao = require("./user-dao");

// Passport-related imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

// init
const app = express();
const port = 3001;

// set up middlewares
app.use(express.json());
app.use(morgan("dev"));
const corsOptions = {
	origin: "http://localhost:5173",
	optionsSuccessStatus: 200,
	credentials: true,
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(
	new LocalStrategy(async function verify(username, password, cb) {
		const user = await userDao.getUser(username, password);
		if (!user) return cb(null, false, "Incorrect username or password.");

		return cb(null, user);
	})
);

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (user, cb) {
	// this user is id + email + name
	return cb(null, user);
	// if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(401).json({ error: "Not authorized" });
};

app.use(
	session({
		secret: "shhhhh... it's a secret!",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.authenticate("session"));

/* ROUTES */
// GET /api/questions
app.get("/api/questions", (request, response) => {
	dao.listQuestions()
		.then((questions) => response.json(questions))
		.catch(() => response.status(500).end());
});

// GET /api/questions/<id>
app.get("/api/questions/:id", async (req, res) => {
	try {
		const question = await dao.getQuestion(req.params.id);
		if (question.error) res.status(404).json(question);
		else res.json(question);
	} catch {
		res.status(500).end();
	}
});

// GET /api/questions/<id>/answers
app.get("/api/questions/:id/answers", async (req, res) => {
	try {
		const answers = await dao.listAnswersOf(req.params.id);
		res.json(answers);
	} catch {
		res.status(500).end();
	}
});

// POST /api/questions/<id>/answers
app.post(
	"/api/questions/:id/answers",
	[
		check("text").notEmpty(),
		check("author").notEmpty(),
		check("score").isNumeric(),
		check("date").isDate({ format: "YYYY-MM-DD", strictMode: true }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const newAnswer = req.body;
		const questionId = req.params.id;

		try {
			const id = await dao.addAnswer(newAnswer, questionId);
			res.status(201).location(id).end();
		} catch (e) {
			console.error(`ERROR: ${e.message}`);
			res.status(503).json({ error: "Impossible to create the answer." });
		}
	}
);

// PUT /api/answers/<id>
app.put(
	"/api/answers/:id",
	[
		check("text").notEmpty(),
		check("author").notEmpty(),
		check("score").isNumeric(),
		check("date").isDate({ format: "YYYY-MM-DD", strictMode: true }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const answerToUpdate = req.body;
		const answerId = req.params.id;

		try {
			await dao.updateAnswer(answerToUpdate, answerId);
			res.status(200).end();
		} catch {
			res.status(503).json({
				error: `Impossible to update answer #${answerId}.`,
			});
		}
	}
);

// POST /api/answers/<id>/vote
app.post(
	"/api/answers/:id/vote",
	isLoggedIn,
	[check("vote").notEmpty()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const answerId = req.params.id;
		try {
			const num = await dao.voteAnswer(answerId, req.body.vote);
			if (num === 1) res.status(204).end();
			else
				throw new Error(
					`Error in casting a vote for answer #${answerId}`
				);
		} catch (e) {
			res.status(503).json({ error: e.message });
		}
	}
);

// POST /api/sessions
app.post("/api/sessions", function (req, res, next) {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			// display wrong login messages
			return res.status(401).send(info);
		}
		// success, perform the login
		req.login(user, (err) => {
			if (err) return next(err);

			// req.user contains the authenticated user, we send all the user info back
			return res.status(201).json(req.user);
		});
	})(req, res, next);
});

/* If we aren't interested in sending error messages... */
/*app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  // req.user contains the authenticated user, we send all the user info back
  res.status(201).json(req.user);
});*/

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
	if (req.isAuthenticated()) {
		res.json(req.user);
	} else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
	req.logout(() => {
		res.end();
	});
});

// start the server
app.listen(port, () => "API server started");
