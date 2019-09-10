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

  // sort lowest to highest
  all.sort((a, b) => {
    if (a.goldPerSecondPerHeart > b.goldPerSecondPerHeart) {
      return 1;
    } else if (b.goldPerSecondPerHeart > a.goldPerSecondPerHeart) {
      return -1;
    } else {
      return 0;
    }
  });

  return all;
}
