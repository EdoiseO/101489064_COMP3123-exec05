// Phillip Onofua - 101489064 | COMP3123 Lab Exercise 5
const express = require('express');
const app = express();
const userRouter = require('./routes/users');

app.use(express.json());
app.use('/api/v1/user', userRouter);

app.get('/home', (req, res, next) => {
  res.sendFile(__dirname + '/home.html', (error) => {
    if (error) next(error);
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).send('Server Error');
});

if (require.main === module) {
  const port = process.env.port || 8081;
  app.listen(port, () => {
    console.log('Web Server is listening at port ' + port);
  });
}

module.exports = app;
