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
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StartGameLevelNode = require( 'MAKE_A_TEN/make-a-ten/game/view/StartGameLevelNode' );
  var InfoDialog = require( 'MAKE_A_TEN/make-a-ten/game/view/InfoDialog' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var ExpressionTermsNode = require( 'MAKE_A_TEN/make-a-ten/common/view/ExpressionTermsNode' );
  var NextArrowButton = require( 'MAKE_A_TEN/make-a-ten/game/view/NextArrowButton' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );
  var GameState = require( 'MAKE_A_TEN/make-a-ten/game/model/GameState' );
  var MakeATenGameModel = require( 'MAKE_A_TEN/make-a-ten/game/model/MakeATenGameModel' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  var levelIcon1 = require( 'image!MAKE_A_TEN/level-1.png' );
  var levelIcon2 = require( 'image!MAKE_A_TEN/level-2.png' );
  var levelIcon3 = require( 'image!MAKE_A_TEN/level-3.png' );
  var levelIcon4 = require( 'image!MAKE_A_TEN/level-4.png' );
  var levelIcon5 = require( 'image!MAKE_A_TEN/level-5.png' );
  var levelIcon6 = require( 'image!MAKE_A_TEN/level-6.png' );
  var levelIcon7 = require( 'image!MAKE_A_TEN/level-7.png' );
  var levelIcon8 = require( 'image!MAKE_A_TEN/level-8.png' );
  var levelIcon9 = require( 'image!MAKE_A_TEN/level-9.png' );
  var levelIcon10 = require( 'image!MAKE_A_TEN/level-10.png' );

  //strings
  var nextString = require( 'string!MAKE_A_TEN/next' );

  var LEVEL_ICONS = [ levelIcon1, levelIcon2, levelIcon3, levelIcon4, levelIcon5, levelIcon6, levelIcon7, levelIcon8, levelIcon9, levelIcon10 ];
  var ICON_SIZE = new Dimension2( 729 / 2, 420 / 2 );

  /**
   * @param {MakeATenGameModel} gameModel
   * @constructor
   */
  function MakeATenGameScreenView( gameModel ) {
    MakeATenCommonView.call( this, gameModel, MakeATenSharedConstants.LAYOUT_BOUNDS );

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
    expressionTermsNode.left = this.layoutBounds.minX + 38;
    expressionTermsNode.top = this.layoutBounds.minY + 25;
    this.challengeLayer.addChild( expressionTermsNode );

    // Add the node that allows the user to choose a game level to play.
    this.startGameLevelNode = new StartGameLevelNode(
      function( level ) { gameModel.startLevel( level ); },
      LEVEL_ICONS.map( function( levelIconImage ) {
        return MakeATenUtil.createSizedImageNode( new Image( levelIconImage ), ICON_SIZE );
      } ),
      gameModel.scores,
      {
        numStarsOnButtons: 1,
        numLevels: MakeATenGameModel.NUMBER_OF_LEVELS,
        numButtonRows: 3,
        controlsInset: 20
      }
    );

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
          infoDialog = new InfoDialog();
        }
        infoDialog.show();
      },
      top: this.layoutBounds.top + 20,
      right: this.layoutBounds.right - 20
    } );
    this.rootNode.addChild( this.infoButton );

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
      right: this.layoutBounds.right - 20
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
    gameModel.gameStateProperty.link( this.handleGameStateChange.bind( this ) );
  }

  makeATen.register( 'MakeATenGameScreenView', MakeATenGameScreenView );

  return inherit( MakeATenCommonView, MakeATenGameScreenView, {

    /**
     * @private, When the game state changes, update the view with the appropriate buttons and readouts.
     * @param gameState
     */
    handleGameStateChange: function( gameState ) {
      // Hide all nodes - the appropriate ones will be shown later based on the current state.
      this.hideAllGameNodes();
      var challenge = this.makeATenModel.currentChallenge;


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
      this.show( [ this.startGameLevelNode, this.resetAllButton, this.audioAndSoundControlBox, this.infoButton ] );
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
      var gameNodes = [ this.startGameLevelNode, this.resetAllButton, this.challengeLayer, this.controlLayer, this.audioAndSoundControlBox, this.nextChallengeButton, this.infoButton ];
      gameNodes.forEach( function( node ) { node.visible = false; } );
    },

    // @private
    handlePresentingInteractiveChallengeState: function( challenge ) {
      this.makeATenModel.createTerms( challenge );
      this.show( [ this.challengeLayer, this.controlLayer ] );
    },

    // @private
    handleCorrectAnswer: function() {
      this.makeATenModel.handleCorrectAnswer();
      // Give the user the appropriate audio and visual feedback
      this.gameAudioPlayer.correctAnswer();

      this.show( [ this.challengeLayer, this.controlLayer ] );
    },

    // @private
    hideChallenge: function() {
      this.challengeLayer.visible = false;
      this.controlLayer.visible = false;
    }
  } );
} );