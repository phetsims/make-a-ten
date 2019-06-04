// Copyright 2015-2018, University of Colorado Boulder

/**
 * Game screenview for make-a-ten. Includes 10 levels, where the goal for each is to combine the 2 numbers together into
 * one number by manipulating with the concept of making a ten. Each level can generate an infinite number of
 * challenges, so the score for each level is an integer (instead of a proportion like other sims).
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var AdditionTermsNode = require( 'MAKE_A_TEN/make-a-ten/common/view/AdditionTermsNode' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Easing = require( 'TWIXT/Easing' );
  var GameAudioPlayerOld = require( 'VEGAS/GameAudioPlayerOld' );
  var GameState = require( 'MAKE_A_TEN/make-a-ten/game/model/GameState' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var InfiniteStatusBar = require( 'VEGAS/InfiniteStatusBar' );
  var InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  var InfoDialog = require( 'MAKE_A_TEN/make-a-ten/game/view/InfoDialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var MakeATenRewardNode = require( 'MAKE_A_TEN/make-a-ten/game/view/MakeATenRewardNode' );
  var NextArrowButton = require( 'MAKE_A_TEN/make-a-ten/game/view/NextArrowButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RewardDialog = require( 'VEGAS/RewardDialog' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StartGameLevelNode = require( 'MAKE_A_TEN/make-a-ten/game/view/StartGameLevelNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TransitionNode = require( 'TWIXT/TransitionNode' );

  // strings
  var nextString = require( 'string!MAKE_A_TEN/next' );
  var patternLevel0LevelNumberString = require( 'string!MAKE_A_TEN/pattern.level.0levelNumber' );

  /**
   * @constructor
   *
   * @param {MakeATenGameModel} model
   */
  function MakeATenGameScreenView( model ) {
    MakeATenCommonView.call( this, model );

    var self = this;

    // @private {Node} - The "left" half of the sliding layer, displayed first
    this.levelSelectionLayer = new Node();

    // @private {Node} - The "right" half of the sliding layer, will slide into view when the user selects a level
    this.challengeLayer = new Node();

    var showingLeftProperty = new DerivedProperty( [ model.gameStateProperty ], function( gameState ) {
      return gameState === GameState.CHOOSING_LEVEL;
    } );

    // @private {TransitionNode}
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: this.levelSelectionLayer
    } );
    showingLeftProperty.lazyLink( function( isLeft ) {
      if ( isLeft ) {
        self.transitionNode.slideRightTo( self.levelSelectionLayer, {
          duration: 0.4,
          targetOptions: {
            easing: Easing.QUADRATIC_IN_OUT
          }
        } );
      }
      else {
        self.transitionNode.slideLeftTo( self.challengeLayer, {
          duration: 0.4,
          targetOptions: {
            easing: Easing.QUADRATIC_IN_OUT
          }
        } );
      }
    } );
    this.addChild( this.transitionNode );

    // @private {StartGameLevelNode} - Shows buttons that allow selecting the level to play
    this.startGameLevelNode = new StartGameLevelNode( model );
    this.levelSelectionLayer.addChild( this.startGameLevelNode );

    // Move our resetAllButton onto our level-selection layer
    this.resetAllButton.detach();
    this.levelSelectionLayer.addChild( this.resetAllButton );

    // info dialog, constructed lazily because Dialog requires sim bounds during construction
    var dialog = null;

    // @private {InfoButton} - Shows '?' in the corner that pops up the info dialog when clicked.
    this.infoButton = new InfoButton( {
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      listener: function() {
        if ( !dialog ) {
          dialog = new InfoDialog( model.levels );
        }
        dialog.show();
      },
      scale: 0.7,
      top: this.layoutBounds.top + 20,
      right: this.layoutBounds.right - 20
    } );
    this.levelSelectionLayer.addChild( this.infoButton );

    // @private {SoundToggleButton} - Toggle whether audio is enabled
    this.soundToggleButton = new SoundToggleButton( model.soundEnabledProperty, {
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      x: 20,
      bottom: this.layoutBounds.height - 20
    } );
    this.levelSelectionLayer.addChild( this.soundToggleButton );

    // The node that display "12 + 100 = "
    var additionTermsNode = new AdditionTermsNode( model.additionTerms, false );
    additionTermsNode.left = this.layoutBounds.left + 38;
    additionTermsNode.top = this.layoutBounds.top + 75;
    this.challengeLayer.addChild( additionTermsNode );

    // @private {NextArrowButton} - Moves to the next challenge when clicked
    this.nextChallengeButton = new NextArrowButton( nextString, {
      listener: function() {
        model.moveToNextChallenge();
      },
      top: this.layoutBounds.centerY,
      right: this.layoutBounds.right - 20
    } );
    this.challengeLayer.addChild( this.nextChallengeButton );
    model.gameStateProperty.link( function( gameState ) {
      self.nextChallengeButton.visible = gameState === GameState.CORRECT_ANSWER;
    } );

    // Add the paper number layer from our supertype
    this.challengeLayer.addChild( this.paperNumberLayerNode );

    var levelNumberText = new Text( '', {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      pickable: false,
      maxWidth: 120
    } );
    var levelDescriptionText = new Text( '', {
      font: new PhetFont( 18 ),
      pickable: false
    } );
    model.currentLevelProperty.link( function( level ) {
      levelNumberText.text = StringUtils.format( patternLevel0LevelNumberString, '' + level.number );
      levelDescriptionText.text = level.description;
    } );
    var statusMessageNode = new HBox( {
      children: [ levelNumberText, levelDescriptionText ],
      spacing: 30
    } );

    // @private {InfiniteStatusBar} - Status bar at the top of the screen
    this.gameStatusBar = new InfiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, statusMessageNode, model.currentScoreProperty, {
      floatToTop: true,
      barFill: new DerivedProperty( [ model.currentLevelProperty ], _.property( 'color' ) ),
      backButtonListener: model.moveToChoosingLevel.bind( model )
    } );
    this.challengeLayer.addChild( this.gameStatusBar );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayerOld( model.soundEnabledProperty );

    // Trigger initial layout
    this.layoutControls();

    // Hook up the update function for handling changes to game state.
    model.gameStateProperty.link( this.onGameStateChange.bind( this ) );

    // @private {RewardNode|null} - see showReward()
    this.rewardNode = null;

    // @private {function|null} - see showReward()
    this.rewardNodeBoundsListener = null;

    // @private {Rectangle}
    this.rewardBarrier = Rectangle.bounds( this.visibleBoundsProperty.value, {
      fill: 'rgba(128,128,128,0.4)'
    } );
    this.visibleBoundsProperty.linkAttribute( this.rewardBarrier, 'rectBounds' );
    this.rewardBarrier.addInputListener( new ButtonListener( {
      fire: function( event ) {
        self.hideReward();
      }
    } ) );

    model.levels.forEach( function( level ) {
      level.scoreProperty.link( function( score ) {
        if ( score === 10 ) {
          self.showReward();
        }
      } );
    } );
  }

  makeATen.register( 'MakeATenGameScreenView', MakeATenGameScreenView );

  return inherit( MakeATenCommonView, MakeATenGameScreenView, {
    /**
     * @override
     */
    step: function( dt ) {
      this.rewardNode && this.rewardNode.step( dt );
      this.transitionNode && this.transitionNode.step( dt );
    },

    /**
     * Shows the reward node.
     * @private
     */
    showReward: function() {
      var self = this;

      this.gameAudioPlayer.gameOverPerfectScore();

      this.rewardNode = new MakeATenRewardNode();
      this.addChild( this.rewardBarrier );
      this.addChild( this.rewardNode );
      this.rewardNodeBoundsListener = this.visibleBoundsProperty.linkAttribute( this.rewardNode, 'canvasBounds' );

      var rewardDialog = new RewardDialog( 10, {
        keepGoingButtonListener: function() {
          self.hideReward();
          rewardDialog.dispose();

        },
        newLevelButtonListener: function() {
          self.hideReward();
          self.model.moveToChoosingLevel();
          rewardDialog.dispose();
        }
      } );
      rewardDialog.show();
    },

    /**
     * Hides the reward node.
     * @private
     */
    hideReward: function() {
      this.removeChild( this.rewardNode );
      this.removeChild( this.rewardBarrier );
      this.visibleBoundsProperty.unlink( this.rewardNodeBoundsListener );

      // fully release references
      this.rewardNode = null;
      this.rewardNodeBoundsListener = null;
    },

    /**
     * When the game state changes, update the view with the appropriate buttons and readouts.
     * @private
     *
     * @param {GameState} gameState
     */
    onGameStateChange: function( gameState ) {
      if ( gameState === GameState.PRESENTING_INTERACTIVE_CHALLENGE ) {
        this.model.setupChallenge( this.model.currentChallengeProperty.value );
      }
      if ( gameState === GameState.CORRECT_ANSWER ) {
        this.model.incrementScore();
        this.gameAudioPlayer.correctAnswer();
      }
    },

    /**
     * @override
     * @returns {number} - Amount in view coordinates to leave at the top of the screen.
     */
    getTopBoundsOffset: function() {
      return this.gameStatusBar.height;
    }
  } );
} );
