// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StartGameLevelNode = require( 'MAKING_TENS/making-tens/game/view/StartGameLevelNode' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );
  var ExpressionTermsNode = require( 'MAKING_TENS/making-tens/common/view/ExpressionTermsNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var GameState = require( 'MAKING_TENS/making-tens/game/model/GameState' );
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
    var self = this;
    this.paperNumberNodeLayer = new Node();
    MakingTensCommonView.call( this, gameModel, MakingTensSharedConstants.LAYOUT_BOUNDS, this.paperNumberNodeLayer );

    this.rootNode = new Node();
    this.addChild( this.rootNode );

    // Add layers used to control game appearance.
    this.controlLayer = new Node();
    this.rootNode.addChild( this.controlLayer );

    this.challengeLayer = new Node();
    this.rootNode.addChild( this.challengeLayer );
    this.challengeLayer.addChild( this.paperNumberNodeLayer );

    // The node that display "12 + 100 = "
    var expressionTermsNode = new ExpressionTermsNode( gameModel.leftTermProperty, gameModel.rightTermProperty );
    expressionTermsNode.left = this.layoutBounds.minX + 38;
    expressionTermsNode.top = this.layoutBounds.minY + 65;
    this.challengeLayer.addChild( expressionTermsNode );

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

    this.rootNode.addChild( this.startGameLevelNode );

    // Hook up the update function for handling changes to game state.
    gameModel.gameStateProperty.link( self.handleGameStateChange.bind( self ) );

    // Add the button for returning to the level selection screen.
    /* this.controlLayer.addChild( new RectangularPushButton( {
     content: new Text( startOverString, { font: BUTTON_FONT } ),
     listener: function() { gameModel.setChoosingLevelState(); },
     baseColor: BUTTON_FILL,
     centerX: this.scoreboard.centerX,
     centerY: this.solutionBanner.centerY
     } ) ); */

  }

  return inherit( MakingTensCommonView, MakingTensGameScreenView, {

    /**
     * @private, When the game state changes, update the view with the appropriate buttons and readouts.
     * @param gameState
     */
    handleGameStateChange: function( gameState ) {
      // Hide all nodes - the appropriate ones will be shown later based on the current state.
      this.hideAllGameNodes();
      var challenge = this.makingTensModel.currentChallenge;


      // Show the nodes appropriate to the state
      switch( gameState ) {

        case GameState.CHOOSING_LEVEL:
          this.handleChoosingLevelState();
          break;

        case GameState.PRESENTING_INTERACTIVE_CHALLENGE:
          this.handlePresentingInteractiveChallengeState( challenge );
          break;

        case GameState.SHOWING_CORRECT_ANSWER_FEEDBACK:
          this.handleShowingCorrectAnswerFeedbackState( challenge );
          break;

        case GameState.SHOWING_LEVEL_RESULTS:
          this.handleShowingLevelResultsState();
          break;

        default:
          throw new Error( 'Unhandled game state: ' + gameState );
      }
    },

    // @private
    handleChoosingLevelState: function() {
      this.show( [ this.startGameLevelNode ] );
      this.hideChallenge();
    },

    // @private
    show: function( nodesToShow ) {
      nodesToShow.forEach( function( nodeToShow ) { nodeToShow.visible = true; } );
    },

    // @private, Utility method for hiding all of the game nodes whose visibility changes during the course of a challenge.
    hideAllGameNodes: function() {
      var gameNodes = [ this.startGameLevelNode, this.challengeLayer, this.controlLayer ];
      gameNodes.forEach( function( node ) { node.visible = false; } );
    },

    // @private
    handlePresentingInteractiveChallengeState: function( challenge ) {
      this.makingTensModel.createTerms( challenge );
      // Make a list of the nodes to be shown in this state.
      var nodesToShow = [ this.challengeLayer, this.controlLayer ];
      this.show( nodesToShow );
      this.showChallengeGraphics();
    },

    // @private
    hideChallenge: function() {
      this.challengeLayer.visible = false;
      this.controlLayer.visible = false;
    },

    // Show the graphic model elements for this challenge.
    showChallengeGraphics: function() {
      this.challengeLayer.visible = true;
      this.controlLayer.visible = true;
    }

  } );
} );