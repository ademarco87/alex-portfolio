const express = require('express');
const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const marked = require('marked');
const exphbs = require('express-handlebars');

const app = express();
const indexRoutes = require('./routes/index');

// ✅ Set up Handlebars with helpers
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b,
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Home route (handled in routes/index.js)
app.use('/', indexRoutes);

// ✅ Individual post route - loads from Markdown
app.get('/post/:slug', (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, 'posts', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Post not found');
  }

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);

  res.render('post', {
    title: data.title,
    date: data.date,
    content: marked(content)
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
