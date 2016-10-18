// Copyright 2016, University of Colorado Boulder

/**
 * Dialog that describes each game level.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Dialog = require( 'JOIST/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // Template for inserting the level number
  var gameInfoLevelXString = require( 'string!MAKE_A_TEN/game.info.levelX' );

  // Level descriptions
  var gameInfoLevel1String = require( 'string!MAKE_A_TEN/game.info.level1' );
  var gameInfoLevel2String = require( 'string!MAKE_A_TEN/game.info.level2' );
  var gameInfoLevel3String = require( 'string!MAKE_A_TEN/game.info.level3' );
  var gameInfoLevel4String = require( 'string!MAKE_A_TEN/game.info.level4' );
  var gameInfoLevel5String = require( 'string!MAKE_A_TEN/game.info.level5' );
  var gameInfoLevel6String = require( 'string!MAKE_A_TEN/game.info.level6' );
  var gameInfoLevel7String = require( 'string!MAKE_A_TEN/game.info.level7' );
  var gameInfoLevel8String = require( 'string!MAKE_A_TEN/game.info.level8' );
  var gameInfoLevel9String = require( 'string!MAKE_A_TEN/game.info.level9' );
  var gameInfoLevel10String = require( 'string!MAKE_A_TEN/game.info.level10' );

  var LEVEL_NUMBER_FONT = new PhetFont( { size: 14, weight: 'bold' } );
  var LEVEL_DESCRIPTION_FONT = new PhetFont( 14 );

  /**
   * @constructor
   */
  function InfoDialog() {
    var padWidth = new Text( StringUtils.format( gameInfoLevelXString, '10' ), { font: LEVEL_NUMBER_FONT } ).width + 20;
    function createLevelNode( levelInfo ) {
      return new Node( {
        children: [
          new Text( StringUtils.format( gameInfoLevelXString, '' + levelInfo.number ), {
            font: LEVEL_NUMBER_FONT
          } ),
          new Text( levelInfo.description, {
            font: LEVEL_DESCRIPTION_FONT,
            x: padWidth
          } )
        ]
      } );
    }
    var contentNode = new VBox( {
      align: 'left',
      spacing: 14,
      children: [
        { number: 1, description: gameInfoLevel1String },
        { number: 2, description: gameInfoLevel2String },
        { number: 3, description: gameInfoLevel3String },
        { number: 4, description: gameInfoLevel4String },
        { number: 5, description: gameInfoLevel5String },
        { number: 6, description: gameInfoLevel6String },
        { number: 7, description: gameInfoLevel7String },
        { number: 8, description: gameInfoLevel8String },
        { number: 9, description: gameInfoLevel9String },
        { number: 10, description: gameInfoLevel10String }
      ].map( createLevelNode )
    } );

    Dialog.call( this, contentNode, {
      modal: true,
      hasCloseButton: false
    } );
  }

  makeATen.register( 'InfoDialog', InfoDialog );

  return inherit( Dialog, InfoDialog );
} );
