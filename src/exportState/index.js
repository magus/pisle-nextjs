// @flow strict

import lzma from 'lz-string';

const STATE_QUERY_PARAM = 'state';
const LOCAL_STORAGE_KEY = 'pisle-nextjs';

function encodeState(state: any) {
  const stateString = lzma.compressToEncodedURIComponent(JSON.stringify(state));
  return stateString;
}

function decodeStateString(stateString: string) {
  const json = lzma.decompressFromEncodedURIComponent(stateString);
  let state = null;
  try {
    state = JSON.parse(json);
  } catch (err) {
    console.error(err);
  }

  return state;
}

export function exportStateLocalStorage(state: any) {
  if (window && window.localStorage) {
    console.info('localStorage', 'write', state);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }
}

export function importLocalStorage(): any {
  if (window && window.localStorage) {
    return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
  }
}

export function exportStateUrl(state: any) {
  const stateString = encodeState(state);
  const url = `/?${STATE_QUERY_PARAM}=${stateString}`;

  window.history.replaceState(null, 'Exported!', url);

  return url;
}

export function importStateUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const stateString = searchParams.get(STATE_QUERY_PARAM);
  if (!stateString) return null;
  return decodeStateString(stateString);
}
