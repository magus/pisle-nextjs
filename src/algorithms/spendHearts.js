// @flow strict

import habitats from '~/constants/habitats';

export default function spendHearts(basis: HabitatBasisCollection) {
  let best = null;
  const all = [];

  const allHabitats = Object.keys(basis);
  for (let i = 0; i < allHabitats.length; i++) {
    const habitat = allHabitats[i];
    const meta = habitats.getMetadata(habitat, basis[habitat]);
    all.push(meta);
    if (!best || meta.goldPerSecondPerHeart > best.goldPerSecondPerHeart) {
      best = meta;
    }
  }

  // Sort highest to lowest
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description
  all.sort((a, b) => {
    if (a.goldPerSecondPerHeart > b.goldPerSecondPerHeart) {
      return -1;
    } else if (b.goldPerSecondPerHeart > a.goldPerSecondPerHeart) {
      return +1;
    } else {
      return 0;
    }
  });

  return all;
}
