// @flow strict

import * as React from 'react';
import styled from 'styled-components';

import {
  HabitatGoldPerSecond,
  HabitatContentRow,
  HabitatLabeledValue,
  HabitatRate,
} from '~/components/Habitats/HabitatRow';

import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

type Props = {
  habitat: HabitatTypes,
  basis?: HabitatBasis,
  gold?: string | React.Node,
  level?: string | React.Node,
  cost?: string | React.Node,
  hearts?: string | React.Node,
  multiplier?: string | React.Node,
  goldPerSecond?: string | React.Node,
};

function HabitatContentStats({ habitat, basis, ...props }: Props) {
  const { rate } = habitats.Metadata[habitat];

  const gold = basis ? scales.numberToShortString(basis.gold) : props.gold;
  const level = basis ? `${basis.level}` : props.level;
  const cost = basis ? scales.numberToShortString(basis.cost) : props.cost;
  const hearts = basis
    ? scales.numberToShortString(basis.hearts)
    : props.hearts;
  const multiplier = basis ? `${basis.multiplier * 100}%` : props.multiplier;

  let goldPerSecond = props.goldPerSecond;
  if (basis) {
    const meta = habitats.getMetadata(habitat, basis);
    goldPerSecond = scales.numberToShortString(meta.goldPerSecond);
  }

  return (
    <>
      <HabitatContentRow>
        <HabitatRate>
          <span>
            <span>{gold}</span>
            <span>{` / ${rate}Sec`}</span>
          </span>
        </HabitatRate>
        <HabitatGoldPerSecond>
          <span>{goldPerSecond}</span>
          <span>{` / Sec`}</span>
        </HabitatGoldPerSecond>
      </HabitatContentRow>
      <HabitatContentRow>
        {!level ? null : <HabitatLabeledValue label="LV" value={level} />}
        {!cost ? null : <HabitatLabeledValue label="Cost" value={cost} />}
        <FlexRow>
          <HabitatLabeledValue label="❤️" value={hearts} />
          <HabitatLabeledValue label="⬆️" value={multiplier} />
        </FlexRow>
      </HabitatContentRow>
    </>
  );
}

export default HabitatContentStats;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

/*
<InlineInput>
<Input
  color={Styles.Colors.Gold}
  label={null}
  onChange={value => console.info('hearts', value)}
  placeholderType="cost"
  validate={value => !!habitats.ValidateField.hearts(value)}
  value={''}
/>
</InlineInput>

const InlineInput = styled.div`
  width: 75px;
  display: inline-block;
`;
*/
