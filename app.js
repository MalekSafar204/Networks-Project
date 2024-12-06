var createError = require('http-errors');
var express = require('express');
var path = require('path');
const { name } = require('ejs');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res) {
//   res.render('index', {title: 'Networks Project', name: 'Malek'});
// });

// app.listen(3000);


const users = [
  { username: 'johnDoe', password: '1234' },
  { username: 'janeSmith', password: 'password' },
];

// Route to render the login page
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists and the password is correct
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.redirect('/home'); // Redirect to home page if login is successful
  } else {
    res.render('index', { error: 'Invalid username or password' });
  }
});

// Route to render the home page
app.get('/home', (req, res) => {
  res.send('<h1>Welcome to the Home Page!</h1>');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
