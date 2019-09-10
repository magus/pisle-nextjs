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
import habitats from '~/constants/habitats';
import Styles from '~/constants/styles';

type Props = {||};

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
  initBasis: {
    [habitat: HabitatTypes]: {
      level: string,
      gold: string,
      cost: string,
      hearts: string,
      multiplier: string,
    },
  },
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
    basis[habitat].gold = basis[habitat].gold * game.GoldIncreaseFactor;
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

const LocalStorageKey = 'pisle-nextjs';
const InitBasisPlaceholders = {
  level: '42',
  gold: '23.81g',
  cost: '376.98g',
  hearts: '1.00 c',
  multiplier: '300%',
};

type InputProps = {
  label: string,
  onChange: (value: string) => void,
  placeholder: string,
  validate: (value: string) => boolean,
  value: string,
};

class Input extends React.Component<InputProps> {
  render() {
    const { label, validate, value, onChange, placeholder } = this.props;

    return (
      <label>
        <InputLabel>{label}</InputLabel>
        <StyledInput
          invalid={value && !validate(value)}
          onChange={event => onChange(event.target.value)}
          value={value}
          placeholder={placeholder}
        />
      </label>
    );
  }
}

const StyledInput = styled.input`
  border: 1px solid
    ${props => (props.invalid ? Styles.Colors.Orange : Styles.Colors.Gray)};
`;

const InputLabel = styled.span`
  margin: 0 ${Styles.Spacing.Small}px 0 0;
`;

class HabitatsState extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      penguins: 43,
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
        <DisplayUncommittedChange
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
          placeholder={InitBasisPlaceholders.cost}
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
        <div>{penguins}</div>
        <button onClick={() => this.setState(addPenguin())}>+</button>

        {habitats.All.map<any>(habitat => {
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

          return (
            <HabitatRow
              key={habitat}
              habitat={habitat}
              onClick={habitat => {
                console.info('clicked', habitat);
              }}
            >
              Not Unlocked
            </HabitatRow>
          );
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
          {['level', 'gold', 'cost', 'hearts', 'multiplier'].map(field => {
            return (
              <Input
                key={`${habitat}-${field}`}
                label={field}
                onChange={value =>
                  this.setState(setInitBasis(habitat, { [field]: value }))
                }
                placeholder={InitBasisPlaceholders[field]}
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
          onChange={hearts => this.setState({ hearts })}
          placeholder={InitBasisPlaceholders.hearts}
          validate={value => !!habitats.ValidateField.hearts(value)}
          value={hearts}
        />
        <Input
          label="Multipler %"
          onChange={multiplier => this.setState({ multiplier })}
          placeholder={InitBasisPlaceholders.multiplier}
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
  // console.info('spendGold', spendGold([2, 'l'], initHabitatBasisCollection));

  return (
    <Page>
      <CustomHead />

      <HabitatsState />
    </Page>
  );
};

export default Home;

const Instructions = styled.div`
  text-align: center;
  font-size: ${Styles.Fonts.Large}px;
`;
