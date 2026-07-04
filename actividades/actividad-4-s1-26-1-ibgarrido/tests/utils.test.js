const { formatHeroCard, getHeroTier } = require('../src/utils');

test('formatHeroCard retorna el formato correcto', () => {
  // Lógica de tu test aquí
  const mockHero = {
    name: 'Batman',
    biography: {
      fullName: 'Bruce Wayne',
      publisher: 'DC Comics',
      alignment: 'good'
    }
    };
    const expected = 'Batman (Bruce Wayne) - Publisher: DC Comics - Alignment: good';
    expect(formatHeroCard(mockHero)).toBe(expected);
});

test('getHeroTier clasifica correctamente', () => {
  // Lógica de tu test aquí
  const statsS = { intelligence: 100, strength: 100, speed: 100 };
  const statsC = { intelligence: 40, strength: 40, speed: 40 };

  expect(getHeroTier(statsS)).toBe('S');
  expect(getHeroTier(statsC)).toBe('C');
});