# COMP3123 - Lab Exercise 5

Phillip Onofua | Student ID: 101489064

## Section B, Question 6: express.Router()

`express.Router()` creates a modular group of routes and middleware. Instead of putting every route in the main application file, a related set of routes can live in its own module and be exported. This makes the code easier to read, maintain and reuse.

In this exercise, `routes/users.js` creates `routerUser` and defines `/profile`, `/login` and `/logout`. The main application mounts that router with:

```javascript
const userRouter = require('./routes/users');
app.use('/api/v1/user', userRouter);
```

The router's `/profile` route therefore becomes `/api/v1/user/profile`. The prefix is declared once, and the user routes stay separate from the `/home` route.

## Section B, Question 7: Error handling

Express error-handling middleware has four arguments: `(err, req, res, next)`. It is placed after the routes and other middleware. Synchronous route errors are passed to it by Express; callback-based asynchronous errors should be forwarded with `next(error)`.

For example, `res.sendFile()` can fail if `home.html` is missing. Its callback forwards that error to the final handler:

```javascript
app.get('/home', (req, res, next) => {
  res.sendFile(__dirname + '/home.html', (error) => {
    if (error) next(error);
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).send('Server Error');
});
```

The handler returns HTTP 500 with `Server Error`, as required by this exercise. The `headersSent` check avoids trying to send a second response. For a production application, known missing resources could instead return 404, unexpected errors should be logged on the server, and internal details should not be exposed to the client.

The submitted test suite checks the 500 handler by sending malformed JSON to `/api/v1/user/login`. The JSON parser rejects the request and forwards its error to this handler.

