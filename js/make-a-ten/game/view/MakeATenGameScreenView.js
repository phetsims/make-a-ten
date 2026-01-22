// Copyright 2015-2017, University of Colorado Boulder

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
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StartGameLevelNode = require( 'MAKE_A_TEN/make-a-ten/game/view/StartGameLevelNode' );
  var InfoDialog = require( 'MAKE_A_TEN/make-a-ten/game/view/InfoDialog' );
  var GameStatusBar = require( 'MAKE_A_TEN/make-a-ten/game/view/GameStatusBar' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var AdditionTermsNode = require( 'MAKE_A_TEN/make-a-ten/common/view/AdditionTermsNode' );
  var NextArrowButton = require( 'MAKE_A_TEN/make-a-ten/game/view/NextArrowButton' );
  var GameState = require( 'MAKE_A_TEN/make-a-ten/game/model/GameState' );
  var SlidingScreen = require( 'MAKE_A_TEN/make-a-ten/game/view/SlidingScreen' );
  var MakeATenRewardNode = require( 'MAKE_A_TEN/make-a-ten/game/view/MakeATenRewardNode' );
  var RewardPanel = require( 'MAKE_A_TEN/make-a-ten/game/view/RewardPanel' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // strings
  var nextString = require( 'string!MAKE_A_TEN/next' );

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

    var showingLeftProperty = DerivedProperty.valueEquals( model.gameStateProperty,
                                                           new Property( GameState.CHOOSING_LEVEL ) );
    this.addChild( new SlidingScreen( this.levelSelectionLayer,
                                      this.challengeLayer,
                                      this.visibleBoundsProperty,
                                      showingLeftProperty ) );

    // @private {StartGameLevelNode} - Shows buttons that allow selecting the level to play
    this.startGameLevelNode = new StartGameLevelNode( model );
    this.levelSelectionLayer.addChild( this.startGameLevelNode );

    // Move our resetAllButton onto our level-selection layer
    this.resetAllButton.detach();
    this.levelSelectionLayer.addChild( this.resetAllButton );

    // created lazily
    var infoDialog = null;

    // @private {RectangularPushButton} - Shows '?' in the corner that pops up the info dialog when clicked.
    this.infoButton = new RectangularPushButton( {
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      content: new Text( '?', {
        font: new PhetFont( { size: 20, weight: 'bold' } )
      } ),
      baseColor: '#eeeeee',
      listener: function() {
        if ( !infoDialog ) {
          infoDialog = new InfoDialog( model.levels );
        }
        infoDialog.show();
      },
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

    // @private {GameStatusBar} - Status bar at the top of the screen
    this.gameStatusBar = new GameStatusBar( model );
    this.challengeLayer.addChild( this.gameStatusBar );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

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

    // @private {RewardPanel}
    this.rewardPanel = new RewardPanel( this.hideReward.bind( this ), function() {
      self.hideReward();
      model.moveToChoosingLevel();
    } );
    this.visibleBoundsProperty.link( function( bounds ) {
      self.rewardPanel.center = bounds.center;
    } );

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
      if ( this.rewardNode ) {
        this.rewardNode.step( dt );
      }
    },

    /**
     * Shows the reward node.
     * @private
     */
    showReward: function() {
      this.gameAudioPlayer.gameOverPerfectScore();

      this.rewardNode = new MakeATenRewardNode();
      this.addChild( this.rewardBarrier );
      this.addChild( this.rewardNode );
      this.addChild( this.rewardPanel );
      this.rewardNodeBoundsListener = this.visibleBoundsProperty.linkAttribute( this.rewardNode, 'canvasBounds' );
    },

    /**
     * Hides the reward node.
     * @private
     */
    hideReward: function() {
      this.removeChild( this.rewardPanel );
      this.removeChild( this.rewardNode );
      this.removeChild( this.rewardBarrier );
      this.visibleBoundsProperty.unlink( this.rewardNodeBoundsListener );
      this.rewardNode.dispose();

      // fully release references
      this.rewardNode = null;
      this.rewardNodeBoundsListener = null;
    },

    /**
     * @override
     */
    layoutControls: function() {
      MakeATenCommonView.prototype.layoutControls.call( this );

      this.gameStatusBar.layout( this.visibleBoundsProperty.value );
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
