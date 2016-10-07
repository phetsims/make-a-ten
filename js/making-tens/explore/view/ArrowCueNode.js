// Copyright 2002-2014, University of Colorado Boulder

/**

 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  //images
  var moveCueImage = require( 'image!MAKING_TENS/move-cue.png' );
  var splitCueImage = require( 'image!MAKING_TENS/split-cue.png' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   *
   * @param {ArrowCue} arrowCue
   * @constructor
   */
  function ArrowCueNode( arrowCue ) {
    var self = this;
    Node.call( self );

    arrowCue.visibleProperty.link( function( visible ) {
      self.visible = visible;
    } );

    arrowCue.opacityProperty.link( function( opacity ) {
      self.opacity = opacity;
    } );

    var moveCueImageNode = new Image( moveCueImage );
    var splitCueImageNode = new Image( splitCueImage );

    self.addChild( moveCueImageNode );
    self.addChild( splitCueImageNode );

    arrowCue.moveArrowCuePositionProperty.link( function( movePosition ) {
      moveCueImageNode.leftTop = movePosition;
    } );

    arrowCue.splitArrowCuePositionProperty.link( function( splitArrowPosition ) {
      splitCueImageNode.leftTop = splitArrowPosition;
    } );

  }

  makingTens.register( 'ArrowCueNode', ArrowCueNode );

  return inherit( Node, ArrowCueNode );

} );
