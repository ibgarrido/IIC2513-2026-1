/* https://stackoverflow.com/questions/3598042/how-can-i-replace-a-regex-substring-match-in-javascript */

const fs = require('fs');

async function updateReadme() {
  const randomId = Math.floor(Math.random() * 731) + 1; // La API tiene 731 héroes, IDs del 1 al 731 (https://akabab.github.io/superhero-api/api/glossary.html)
  /*llamamos a la API */
  const res = await fetch('https://akabab.github.io/superhero-api/api/all.json');
  
  if (!res.ok) throw new Error('Error al obtener los superhéroes');
  
  const heroes = await res.json();
  const hero = heroes[Math.floor(Math.random() * heroes.length)];

  let readme = fs.readFileSync('README.md', 'utf-8');
 /*Actualización de la versión */
  readme = readme.replace(/Versión actual: v(\d+)\.(\d+)\.(\d+)/, (match, major, minor, patch) => {
    return `Versión actual: v${major}.${minor}.${parseInt(patch) + 1}`;
  });

  const { intelligence, strength, speed, durability, power, combat } = hero.powerstats;
  const updatedVersionTag = readme.match(/Versión actual: v\d+\.\d+\.\d+/)[0]; //

  /* Construcción de la sección del héroe */
  const heroSection = `## 🦸 Superhéroe del día\n\n` +
    `${updatedVersionTag}\n\n` +
    `<img src="${hero.images.md}" alt="${hero.name}" width="300">\n\n` +
    `**${hero.name} (${hero.biography.fullName || 'N/A'})** — ID: ${hero.id}\n` +
    `Publisher: ${hero.biography.publisher}\n` +
    `Alignment: ${hero.biography.alignment}\n\n` +
    `Intelligence: ${intelligence} | Strength: ${strength} | Speed: ${speed} | ` +
    `Durability: ${durability} | Power: ${power} | Combat: ${combat}\n`;

  const regexSection = /## 🦸 Superhéroe del día[\s\S]*/; /* Patrón para encontrar la sección del héroe */

  if (readme.match(regexSection)) {
    readme = readme.replace(regexSection, heroSection);
  } else {
    readme += `\n\n${heroSection}`;
  }

  fs.writeFileSync('README.md', readme);
}

updateReadme();