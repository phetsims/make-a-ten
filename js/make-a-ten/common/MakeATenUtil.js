// Copyright 2015, University of Colorado Boulder


/**
 * Util methods

 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );

  // constants
  var SCALING_TOLERANCE = 1E-4; // Empirically chosen as something the human eye is unlikely to notice.


  var MakeATenUtil = {
    /**
     * Common way of determining number of digits in a number.
     * @public
     *
     * @param {number} number - Should be an integer.
     */
    digitsInNumber: function( number ) {
      assert && assert( number % 1 === 0, 'Should be an integer' );

      // Not using log10, since phet.dot.Util.log10( 1000 ) => 2.9999999999999996, which behaved badly with floor.
      return ( '' + number ).length;
    },

    /**
     * Code is copied over from LevelButton
     * TODO: deduplication
     * Create a node that is scaled and padded out to meet the size specification.
     * @param {Image} icon
     * @param {Dimension2} size
     * @returns {*}
     */
    createSizedImageNode: function( icon, size ) {
      icon.scale( Math.min( size.width / icon.bounds.width, size.height / icon.bounds.height ) );
      if ( Math.abs( icon.bounds.width - size.width ) < SCALING_TOLERANCE &&
           Math.abs( icon.bounds.height - size.height ) < SCALING_TOLERANCE ) {
        // The aspect ratio of the icon matched that of the specified size, so no padding is necessary.
        return icon;
      }
      // else padding is needed in either the horizontal or vertical direction.
      var background = Rectangle.dimension( size, { fill: null } );
      icon.center = background.center;
      background.addChild( icon );
      return background;
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
      var imageNode = new Image( image );

      return new Node( {
        children: [
          new Rectangle( 0, 0, imageNode.imageWidth, imageNode.imageHeight, { fill: backgroundFill } ),
          imageNode
        ]
      } );
    }
  };

  makeATen.register( 'MakeATenUtil', MakeATenUtil );

  return MakeATenUtil;

} );