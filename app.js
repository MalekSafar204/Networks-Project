var createError = require("http-errors");
var express = require("express");
var path = require("path");
const { name } = require("ejs");
var { MongoClient } = require("mongodb");

var app = express();



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index", { title: "Networks Project", name: "Malek" });
});

// Route to handle login
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
});

MongoClient.connect("mongodb://localhost:27017/myDB", function (err, client) {
  client.collection("myCollection").insertOne({ name: "malek", age: 24, city: "Egypt" });
});

// Route to render the home page
app.get("/home", (req, res) => {
  res.render("home", { title: "Home Page" });
});

// Start the server
app.listen(3000);
