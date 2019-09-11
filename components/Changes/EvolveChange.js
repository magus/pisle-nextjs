// @flow strict

import * as React from 'react';

import type { Props as ChangeProps } from '~/components/Changes/UncommittedChange';

import HabitatRow from '~/components/Habitats/HabitatRow';
import HabitatContentStats from '~/components/Habitats/HabitatRow/HabitatContentStats';
import HabitatEvolveStats from '~/components/Habitats/HabitatRow/HabitatEvolveStats';
import Input from '~/components/common/Input';
import { Instructions } from '~/components/common/Styled';

import spendHearts from '~/src/algorithms/spendHearts';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

type State = {
  habitat: ?HabitatTypes,
  hearts: string,
  multiplier: string,
};

export default class EvolveChange extends React.Component<ChangeProps, State> {
  state = {
    habitat: null,
    hearts: '',
    multiplier: '',
  };

  _getInputs() {
    const hearts = habitats.ValidateField.hearts(this.state.hearts);
    const multiplier = habitats.ValidateField.multiplier(this.state.multiplier);
    return {
      valid: !!(hearts && multiplier),
      hearts,
      multiplier,
    };
  }

  render() {
    const { habitat } = this.state;
    const { valid, hearts, multiplier } = this._getInputs();

    if (habitat) {
      const onClick =
        valid && hearts && multiplier
          ? this.props.onDone({
              habitat,
              hearts,
              multiplier,
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

    return (
      <>
        {this._renderInstructions()}
        {this._renderChange()}
        {this._renderCancel()}
      </>
    );
  }

  _renderCancel() {
    return <button onClick={this.props.onCancel}>Cancel</button>;
  }

  _renderInputs() {
    const { habitat, hearts, multiplier } = this.state;
    const basis = this.props.change.meta[habitat];

    return (
      <>
        <HabitatRow key={habitat} habitat={habitat}>
          <HabitatContentStats
            habitat={habitat}
            gold={scales.numberToShortString(basis.gold * basis.multiplier)}
            level={basis.level}
            cost={scales.numberToShortString(basis.cost)}
            hearts={
              <Input
                onChange={hearts => this.setState({ hearts })}
                placeholderType="hearts"
                validate={value => !!habitats.ValidateField.hearts(value)}
                value={hearts}
              />
            }
            multiplier={
              <Input
                onChange={multiplier => this.setState({ multiplier })}
                placeholderType="multiplier"
                validate={value => !!habitats.ValidateField.multiplier(value)}
                value={multiplier}
              />
            }
          />
        </HabitatRow>
      </>
    );
  }

  _renderInstructions() {
    const { habitat } = this.state;
    const { valid } = this._getInputs();

    let content;

    if (!habitat) {
      content = 'Select a Habitat to evolve with Hearts (sorted best to worst)';
    } else if (!valid) {
      content = 'Enter new heart cost and multiplier from game';
    } else if (valid) {
      content = 'Looks good, click Done';
    }

    return <Instructions>{content}</Instructions>;
  }

  _renderChange() {
    const { change } = this.props;

    const spendHeartMeta = spendHearts(change.meta);

    // sort by spendHeart algorithm
    return spendHeartMeta.map<React$Element<typeof HabitatRow>>(
      habitatBasis => {
        const habitat = habitatBasis.habitat;

        return (
          <HabitatRow
            key={habitat}
            habitat={habitat}
            onClick={habitat => this.setState({ habitat })}
          >
            <HabitatEvolveStats
              habitat={habitat}
              basis={change.meta[habitat]}
            />
          </HabitatRow>
        );
      }
    );
  }
}
