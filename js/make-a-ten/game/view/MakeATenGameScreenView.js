// Copyright 2015, University of Colorado Boulder

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
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var Vector2 = require( 'DOT/Vector2' );

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

    // @private {Node} - Holds everything that can slide back and forth
    this.slidingLayer = new Node();
    this.addChild( this.slidingLayer );

    // @private {Node} - The "left" half of the sliding layer, displayed first
    this.levelSelectionLayer = new Node();
    this.slidingLayer.addChild( this.levelSelectionLayer );

    // @private {Node} - The "right" half of the sliding layer, will slide into view when the user selects a level
    this.challengeLayer = new Node();
    this.slidingLayer.addChild( this.challengeLayer );

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

    // Add the paper number layer from our supertype
    this.challengeLayer.addChild( this.paperNumberLayerNode );

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

    // @private {GameStatusBar} - Status bar at the top of the screen
    this.gameStatusBar = new GameStatusBar( model );
    this.challengeLayer.addChild( this.gameStatusBar );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

    // Trigger initial layout
    this.layoutControls();

    // Hook up the update function for handling changes to game state.
    model.gameStateProperty.link( this.onGameStateChange.bind( this ) );

    // We need to update some animation and layout when this happens
    this.visibleBoundsProperty.link( this.onVisibleBoundsChange.bind( this ) );

    // @private {MoveTo|null} - Current animation, if it exists
    this.moveTo = null;
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
     * Sets options that depend on whether our view is moving (switching from level selection to challenges or back).
     * @public
     */
    setMoving: function( isMoving ) {
      this.levelSelectionLayer.pickable = !isMoving;
      this.challengeLayer.pickable = !isMoving;
    },

    /**
     * The x offset that should be applied to slidingLayer when we are in a particular game state.
     * @private
     *
     * @returns {number}
     */
    getIdealSlideOffset: function( gameState ) {
      var mainOffset = this.visibleBoundsProperty.value.left - this.visibleBoundsProperty.value.right;
      return ( gameState === GameState.CHOOSING_LEVEL ) ? 0 : mainOffset;
    },

    /**
     * Stops animation.
     * @private
     */
    stopAnimation: function() {
      if ( this.moveTo ) {
        this.moveTo.stop();
        this.moveTo = null;
      }
    },

    /**
     * Moves into place immediately, instead of sliding.
     * @private
     */
    moveImmediately: function() {
      this.slidingLayer.x = this.getIdealSlideOffset( this.model.gameStateProperty.value );
      this.setMoving( false );
    },

    /**
     * Called when the visible bounds change
     * @private
     */
    onVisibleBoundsChange: function() {
      this.challengeLayer.x = -this.getIdealSlideOffset( GameState.PRESENTING_INTERACTIVE_CHALLENGE );
      this.moveImmediately();
    },

    /**
     * When the game state changes, update the view with the appropriate buttons and readouts.
     * @private
     *
     * @param {GameState} gameState
     */
    onGameStateChange: function( gameState ) {
      var self = this;

      if ( this.slidingLayer.x !== this.getIdealSlideOffset( gameState ) ) {
        this.setMoving( true );
        if ( this.moveTo ) {
          this.moveTo.stop();
        }
        this.moveTo = new MoveTo( this.slidingLayer, new Vector2( this.getIdealSlideOffset( gameState ), 0 ), {
          duration: 0.5,
          onComplete: function() {
            self.setMoving( false );
          }
        } ).start();
      }

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
