// @flow strict

import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

export default function spendGold(
  totalGold: ShortNotation,
  initBasis: HabitatBasisCollection
) {
  let basis = { ...initBasis };
  let finalBasis = {};
  let goldLeft = scales.toNumber(totalGold);

  // store original levels
  for (let i = 0; i < habitats.All.length; i++) {
    const habitat = habitats.All[i];
    finalBasis[habitat] = {};
    finalBasis[habitat].levelStart = basis[habitat].level;
    finalBasis[habitat].level = basis[habitat].level;
  }

  while (goldLeft) {
    let best = null;

    for (let i = 0; i < habitats.All.length; i++) {
      const habitat = habitats.All[i];
      const meta = habitats.getMetadata(habitat, basis[habitat]);
      if (!best || meta.goldPerSecondPerCost > best.goldPerSecondPerCost) {
        best = meta;
      }
    }

    const foundBest = best;

    if (!foundBest) throw new Error('best not set, unexpected error');

    // best is too expensive, exit while loop
    if (foundBest.cost > goldLeft) break;

    // add best to levels and  decrement goldLeft
    basis[foundBest.habitat].level = basis[foundBest.habitat].level + 1;
    finalBasis[foundBest.habitat].level = basis[foundBest.habitat].level;
    goldLeft = goldLeft - foundBest.cost;
  }

  return finalBasis;
}
