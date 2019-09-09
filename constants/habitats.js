// @flow strict

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

export default {
  ...Habitats,
  All,
  Habitats,
  Metadata,
  getMetadata,
};
