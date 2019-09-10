// @flow strict

import React from 'react';
import styled from 'styled-components';

import {
  HabitatContentRow,
  HabitatRate,
  HabitatGoldPerSecond,
} from '~/components/Habitats/HabitatRow';

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
  const { rate } = habitats.Metadata[habitat];
  const meta = habitats.getMetadata(habitat, basis);

  const newGoldValue = basis.gold * basis.multiplier;
  const newGoldPerSecondValue = meta.goldPerSecond * basis.multiplier;

  const newGold = scales.numberToShortString(newGoldValue);
  const oldGold = scales.numberToShortString(basis.gold);
  const goldInc = scales.numberToShortString(newGoldValue - basis.gold);

  return (
    <>
      <HabitatContentRow>
        <HabitatRate>
          <span>{`${newGold} `}</span>
          <RateMath>{`(${oldGold} + ${goldInc})`}</RateMath>
          <span>{` / ${rate}Sec`}</span>
        </HabitatRate>
        <HabitatGoldPerSecond>
          <span>{`${scales.numberToShortString(newGoldPerSecondValue)} `}</span>
          <RateMath>{`(${scales.numberToShortString(
            meta.goldPerSecond
          )} + ${scales.numberToShortString(
            newGoldPerSecondValue - meta.goldPerSecond
          )})`}</RateMath>
          <span>{` / Sec`}</span>
        </HabitatGoldPerSecond>
      </HabitatContentRow>
    </>
  );
}

export default HabitatEvolveStats;

const RateMath = styled.span`
  font-size: ${Styles.Fonts.Smaller}px;
  font-weight: ${Styles.Fonts.Weight.Light};
  color: ${Styles.Colors.Orange};
`;
