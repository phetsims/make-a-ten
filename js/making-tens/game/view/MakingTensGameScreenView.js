// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StartGameLevelNode = require( 'MAKING_TENS/making-tens/game/view/StartGameLevelNode' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );
  var ExpressionTermsNode = require( 'MAKING_TENS/making-tens/common/view/ExpressionTermsNode' );
  var NextArrowButton = require( 'MAKING_TENS/making-tens/game/view/NextArrowButton' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var GameState = require( 'MAKING_TENS/making-tens/game/model/GameState' );
  var GameIconNode = require( 'MAKING_TENS/making-tens/game/view/GameIconNode' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );

  // images
  var levelIcon1 = require( 'image!MAKING_TENS/level-1.png' );
  var levelIcon2 = require( 'image!MAKING_TENS/level-2.png' );
  var levelIcon3 = require( 'image!MAKING_TENS/level-3.png' );
  var levelIcon4 = require( 'image!MAKING_TENS/level-4.png' );
  var levelIcon5 = require( 'image!MAKING_TENS/level-5.png' );
  var levelIcon6 = require( 'image!MAKING_TENS/level-6.png' );
  var levelIcon7 = require( 'image!MAKING_TENS/level-7.png' );
  var levelIcon8 = require( 'image!MAKING_TENS/level-8.png' );
  var levelIcon9 = require( 'image!MAKING_TENS/level-9.png' );
  var levelIcon10 = require( 'image!MAKING_TENS/level-10.png' );

  //strings
  var nextString = require( 'string!MAKING_TENS/next' );

  var LEVEL_ICONS = [ levelIcon1, levelIcon2, levelIcon3, levelIcon4, levelIcon5, levelIcon6, levelIcon7, levelIcon8, levelIcon9, levelIcon10 ];

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
    var expressionTermsNode = new ExpressionTermsNode( gameModel.expressionTerms );
    expressionTermsNode.left = this.layoutBounds.minX + 38;
    expressionTermsNode.top = this.layoutBounds.minY + 25;
    this.challengeLayer.addChild( expressionTermsNode );

    // Create and add the Reset All Button in the bottom right, which resets the model
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        gameModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( this.resetAllButton );

    // Add the node that allows the user to choose a game level to play.
    this.startGameLevelNode = new StartGameLevelNode(
      function( level ) { gameModel.startLevel( level ); },
      LEVEL_ICONS.map( function( icon ) { return new GameIconNode( icon ); } ),
      gameModel.scores,
      {
        numStarsOnButtons: 1,
        numLevels: gameModel.numberOfLevels,
        numButtonRows: 3,
        controlsInset: 20
      }
    );

    this.rootNode.addChild( this.startGameLevelNode );

    //go to Level Selection Mode
    var backButton = new BackButton( {
        listener: function() {gameModel.setChoosingLevelState();},
        top: this.layoutBounds.bottom - 100,
        left: this.layoutBounds.left + 20
      }
    );
    this.controlLayer.addChild( backButton );

    this.nextChallengeButton = new NextArrowButton( nextString, {
      listener: function() {
        gameModel.nextChallenge();
      },
      top: this.layoutBounds.centerY - 100,
      left: this.layoutBounds.right - 100
    } );

    this.rootNode.addChild( this.nextChallengeButton );

    // Sound and timer controls.
    this.audioAndSoundControlBox = new HBox( {
      children: [
        new SoundToggleButton( gameModel.soundEnabledProperty )
      ],
      spacing: 10,
      x: 20,
      bottom: this.layoutBounds.height - 20
    } );

    this.rootNode.addChild( this.audioAndSoundControlBox );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );

    // Hook up the update function for handling changes to game state.
    gameModel.gameStateProperty.link( self.handleGameStateChange.bind( self ) );

  }

  makingTens.register( 'MakingTensGameScreenView', MakingTensGameScreenView );

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

        case GameState.CORRECT_ANSWER:
          this.handleCorrectAnswer( challenge );
          break;

        case GameState.MOVE_TO_NEXT_CHALLENGE:
          this.moveToNextChallenge();
          break;

        default:
          throw new Error( 'Unhandled game state: ' + gameState );
      }
    },

    // @private
    handleChoosingLevelState: function() {
      this.show( [ this.startGameLevelNode, this.resetAllButton, this.audioAndSoundControlBox ] );
      this.hideChallenge();
    },

    moveToNextChallenge: function() {
      this.show( [ this.challengeLayer, this.controlLayer, this.nextChallengeButton ] );
    },

    // @private
    show: function( nodesToShow ) {
      nodesToShow.forEach( function( nodeToShow ) { nodeToShow.visible = true; } );
    },

    // @private, Utility method for hiding all of the game nodes whose visibility changes during the course of a challenge.
    hideAllGameNodes: function() {
      var gameNodes = [ this.startGameLevelNode, this.resetAllButton, this.challengeLayer, this.controlLayer, this.audioAndSoundControlBox, this.nextChallengeButton ];
      gameNodes.forEach( function( node ) { node.visible = false; } );
    },

    // @private
    handlePresentingInteractiveChallengeState: function( challenge ) {
      this.makingTensModel.createTerms( challenge );
      // Make a list of the nodes to be shown in this state.
      var nodesToShow = [ this.challengeLayer, this.controlLayer ];
      this.show( nodesToShow );
    },

    // @private
    handleCorrectAnswer: function() {
      this.makingTensModel.handleCorrectAnswer();
      // Give the user the appropriate audio and visual feedback
      this.gameAudioPlayer.correctAnswer();

      var nodesToShow = [ this.challengeLayer, this.controlLayer ];
      this.show( nodesToShow );

    },

    // @private
    hideChallenge: function() {
      this.challengeLayer.visible = false;
      this.controlLayer.visible = false;
    }
  } );
} );