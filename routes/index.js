const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// Home page
router.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Blog list (reads all markdown files)
router.get('/blog', (req, res) => {
  const postsDir = path.join(__dirname, '../posts');
  const files = fs.readdirSync(postsDir);

  const posts = files
    .filter(file => file.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        title: data.title || 'Untitled',
        slug: filename.replace('.md', ''),
        date: data.date || '',
        excerpt: data.excerpt || ''
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render('blog', { posts, title: 'Blog' });
});

// Individual post page
router.get('/post/:slug', (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, `../posts/${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Post not found');
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = marked(content);

  res.render('post', {
    title: data.title,
    date: data.date,
    content: htmlContent
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// Projects page
router.get('/projects', (req, res) => {
  res.render('projects', { title: 'Projects' });
});

// Now page
router.get('/now', (req, res) => {
  res.render('now', { title: 'Now' });
});

module.exports = router;
