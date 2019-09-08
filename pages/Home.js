// @flow strict

import * as React from 'react';
import dynamic from 'next/dynamic';

import Head from '~/components/Head';
import Page from '~/components/Page';

import spendGold from '~/src/algorithms/spendGold';
import spendHearts from '~/src/algorithms/spendHearts';

import game from '~/constants/game';
import { initHabitatBasisCollection } from '~/constants/test';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

const DynamicHabitatRows = dynamic(() => import('~/components/HabitatsRows'), {
  ssr: false,
});

type Props = {|
  children: (props: RenderProps) => React.Node,
|};

const ChangeTypes = {
  Upgrade: 'Upgrade',
  Evolve: 'Evolve',
};

type ChangeType = $Keys<typeof ChangeTypes>;

type EvolveUpdate = {
  habitat: HabitatTypes,
  multipler: number,
  hearts: number,
};

type State = {|
  penguins: number,
  basis: HabitatBasisCollection,
  uncommittedChange: ?{
    type: ChangeType,
    meta: any,
  },
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
  const meta = spendHearts(state.basis);
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

function DisplayUncommittedChange({
  change,
  onCancel,
  onDone,
}: {
  onCancel: () => void,
  onDone: (extra: ?EvolveUpdate) => () => void,
  change: $PropertyType<State, 'uncommittedChange'>,
}) {
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
        <>
          <div>
            Make the following changes in your game, then click Done below
          </div>
          <pre>{JSON.stringify(change, null, 2)}</pre>
          <button
            onClick={onDone({
              habitat: habitats.FishingSpot,
              multipler: 2500,
              hearts: scales.toNumber([100, 'd']),
            })}
          >
            Done
          </button>
          <button onClick={onCancel}>Cancel</button>
        </>
      );
    }
    default:
      console.error('DisplayUncommittedChange', change);
      return null;
  }
}

const Home = () => {
  return (
    <Page>
      <Head title="Home" />

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

            <DisplayUncommittedChange
              change={uncommittedChange}
              onDone={extra =>
                actions.setState(commitChange({ ...uncommittedChange, extra }))
              }
              onCancel={actions.setState(cancelChange())}
            />

            <DynamicHabitatRows basis={basis} />
          </>
        )}
      </HabitatsState>
    </Page>
  );
};

export default Home;
