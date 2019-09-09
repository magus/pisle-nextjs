// @flow strict

import React from 'react';
import styled from 'styled-components';

import { HabitatContentRow } from '~/components/HabitatRow';

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
  const basisString = scales.numberToShortString(basis.gold);

  return (
    <>
      <HabitatContentRow>
        <HabitatRate>{`${basisString} / ${rate}Sec`}</HabitatRate>
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
