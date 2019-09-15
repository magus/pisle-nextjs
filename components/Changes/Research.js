// @flow strict

import * as React from 'react';

import type { Props as ChangeProps } from '~/components/Changes/UncommittedChange';

import HabitatRow from '~/components/Habitats/HabitatRow';
import HabitatContentStats from '~/components/Habitats/HabitatRow/HabitatContentStats';
import { InlineInput } from '~/components/common/Input';
import { Instructions } from '~/components/common/Styled';

import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

type State = {
  gold: string,
  cost: string,
};

export default class Research extends React.Component<ChangeProps, State> {
  state = {
    gold: '',
    cost: '',
  };

  _getInputs() {
    const gold = habitats.ValidateField.gold(this.state.gold);
    const cost = habitats.ValidateField.cost(this.state.cost);
    return {
      valid: !!(gold && cost),
      gold,
      cost,
    };
  }

  render() {
    const { valid, gold, cost } = this._getInputs();

    const onClick =
      valid && gold && cost
        ? this.props.onDone({
            gold,
            cost,
          })
        : () => {};

    return (
      <>
        {this._renderInstructions()}
        {this._renderInputs()}
        <button disabled={!valid} onClick={onClick}>
          Done
        </button>
        {this._renderCancel()}
      </>
    );
  }

  _renderCancel() {
    return <button onClick={this.props.onCancel}>Cancel</button>;
  }

  _renderInputs() {
    const { gold, cost } = this.state;
    const habitat = habitats.FishingSpot;
    const basis = this.props.change.meta[habitat];

    return (
      <>
        <HabitatRow habitat={habitat}>
          <HabitatContentStats
            habitat={habitat}
            gold={
              <InlineInput
                onChange={gold => this.setState({ gold })}
                placeholderType="cost"
                validate={value => !!habitats.ValidateField.gold(value)}
                value={gold}
              />
            }
            level={basis.level}
            cost={
              <InlineInput
                onChange={cost => this.setState({ cost })}
                placeholderType="cost"
                validate={value => !!habitats.ValidateField.cost(value)}
                value={cost}
              />
            }
            hearts={scales.numberToShortString(basis.hearts)}
            multiplier={`${basis.multiplier * 100}%`}
          />
        </HabitatRow>
      </>
    );
  }

  _renderInstructions() {
    const { valid } = this._getInputs();

    let content;

    if (!valid) {
      content = 'Enter new gold and cost from game';
    } else if (valid) {
      content = 'Looks good, click Done';
    }

    return <Instructions>{content}</Instructions>;
  }
}
