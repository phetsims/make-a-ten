// Copyright 2015-2026, University of Colorado Boulder

/**
 * Contains an arrangement of level selection buttons.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import ScreenView from '../../../../../joist/js/ScreenView.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import LevelSelectionButton from '../../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import type Level from '../model/Level.js';
import type MakeATenGameModel from '../model/MakeATenGameModel.js';

// Constants
const X_OFFSET = 170;
const Y_OFFSET = 160;

class StartGameLevelNode extends Node {
  /**
   * @param model - Our model
   */
  public constructor( model: MakeATenGameModel ) {
    super();

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

  /**
   * Adds a level button at a specified x/y offset (in relation to the center, in button offsets)
   *
   * @param level
   * @param xOffset - How many buttons to the right of the horizontal center should we be?
   * @param yOffset - How many buttons to the bottom of the vertical center should we be?
   */
  private addLevelButton( level: Level, xOffset: number, yOffset: number ): void {
    const fireCallback = this.model.startLevel.bind( this.model, level );
    const center = ScreenView.DEFAULT_LAYOUT_BOUNDS.center.plus( new Vector2( xOffset * X_OFFSET, yOffset * Y_OFFSET ) );

    const button = new LevelSelectionButton( level.iconNode, level.scoreProperty, {
      listener: fireCallback,
      baseColor: level.color,
      createScoreDisplay: scoreProperty => new ScoreDisplayNumberAndStar( scoreProperty ),
      soundPlayerIndex: level.number - 1
    } );
    button.scale( 0.9 );
    button.center = center;
    this.addChild( button );
  }
}

export default StartGameLevelNode;
