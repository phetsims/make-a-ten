// Copyright 2015, University of Colorado Boulder

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
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var TITLE_FONT = new PhetFont( 70 );
  var ICON_SIZE = new Dimension2( 729 / 2, 420 / 2 );


  /**
   *
   * @param {Image} icon
   * @param levelString
   * @constructor
   */
  function GameIconNode( levelIconImage, levelString ) {
    Node.call( this );

    var scaledImage = MakingTensUtil.createSizedImageNode( new Image( levelIconImage ), ICON_SIZE );
    this.addChild( scaledImage );

    var titleNode = new Text( levelString, { font: TITLE_FONT } );
    this.addChild( titleNode );
    titleNode.top = scaledImage.bottom + 12;
    titleNode.centerX = scaledImage.centerX;
  }

  return inherit( Node, GameIconNode );
} );
