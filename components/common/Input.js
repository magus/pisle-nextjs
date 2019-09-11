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

type InputProps = {
  color?: string,
  label?: string,
  onChange: (value: string) => void,
  placeholderType?: $Keys<typeof PlaceholderTypes>,
  placeholder?: String,
  validate: (value: string) => boolean,
  value: string,
};

export default class Input extends React.Component<InputProps> {
  render() {
    const {
      color,
      label,
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
      <label>
        <InputLabel>{label}</InputLabel>
        <StyledInput
          color={color}
          invalid={value && !validate(value)}
          onChange={event => onChange(event.target.value)}
          value={value}
          placeholder={placeholderText}
        />
      </label>
    );
  }
}

const StyledInput = styled.input`
  color: ${props => props.color || 'inherit'};
  width: 100%;
  border: 1px solid
    ${props => (props.invalid ? Styles.Colors.Orange : Styles.Colors.Gray)};
`;

const InputLabel = styled.span`
  margin: 0 ${Styles.Spacing.Small}px 0 0;
`;
