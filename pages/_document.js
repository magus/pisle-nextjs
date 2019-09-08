// @flow
import React from 'react';

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import StyleReset from '~/components/StyleReset';
import GlobalStyles from '~/components/GlobalStyles';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    // styled-components SSR
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,

      // styled-components SSR
      styles: [...initialProps.styles, ...sheet.getStyleElement()],
    };
  }

  render() {
    return (
      <html>
        <Head>
          <meta httpEquiv="Referrer-Policy" content="no-referrer" />
          <meta name="referrer" content="no-referrer" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          />

          {/* Global Styles */}
          <StyleReset />
          <GlobalStyles />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
