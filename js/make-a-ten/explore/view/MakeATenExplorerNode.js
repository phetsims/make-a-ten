// Copyright 2015, University of Colorado Boulder

/**
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumberCreatorNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/PaperNumberCreatorNode' );
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
   * @param {MakeATenCommonView} makeATenView
   * @constructor
   */
  function MakeATenExplorerNode( numberValue, addNumberToModel, tryToCombineNumbers, canPlaceNumber, makeATenView ) {
    Node.call( this );

    var numberCollectionLayer = new Node();
    this.addChild( numberCollectionLayer );

    NUMBER_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      var paperNumberCreatorNode = new PaperNumberCreatorNode( numberValue, makeATenView );
      numberCollectionLayer.addChild( paperNumberCreatorNode );
      paperNumberCreatorNode.left = offset.x;
      paperNumberCreatorNode.top = offset.y;

    } );

  }

  makeATen.register( 'MakeATenExplorerNode', MakeATenExplorerNode );

  return inherit( Node, MakeATenExplorerNode );
} );