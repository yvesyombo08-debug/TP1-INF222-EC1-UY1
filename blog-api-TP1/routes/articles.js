const express = require('express');
const router = express.Router();
const {
  creerArticle,
  lireArticles,
  rechercherArticles,
  lireArticleParId,
  modifierArticle,
  supprimerArticle
} = require('../controllers/articlesController');

// GET /api/articles/search?query=texte  (AVANT /:id pour éviter conflit)
router.get('/search', rechercherArticles);

// GET /api/articles  (avec filtres optionnels: ?categorie=...&auteur=...&date=...)
router.get('/', lireArticles);

// GET /api/articles/:id
router.get('/:id', lireArticleParId);

// POST /api/articles
router.post('/', creerArticle);

// PUT /api/articles/:id
router.put('/:id', modifierArticle);

// DELETE /api/articles/:id
router.delete('/:id', supprimerArticle);

module.exports = router;
