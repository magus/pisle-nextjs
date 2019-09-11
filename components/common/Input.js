// @flow strict

import * as React from 'react';
import styled from 'styled-components';

import Styles from '~/constants/styles';

const PlaceholderTypes = {
  numeric: '42',
  cost: '23.81g',
  hearts: '1.00d',
  multiplier: '300%',
};

type Props = {|
  color?: string,
  onChange: (value: string) => void,
  placeholderType?: $Keys<typeof PlaceholderTypes>,
  placeholder?: String,
  validate: (value: string) => boolean,
  value: string,
|};

export default class Input extends React.Component<Props> {
  render() {
    const {
      color,
      validate,
      value,
      onChange,
      placeholder,
      placeholderType,
    } = this.props;

    const placeholderText =
      placeholder ||
      (placeholderType && PlaceholderTypes[placeholderType]) ||
      '';

    return (
      <StyledInput
        color={color}
        invalid={value && !validate(value)}
        onChange={event => onChange(event.target.value)}
        value={value}
        placeholder={placeholderText}
      />
    );
  }
}

export function InlineInput(props: Props) {
  return (
    <InlineInputContainer>
      <Input {...props} />
    </InlineInputContainer>
  );
}

const InlineInputContainer = styled.div`
  width: 75px;
  display: inline-block;
`;

const StyledInput = styled.input`
  color: ${props => props.color || 'inherit'};
  width: inherit;
  border: 1px solid
    ${props => (props.invalid ? Styles.Colors.Orange : Styles.Colors.Gray)};
`;
