const conversions = {
  feetToMeters: {
    from: 'pieds',
    to: 'mètres',
    convert: (value) => value * 0.3048,
  },
  metersToFeet: {
    from: 'mètres',
    to: 'pieds',
    convert: (value) => value / 0.3048,
  },
  litersToGallons: {
    from: 'litres',
    to: 'gallons US',
    convert: (value) => value * 0.2641720524,
  },
  gallonsToLiters: {
    from: 'gallons US',
    to: 'litres',
    convert: (value) => value / 0.2641720524,
  },
};

function convertUnit(type, value) {
  const conversion = conversions[type];

  if (!conversion) {
    throw new Error('Type de conversion non pris en charge.');
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('La valeur doit être un nombre valide.');
  }

  return {
    type,
    input: value,
    result: conversion.convert(value),
    from: conversion.from,
    to: conversion.to,
  };
}

module.exports = { conversions, convertUnit };
