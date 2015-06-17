// Copyright 2002-2014, University of Colorado Boulder

/**

 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumberCreatorNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberCreatorNode' );
  var Vector2 = require( 'DOT/Vector2' );

  var NUMBER_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of paper numbers Empirically determined.
    new Vector2( -8, -8 ),
    new Vector2( 0, 0 )
  ];

  function MakingTensExplorerNode( numberValue, addShapeToModel, combineNumbersIfApplicableCallback ) {
    var thisNode = this;
    Node.call( thisNode );

    var numberCollectionLayer = new Node();
    thisNode.addChild( numberCollectionLayer );

    NUMBER_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      var paperNumberCreatorNode = new PaperNumberCreatorNode( numberValue,
        addShapeToModel, combineNumbersIfApplicableCallback );
      numberCollectionLayer.addChild( paperNumberCreatorNode );
      paperNumberCreatorNode.left = offset.x;
      paperNumberCreatorNode.top = offset.y;

    } );

  }

  return inherit( Node, MakingTensExplorerNode, {
    reset: function() {

    }
  } );
} );