const test = require('node:test');
const assert = require('node:assert/strict');
const { convertUnit } = require('../src/conversions');

test('convertit les pieds en mètres', () => {
  assert.equal(convertUnit('feetToMeters', 10).result, 3.048);
});

test('convertit les mètres en pieds', () => {
  assert.ok(Math.abs(convertUnit('metersToFeet', 1).result - 3.280839895) < 1e-9);
});

test('convertit les litres en gallons US', () => {
  assert.ok(Math.abs(convertUnit('litersToGallons', 1).result - 0.2641720524) < 1e-12);
});

test('convertit les gallons US en litres', () => {
  assert.ok(Math.abs(convertUnit('gallonsToLiters', 1).result - 3.785411784) < 1e-8);
});

test('rejette un type inconnu', () => {
  assert.throws(() => convertUnit('unknown', 1), /non pris en charge/);
});
