// @flow strict

import _cloneDeep from 'lodash/cloneDeep';

import game from '~/constants/game';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

export default function spendGold(
  totalGold: ShortNotation,
  initBasis: HabitatBasisCollection
) {
  let basis = _cloneDeep(initBasis);
  let finalBasis = _cloneDeep(initBasis);
  let goldLeft = scales.toNumber(totalGold);

  // let iter = 0;
  while (goldLeft) {
    // iter++;
    let best = null;

    for (let i = 0; i < habitats.All.length; i++) {
      const habitat = habitats.All[i];
      const meta = habitats.getMetadata(habitat, finalBasis[habitat]);
      if (!best || meta.goldPerSecondPerCost > best.goldPerSecondPerCost) {
        best = meta;
      }
    }

    const foundBest = best;

    if (!foundBest) throw new Error('best not set, unexpected error');

    // best is too expensive, exit while loop
    if (foundBest.cost > goldLeft) {
      // console.info(
      //   'too expensive, exiting spend gold',
      //   foundBest,
      //   scales.numberToShortString(foundBest.cost)
      // );
      break;
    }

    // decrement goldLeft and update finalBasis levels, costs, etc.
    goldLeft = goldLeft - foundBest.cost;
    // console.info(iter, 'goldLeft', scales.numberToShortString(goldLeft));
    finalBasis[foundBest.habitat].level =
      finalBasis[foundBest.habitat].level + 1;
    finalBasis[foundBest.habitat].cost =
      finalBasis[foundBest.habitat].cost * game.CostIncreaseFactor;
    finalBasis[foundBest.habitat].gold =
      finalBasis[foundBest.habitat].gold * game.GoldIncreaseFactor;
  }

  return { original: basis, final: finalBasis };
}
