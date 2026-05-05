// Copyright 2016-2026, University of Colorado Boulder

/**
 * Dialog that describes each game level.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
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
    const levelMaxWidth = 100;

    const padWidth = new Text( StringUtils.format( patternLevel0LevelNumberStringProperty.value, '10' ), { // TODO: I18n, see https://github.com/phetsims/make-a-ten/issues/310
      font: LEVEL_NUMBER_FONT,
      maxWidth: levelMaxWidth
    } ).width + 20;

    function createLevelNode( level: Level ): Node {
      return new Node( {
        children: [
          new Text( StringUtils.format( patternLevel0LevelNumberStringProperty.value, `${level.number}` ), { // TODO: I18n, see https://github.com/phetsims/make-a-ten/issues/310
            font: LEVEL_NUMBER_FONT,
            maxWidth: levelMaxWidth
          } ),
          new Text( level.descriptionProperty, {
            font: LEVEL_DESCRIPTION_FONT,
            x: padWidth,
            maxWidth: 500
          } )
        ]
      } );
    }

    const contentNode = new VBox( {
      align: 'left',
      spacing: 14,
      children: levels.map( createLevelNode )
    } );

    super( contentNode );
  }
}

export default InfoDialog;
