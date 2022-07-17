import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Maragsa';
        font-style: normal;
        font-weight: 500;
        src: url('./fonts/Maragsa.woff2') format('woff2');
      }
      `}
  />
);

export default Fonts;
