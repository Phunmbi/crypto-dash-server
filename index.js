const express = require("express");
var pg = require("pg");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 8000;
// connect db
const client = new pg.Client(process.env.ELEPHANT_SQL_CONNECTION_STRING);
client.connect((err) => err && console.error("could not connect to postgres on elephantsql", err));

// set up node express app
const app = express();
app.use(express.json());
app.use(cors());

// define routes
app.get("/", (req, res) => {
	res.send("Hello World!, API is available at /api/v1");
});

app.get("/api/v1", (req, res) => {
	res.send("Welcome to the crypto dash APIs");
});

app.post("/api/v1/userinfo", (req, res) => {
	try {
		const { browserType, ip, lat, lon, city, country } = req.body;
		client.query(
			`INSERT INTO user_info(browser_type,ip_address,latitude,longitude,city,country) VALUES ($1,$2, $3, $4,$5, $6)`,
			[browserType, ip, lat, lon, city, country],
			function (err, result) {
				if (err) {
					return console.error("error running query", err);
				}
				return res.status(200).send("success");
			}
		);
	} catch (error) {
		res.status(400).send("request failed");
	}
});

app.get("*", (req, res) => {
	res.send("This route does not exist");
});

app.listen(port, () => {
	console.log(`crypto dash server listening on port ${port}!`);
});
