// @flow strict

import React from 'react';

import {
  HabitatContentRow,
  HabitatLabeledValue,
} from '~/components/Habitats/HabitatRow';

function HabitatUpgradeStats({
  oldLevel,
  newLevel,
  levelDelta,
}: {
  oldLevel: number,
  newLevel: number,
  levelDelta: number,
}) {
  return (
    <>
      <HabitatContentRow>
        <HabitatLabeledValue
          label="LV"
          value={`${newLevel} (${oldLevel} + ${levelDelta})`}
        />
      </HabitatContentRow>
    </>
  );
}

export default HabitatUpgradeStats;
