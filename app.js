var express = require("express");
var path = require("path");
var { MongoClient } = require("mongodb");
var app = express();
var session = require("express-session");
const { log } = require("console");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
const destinations = [
  "Inca Trail",
  "Bali",
  "Annapurna Circuit",
  "Paris",
  "Rome",
  "Santorini",
];
var db;

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", async (req, res) => {
  const { username, password } = req.body;
  await db
    .collection("myCollection")
    .findOne({ username: username, password: password })
    .then((user) => {
      if (user) {
        console.log("User found");
        req.session.isLoggedIn = true;
        req.session.username = username;
        return res
          .status(200)
          .json({ success: true, message: "Login successful" });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    });
});

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.post("/registration", async (req, res) => {
  const { username, password } = req.body;
  if (await db.collection("myCollection").findOne({ username: username })) {
    return res
      .status(400)
      .json({ success: false, message: "Username already exists" });
  } else {
    await db
      .collection("myCollection")
      .insertOne({ username, password, wantToGo: [] })
      .then(() => {
        return res.status(201).json({ success: true, message: "User created" });
      });
  }
});

function isLoggedIn(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    next();
  } else {
    if (
      req.headers["accept"] &&
      req.headers["accept"].includes("application/json")
    ) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    } else {
      res.redirect("/");
    }
  }
}

app.get("/home", isLoggedIn, (req, res) => {
  res.render("home");
});

app.get("/index", isLoggedIn, (req, res) => {
  res.render("index");
});

app.post("/searchresults", isLoggedIn, async (req, res) => {
  const { param } = req.body || "malek";
  const results = [];
  destinations.forEach((destination) => {
    if (destination.toLowerCase().includes(param.toLowerCase())) {
      results.push(destination.split(" ")[0].toLowerCase());
    }
  });
  if (results.length === 0) {
    return res.redirect(`/searchresults?message=No+Results+Found&results=[]`);
  } else {
    const resultsQuery = encodeURIComponent(JSON.stringify(results));
    return res.redirect(`/searchresults?message=Results+Found+:&results=${resultsQuery}`);
  }
});

app.get("/searchresults", isLoggedIn, (req, res) => {
  const message = req.query.message || "No message";
  const results = JSON.parse(req.query.results || "[]");
  res.render("searchresults", { message, results });
});

app.get("/wanttogo", isLoggedIn, async (req, res) => {
  try {
    const user = await db
      .collection("myCollection")
      .findOne({ username: req.session.username });
    const list = user.wantToGo;
    if (user) {
      res.render("wanttogo", { wantToGo: list });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching wantToGo array:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.get("/islands", isLoggedIn, (req, res) => {
  res.render("islands");
});

app.get("/cities", isLoggedIn, (req, res) => {
  res.render("cities");
});

app.get("/error", isLoggedIn, (req, res) => {
  res.render("error");
});

app.get("/hiking", isLoggedIn, (req, res) => {
  res.render("hiking");
});

app.get("/inca", isLoggedIn, (req, res) => {
  res.render("inca");
});
app.post("/inca", isLoggedIn, async (req, res) => {
  const { name } = req.body;
  const username = req.session.username;
  const userFile = await db
    .collection("myCollection")
    .findOne({ username: username });
  var oldList = userFile.wantToGo;
  if (oldList.includes(name)) {
    return res.status(401).json({
      success: false,
      message: "Failed to add item to list as item already exists in list.",
    });
  } else {
    await db
      .collection("myCollection")
      .updateOne({ username: username }, { $push: { wantToGo: name } });
    return res
      .status(201)
      .json({ success: true, message: "Destination added successfully." });
  }
});

app.get("/bali", isLoggedIn, (req, res) => {
  res.render("bali");
});

app.post("/bali", isLoggedIn, async (req, res) => {
  const { name } = req.body;
  const username = req.session.username;
  const userFile = await db
    .collection("myCollection")
    .findOne({ username: username });
  var oldList = userFile.wantToGo;
  if (oldList.includes(name)) {
    return res.status(401).json({
      success: false,
      message: "Failed to add item to list as item already exists in list.",
    });
  } else {
    await db
      .collection("myCollection")
      .updateOne({ username: username }, { $push: { wantToGo: name } });
    return res
      .status(201)
      .json({ success: true, message: "Destination added successfully." });
  }
});

app.get("/annapurna", isLoggedIn, (req, res) => {
  res.render("annapurna");
});

app.post("/annapurna", isLoggedIn, async (req, res) => {
  const { name } = req.body;
  const username = req.session.username;
  const userFile = await db
    .collection("myCollection")
    .findOne({ username: username });
  var oldList = userFile.wantToGo;
  if (oldList.includes(name)) {
    return res.status(401).json({
      success: false,
      message: "Failed to add item to list as item already exists in list.",
    });
  } else {
    await db
      .collection("myCollection")
      .updateOne({ username: username }, { $push: { wantToGo: name } });
    return res
      .status(201)
      .json({ success: true, message: "Destination added successfully." });
  }
});

app.get("/paris", isLoggedIn, (req, res) => {
  res.render("paris");
});
app.post("/paris", isLoggedIn, async (req, res) => {
  const { name } = req.body;
  const username = req.session.username;
  const userFile = await db
    .collection("myCollection")
    .findOne({ username: username });
  var oldList = userFile.wantToGo;
  if (oldList.includes(name)) {
    return res.status(401).json({
      success: false,
      message: "Failed to add item to list as item already exists in list.",
    });
  } else {
    await db
      .collection("myCollection")
      .updateOne({ username: username }, { $push: { wantToGo: name } });
    return res
      .status(201)
      .json({ success: true, message: "Destination added successfully." });
  }
});

app.get("/rome", isLoggedIn, (req, res) => {
  res.render("rome");
});
app.post("/rome", isLoggedIn, async (req, res) => {
  const { name } = req.body;
  const username = req.session.username;
  const userFile = await db
    .collection("myCollection")
    .findOne({ username: username });
  var oldList = userFile.wantToGo;
  if (oldList.includes(name)) {
    return res.status(401).json({
      success: false,
      message: "Failed to add item to list as item already exists in list.",
    });
  } else {
    await db
      .collection("myCollection")
      .updateOne({ username: username }, { $push: { wantToGo: name } });
    return res
      .status(201)
      .json({ success: true, message: "Destination added successfully." });
  }
});

app.get("/santorini", isLoggedIn, (req, res) => {
  res.render("santorini");
});
app.post("/santorini", isLoggedIn, async (req, res) => {
  const { name } = req.body;
  const username = req.session.username;
  const userFile = await db
    .collection("myCollection")
    .findOne({ username: username });
  var oldList = userFile.wantToGo;
  if (oldList.includes(name)) {
    return res.status(401).json({
      success: false,
      message: "Failed to add item to list as item already exists in list.",
    });
  } else {
    await db
      .collection("myCollection")
      .updateOne({ username: username }, { $push: { wantToGo: name } });
    return res
      .status(201)
      .json({ success: true, message: "Destination added successfully." });
  }
});

async function connection() {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017");
    db = client.db("myDB");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

connection().then(() => {
  app.listen(3000);
});
