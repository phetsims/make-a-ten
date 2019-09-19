// Copyright 2015-2018, University of Colorado Boulder

/**
 * Contains an arrangement of level selection buttons.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  const Vector2 = require( 'DOT/Vector2' );

  // Constants
  const X_OFFSET = 170;
  const Y_OFFSET = 160;

  /**
   * @constructor
   *
   * @param {MakeATenGameModel} model - Our model
   */
  function StartGameLevelNode( model ) {
    Node.call( this );

    // @private {MakeATenGameModel}
    this.model = model;

    // Add the level buttons
    this.addLevelButton( model.levels[ 0 ], -1, -1 );
    this.addLevelButton( model.levels[ 1 ], 0, -1 );
    this.addLevelButton( model.levels[ 2 ], 1, -1 );
    this.addLevelButton( model.levels[ 3 ], -1.5, 0 );
    this.addLevelButton( model.levels[ 4 ], -0.5, 0 );
    this.addLevelButton( model.levels[ 5 ], 0.5, 0 );
    this.addLevelButton( model.levels[ 6 ], 1.5, 0 );
    this.addLevelButton( model.levels[ 7 ], -1, 1 );
    this.addLevelButton( model.levels[ 8 ], 0, 1 );
    this.addLevelButton( model.levels[ 9 ], 1, 1 );
  }

  makeATen.register( 'StartGameLevelNode', StartGameLevelNode );

  return inherit( Node, StartGameLevelNode, {
    /**
     * Adds a level button at a specified x/y offset (in relation to the center, in button offsets)
     * @private
     *
     * @param {Level} level
     * @param {number} xOffset - How many buttons to the right of the horizontal center should we be?
     * @param {number} yOffset - How many buttons to the bottom of the vertical center should we be?
     */
    addLevelButton: function( level, xOffset, yOffset ) {
      const fireCallback = this.model.startLevel.bind( this.model, level );
      const center = MakeATenConstants.LAYOUT_BOUNDS.center.plus( new Vector2( xOffset * X_OFFSET, yOffset * Y_OFFSET ) );

      const button = new LevelSelectionButton( level.iconNode, level.scoreProperty, {
        listener: fireCallback,
        baseColor: level.color,
        scoreDisplayConstructor: ScoreDisplayNumberAndStar
      } );
      button.scale( 0.9 );
      button.center = center;
      this.addChild( button );
    }
  } );
} );
