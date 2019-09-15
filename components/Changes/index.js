// @flow strict

export const ChangeTypes = {
  Upgrade: 'Upgrade',
  Evolve: 'Evolve',
  Research: 'Research',
};

type ChangeType = $Keys<typeof ChangeTypes>;

export type Change = {|
  type: ChangeType,
  meta: any,
|};

export type EvolveUpdate = {
  habitat: HabitatTypes,
  multiplier: number,
  hearts: number,
};
