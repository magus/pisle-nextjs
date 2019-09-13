// @flow strict

import _cloneDeep from 'lodash/cloneDeep';

import game from '~/constants/game';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

export default function spendGold(
  totalGold: number,
  initBasis: HabitatBasisCollection
) {
  let basis = _cloneDeep(initBasis);
  let finalBasis = _cloneDeep(initBasis);
  let goldLeft = totalGold;

  // let iter = 0;
  while (goldLeft) {
    // iter++;

    const allHabitats = Object.keys(finalBasis);
    const allHabitatsMeta = [];
    let totalGoldPerSecond = 0;
    for (let i = 0; i < allHabitats.length; i++) {
      const habitat = allHabitats[i];
      const meta = habitats.getMetadata(habitat, finalBasis[habitat]);
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

    // move through sorted metas (best to worst) to find first we can afford
    let foundBest;
    for (let i = 0; i < allHabitatsMeta.length; i++) {
      if (allHabitatsMeta[i].cost <= goldLeft) {
        foundBest = allHabitatsMeta[i];
        // console.info('best', i);
        break;
      }
    }

    // out of gold, all habitats exceed gold left, exit while loop
    if (!foundBest) {
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

    // // debug
    // const penguinGain = totalGoldPerSecond * 1.5 - totalGoldPerSecond;
    // const penguinPrice = penguinGain / foundBest.goldPerSecondPerCost;
    // console.info(
    //   'penguin price',
    //   scales.numberToShortString(penguinPrice),
    //   'totalGoldPerSecond',
    //   scales.numberToShortString(totalGoldPerSecond),
    //   'best gps/cost',
    //   foundBest.goldPerSecondPerCost,
    //   'gold left',
    //   scales.numberToShortString(goldLeft)
    // );
  }

  return { original: basis, final: finalBasis };
}
