const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    page: 'home',
    title: 'Yunus Emre Tom — Full Stack Developer'
  });
});

module.exports = router;
