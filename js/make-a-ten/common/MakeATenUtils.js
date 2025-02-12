// Copyright 2015-2025, University of Colorado Boulder

/**
 * Utility methods for Make a Ten
 *
 * @author Sharfudeen Ashraf
 */

import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import makeATen from '../../makeATen.js';

const MakeATenUtils = {
  /**
   * Creates an icon using an image over a background fill.
   * @public
   *
   * @param {HTMLImageElement} image
   * @param {scenery.fill} backgroundFill
   * @returns {Node}
   */
  createIconWithBackgroundColor( image, backgroundFill ) {
    const imageNode = new Image( image );

    return new ScreenIcon( new Node( {
      children: [
        new Rectangle( 0, 0, imageNode.imageWidth, imageNode.imageHeight, {
          fill: backgroundFill
        } ),
        imageNode
      ]
    } ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } );
  }
};

makeATen.register( 'MakeATenUtils', MakeATenUtils );

export default MakeATenUtils;