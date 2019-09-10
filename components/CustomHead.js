import React from 'react';
import NextHead from 'next/head';
import { string } from 'prop-types';

const defaultDescription =
  "Use this app to input your Penguin's Isle habitats to optimze upgrades and evolutions!";
const defaultOGURL = 'https://pisle-nextjs.noah.now.sh/';
const defaultOGImage = '/static/summary-image.jpg';

const Head = props => {
  const title = props.title || "Penuin's Isle Optimizer";
  const description = props.description || defaultDescription;
  const url = props.url || defaultOGURL;
  const image = {
    src: props.ogImage || defaultOGImage,
    width: 1125,
    height: 633,
  };

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
      <link rel="apple-touch-icon" href="/static/touch-icon.png" />
      <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
      <link rel="icon" href="/static/favicon.ico" />

      <meta property="og:url" content={url} />
      <meta name="twitter:site" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image.src} />
      <meta property="og:image" content={image.src} />
      <meta property="og:image:width" content={image.width} />
      <meta property="og:image:height" content={image.height} />
    </NextHead>
  );
};

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string,
};

export default Head;
