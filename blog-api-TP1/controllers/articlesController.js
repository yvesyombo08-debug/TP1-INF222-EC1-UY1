const { lire, ecrire } = require('../models/database');

// POST /api/articles
const creerArticle = (req, res) => {
  const { titre, contenu, auteur, date, categorie, tags } = req.body;

  if (!titre || titre.trim() === '')
    return res.status(400).json({ erreur: 'Le titre est obligatoire.' });
  if (!contenu || contenu.trim() === '')
    return res.status(400).json({ erreur: 'Le contenu est obligatoire.' });
  if (!auteur || auteur.trim() === '')
    return res.status(400).json({ erreur: "L'auteur est obligatoire." });
  if (!date)
    return res.status(400).json({ erreur: 'La date est obligatoire.' });
  if (!categorie || categorie.trim() === '')
    return res.status(400).json({ erreur: 'La catégorie est obligatoire.' });

  try {
    const db = lire();
    const nouvelArticle = {
      id: db.nextId,
      titre: titre.trim(),
      contenu: contenu.trim(),
      auteur: auteur.trim(),
      date,
      categorie: categorie.trim(),
      tags: tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.articles.push(nouvelArticle);
    db.nextId += 1;
    ecrire(db);
    return res.status(201).json({ message: 'Article créé avec succès.', id: nouvelArticle.id });
  } catch (err) {
    return res.status(500).json({ erreur: 'Erreur serveur.', detail: err.message });
  }
};

// GET /api/articles
const lireArticles = (req, res) => {
  const { categorie, auteur, date } = req.query;
  try {
    const db = lire();
    let articles = db.articles;
    if (categorie) articles = articles.filter(a => a.categorie === categorie);
    if (auteur)    articles = articles.filter(a => a.auteur === auteur);
    if (date)      articles = articles.filter(a => a.date === date);
    articles = articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return res.status(200).json({ articles });
  } catch (err) {
    return res.status(500).json({ erreur: 'Erreur serveur.', detail: err.message });
  }
};

// GET /api/articles/search?query=texte
const rechercherArticles = (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === '')
    return res.status(400).json({ erreur: 'Le paramètre "query" est requis.' });
  try {
    const db = lire();
    const q = query.toLowerCase();
    const articles = db.articles.filter(a =>
      a.titre.toLowerCase().includes(q) || a.contenu.toLowerCase().includes(q)
    );
    return res.status(200).json({ articles });
  } catch (err) {
    return res.status(500).json({ erreur: 'Erreur serveur.', detail: err.message });
  }
};

// GET /api/articles/:id
const lireArticleParId = (req, res) => {
  try {
    const db = lire();
    const article = db.articles.find(a => a.id === parseInt(req.params.id));
    if (!article)
      return res.status(404).json({ erreur: `Article avec l'ID ${req.params.id} introuvable.` });
    return res.status(200).json(article);
  } catch (err) {
    return res.status(500).json({ erreur: 'Erreur serveur.', detail: err.message });
  }
};

// PUT /api/articles/:id
const modifierArticle = (req, res) => {
  const { id } = req.params;
  const { titre, contenu, categorie, tags } = req.body;
  try {
    const db = lire();
    const index = db.articles.findIndex(a => a.id === parseInt(id));
    if (index === -1)
      return res.status(404).json({ erreur: `Article avec l'ID ${id} introuvable.` });

    const article = db.articles[index];
    db.articles[index] = {
      ...article,
      titre:     titre     ? titre.trim()     : article.titre,
      contenu:   contenu   ? contenu.trim()   : article.contenu,
      categorie: categorie ? categorie.trim() : article.categorie,
      tags:      tags !== undefined ? tags    : article.tags,
      updated_at: new Date().toISOString()
    };
    ecrire(db);
    return res.status(200).json({ message: `Article ${id} mis à jour avec succès.` });
  } catch (err) {
    return res.status(500).json({ erreur: 'Erreur serveur.', detail: err.message });
  }
};

// DELETE /api/articles/:id
const supprimerArticle = (req, res) => {
  const { id } = req.params;
  try {
    const db = lire();
    const index = db.articles.findIndex(a => a.id === parseInt(id));
    if (index === -1)
      return res.status(404).json({ erreur: `Article avec l'ID ${id} introuvable.` });
    db.articles.splice(index, 1);
    ecrire(db);
    return res.status(200).json({ message: `Article ${id} supprimé avec succès.` });
  } catch (err) {
    return res.status(500).json({ erreur: 'Erreur serveur.', detail: err.message });
  }
};

module.exports = { creerArticle, lireArticles, rechercherArticles, lireArticleParId, modifierArticle, supprimerArticle };
