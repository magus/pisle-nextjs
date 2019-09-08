// @flow strict

import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

export const initHabitatBasisCollection: HabitatBasisCollection = {
  [habitats.FishingSpot]: {
    level: 400,
    levelBasis: 374,
    gold: scales.toNumber([214.61, 'i']),
    cost: scales.toNumber([6.64, 'j']),
    hearts: scales.toNumber([1, 'd']),
    multiplier: 10,
  },
  [habitats.FlowerGarden]: {
    level: 367,
    levelBasis: 346,
    gold: scales.toNumber([30.55, 'i']),
    cost: scales.toNumber([612.2, 'i']),
    hearts: scales.toNumber([200, 'c']),
    multiplier: 3,
  },
  [habitats.GravellyField]: {
    level: 329,
    levelBasis: 307,
    gold: scales.toNumber([14.66, 'i']),
    cost: scales.toNumber([252.87, 'i']),
    hearts: scales.toNumber([100, 'c']),
    multiplier: 3,
  },
  [habitats.HotSpring]: {
    level: 274,
    levelBasis: 253,
    gold: scales.toNumber([9.41, 'i']),
    cost: scales.toNumber([121.96, 'i']),
    hearts: scales.toNumber([100, 'c']),
    multiplier: 3,
  },
  [habitats.AntarcticBase]: {
    level: 169,
    levelBasis: 153,
    gold: scales.toNumber([6.27, 'i']),
    cost: scales.toNumber([121.96, 'i']),
    hearts: scales.toNumber([100, 'c']),
    multiplier: 5,
  },
  [habitats.SeagullNest]: {
    level: 90,
    levelBasis: 74,
    gold: scales.toNumber([298.64, 'i']),
    cost: scales.toNumber([5.61, 'j']),
    hearts: scales.toNumber([1, 'd']),
    multiplier: 2,
  },
  [habitats.AmusementPark]: {
    level: 1,
    levelBasis: 1,
    gold: scales.toNumber([8.8, 'j']),
    cost: scales.toNumber([770.75, 'j']),
    hearts: scales.toNumber([1, 'd']),
    multiplier: 2,
  },
};
