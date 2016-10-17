// Copyright 2002-2014, University of Colorado Boulder

/**

 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  //images
  var moveCueImage = require( 'image!MAKE_A_TEN/move-cue.png' );
  var splitCueImage = require( 'image!MAKE_A_TEN/split-cue.png' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   *
   * @param {ArrowCue} arrowCue
   * @constructor
   */
  function ArrowCueNode( arrowCue ) {
    Node.call( this );

    arrowCue.visibleProperty.linkAttribute( this, 'visible' );
    arrowCue.opacityProperty.linkAttribute( this, 'opacity' );

    var moveCueImageNode = new Image( moveCueImage );
    var splitCueImageNode = new Image( splitCueImage );

    this.addChild( moveCueImageNode );
    this.addChild( splitCueImageNode );

    arrowCue.moveArrowCuePositionProperty.linkAttribute( moveCueImageNode, 'leftTop' );
    arrowCue.splitArrowCuePositionProperty.linkAttribute( splitCueImageNode, 'leftTop' );
  }

  makeATen.register( 'ArrowCueNode', ArrowCueNode );

  return inherit( Node, ArrowCueNode );

} );
