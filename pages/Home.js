// @flow strict

import * as React from 'react';

import CustomHead from '~/components/CustomHead';
import Habitats from '~/components/Habitats';
import Page from '~/components/Page';

const Home = () => {
  return (
    <Page>
      <CustomHead />

      <Habitats />
    </Page>
  );
};

export default Home;
