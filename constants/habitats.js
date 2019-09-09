// @flow strict

import scales from '~/constants/scales';

const Habitats = {
  FishingSpot: 'FishingSpot',
  FlowerGarden: 'FlowerGarden',
  GravellyField: 'GravellyField',
  HotSpring: 'HotSpring',
  AntarcticBase: 'AntarcticBase',
  SeagullNest: 'SeagullNest',
  AmusementPark: 'AmusementPark',
};

const All: HabitatTypes[] = Object.keys(Habitats);

// metadata about habitat required
// {
//   level: 0,      // level of habitat
//   gold: 0,       // gold earned per rate
//   cost: 0,       // gold cost to upgrade
//   hearts: 0,     // hearts to evolve
//   multiplier: 0, // evolution multipler
// }

function getMetadata(habitat: HabitatTypes, basis: HabitatBasis) {
  const habitatMeta = Metadata[habitat];
  const { cost, gold, hearts } = basis;

  const goldPerSecond = gold / habitatMeta.rate;
  const goldPerSecondPerCost = goldPerSecond / cost;
  const goldPerSecondPerHeart = (goldPerSecond * basis.multiplier) / hearts;

  return {
    habitat,
    cost,
    goldPerSecond,
    goldPerSecondPerCost,
    goldPerSecondPerHeart,
  };
}

// name    in-game string identifying this habitat
// rate    rate in seconds per gold tick
const Metadata = {
  [Habitats.FishingSpot]: {
    name: 'Fishing Spot',
    rate: 3,
  },
  [Habitats.FlowerGarden]: {
    name: 'Flower Garden',
    rate: 5,
  },
  [Habitats.GravellyField]: {
    name: 'Gravelly Field',
    rate: 5,
  },
  [Habitats.HotSpring]: {
    name: 'Hot Spring',
    rate: 7,
  },
  [Habitats.AntarcticBase]: {
    name: 'Antarctic Base',
    rate: 7,
  },
  [Habitats.SeagullNest]: {
    name: 'Seagull Nest',
    rate: 10,
  },
  [Habitats.AmusementPark]: {
    name: 'Amusement Park',
    rate: 10,
  },
};

const ShortNotationRegex = /^(\d+(\.\d+)?)\s*([a-z]{1})?$/;

function validateShort(shortString: string): ?number {
  if (typeof shortString !== 'string') return null;

  const match = shortString.match(ShortNotationRegex);
  if (!match) return null;

  const value = parseFloat(match[1]);

  if (isNaN(value)) return null;

  const scale = match[3];

  if (!scale) return scales.toNumber([value, undefined]);

  return scales.toNumber([value, scale]);
}

const MultiplierRegex = /^(\d+)\s*%?$/;

function validateMultiplier(multiplier: string): ?number {
  if (typeof multiplier !== 'string') return null;

  const match = multiplier.match(MultiplierRegex);
  if (!match) return null;

  const value = parseFloat(match[1]);

  if (isNaN(value) || value < 100) return null;

  return value / 100;
}

const LevelRegex = /^[0-9]+$/;

function validateLevel(level: string): ?number {
  if (typeof level !== 'string') return null;

  const match = level.match(LevelRegex);
  if (!match) return null;

  const value = parseInt(match[0], 10);

  if (isNaN(value) || value < 1) return null;

  return value;
}

const ValidateField = {
  level: validateLevel,
  gold: validateShort,
  cost: validateShort,
  hearts: validateShort,
  multiplier: validateMultiplier,
};

export default {
  ...Habitats,
  All,
  ValidateField,
  Habitats,
  Metadata,
  getMetadata,
};
