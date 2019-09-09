// @flow strict

import * as React from 'react';
import styled from 'styled-components';

import CustomHead from '~/components/CustomHead';
import Page from '~/components/Page';
import HabitatRow from '~/components/HabitatRow';
import HabitatContentStats from '~/components/HabitatRow/HabitatContentStats';
import HabitatEvolveStats from '~/components/HabitatRow/HabitatEvolveStats';

import spendGold from '~/src/algorithms/spendGold';

import game from '~/constants/game';
import { initHabitatBasisCollection } from '~/constants/test';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';
import Styles from '~/constants/styles';

type Props = {|
  children: (props: RenderProps) => React.Node,
|};

const ChangeTypes = {
  Upgrade: 'Upgrade',
  Evolve: 'Evolve',
};

type ChangeType = $Keys<typeof ChangeTypes>;
type Change = {|
  type: ChangeType,
  meta: any,
|};

type EvolveUpdate = {
  habitat: HabitatTypes,
  multiplier: number,
  hearts: number,
};

type State = {|
  penguins: number,
  basis: HabitatBasisCollection,
  uncommittedChange: ?Change,
|};

type RenderProps = {
  ...State,
  actions: {
    setState: (action: any) => () => void,
  },
};

const addPenguin = () => state => {
  const penguins = state.penguins + 1;
  // update all gold values for habitat basis
  const { basis } = state;
  Object.keys(basis).forEach(habitat => {
    basis[habitat].gold = basis[habitat].gold * game.GoldIncreaseFactor;
  });
  return { penguins, uncommittedChange: null };
};

const suggestUpgrades = budget => state => {
  const meta = spendGold(budget, state.basis);
  const uncommittedChange = { type: ChangeTypes.Upgrade, meta };
  return { uncommittedChange };
};

const suggestEvolve = () => state => {
  const meta = state.basis;
  const uncommittedChange = { type: ChangeTypes.Evolve, meta };
  return { uncommittedChange };
};

const cancelChange = () => () => ({ uncommittedChange: null });

const commitChange = change => state => {
  if (!change) return { uncommittedChange: null };

  const { basis } = state;

  // build updated state based on change type
  switch (change.type) {
    case ChangeTypes.Upgrade: {
      console.info('commit', ChangeTypes.Upgrade);
      Object.keys(change.meta).forEach(habitat => {
        basis[habitat].level = change.meta[habitat].level;
      });
      break;
    }
    case ChangeTypes.Evolve: {
      console.info('commit', ChangeTypes.Evolve, change);
      if (change.extra) {
        const { habitat, hearts, multiplier } = change.extra;
        basis[habitat].hearts = hearts;
        basis[habitat].multiplier = multiplier;
      }
      break;
    }
    default:
      console.error('commit', change);
  }

  // clear uncommitted change
  return { uncommittedChange: null };
};

class HabitatsState extends React.Component<Props, State> {
  state = {
    penguins: 43,
    basis: { ...initHabitatBasisCollection },
    uncommittedChange: null,
  };

  render() {
    return this.props.children({
      ...this.state,
      actions: {
        setState: action => () => this.setState(action),
      },
    });
  }
}

type ChangeProps = {|
  onCancel: () => void,
  onDone: (extra: ?EvolveUpdate) => () => void,
  change: Change,
|};

type EvolveChangeState = {
  habitat: ?HabitatTypes,
  hearts: string,
  multiplier: string,
};

class EvolveChange extends React.Component<ChangeProps, EvolveChangeState> {
  state = {
    habitat: null,
    hearts: '',
    multiplier: '',
  };

  _getInputs() {
    const hearts = scales.toNumber(scales.validateShort(this.state.hearts));
    const multiplier = scales.validateMultiplier(this.state.multiplier);
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
          : onDone();

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
        <input
          onChange={event => this.setState({ hearts: event.target.value })}
          value={hearts}
          placeholder="1.00c"
        />
        <input
          onChange={event => this.setState({ multiplier: event.target.value })}
          value={multiplier}
          placeholder="300%"
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

    return Object.keys(change.meta).map(habitat => {
      return (
        <HabitatRow
          key={habitat}
          habitat={habitat}
          onClick={habitat => this.setState({ habitat })}
        >
          <HabitatEvolveStats habitat={habitat} basis={change.meta[habitat]} />
        </HabitatRow>
      );
    });
  }
}

function DisplayUncommittedChange({ change, onCancel, onDone }: ChangeProps) {
  if (!change) return null;

  switch (change.type) {
    case ChangeTypes.Upgrade: {
      return (
        <>
          <div>
            Make the following changes in your game, then click Done below
          </div>
          <pre>{JSON.stringify(change, null, 2)}</pre>
          <button onClick={onDone()}>Done</button>
          <button onClick={onCancel}>Cancel</button>
        </>
      );
    }
    case ChangeTypes.Evolve: {
      console.info('DisplayUncommittedChange', ChangeTypes.Evolve, change);
      return (
        <EvolveChange change={change} onDone={onDone} onCancel={onCancel} />
      );
    }
    default:
      console.error('DisplayUncommittedChange', change);
      return null;
  }
}

const Home = () => {
  console.info('spendGold', spendGold([2, 'k'], initHabitatBasisCollection));

  return (
    <Page>
      <CustomHead title="Home" />

      <HabitatsState>
        {({ actions, basis, penguins, uncommittedChange }) => (
          <>
            <button onClick={actions.setState(suggestUpgrades([10, 'k']))}>
              Upgrade
            </button>
            <button onClick={actions.setState(suggestEvolve())}>Evolve</button>

            <div>Penguins</div>
            <div>{penguins}</div>
            <button onClick={actions.setState(addPenguin())}>+</button>

            {!uncommittedChange ? null : (
              <DisplayUncommittedChange
                change={uncommittedChange}
                onDone={extra =>
                  actions.setState(
                    commitChange({ ...uncommittedChange, extra })
                  )
                }
                onCancel={actions.setState(cancelChange())}
              />
            )}

            {habitats.All.map<any>(habitat => {
              return (
                <HabitatRow
                  key={habitat}
                  habitat={habitat}
                  onClick={habitat => {
                    console.info('clicked', habitat);
                  }}
                >
                  <HabitatContentStats
                    habitat={habitat}
                    basis={basis[habitat]}
                  />
                </HabitatRow>
              );
            })}
          </>
        )}
      </HabitatsState>
    </Page>
  );
};

export default Home;

const Instructions = styled.div`
  text-align: center;
  font-size: ${Styles.Fonts.Large}px;
`;
