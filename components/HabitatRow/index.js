// @flow strict

import * as React from 'react';
import styled from 'styled-components';

import Styles from '~/constants/styles';
import habitats from '~/constants/habitats';

type Props = {
  habitat: HabitatTypes,
  children?: React.Node,
  onClick?: (habitat: HabitatTypes) => void,
};

const HabitatRow = ({ habitat, children, onClick = () => {} }: Props) => {
  const { name } = habitats.Metadata[habitat];

  return (
    <HabitatContainer onClick={() => onClick(habitat)}>
      <HabitatRowContainer>
        <HabitatIconSpacer>
          <HabitatIcon />
        </HabitatIconSpacer>
        <HabitatContent>
          <HabitatContentRow>
            <HabitatTitle>{name}</HabitatTitle>
          </HabitatContentRow>
          {children}
        </HabitatContent>
      </HabitatRowContainer>
    </HabitatContainer>
  );
};

export default HabitatRow;

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

const HabitatContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 0 0 ${Styles.Spacing.Large}px;
`;

export const HabitatContentRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const HabitatTitle = styled.div`
  margin: 0 0 ${Styles.Spacing.Small}px 0;
  font-weight: ${Styles.Fonts.Weight.Heavy};
`;

export const HabitatContentRowSpacer = styled.div`
  margin: ${Styles.Spacing.Medium}px 0;
  height: 1px;
  background: ${Styles.Colors.Gray};
`;
