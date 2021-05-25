// Copyright 2016-2021, University of Colorado Boulder

/**
 * Dialog that describes each game level.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import makeATen from '../../../makeATen.js';
import makeATenStrings from '../../../makeATenStrings.js';

// Template for inserting the level number
const patternLevel0LevelNumberString = makeATenStrings.pattern.level[ '0levelNumber' ];

const LEVEL_NUMBER_FONT = new PhetFont( { size: 14, weight: 'bold' } );
const LEVEL_DESCRIPTION_FONT = new PhetFont( 14 );

class InfoDialog extends Dialog {
  /**
   * @param {Array.<Level>} levels - All game levels
   */
  constructor( levels ) {
    const levelMaxWidth = 100;

    const padWidth = new Text( StringUtils.format( patternLevel0LevelNumberString, '10' ), {
      font: LEVEL_NUMBER_FONT,
      maxWidth: levelMaxWidth
    } ).width + 20;

    function createLevelNode( level ) {
      return new Node( {
        children: [
          new Text( StringUtils.format( patternLevel0LevelNumberString, `${level.number}` ), {
            font: LEVEL_NUMBER_FONT,
            maxWidth: levelMaxWidth
          } ),
          new Text( level.description, {
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

makeATen.register( 'InfoDialog', InfoDialog );
export default InfoDialog;