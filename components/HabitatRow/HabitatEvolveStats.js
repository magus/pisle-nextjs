// @flow strict

import React from 'react';
import styled from 'styled-components';

import { HabitatContentRow } from '~/components/HabitatRow';

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
  const basisString = scales.numberToShortString(basis.gold);
  const meta = habitats.getMetadata(habitat, basis);

  return (
    <>
      <HabitatContentRow>
        <HabitatRate>{`${basisString} / ${rate}Sec`}</HabitatRate>

        <pre>{JSON.stringify(meta, null, 2)}</pre>
      </HabitatContentRow>
    </>
  );
}

export default HabitatEvolveStats;

const HabitatRate = styled.div`
  font-size: ${Styles.Fonts.Small}px;
  font-weight: ${Styles.Fonts.Weight.Heavy};
  color: ${Styles.Colors.Gold};
`;
