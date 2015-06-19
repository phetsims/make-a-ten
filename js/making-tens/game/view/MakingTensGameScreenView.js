// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StartGameLevelNode = require( 'MAKING_TENS/making-tens/game/view/StartGameLevelNode' );
  var GameIconNode = require( 'MAKING_TENS/making-tens/game/view/GameIconNode' );


  //strings
  var tenAndUnderString = require( 'string!MAKING_TENS/tenAndUnder' );
  var addWithNineString = require( 'string!MAKING_TENS/addWithNine' );
  var underTwentyString = require( 'string!MAKING_TENS/underTwenty' );
  var addWithTensString = require( 'string!MAKING_TENS/addWithTens' );
  var addWithSinglesString = require( 'string!MAKING_TENS/addWithSingles' );
  var underHundredString = require( 'string!MAKING_TENS/underHundred' );
  var overHundredString = require( 'string!MAKING_TENS/overHundred' );
  var triplesString = require( 'string!MAKING_TENS/triples' );


  /**
   * @param {MakingTensGameModel} gameModel
   * @constructor
   */
  function MakingTensGameScreenView( gameModel ) {
    ScreenView.call( this );

    var rootNode = new Node();
    this.addChild( rootNode );


    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        gameModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // Add the node that allows the user to choose a game level to play.
    this.startGameLevelNode = new StartGameLevelNode(
      function( level ) { gameModel.startLevel( level ); },
      function() { gameModel.reset(); },
      gameModel.timerEnabledProperty,
      gameModel.soundEnabledProperty,
      [
        new GameIconNode( [ 7, 3 ], tenAndUnderString ),
        new GameIconNode( [ 9, 7 ], addWithNineString ),
        new GameIconNode( [ 7, 8 ], underTwentyString ),
        new GameIconNode( [ 70, 80 ], addWithTensString ),
        new GameIconNode( [ 29, 7 ], addWithSinglesString ),
        new GameIconNode( [ 17, 49 ], underHundredString ),
        new GameIconNode( [ 87, 59 ], overHundredString ),
        new GameIconNode( [ 200, 7 ], addWithSinglesString ),
        new GameIconNode( [ 270, 310 ], addWithTensString ),
        new GameIconNode( [ 317, 949 ], triplesString )
      ],
      gameModel.bestScores,
      {
        numStarsOnButtons: gameModel.challengesPerSet,
        perfectScore: gameModel.maxPossibleScore,
        numLevels: gameModel.numberOfLevels,
        numButtonRows: 3,
        controlsInset: 20
      }
    );

    rootNode.addChild( this.startGameLevelNode );
  }

  return inherit( ScreenView, MakingTensGameScreenView );
} );