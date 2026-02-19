/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

let document;

beforeAll(() => {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
  document = new DOMParser().parseFromString(html, 'text/html');
});

function getLocationCards() {
  const cards = document.querySelectorAll('section .flex.flex-col.md\\:flex-row .group');
  return {
    zapopan: cards[0],
    guadalajara: cards[1],
  };
}

describe('Location cards structure and styling', () => {
  test('Zapopan and Guadalajara cards are rendered with the correct structure', () => {
    const { zapopan, guadalajara } = getLocationCards();

    // Both cards exist
    expect(zapopan).not.toBeNull();
    expect(guadalajara).not.toBeNull();

    // Both cards have the shared structural classes
    const expectedClasses = [
      'relative', 'w-full', 'shrink-0', 'rounded-2xl',
      'shadow-xl', 'overflow-hidden', 'group',
    ];
    for (const cls of expectedClasses) {
      expect(zapopan.classList.contains(cls)).toBe(true);
      expect(guadalajara.classList.contains(cls)).toBe(true);
    }

    // Each card contains an <img> and an overlay <div>
    expect(zapopan.querySelector('img')).not.toBeNull();
    expect(zapopan.querySelectorAll('div').length).toBeGreaterThanOrEqual(1);
    expect(guadalajara.querySelector('img')).not.toBeNull();
    expect(guadalajara.querySelectorAll('div').length).toBeGreaterThanOrEqual(1);

    // Zapopan card has correct heading text
    expect(zapopan.querySelector('h3').textContent.trim()).toBe('Zapopan');
    // Guadalajara card has correct heading text
    expect(guadalajara.querySelector('h3').textContent.trim()).toBe('Guadalajara');
  });
});

describe('Image hover transition', () => {
  test('images apply group-hover:scale-105 transition on hover', () => {
    const { zapopan, guadalajara } = getLocationCards();

    const zapopanImg = zapopan.querySelector('img');
    const guadalajaraImg = guadalajara.querySelector('img');

    // Both images carry the hover-scale utility
    expect(zapopanImg.classList.contains('group-hover:scale-105')).toBe(true);
    expect(guadalajaraImg.classList.contains('group-hover:scale-105')).toBe(true);

    // Both images have supporting transition classes
    expect(zapopanImg.classList.contains('transition-transform')).toBe(true);
    expect(guadalajaraImg.classList.contains('transition-transform')).toBe(true);
    expect(zapopanImg.classList.contains('duration-700')).toBe(true);
    expect(guadalajaraImg.classList.contains('duration-700')).toBe(true);
  });
});

describe('Background overlay with backdrop-blur and bg-black/20', () => {
  test('overlay div has backdrop-blur-sm and bg-black/20 classes', () => {
    const { zapopan, guadalajara } = getLocationCards();

    const zapopanOverlay = zapopan.querySelector('div');
    const guadalajaraOverlay = guadalajara.querySelector('div');

    expect(zapopanOverlay.classList.contains('backdrop-blur-sm')).toBe(true);
    expect(zapopanOverlay.classList.contains('bg-black/20')).toBe(true);

    expect(guadalajaraOverlay.classList.contains('backdrop-blur-sm')).toBe(true);
    expect(guadalajaraOverlay.classList.contains('bg-black/20')).toBe(true);

    // Overlay is positioned at the bottom
    expect(zapopanOverlay.classList.contains('absolute')).toBe(true);
    expect(zapopanOverlay.classList.contains('bottom-0')).toBe(true);
    expect(guadalajaraOverlay.classList.contains('absolute')).toBe(true);
    expect(guadalajaraOverlay.classList.contains('bottom-0')).toBe(true);
  });
});

describe('Text styling on location cards', () => {
  test('headings have text-white, drop-shadow-md, and responsive md:text-6xl', () => {
    const { zapopan, guadalajara } = getLocationCards();

    const zapopanH3 = zapopan.querySelector('h3');
    const guadalajaraH3 = guadalajara.querySelector('h3');

    for (const h3 of [zapopanH3, guadalajaraH3]) {
      expect(h3.classList.contains('text-white')).toBe(true);
      expect(h3.classList.contains('drop-shadow-md')).toBe(true);
      expect(h3.classList.contains('md:text-6xl')).toBe(true);
    }
  });

  test('paragraphs have responsive md:text-xl and drop-shadow-sm', () => {
    const { zapopan, guadalajara } = getLocationCards();

    const zapopanP = zapopan.querySelector('p');
    const guadalajaraP = guadalajara.querySelector('p');

    for (const p of [zapopanP, guadalajaraP]) {
      expect(p.classList.contains('md:text-xl')).toBe(true);
      expect(p.classList.contains('drop-shadow-sm')).toBe(true);
    }
  });
});

describe('Responsive height and flex-behavior at medium breakpoints', () => {
  test('cards have md:h-125 and md:flex-1 classes', () => {
    const { zapopan, guadalajara } = getLocationCards();

    for (const card of [zapopan, guadalajara]) {
      expect(card.classList.contains('md:h-125')).toBe(true);
      expect(card.classList.contains('md:flex-1')).toBe(true);
    }
  });

  test('cards have base height h-100 for mobile', () => {
    const { zapopan, guadalajara } = getLocationCards();

    for (const card of [zapopan, guadalajara]) {
      expect(card.classList.contains('h-100')).toBe(true);
    }
  });
});
