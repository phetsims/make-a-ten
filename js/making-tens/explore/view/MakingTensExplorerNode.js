// Copyright 2015, University of Colorado Boulder

/**
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumberCreatorNode = require( 'MAKING_TENS/making-tens/explore/view/PaperNumberCreatorNode' );
  var Vector2 = require( 'DOT/Vector2' );

  var NUMBER_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of paper numbers Empirically determined.
    new Vector2( -8, -8 ),
    new Vector2( 0, 0 )
  ];

  /**
   *
   * @param {number} numberValue
   * @param {Function} addNumberToModel
   * @param {Function} tryToCombineNumbers
   * @param {Function} canPlaceNumber
   * @param {MakingTensCommonView} makingTensView
   * @constructor
   */
  function MakingTensExplorerNode( numberValue, addNumberToModel, tryToCombineNumbers , canPlaceNumber, makingTensView ) {
    Node.call( this );

    var numberCollectionLayer = new Node();
    this.addChild( numberCollectionLayer );

    NUMBER_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      var paperNumberCreatorNode = new PaperNumberCreatorNode( numberValue,
        addNumberToModel, tryToCombineNumbers , canPlaceNumber, makingTensView );
      numberCollectionLayer.addChild( paperNumberCreatorNode );
      paperNumberCreatorNode.left = offset.x;
      paperNumberCreatorNode.top = offset.y;

    } );

  }

  makingTens.register( 'MakingTensExplorerNode', MakingTensExplorerNode );

  return inherit( Node, MakingTensExplorerNode );
} );