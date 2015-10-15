// Copyright 2002-2014, University of Colorado Boulder

/**
 * Convenience type for creating the icons used on the game level start buttons.
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var TITLE_FONT = new PhetFont( 70 );
  var ICON_SIZE = new Dimension2( 729 / 2, 420 / 2 );

  // constants
  var SCALING_TOLERANCE = 1E-4; // Empirically chosen as something the human eye is unlikely to notice.

  // Code is copied over from LevelSelectionButton
  // Create a node that is scaled and padded out to meet the size specification.
  function createSizedImageNode( icon, size ) {
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
  }

  /**
   *
   * @param {Image} icon
   * @param levelString
   * @constructor
   */
  function GameIconNode( levelIconImage, levelString ) {
    Node.call( this );

    var scaledImage = createSizedImageNode( new Image( levelIconImage ), ICON_SIZE );
    this.addChild( scaledImage );

    var titleNode = new Text( levelString, { font: TITLE_FONT } );
    this.addChild( titleNode );
    titleNode.top = scaledImage.bottom + 12;
    titleNode.centerX = scaledImage.centerX;
  }

  return inherit( Node, GameIconNode );
} );
