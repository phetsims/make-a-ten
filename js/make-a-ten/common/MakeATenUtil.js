// Copyright 2015-2019, University of Colorado Boulder

/**
 * Utility methods for Make a Ten
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  const MakeATenUtil = {
    /**
     * Common way of determining number of digits in a number.
     * @public
     *
     * @param {number} number - Should be an integer.
     */
    digitsInNumber: function( number ) {
      assert && assert( number % 1 === 0, 'Should be an integer' );

      // Not using log10, since phet.dot.Utils.log10( 1000 ) => 2.9999999999999996, which behaved badly with floor.
      return ( '' + number ).length;
    },

    /**
     * Creates an icon using an image over a background fill.
     * @public
     *
     * @param {HTMLImageElement} image
     * @param {scenery.fill} backgroundFill
     * @returns {Node}
     */
    createIconWithBackgroundColor: function( image, backgroundFill ) {
      const imageNode = new Image( image );

      return new Node( {
        children: [
          new Rectangle( 0, 0, imageNode.imageWidth, imageNode.imageHeight, {
            fill: backgroundFill
          } ),
          imageNode
        ]
      } );
    }
  };

  makeATen.register( 'MakeATenUtil', MakeATenUtil );

  return MakeATenUtil;
} );
