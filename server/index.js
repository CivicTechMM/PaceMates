///////////////////////////////
// Imports
///////////////////////////////

require('dotenv').config();
const path = require('path');
const express = require('express');

// middleware imports
const handleCookieSessions = require('./middleware/handleCookieSessions');
const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');

// controller imports
const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');
const eventControllers = require('./controllers/eventControllers')
const eventParticipantsControllers = require('./controllers/eventParticipantsControllers')
const quoteControllers = require('./controllers/quotesControllers')
const app = express();

// middleware
app.use(handleCookieSessions); // adds a session property to each request representing the cookie
app.use(logRoutes); // print information about each incoming request
app.use(express.json()); // parse incoming request bodies as JSON
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Serve static assets from the dist folder of the frontend



///////////////////////////////
// Auth Routes
///////////////////////////////

app.get('/api/me', authControllers.showMe);
app.post('/api/login', authControllers.loginUser);
app.delete('/api/logout', authControllers.logoutUser);



///////////////////////////////
// Routes
///////////////////////////////

app.post('/api/users', userControllers.createUser);
app.get('/api/users', checkAuthentication, userControllers.listUsers);
app.get('/api/users/:id', checkAuthentication, userControllers.showUser);
app.patch('/api/users/:id', checkAuthentication, userControllers.updateUser);

app.get('/api/events', eventControllers.filterEvents);
app.get('/api/events', eventControllers.listEvents);
app.get('/api/events/:id', eventControllers.listEvent);
app.post('/api/events', checkAuthentication, eventControllers.createEvent);
app.patch('/api/events/:id', checkAuthentication, eventControllers.updateEvent);
app.delete('/api/events/:id', checkAuthentication, eventControllers.deleteEvent);

app.get('/api/events/:id/participants', eventParticipantsControllers.listParticipants);
app.post('/api/events/:id/participants', checkAuthentication, eventParticipantsControllers.signUpForEvent);
app.delete('/api/events/:id/participants', checkAuthentication, eventParticipantsControllers.deleteParticipant);


app.get('/api/quotes', quoteControllers.giveQuote)


///////////////////////////////
// Fallback Route
///////////////////////////////

// Requests meant for the API will be sent along to the router.
// For all other requests, send back the index.html file in the dist folder.
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});



///////////////////////////////
// Start Listening
///////////////////////////////

const port = process.env.PORT || 3000;
// console.log("Google Maps API Key:", process.env.GOOGLE_MAPS_API_KEY);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
