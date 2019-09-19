// Copyright 2016-2018, University of Colorado Boulder

/**
 * Shows a reward, and allows the user to (a) keep going with the current level, or (b) go back to the level selection.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const BaseNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/BaseNumber' );
  const BaseNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/BaseNumberNode' );
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const RewardNode = require( 'VEGAS/RewardNode' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );

  function createNumber( digit, place ) {
    const node = new BaseNumberNode( new BaseNumber( digit, place ), 1 );
    node.scale( 0.5 );
    return node;
  }

  /**
   * @constructor
   */
  function MakeATenRewardNode() {
    RewardNode.call( this, {
      nodes: RewardNode.createRandomNodes( [
        new StarNode(),
        new StarNode(),
        new StarNode(),
        new StarNode(),
        new StarNode(),
        new StarNode(),
        new StarNode(),
        new FaceNode( 40, { headStroke: 'black' } ),
        new FaceNode( 40, { headStroke: 'black' } ),
        new FaceNode( 40, { headStroke: 'black' } ),
        new FaceNode( 40, { headStroke: 'black' } ),
        new FaceNode( 40, { headStroke: 'black' } ),
        new FaceNode( 40, { headStroke: 'black' } ),
        new FaceNode( 40, { headStroke: 'black' } ),
        createNumber( 1, 0 ),
        createNumber( 2, 0 ),
        createNumber( 3, 0 ),
        createNumber( 4, 0 ),
        createNumber( 5, 0 ),
        createNumber( 6, 0 ),
        createNumber( 7, 0 ),
        createNumber( 8, 0 ),
        createNumber( 9, 0 ),
        createNumber( 1, 1 ),
        createNumber( 1, 1 ),
        createNumber( 1, 1 ),
        createNumber( 1, 1 ),
        createNumber( 1, 1 )
      ], 150 )
    } );
  }

  makeATen.register( 'MakeATenRewardNode', MakeATenRewardNode );

  return inherit( RewardNode, MakeATenRewardNode );
} );
