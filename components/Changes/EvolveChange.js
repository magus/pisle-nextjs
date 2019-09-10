// @flow strict

import * as React from 'react';

import type { Props as ChangeProps } from '~/components/Changes/UncommittedChange';

import HabitatRow from '~/components/Habitats/HabitatRow';
import HabitatEvolveStats from '~/components/Habitats/HabitatRow/HabitatEvolveStats';
import Input from '~/components/common/Input';
import { Instructions } from '~/components/common/Styled';

import spendHearts from '~/src/algorithms/spendHearts';
import habitats from '~/constants/habitats';

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
    const { onDone, onCancel } = this.props;
    const { habitat } = this.state;
    const { valid, hearts, multiplier } = this._getInputs();

    if (habitat) {
      const onClick =
        valid && hearts && multiplier
          ? onDone({
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
          <button onClick={onCancel}>Cancel</button>
        </>
      );
    }

    return (
      <>
        {this._renderInstructions()}
        {this._renderChange()}
      </>
    );
  }

  _renderInputs() {
    const { hearts, multiplier } = this.state;

    return (
      <>
        <Input
          label="❤️"
          type="cost"
          onChange={hearts => this.setState({ hearts })}
          placeholderType="cost"
          validate={value => !!habitats.ValidateField.hearts(value)}
          value={hearts}
        />
        <Input
          label="Multipler"
          onChange={multiplier => this.setState({ multiplier })}
          placeholderType="multiplier"
          validate={value => !!habitats.ValidateField.multiplier(value)}
          value={multiplier}
        />
      </>
    );
  }

  _renderInstructions() {
    const { habitat } = this.state;
    const { valid } = this._getInputs();

    let content;

    if (!habitat) {
      content = 'Select a Habitat to evolve with Hearts';
    } else if (!valid) {
      content = 'Enter new heart cost and % multiplier';
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
