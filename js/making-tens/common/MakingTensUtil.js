// Copyright 2015, University of Colorado Boulder


/**
 * Util methods

 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  // constants
  var SCALING_TOLERANCE = 1E-4; // Empirically chosen as something the human eye is unlikely to notice.


  var MakingTensUtil = {
    isBetween: function( value, a, b ) {
      var min = Math.min( a, b );
      var max = Math.max( a, b );
      return value > min && value < max;
    },

    /**
     * Code is copied over from LevelSelectionButton
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
      var background = new Rectangle( 0, 0, size.width, size.height, 0, 0, { fill: null } );
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

  return MakingTensUtil;

} );