// Copyright 2016-2018, University of Colorado Boulder

/**
 * Dialog that describes each game level.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // Template for inserting the level number
  const patternLevel0LevelNumberString = require( 'string!MAKE_A_TEN/pattern.level.0levelNumber' );

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

  return inherit( Dialog, InfoDialog );
} );
