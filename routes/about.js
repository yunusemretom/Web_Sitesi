const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('about', {
    page: 'about',
    title: 'Hakkımda — Yunus Emre Tom'
  });
});

module.exports = router;
