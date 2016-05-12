// Copyright 2015, University of Colorado Boulder

/**
 * Convenience type for creating the icons used on the game level start buttons.
 */
define( function( require ) {
  'use strict';

  // imports
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var ICON_SIZE = new Dimension2( 729 / 2, 420 / 2 );

  /**
   *
   * @param {Image} icon
   * @constructor
   */
  function GameIconNode( levelIconImage ) {
    Node.call( this );

    var scaledImage = MakingTensUtil.createSizedImageNode( new Image( levelIconImage ), ICON_SIZE );
    this.addChild( scaledImage );
  }

  makingTens.register( 'GameIconNode', GameIconNode );

  return inherit( Node, GameIconNode );
} );
