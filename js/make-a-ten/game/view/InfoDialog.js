// Copyright 2016-2018, University of Colorado Boulder

/**
 * Dialog that describes each game level.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Dialog = require( 'SUN/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // Template for inserting the level number
  var patternLevel0LevelNumberString = require( 'string!MAKE_A_TEN/pattern.level.0levelNumber' );

  var LEVEL_NUMBER_FONT = new PhetFont( { size: 14, weight: 'bold' } );
  var LEVEL_DESCRIPTION_FONT = new PhetFont( 14 );

  /**
   * @constructor
   *
   * @param {Array.<Level>} levels - All game levels
   */
  function InfoDialog( levels ) {
    var levelMaxWidth = 100;

    var padWidth = new Text( StringUtils.format( patternLevel0LevelNumberString, '10' ), {
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
    var contentNode = new VBox( {
      align: 'left',
      spacing: 14,
      children: levels.map( createLevelNode )
    } );

    Dialog.call( this, contentNode );
  }

  makeATen.register( 'InfoDialog', InfoDialog );

  return inherit( Dialog, InfoDialog );
} );
