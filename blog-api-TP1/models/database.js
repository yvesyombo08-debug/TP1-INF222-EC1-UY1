const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/blog.json');

// Initialiser le fichier JSON si inexistant
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ articles: [], nextId: 1 }, null, 2));
}

// Lire la base
const lire = () => {
  const contenu = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(contenu);
};

// Écrire dans la base
const ecrire = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

console.log('Base de données JSON prête.');

module.exports = { lire, ecrire };
