// @flow strict

import React from 'react';
import styled from 'styled-components';

import {
  HabitatGoldPerSecond,
  HabitatContentRow,
  HabitatLabeledValue,
} from '~/components/Habitats/HabitatRow';

import Styles from '~/constants/styles';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

function HabitatContentStats({
  habitat,
  basis,
}: {
  habitat: HabitatTypes,
  basis: HabitatBasis,
}) {
  const { rate } = habitats.Metadata[habitat];
  const meta = habitats.getMetadata(habitat, basis);

  const oldGold = scales.numberToShortString(basis.gold);
  const goldPerSecond = scales.numberToShortString(meta.goldPerSecond);

  return (
    <>
      <HabitatContentRow>
        <HabitatRate>
          <span>{`${oldGold} / ${rate}Sec`}</span>
        </HabitatRate>
        <HabitatGoldPerSecond>
          <span>{`${goldPerSecond} / Sec`}</span>
        </HabitatGoldPerSecond>
      </HabitatContentRow>
      <HabitatContentRow>
        <HabitatLabeledValue label="LV" value={`${basis.level}`} />
        <HabitatLabeledValue
          label="Cost"
          value={scales.numberToShortString(basis.cost)}
        />
        <HabitatLabeledValue
          label="❤️"
          value={`${scales.numberToShortString(
            basis.hearts
          )} (${basis.multiplier * 100}%)`}
        />
      </HabitatContentRow>
    </>
  );
}

export default HabitatContentStats;

const HabitatRate = styled.div`
  font-size: ${Styles.Fonts.Small}px;
  font-weight: ${Styles.Fonts.Weight.Heavy};
  color: ${Styles.Colors.Gold};
`;
