// Copyright 2016-2026, University of Colorado Boulder

/**
 * Dialog that describes each game level.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import MakeATenStrings from '../../MakeATenStrings.js';
import type Level from '../model/Level.js';

// Template for inserting the level number
const patternLevel0LevelNumberStringProperty = MakeATenStrings.pattern.level[ '0levelNumberStringProperty' ];

const LEVEL_NUMBER_FONT = new PhetFont( { size: 14, weight: 'bold' } );
const LEVEL_DESCRIPTION_FONT = new PhetFont( 14 );

class InfoDialog extends Dialog {
  /**
   * @param levels - All game levels
   */
  public constructor( levels: Level[] ) {
    const levelNumberMaxWidth = 100;

    function createLevelNode( level: Level ): Node {
      return new Text( new PatternStringProperty( patternLevel0LevelNumberStringProperty, {
        levelNumber: level.number
      }, {
        formatNames: [ 'levelNumber' ]
      } ), {
        font: LEVEL_NUMBER_FONT,
        maxWidth: levelNumberMaxWidth
      } );
    }

    const contentNode = new GridBox( {
      rows: levels.map( level => [
        createLevelNode( level ),
        new Text( level.descriptionProperty, {
          font: LEVEL_DESCRIPTION_FONT,
          maxWidth: 500
        } )
      ] ),
      xAlign: 'left',
      yAlign: 'center',
      xSpacing: 20,
      ySpacing: 14
    } );

    super( contentNode );
  }
}

export default InfoDialog;
