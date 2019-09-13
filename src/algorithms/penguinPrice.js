// @flow strict

import _cloneDeep from 'lodash/cloneDeep';

import game from '~/constants/game';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

export default function penguinPrice(initBasis: HabitatBasisCollection) {
  let basis = _cloneDeep(initBasis);

  const allHabitats = Object.keys(basis);
  const allHabitatsMeta = [];
  let totalGoldPerSecond = 0;
  for (let i = 0; i < allHabitats.length; i++) {
    const habitat = allHabitats[i];
    const meta = habitats.getMetadata(habitat, basis[habitat]);
    allHabitatsMeta.push(meta);
    totalGoldPerSecond += meta.goldPerSecond;
  }

  // sort by meta habitat values
  allHabitatsMeta.sort((a, b) => {
    if (a.goldPerSecondPerCost > b.goldPerSecondPerCost) {
      return -1;
    } else if (b.goldPerSecondPerCost > a.goldPerSecondPerCost) {
      return +1;
    } else {
      return 0;
    }
  });

  const foundBest = allHabitatsMeta[0];

  const penguinPrice =
    (totalGoldPerSecond * 1.5 - totalGoldPerSecond) /
    foundBest.goldPerSecondPerCost;

  // // debug
  // console.info(
  //   'penguin price',
  //   scales.numberToShortString(penguinPrice),
  //   'totalGoldPerSecond',
  //   scales.numberToShortString(totalGoldPerSecond),
  //   'best gps/cost',
  //   foundBest.goldPerSecondPerCost
  // );

  return penguinPrice;
}
