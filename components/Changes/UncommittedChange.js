// @flow strict

import type { Change, EvolveUpdate } from '~/components/Changes';

import * as React from 'react';

import { ChangeTypes } from '~/components/Changes';
import EvolveChange from '~/components/Changes/EvolveChange';
import HabitatRow from '~/components/Habitats/HabitatRow';
import HabitatUpgradeStats from '~/components/Habitats/HabitatRow/HabitatUpgradeStats';
import { Instructions } from '~/components/common/Styled';

export type Props = {|
  onCancel: () => void,
  onDone: (extra: ?EvolveUpdate) => () => void,
  change: Change,
|};

export default function UncommittedChange({ change, onCancel, onDone }: Props) {
  if (!change) return null;

  switch (change.type) {
    case ChangeTypes.Upgrade: {
      const habitatDeltas = Object.keys(change.meta.final).map(habitat => {
        const oldLevel = change.meta.original[habitat].level;
        const newLevel = change.meta.final[habitat].level;
        const levelDelta = newLevel - oldLevel;

        return { habitat, oldLevel, newLevel, levelDelta };
      });

      if (!habitatDeltas.length) {
        return (
          <>
            <Instructions>No upgrades possible 😢</Instructions>
            <button onClick={onCancel}>Ok</button>
          </>
        );
      }

      return (
        <>
          <Instructions>
            Make the following changes in your game, then click Done below
          </Instructions>

          {habitatDeltas.map(habitatUpgrade => {
            if (!habitatUpgrade) return null;

            const { habitat, oldLevel, newLevel, levelDelta } = habitatUpgrade;
            return (
              <HabitatRow key={habitat} habitat={habitat}>
                <HabitatUpgradeStats
                  oldLevel={oldLevel}
                  newLevel={newLevel}
                  levelDelta={levelDelta}
                />
              </HabitatRow>
            );
          })}

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
