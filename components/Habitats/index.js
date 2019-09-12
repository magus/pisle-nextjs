// @flow strict

import type { Change } from '~/components/Changes';

import * as React from 'react';

import { ChangeTypes } from '~/components/Changes';
import HabitatRow from '~/components/Habitats/HabitatRow';
import HabitatContentStats from '~/components/Habitats/HabitatRow/HabitatContentStats';
import { InlineInput } from '~/components/common/Input';
import { Instructions } from '~/components/common/Styled';
import UncommittedChange from '~/components/Changes/UncommittedChange';

import {
  exportStateLocalStorage,
  exportStateUrl,
  importLocalStorage,
  importStateUrl,
} from '~/src/exportState';
import spendGold from '~/src/algorithms/spendGold';

import game from '~/constants/game';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

type Props = {||};

type InitBasisCollection = {
  [habitat: HabitatTypes]: {
    level: string,
    gold: string,
    cost: string,
    hearts: string,
    multiplier: string,
  },
};

type State = {|
  date: number,
  initBasis: InitBasisCollection,
  basis: ?HabitatBasisCollection,
  uncommittedChange: ?Change,
  upgradeBudget: string,
|};

const addPenguin = () => state => {
  const { basis } = state;

  if (!basis) return;

  // update all gold values for habitat basis
  Object.keys(basis).forEach(habitat => {
    basis[habitat].gold = basis[habitat].gold * game.PenguinIncreaseFactor;
  });

  return { date: Date.now(), basis, uncommittedChange: null };
};

const suggestUpgrades = budget => state => {
  if (!state.basis || !budget) return;

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

  if (!basis) return;

  // build updated state based on change type
  switch (change.type) {
    case ChangeTypes.Upgrade: {
      console.info('commit', ChangeTypes.Upgrade);
      const finalBasis = change.meta.final;
      Object.keys(finalBasis).forEach(habitat => {
        basis[habitat] = { ...finalBasis[habitat] };
      });
      break;
    }
    case ChangeTypes.Evolve: {
      console.info('commit', ChangeTypes.Evolve, change);
      if (change.extra) {
        const { habitat, hearts, multiplier } = change.extra;
        basis[habitat].hearts = hearts;
        // Update gold based on old multiplier first
        basis[habitat].gold = basis[habitat].gold * basis[habitat].multiplier;
        // Now set new multiplier
        basis[habitat].multiplier = multiplier;
      }
      break;
    }
    default:
      console.error('commit', change);
  }

  // clear uncommitted change
  return { date: Date.now(), basis, uncommittedChange: null };
};

const setInitBasis = (habitat, updateBlob) => state => {
  const { initBasis } = state;
  initBasis[habitat] = { ...initBasis[habitat], ...updateBlob };
  return { initBasis };
};

function basisToInitBasis(basis: HabitatBasisCollection) {
  const initBasis: InitBasisCollection = {};
  Object.keys(basis).forEach(habitat => {
    const basisHabitat = basis[habitat];
    initBasis[habitat] = {
      level: `${basisHabitat.level}`,
      gold: scales.numberToShortString(basisHabitat.gold),
      cost: scales.numberToShortString(basisHabitat.cost),
      hearts: scales.numberToShortString(basisHabitat.hearts),
      multiplier: `${basisHabitat.multiplier * 100}%`,
    };
  });

  return initBasis;
}

const startEdit = () => state => {
  const { basis } = state;
  if (!basis) return;
  const initBasis = basisToInitBasis(basis);
  return { basis: null, initBasis };
};

const saveBasis = (basis: HabitatBasisCollection) => () => ({
  date: Date.now(),
  initBasis: {},
  basis,
});

