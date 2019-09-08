// @flow strict

import habitats from '~/constants/habitats';

export const initHabitatBasisCollection: HabitatBasisCollection = {
  [habitats.FishingSpot]: {
    level: 400,
    levelBasis: 374,
    gold: [214.61, 'i'],
    cost: [6.64, 'j'],
    hearts: [1, 'd'],
    multiplier: 10,
  },
  [habitats.FlowerGarden]: {
    level: 367,
    levelBasis: 346,
    gold: [30.55, 'i'],
    cost: [612.2, 'i'],
    hearts: [200, 'c'],
    multiplier: 3,
  },
  [habitats.GravellyField]: {
    level: 329,
    levelBasis: 307,
    gold: [14.66, 'i'],
    cost: [252.87, 'i'],
    hearts: [100, 'c'],
    multiplier: 3,
  },
  [habitats.HotSpring]: {
    level: 274,
    levelBasis: 253,
    gold: [9.41, 'i'],
    cost: [121.96, 'i'],
    hearts: [100, 'c'],
    multiplier: 3,
  },
  [habitats.AntarcticBase]: {
    level: 169,
    levelBasis: 153,
    gold: [6.27, 'i'],
    cost: [121.96, 'i'],
    hearts: [100, 'c'],
    multiplier: 5,
  },
  [habitats.SeagullNest]: {
    level: 90,
    levelBasis: 74,
    gold: [298.64, 'i'],
    cost: [5.61, 'j'],
    hearts: [1, 'd'],
    multiplier: 2,
  },
  [habitats.AmusementPark]: {
    level: 1,
    levelBasis: 1,
    gold: [8.8, 'j'],
    cost: [770.75, 'j'],
    hearts: [1, 'd'],
    multiplier: 2,
  },
};
