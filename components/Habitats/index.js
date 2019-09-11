// @flow strict

import type { Change } from '~/components/Changes';

import * as React from 'react';

import { ChangeTypes } from '~/components/Changes';
import HabitatRow from '~/components/Habitats/HabitatRow';
import HabitatContentStats from '~/components/Habitats/HabitatRow/HabitatContentStats';
import Input from '~/components/common/Input';
import { Instructions } from '~/components/common/Styled';
import UncommittedChange from '~/components/Changes/UncommittedChange';

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
  penguins: number,
  initBasis: InitBasisCollection,
  basis: ?HabitatBasisCollection,
  uncommittedChange: ?Change,
  upgradeBudget: string,
|};

const addPenguin = () => state => {
  const { basis } = state;

  if (!basis) return;

  const penguins = state.penguins + 1;

  // update all gold values for habitat basis
  Object.keys(basis).forEach(habitat => {
    basis[habitat].gold = basis[habitat].gold * game.PenguinIncreaseFactor;
  });

  return { basis, penguins, uncommittedChange: null };
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
  return { basis, uncommittedChange: null };
};

const setInitBasis = (habitat, updateBlob) => state => {
  const { initBasis } = state;
  initBasis[habitat] = { ...initBasis[habitat], ...updateBlob };
  return { initBasis };
};

const startEdit = () => state => {
  const { basis } = state;
  if (!basis) return;
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

  return { basis: null, initBasis };
};

const LocalStorageKey = 'pisle-nextjs';

export default class Habitats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      penguins: 0,
      initBasis: {},
      basis: null,
      uncommittedChange: null,
      upgradeBudget: '',
    };
  }

  componentDidMount() {
    if (window && window.localStorage) {
      const storedState = JSON.parse(
        window.localStorage.getItem(LocalStorageKey)
      );

      if (storedState) {
        const state = {};

        if (storedState.basis) {
          state.basis = storedState.basis;
        }
        if (storedState.initBasis) {
          state.initBasis = storedState.initBasis;
        }
        if (storedState.penguins) {
          state.penguins = storedState.penguins;
        }
        if (storedState.upgradeBudget) {
          state.upgradeBudget = storedState.upgradeBudget;
        }

        this.setState(state);
      }
    }
  }

  componentDidUpdate() {
    console.info('localStorage', 'write', { ...this.state });
    localStorage.setItem(LocalStorageKey, JSON.stringify(this.state));
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
    const { basis, penguins, uncommittedChange } = this.state;

    if (!basis) {
      return (
        <>
          <Instructions>
            {"Welcome, you look new here. Let's get you setup!"}
          </Instructions>
          {this._renderInitBasis()}
          {this._renderReset()}
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
        <Input
          label="Budget"
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

        <div>Penguins</div>
        <button onClick={() => this.setState(addPenguin())}>+</button>

        <button onClick={() => this.setState(startEdit())}>Edit</button>

        {habitats.All.map<React$Element<typeof HabitatRow>>(habitat => {
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

        {this._renderReset()}
      </>
    );
  }

  _renderReset() {
    return (
      <button onClick={() => this.setState({ initBasis: {}, basis: null })}>
        Reset
      </button>
    );
  }

  _renderSave() {
    const basis = this._getInputs();

    return (
      <button
        disabled={!basis}
        onClick={() => this.setState({ initBasis: {}, basis })}
      >
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

      return (
        <HabitatRow
          key={habitat}
          habitat={habitat}
          onClick={habitat => {
            console.info('clicked', habitat);
          }}
        >
          {Object.keys(habitats.HabitatFields).map(field => {
            return (
              <Input
                key={`${habitat}-${field}`}
                label={field}
                onChange={value =>
                  this.setState(setInitBasis(habitat, { [field]: value }))
                }
                placeholderType={HabitatBasisFieldPlaceholderTypes[field]}
                validate={value => !!habitats.ValidateField[field](value)}
                value={initBasis[habitat][field]}
              />
            );
          })}
        </HabitatRow>
      );
    });
  };
}

const HabitatBasisFieldPlaceholderTypes = {
  [habitats.HabitatFields.level]: 'numeric',
  [habitats.HabitatFields.gold]: 'cost',
  [habitats.HabitatFields.cost]: 'cost',
  [habitats.HabitatFields.hearts]: 'cost',
  [habitats.HabitatFields.multiplier]: 'multiplier',
};
