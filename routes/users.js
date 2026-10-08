// Phillip Onofua - 101489064 | COMP3123 Lab Exercise 5
const express = require('express');
const routerUser = express.Router();
const user = require('../user.json');

routerUser.get('/profile', (req, res) => {
  res.json(user);
});

routerUser.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username !== user.username) {
    return res.json({ status: false, message: 'User Name is invalid' });
  }
  if (password !== user.password) {
    return res.json({ status: false, message: 'Password is invalid' });
  }
  res.json({ status: true, message: 'User Is valid' });
});

function logout(req, res) {
  const username = req.params.username || req.query.username;
  if (typeof username !== 'string' || !username.trim()) {
    return res.status(400).send('Username is required');
  }
  const escapedUsername = username.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  res.send('<b>' + escapedUsername + ' successfully logged out.</b>');
}

routerUser.get('/logout', logout);
routerUser.get('/logout/:username', logout);

module.exports = routerUser;
