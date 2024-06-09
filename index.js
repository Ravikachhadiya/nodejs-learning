const express = require("express");
const fs = require("fs");
var users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;
const USERS_FILE_PATH = "./MOCK_DATA.json";

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
	console.log("Middleware 2 is called");
	fs.appendFile(
		"./log.txt",
		`\n${Date.now()}:${req.ip} ${req.method}: ${req.path}`,
		(err, data) => {
			next();
		}
	);
});

app.use((req, res, next) => {
	console.log("Middleware 3 is called");

	next();
});

// Routes
app.get("/users", (req, res) => {
	const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;

	return res.send(html);
});

app.get("/api/users", (req, res) => {
	// setting custom header.
	// Always put X- as a prefix to follow best practice.
	res.setHeader("X-My-Name", "ravi kachhadiya");
	return res.json(users);
});

app.post("/api/users", (req, res) => {
	const body = req.body;

	if (
		!body ||
		!body.first_name ||
		!body.last_name ||
		!body.email ||
		!body.gender ||
		!body.job_title
	) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	const id = users.length + 1;
	users.push({ id, ...body });

	// updating file
	fs.writeFile(USERS_FILE_PATH, JSON.stringify(users), (err, data) => {
		return res.status(201).json({ status: "success", id });
	});
});

app
	.route("/api/users/:id")
	.get((req, res) => {
		const id = Number(req.params.id);
		const user = users.find((user) => user.id === id);
		if (!user) {
			return res.status(404).json({ message: "record not found!" })
		}

		res.json(user);
	})
	.patch((req, res) => {
		const id = Number(req.params.id);
		const body = req.body;

		if (!users.find((user) => user.id === id))
			return res.status(404).json({ status: "success", id, message: "invalid id" });

		users = users.map((user) => (user.id === id ? { ...user, ...body } : user));

		// updating file
		fs.writeFile(USERS_FILE_PATH, JSON.stringify(users), (err, data) => {
			return res.json({
				status: "success",
				id,
				message: "successfully updated",
			});
		});
	})
	.delete((req, res) => {
		const id = Number(req.params.id);

		if (!users.find((user) => user.id === id))
			return res.status(404).json({ status: "success", id, message: "invalid id" });

		users = users.filter((user) => user.id !== id);

		// updating file
		fs.writeFile(USERS_FILE_PATH, JSON.stringify(users), (err, data) => {
			return res.json({
				status: "success",
				id,
				message: "successfully deleted",
			});
		});
	});

app.listen(PORT, () => console.log("Server started!"));
