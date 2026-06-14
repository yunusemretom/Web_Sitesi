const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/about', require('./routes/about'));
app.use('/projects', require('./routes/projects'));
app.use('/contact', require('./routes/contact'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { page: '404' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
