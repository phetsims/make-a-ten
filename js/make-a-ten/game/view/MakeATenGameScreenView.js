// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StartGameLevelNode = require( 'MAKE_A_TEN/make-a-ten/game/view/StartGameLevelNode' );
  var InfoDialog = require( 'MAKE_A_TEN/make-a-ten/game/view/InfoDialog' );
  var GameStatusBar = require( 'MAKE_A_TEN/make-a-ten/game/view/GameStatusBar' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var ExpressionTermsNode = require( 'MAKE_A_TEN/make-a-ten/common/view/ExpressionTermsNode' );
  var NextArrowButton = require( 'MAKE_A_TEN/make-a-ten/game/view/NextArrowButton' );
  var GameState = require( 'MAKE_A_TEN/make-a-ten/game/model/GameState' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  //strings
  var nextString = require( 'string!MAKE_A_TEN/next' );

  /**
   * @param {MakeATenGameModel} gameModel
   * @constructor
   */
  function MakeATenGameScreenView( gameModel ) {
    MakeATenCommonView.call( this, gameModel );

    this.rootNode = new Node();
    this.addChild( this.rootNode );

    // Add layers used to control game appearance.
    this.controlLayer = new Node();
    this.rootNode.addChild( this.controlLayer );

    this.challengeLayer = new Node();
    this.rootNode.addChild( this.challengeLayer );
    this.challengeLayer.addChild( this.paperNumberLayerNode );

    // The node that display "12 + 100 = "
    var expressionTermsNode = new ExpressionTermsNode( gameModel.expressionTerms );
    expressionTermsNode.left = this.layoutBounds.left + 38;
    expressionTermsNode.top = this.layoutBounds.top + 75;
    this.challengeLayer.addChild( expressionTermsNode );

    // Add the node that allows the user to choose a game level to play.
    this.startGameLevelNode = new StartGameLevelNode( gameModel );
    this.rootNode.addChild( this.startGameLevelNode );

    // created lazily
    var infoDialog = null;

    this.infoButton = new RectangularPushButton( {
      content: new Text( '?', {
        font: new PhetFont( { size: 20, weight: 'bold' } )
      } ),
      baseColor: '#eeeeee',
      listener: function() {
        if ( !infoDialog ) {
          infoDialog = new InfoDialog( gameModel.levels );
        }
        infoDialog.show();
      },
      top: this.layoutBounds.top + 20,
      right: this.layoutBounds.right - 20
    } );
    this.rootNode.addChild( this.infoButton );

    this.nextChallengeButton = new NextArrowButton( nextString, {
      listener: function() {
        gameModel.nextChallenge();
      },
      top: this.layoutBounds.centerY,
      right: this.layoutBounds.right - 20
    } );

    this.rootNode.addChild( this.nextChallengeButton );

    // Sound and timer controls.
    this.soundToggleButton = new SoundToggleButton( gameModel.soundEnabledProperty, {
      x: 20,
      bottom: this.layoutBounds.height - 20
    } );
    this.rootNode.addChild( this.soundToggleButton );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );

    this.gameStatusBar = new GameStatusBar( gameModel );
    this.rootNode.addChild( this.gameStatusBar );

    // Hook up the update function for handling changes to game state.
    gameModel.gameStateProperty.link( this.handleGameStateChange.bind( this ) );

    this.layoutControls();
  }

  makeATen.register( 'MakeATenGameScreenView', MakeATenGameScreenView );

  return inherit( MakeATenCommonView, MakeATenGameScreenView, {
    /**
     * @override
     */
    layoutControls: function() {
      MakeATenCommonView.prototype.layoutControls.call( this );

      this.gameStatusBar.layout( this.visibleBoundsProperty.value );
    },

    /**
     * @private, When the game state changes, update the view with the appropriate buttons and readouts.
     * @param gameState
     */
    handleGameStateChange: function( gameState ) {
      // Hide all nodes - the appropriate ones will be shown later based on the current state.
      this.hideAllGameNodes();
      var challenge = this.makeATenModel.currentChallengeProperty.value;


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
      this.show( [ this.startGameLevelNode, this.resetAllButton, this.soundToggleButton, this.infoButton ] );
      this.hideChallenge();
    },

    moveToNextChallenge: function() {
      this.show( [ this.challengeLayer, this.controlLayer, this.nextChallengeButton, this.gameStatusBar ] );
    },

    // @private
    show: function( nodesToShow ) {
      nodesToShow.forEach( function( nodeToShow ) { nodeToShow.visible = true; } );
    },

    // @private, Utility method for hiding all of the game nodes whose visibility changes during the course of a challenge.
    hideAllGameNodes: function() {
      var gameNodes = [ this.startGameLevelNode, this.resetAllButton, this.challengeLayer, this.controlLayer, this.soundToggleButton, this.nextChallengeButton, this.infoButton ];
      gameNodes.forEach( function( node ) { node.visible = false; } );
    },

    // @private
    handlePresentingInteractiveChallengeState: function( challenge ) {
      this.makeATenModel.createTerms( challenge );
      this.show( [ this.challengeLayer, this.controlLayer, this.gameStatusBar ] );
    },

    // @private
    handleCorrectAnswer: function() {
      this.makeATenModel.handleCorrectAnswer();
      // Give the user the appropriate audio and visual feedback
      this.gameAudioPlayer.correctAnswer();

      this.show( [ this.challengeLayer, this.controlLayer, this.gameStatusBar ] );
    },

    // @private
    hideChallenge: function() {
      this.challengeLayer.visible = false;
      this.controlLayer.visible = false;
      this.gameStatusBar.visible = false;
    },

    /**
     * @override
     */
    getTopBoundsOffset: function() {
      return this.gameStatusBar.height;
    }
  } );
} );