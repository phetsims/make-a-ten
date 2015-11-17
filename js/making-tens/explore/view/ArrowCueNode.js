// Copyright 2002-2014, University of Colorado Boulder

/**

 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

// modules
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  //images
  var moveCueImage = require( 'image!MAKING_TENS/move-cue.png' );
  var splitCueImage = require( 'image!MAKING_TENS/split-cue.png' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   *
   * @param {ArrowCueModel} arrowCueModel
   * @constructor
   */
  function ArrowCueNode( arrowCueModel ) {
    var thisNode = this;
    Node.call( thisNode );

    arrowCueModel.visibleProperty.link( function( visible ) {
      thisNode.visible = visible;
    } );

    arrowCueModel.opacityProperty.link( function( opacity ) {
      thisNode.opacity = opacity;
    } );

    var moveCueImageNode = new Image( moveCueImage );
    var splitCueImageNode = new Image( splitCueImage );

    thisNode.addChild( moveCueImageNode );
    thisNode.addChild( splitCueImageNode );

    arrowCueModel.moveArrowCuePositionProperty.link( function( movePosition ) {
      moveCueImageNode.leftTop = movePosition;
    } );

    arrowCueModel.splitArrowCuePositionProperty.link( function( splitArrowPosition ) {
      splitCueImageNode.leftTop = splitArrowPosition;
    } );

  }

  return inherit( Node, ArrowCueNode, {} );

} );
