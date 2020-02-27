// Copyright 2016-2019, University of Colorado Boulder

/**
 * Dialog that describes each game level.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import makeATenStrings from '../../../make-a-ten-strings.js';
import makeATen from '../../../makeATen.js';

// Template for inserting the level number
const patternLevel0LevelNumberString = makeATenStrings.pattern.level[ '0levelNumber' ];

const LEVEL_NUMBER_FONT = new PhetFont( { size: 14, weight: 'bold' } );
const LEVEL_DESCRIPTION_FONT = new PhetFont( 14 );

/**
 * @constructor
 *
 * @param {Array.<Level>} levels - All game levels
 */
function InfoDialog( levels ) {
  const levelMaxWidth = 100;

  const padWidth = new Text( StringUtils.format( patternLevel0LevelNumberString, '10' ), {
    font: LEVEL_NUMBER_FONT,
    maxWidth: levelMaxWidth
  } ).width + 20;

  function createLevelNode( level ) {
    return new Node( {
      children: [
        new Text( StringUtils.format( patternLevel0LevelNumberString, '' + level.number ), {
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

  Dialog.call( this, contentNode );
}

makeATen.register( 'InfoDialog', InfoDialog );

inherit( Dialog, InfoDialog );
export default InfoDialog;