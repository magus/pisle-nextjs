// @flow
import React from 'react';

import StyleReset from '~/components/StyleReset';
import GlobalStyles from '~/components/GlobalStyles';

function preventPullToRefresh(element) {
  if (!element) return;

  let prevent = false;

  element.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    if (!window || !document.body || !document.documentElement) return;

    const scrollY =
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop;
    prevent = scrollY === 0;
  });

  element.addEventListener('touchmove', (e: TouchEvent) => {
    if (prevent) {
      prevent = false;
      e.preventDefault();
    }
  });
}

type Props = {
  children: any,
  preventPullToRefresh?: boolean,
};

export default class Page extends React.Component<Props> {
  containerRef: { current: null | HTMLElement };

  constructor(props: Props) {
    super(props);

    this.containerRef = React.createRef();
  }
  componentDidMount() {
    if (this.props.preventPullToRefresh) {
      preventPullToRefresh(this.containerRef.current);
    }
  }

  render() {
    return (
      <div ref={this.containerRef}>
        {/* Global Styles */}
        <StyleReset />
        <GlobalStyles />

        {this.props.children}
      </div>
    );
  }
}
