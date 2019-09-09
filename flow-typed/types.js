// @flow strict

import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

declare type HabitatTypes = $Keys<typeof habitats.Habitats>;
declare type HabitatBasis = {|
  level: number,
  gold: number,
  cost: number,
  hearts: number,
  multiplier: number,
|};
declare type HabitatBasisCollection = {
  [habitat: HabitatTypes]: HabitatBasis,
};

declare type FactorTypes = $Keys<typeof scales.Factors>;
declare type ShortNotation = [number, ?FactorTypes];
