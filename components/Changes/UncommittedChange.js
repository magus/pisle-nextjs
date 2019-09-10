// @flow strict

import type { Change, EvolveUpdate } from '~/components/Changes';

import * as React from 'react';

import { ChangeTypes } from '~/components/Changes';
import EvolveChange from '~/components/Changes/EvolveChange';

export type Props = {|
  onCancel: () => void,
  onDone: (extra: ?EvolveUpdate) => () => void,
  change: Change,
|};

export default function UncommittedChange({ change, onCancel, onDone }: Props) {
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
