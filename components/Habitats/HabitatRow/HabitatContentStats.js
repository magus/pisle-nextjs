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

  const gold =
    props.gold !== undefined
      ? props.gold
      : basis && scales.numberToShortString(basis.gold);
  const level =
    props.level !== undefined ? props.level : basis && `${basis.level}`;
  const cost =
    props.cost !== undefined
      ? props.cost
      : basis && scales.numberToShortString(basis.cost);
  const hearts =
    props.hearts !== undefined
      ? props.hearts
      : basis && scales.numberToShortString(basis.hearts);
  const multiplier =
    props.multiplier !== undefined
      ? props.multiplier
      : basis && `${basis.multiplier * 100}%`;

  let goldPerSecond = props.goldPerSecond;
  if (basis && goldPerSecond === undefined) {
    const meta = habitats.getMetadata(habitat, basis);
    goldPerSecond = scales.numberToShortString(meta.goldPerSecond);
  }

  return (
    <>
      <HabitatContentRow>
        <HabitatRate>
          <span>
            <span>{gold}</span>
            {gold === undefined ? null : <span>{` / ${rate}Sec`}</span>}
          </span>
        </HabitatRate>
        <HabitatGoldPerSecond>
          <span>{goldPerSecond}</span>
          {goldPerSecond === undefined ? null : <span>{` / Sec`}</span>}
        </HabitatGoldPerSecond>
      </HabitatContentRow>
      <HabitatContentRow>
        {level === undefined ? null : (
          <HabitatLabeledValue label="LV" value={level} />
        )}
        {cost === undefined ? null : (
          <HabitatLabeledValue label="Cost" value={cost} />
        )}
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
