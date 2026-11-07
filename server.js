const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// New bilingual portfolio routes. Legacy routes remain available during migration.
app.use('/', require('./routes/site'));
app.use('/about', require('./routes/about'));
app.use('/projects', require('./routes/projects'));
app.use('/contact', require('./routes/contact'));

app.use((req, res) => {
  res.status(404).send('Page not found');
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
}
module.exports = app;
