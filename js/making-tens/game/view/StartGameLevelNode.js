// Copyright 2015, University of Colorado Boulder

/**
 * A node that pretty much fills the screen and that allows the user to select the game level that they wish to play.
 *
 * TODO: Should be replaced with generalized version.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionButton = require( 'MAKING_TENS/making-tens/game/view/LevelSelectionButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );


  // strings
  var chooseYourLevelString = require( 'string!MAKING_TENS/chooseYourLevel' );

  /**
   * @param {Function} startLevelFunction - Function used to initiate a game
   * level, will be called with a zero-based index value.
   * @param {Array} iconNodes - Set of iconNodes to use on the buttons, sizes
   * should be the same, length of array must match number of levels.
   * @param {Array} scores - Current scores, used to decide which stars to
   * illuminate on the level start buttons, length must match number of levels.
   * @param {Object} [options] - See code below for options and default values.
   * @constructor
   */
  function StartGameLevelNode( startLevelFunction, iconNodes, scores, options ) {
    Node.call( this );
    options = _.extend( {
      // Defaults
      numLevels: 10,
      titleString: chooseYourLevelString,
      numStarsOnButtons: 1,
      numButtonRows: 1, // For layout
      controlsInset: 12,
      size: MakingTensSharedConstants.LAYOUT_BOUNDS
    }, options );

    // Verify parameters
    if ( iconNodes.length !== options.numLevels || scores.length !== options.numLevels ) {
      throw new Error( 'Number of game levels doesn\'t match length of provided arrays' );
    }

    // Add the buttons
    function createLevelStartFunction( level ) {
      return function() { startLevelFunction( level ); };
    }

    var buttonColors = [ '#F7ED41', '#A6E4EC', '#D4C5E4' ];
    var buttonRows = [ 3, 4, 3 ]; // 3 on the first row,4 on the second amd 3 on the next one
    var levelSelectionButtons = new Array( options.numLevels );
    var level = 0;
    for ( var row = 0; row < buttonRows.length; row++ ) {
      var numColumns = buttonRows[ row ];

      //buttons on the same row have the same color
      for ( var i = 0; i < numColumns; i++ ) {
        levelSelectionButtons[ level ] = new LevelSelectionButton(
          iconNodes[ level ],
          options.numStarsOnButtons,
          createLevelStartFunction( level ),
          scores[ level ], {
            baseColor: buttonColors[ row ]
          }
        );
        levelSelectionButtons[ level ].scale( 0.9 );
        this.addChild( levelSelectionButtons[ level ] );
        level++;
      }
    }

    // Layout
    var buttonSpacingX = levelSelectionButtons[ 0 ].width * 1.2; // Note: Assumes all buttons are the same size.
    var buttonSpacingY = levelSelectionButtons[ 0 ].height * 1.2;  // Note: Assumes all buttons are the same size.
    var buttonIndex = 0;
    for ( row = 0; row < buttonRows.length; row++ ) {
      var columns = buttonRows[ row ];
      var firstButtonOrigin = new Vector2( options.size.width / 2 - ( columns - 1 ) * buttonSpacingX / 2,
        options.size.height * 0.5 - ( ( buttonRows.length - 1 ) * buttonSpacingY ) / 2 );

      for ( var col = 0; col < columns; col++ ) {
        levelSelectionButtons[ buttonIndex ].centerX = firstButtonOrigin.x + col * buttonSpacingX;
        levelSelectionButtons[ buttonIndex ].centerY = firstButtonOrigin.y + row * buttonSpacingY;
        buttonIndex++;
      }
    }


  }

  // Inherit from Node.
  return inherit( Node, StartGameLevelNode );
} );
