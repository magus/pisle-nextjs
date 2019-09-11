// @flow strict

import React from 'react';
import styled from 'styled-components';

import HabitatContentStats from '~/components/Habitats/HabitatRow/HabitatContentStats';

import Styles from '~/constants/styles';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

function HabitatEvolveStats({
  habitat,
  basis,
}: {
  habitat: HabitatTypes,
  basis: HabitatBasis,
}) {
  const meta = habitats.getMetadata(habitat, basis);

  const newGoldValue = basis.gold * basis.multiplier;
  const newGoldPerSecondValue = meta.goldPerSecond * basis.multiplier;

  const newGold = scales.numberToShortString(newGoldValue);
  const oldGold = scales.numberToShortString(basis.gold);
  const goldInc = scales.numberToShortString(newGoldValue - basis.gold);

  return (
    <HabitatContentStats
      habitat={habitat}
      gold={
        <>
          <span>{`${newGold} `}</span>
          <RateMath>{`(${oldGold} + ${goldInc})`}</RateMath>
        </>
      }
      goldPerSecond={
        <>
          <span>{`${scales.numberToShortString(newGoldPerSecondValue)} `}</span>
          <RateMath>{`(${scales.numberToShortString(
            meta.goldPerSecond
          )} + ${scales.numberToShortString(
            newGoldPerSecondValue - meta.goldPerSecond
          )})`}</RateMath>
        </>
      }
      hearts={scales.numberToShortString(basis.hearts)}
      multiplier={`${basis.multiplier * 100}%`}
    />
  );
}

export default HabitatEvolveStats;

const RateMath = styled.span`
  font-size: ${Styles.Fonts.Smaller}px;
  font-weight: ${Styles.Fonts.Weight.Light};
  color: ${Styles.Colors.Orange};
`;
