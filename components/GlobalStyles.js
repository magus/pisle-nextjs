// @flow strict
import { createGlobalStyle } from 'styled-components';
import Styles from '~/constants/styles';

export default createGlobalStyle`
  body {
    background: ${Styles.Colors.White};
    color: ${Styles.Colors.Black};
    font-size: ${Styles.Fonts.Medium}px;
    font-weight: ${Styles.Fonts.Weight.Normal};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;

    /* Disables pull-to-refresh but allows overscroll glow effects. */
    overscroll-behavior-y: contain;

    /* smooth momentum scrolling */
    overflow-y: scroll; /* has to be scroll, not auto */
    -webkit-overflow-scrolling: touch;
  }

  /* Prevent zoom on mobile devices */
  input {
    font-size: 16px;
  }
`;
