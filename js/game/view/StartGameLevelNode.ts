// Copyright 2015-2026, University of Colorado Boulder

/**
 * Contains an arrangement of level selection buttons.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MakeATenQueryParameters from '../../common/MakeATenQueryParameters.js';
import type MakeATenGameModel from '../model/MakeATenGameModel.js';

// Constants
const BUTTON_SIZE = 150;
const BUTTON_SCALE = 0.9;
const X_SPACING = 35 / BUTTON_SCALE;
const Y_SPACING = 25 / BUTTON_SCALE;

class StartGameLevelNode extends Node {

  /**
   * @param model - Our model
   */
  public constructor( model: MakeATenGameModel ) {
    super();

    const buttonItems: LevelSelectionButtonGroupItem[] = model.levels.map( level => {
      return {
        icon: level.iconNode,
        scoreProperty: level.scoreProperty,
        buttonListener: () => {
          model.startLevel( level );
        },
        options: {
          baseColor: level.color,
          createScoreDisplay: scoreProperty => new ScoreDisplayNumberAndStar( scoreProperty ),
          soundPlayerIndex: level.number - 1
        }
      };
    } );

    const levelSelectionButtonGroup = new LevelSelectionButtonGroup( buttonItems, {
      createLayoutNode: ( buttons: LevelSelectionButton[] ) => {
        assert && assert( buttons.length === 10, 'Make a Ten has 10 game levels' );
        return new VBox( {
          children: [
            new HBox( {
              children: [ buttons[ 0 ], buttons[ 1 ], buttons[ 2 ] ],
              spacing: X_SPACING,
              justify: 'center'
            } ),
            new HBox( {
              children: [ buttons[ 3 ], buttons[ 4 ], buttons[ 5 ], buttons[ 6 ] ],
              spacing: X_SPACING,
              justify: 'center'
            } ),
            new HBox( {
              children: [ buttons[ 7 ], buttons[ 8 ], buttons[ 9 ] ],
              spacing: X_SPACING,
              justify: 'center'
            } )
          ],
          spacing: Y_SPACING
        } );
      },
      groupButtonWidth: BUTTON_SIZE,
      groupButtonHeight: BUTTON_SIZE,
      gameLevels: MakeATenQueryParameters.gameLevels,
      tandem: Tandem.OPT_OUT
    } );

    levelSelectionButtonGroup.scale( BUTTON_SCALE );
    levelSelectionButtonGroup.center = ScreenView.DEFAULT_LAYOUT_BOUNDS.center;
    this.addChild( levelSelectionButtonGroup );
  }
}

export default StartGameLevelNode;