export default class Habitats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      date: -1,
      initBasis: {},
      basis: null,
      uncommittedChange: null,
      upgradeBudget: '',
    };
  }

  componentDidMount() {
    const localStorageState = importLocalStorage();
    const queryParamState = importStateUrl();

    // select state with most recent date
    let storedState;
    if (localStorageState && queryParamState) {
      console.info('loading', 'local storage and query param both available');
      if (localStorageState.date > queryParamState.date) {
        console.info('loading from', 'local storage');
        storedState = localStorageState;
      } else {
        console.info('loading from', 'query param');
        storedState = queryParamState;
      }
    } else if (localStorageState) {
      console.info('loading from', 'local storage');
      storedState = localStorageState;
    } else if (queryParamState) {
      console.info('loading from', 'query param');
      storedState = queryParamState;
    }

    if (storedState) {
      this.setState({ ...storedState });
    }
  }

  componentDidUpdate() {
    exportStateLocalStorage({ ...this.state });
  }

  _getInputs() {
    const basis = {};
    let valid = true;

    // build basis from initBasis, validating along the way
    // if a field is set it was validated and transformed already
    const { initBasis } = this.state;
    Object.keys(initBasis).forEach(habitat => {
      const habitatInitBasis = initBasis[habitat];

      basis[habitat] = {};
      Object.keys(habitatInitBasis).forEach(field => {
        const fieldInput = habitatInitBasis[field];
        const validatedValue = habitats.ValidateField[field](fieldInput);
        if (!validatedValue) valid = false;
        basis[habitat][field] = validatedValue;
      });
    });

    return valid && basis;
  }

  render() {
    const { basis, uncommittedChange } = this.state;

    if (!basis) {
      return (
        <>
          <Instructions>
            {"Welcome, you look new here. Let's get you setup!"}
          </Instructions>
          {this._renderInitBasis()}
          {/* <button onClick={() => this.setState({ initBasis: {}, basis: null })}>
            Reset
          </button> */}
          {this._renderSave()}
        </>
      );
    }

    if (uncommittedChange) {
      return (
        <UncommittedChange
          change={uncommittedChange}
          onDone={extra => () =>
            this.setState(commitChange({ ...uncommittedChange, extra }))}
          onCancel={() => this.setState(cancelChange())}
        />
      );
    }

    const upgradeBudgetInput = this.state.upgradeBudget;
    const upgradeBudgetValue = habitats.ValidateField.cost(upgradeBudgetInput);
    return (
      <>
        <div>Budget</div>
        <InlineInput
          onChange={upgradeBudget => this.setState({ upgradeBudget })}
          placeholderType="cost"
          validate={value => !!habitats.ValidateField.cost(value)}
          value={upgradeBudgetInput}
        />
        <button
          disabled={!upgradeBudgetValue}
          onClick={() => this.setState(suggestUpgrades(upgradeBudgetValue))}
        >
          Upgrade
        </button>

        <button onClick={() => this.setState(suggestEvolve())}>Evolve</button>

        <button onClick={() => this.setState(addPenguin())}>Add Penguin</button>

        {habitats.All.map<null | React$Element<typeof HabitatRow>>(habitat => {
          const habitatBasis = basis[habitat];
          if (habitatBasis) {
            return (
              <HabitatRow
                key={habitat}
                habitat={habitat}
                onClick={habitat => {
                  console.info('clicked', habitat);
                }}
              >
                <HabitatContentStats habitat={habitat} basis={habitatBasis} />
              </HabitatRow>
            );
          }

          return null;
        })}

        <button onClick={() => this.setState(startEdit())}>Edit</button>
        <button
          onClick={() => {
            exportStateUrl({ ...this.state });
            alert('Saved to URL, share the link!');
          }}
        >
          Export
        </button>
      </>
    );
  }

  _renderSave() {
    const basis = this._getInputs();

    return (
      <button disabled={!basis} onClick={() => this.setState(saveBasis(basis))}>
        Save
      </button>
    );
  }

  _renderInitBasis = () => {
    const { initBasis } = this.state;
    return habitats.All.map<any>(habitat => {
      const initBasisHabitat = initBasis[habitat];

      if (!initBasisHabitat) {
        return (
          <HabitatRow
            key={habitat}
            habitat={habitat}
            onClick={habitat => {
              this.setState(
                setInitBasis(habitat, {
                  level: '',
                  gold: '',
                  cost: '',
                  hearts: '',
                  multiplier: '',
                })
              );
            }}
          >
            Click to unlock
          </HabitatRow>
        );
      }

      const InputProps = {};

      Object.keys(habitats.HabitatFields).map(field => {
        InputProps[field] = (
          <InlineInput
            onChange={value =>
              this.setState(setInitBasis(habitat, { [field]: value }))
            }
            placeholderType={HabitatBasisFieldPlaceholderTypes[field]}
            validate={value => !!habitats.ValidateField[field](value)}
            value={initBasis[habitat][field]}
          />
        );
      });

      return (
        <HabitatRow
          key={habitat}
          habitat={habitat}
          onClick={habitat => {
            console.info('clicked', habitat);
          }}
        >
          <HabitatContentStats habitat={habitat} {...InputProps} />
        </HabitatRow>
      );
    });
  };
}

const HabitatBasisFieldPlaceholderTypes = {
  [habitats.HabitatFields.level]: 'numeric',
  [habitats.HabitatFields.gold]: 'cost',
  [habitats.HabitatFields.cost]: 'cost',
  [habitats.HabitatFields.hearts]: 'hearts',
  [habitats.HabitatFields.multiplier]: 'multiplier',
};
