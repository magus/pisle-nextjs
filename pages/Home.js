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
import scales from '~/constants/scales';
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
      level: string | number,
      gold: string | number,
      cost: string | number,
      hearts: string | number,
      multiplier: string | number,
    },
  },
  basis: ?HabitatBasisCollection,
  uncommittedChange: ?Change,
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
  if (!state.basis) return;

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

const setBasis = (habitat, updateBlob) => state => {
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
  onChange: (value: string) => void,
  placeholder: string,
  transform: (value: string) => any,
  validate: (value: string) => boolean,
  value: string | number,
};

type InputState = {
  value: string,
};

class Input extends React.Component<InputProps, InputState> {
  static defaultProps = {
    transform: value => value,
  };

  state = { value: `${this.props.value}` || '' };

  shouldComponentUpdate(nextProps, nextState) {
    const isPropSameAsState = nextProps.value === this.state.value;
    const isStateUnchanged = nextState.value === this.state.value;
    if (isPropSameAsState && isStateUnchanged) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { validate, onChange, transform } = this.props;
    const { value } = this.state;

    const stateChanged = prevState.value !== value;

    if (stateChanged && validate(value) && onChange) {
      onChange(transform(value));
    }
  }

  render() {
    const { validate, placeholder } = this.props;
    const { value } = this.state;

    return (
      <StyledInput
        invalid={value && !validate(value)}
        onChange={event => this.setState({ value: event.target.value })}
        value={value}
        placeholder={placeholder}
      />
    );
  }
}

const StyledInput = styled.input`
  border: 1px solid ${props => (props.invalid ? 'red' : 'inherit')};
`;

class HabitatsState extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      penguins: 43,
      initBasis: {},
      basis: null,
      uncommittedChange: null,
    };
  }

  componentDidMount() {
    if (window && window.localStorage) {
      const storedState = JSON.parse(
        window.localStorage.getItem(LocalStorageKey)
      );
      if (storedState && storedState.basis) {
        this.setState({ basis: storedState.basis });
      } else if (storedState && storedState.initBasis) {
        this.setState({ initBasis: storedState.initBasis });
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
      // {
      //   level: '',
      //   gold: '',
      //   cost: '',
      //   hearts: '',
      //   multiplier: '',
      // }
    });
  }

  render() {
    const { basis, penguins, uncommittedChange } = this.state;

    if (!basis) {
      const input = this._getInputs();

      return (
        <>
          <Instructions>
            {"Welcome, you look new here. Let's get you setup!"}
          </Instructions>
          {this._renderInitBasis()}
          {this._renderReset()}
        </>
      );
    }

    return (
      <>
        <button onClick={() => this.setState(suggestUpgrades([10, 'k']))}>
          Upgrade
        </button>
        <button onClick={() => this.setState(suggestEvolve())}>Evolve</button>

        <div>Penguins</div>
        <div>{penguins}</div>
        <button onClick={() => this.setState(addPenguin())}>+</button>

        {!uncommittedChange ? null : (
          <DisplayUncommittedChange
            change={uncommittedChange}
            onDone={extra => () =>
              this.setState(commitChange({ ...uncommittedChange, extra }))}
            onCancel={() => this.setState(cancelChange())}
          />
        )}

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
                setBasis(habitat, {
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
          {Object.keys(initBasis[habitat]).map(field => {
            return (
              <Input
                key={`${habitat}-${field}`}
                onChange={value =>
                  this.setState(setBasis(habitat, { [field]: value }))
                }
                placeholder={InitBasisPlaceholders[field]}
                transform={value => habitats.ValidateField[field](value)}
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
  // console.info('spendGold', spendGold([2, 'l'], initHabitatBasisCollection));

  return (
    <Page>
      <CustomHead title="Home" />

      <HabitatsState />
    </Page>
  );
};

export default Home;

const Instructions = styled.div`
  text-align: center;
  font-size: ${Styles.Fonts.Large}px;
`;
