function formatHeroCard(hero) {
  const name = hero.name;
  const fullName = hero.biography.fullName || "Desconocido";
  const publisher = hero.biography.publisher || "Desconocido";
  const alignment = hero.biography.alignment || "Desconocido";
  return `${name} (${fullName}) - Publisher: ${publisher} - Alignment: ${alignment}`;
}

function getHeroTier(powerstats) {
  const values = Object.values(powerstats);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;

  if (average > 85) return "S";
  if (average > 70) return "A";
  if (average > 50) return "B";
  if (average > 30) return "C";
  return "D";
}

module.exports = { formatHeroCard, getHeroTier };
