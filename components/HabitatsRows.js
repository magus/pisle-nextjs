// @flow strict

import React from 'react';
import styled from 'styled-components';

import Styles from '~/constants/styles';
import habitats from '~/constants/habitats';
import scales from '~/constants/scales';

const HabitatRow = ({
  habitat,
  basis,
}: {
  habitat: HabitatTypes,
  basis: HabitatBasis,
}) => {
  const { name, rate } = habitats.Metadata[habitat];
  const basisString = scales.numberToShortString(basis.gold);

  return (
    <HabitatRowContainer>
      <HabitatIconSpacer>
        <HabitatIcon />
      </HabitatIconSpacer>
      <HabitatContent>
        <HabitatContentRow>
          <HabitatTitle>{name}</HabitatTitle>
          <HabitatRate>{`${basisString} / ${rate}Sec`}</HabitatRate>
        </HabitatContentRow>
        <HabitatContentRowSpacer />
        <HabitatContentRow>
          <HabitatTitle>{name}</HabitatTitle>
          <HabitatRate>{`${basisString} / ${rate}Sec`}</HabitatRate>
        </HabitatContentRow>
      </HabitatContent>
    </HabitatRowContainer>
  );
};

const HabitatsRows = ({ basis }: { basis: HabitatBasisCollection }) => {
  return habitats.All.map<any>(habitat => {
    return (
      <HabitatContainer key={habitat}>
        <HabitatRow habitat={habitat} basis={basis[habitat]} />
      </HabitatContainer>
    );
  });
};

export default HabitatsRows;

const HabitatContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin: ${Styles.Spacing.Medium}px;
  padding: 16px;
  border-radius: ${Styles.Radius.Normal}px;
  box-shadow: 0px 0px ${Styles.Radius.Normal}px 0px ${Styles.Colors.Shadow};
`;

const HabitatRowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const HabitatIconSpacer = styled.div`
  width: 32px;
  height: 32px;
`;
const HabitatIcon = styled.img`
  width: 100%;
  height: 100%;
  background: ${Styles.Colors.Gray};
`;

const HabitatContentRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const HabitatContentRowSpacer = styled.div`
  margin: ${Styles.Spacing.Medium}px 0;
  height: 1px;
  background: ${Styles.Colors.Gray};
`;

const HabitatContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 0 0 ${Styles.Spacing.Large}px;
`;

const HabitatTitle = styled.div`
  margin: 0 0 ${Styles.Spacing.Small}px 0;
  font-weight: ${Styles.Fonts.Weight.Heavy};
`;

const HabitatRate = styled.div`
  font-size: ${Styles.Fonts.Small}px;
  font-weight: ${Styles.Fonts.Weight.Heavy};
  color: ${Styles.Colors.Gold};
`;
