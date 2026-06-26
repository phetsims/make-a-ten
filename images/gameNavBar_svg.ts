/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="147" height="100" viewBox="0 0 147 100"><text style="font-family:Arial-BoldMT,Arial;font-size:33.55px;font-weight:700" transform="translate(20.69 59.39)"><tspan x="0" y="0">+</tspan><tspan x="19.59" y="0" style="letter-spacing:-.08em"> </tspan><tspan x="26.23" y="0" style="letter-spacing:0">1</tspan></text><path d="M102.29 25.83c.23-.47.61-.47.85 0l6.33 12.81c.23.47.85.92 1.37 1l14.14 2.06c.52.08.64.44.26.81l-10.23 9.97c-.38.37-.61 1.09-.52 1.61l2.42 14.08c.09.52-.22.74-.69.5l-12.65-6.65c-.47-.25-1.23-.25-1.7 0l-12.65 6.65c-.47.25-.78.02-.69-.5l2.41-14.08c.09-.52-.15-1.25-.52-1.61l-10.23-9.97c-.38-.37-.26-.73.26-.81l14.14-2.06c.52-.08 1.14-.52 1.37-1l6.32-12.81Z" style="fill:#fcff00"/><path d="M102.29 25.83c.23-.47.61-.47.85 0l6.33 12.81c.23.47.85.92 1.37 1l14.14 2.06c.52.08.64.44.26.81l-10.23 9.97c-.38.37-.61 1.09-.52 1.61l2.42 14.08c.09.52-.22.74-.69.5l-12.65-6.65c-.47-.25-1.23-.25-1.7 0l-12.65 6.65c-.47.25-.78.02-.69-.5l2.41-14.08c.09-.52-.15-1.25-.52-1.61l-10.23-9.97c-.38-.37-.26-.73.26-.81l14.14-2.06c.52-.08 1.14-.52 1.37-1l6.32-12.81Z" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:3.83px"/></svg>')}`;
export default image;