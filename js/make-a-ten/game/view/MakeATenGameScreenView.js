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

  // strings
  var nextString = require( 'string!MAKE_A_TEN/next' );

  /**
   * @constructor
   *
   * @param {MakeATenGameModel} model
   */
  function MakeATenGameScreenView( model ) {
    MakeATenCommonView.call( this, model );

    // @private {Node} - Layer for the paper numbers and expression formula
    this.challengeLayer = new Node();
    this.addChild( this.challengeLayer );

    // Add the paper number layer from our supertype
    this.challengeLayer.addChild( this.paperNumberLayerNode );

    // The node that display "12 + 100 = "
    var additionTermsNode = new AdditionTermsNode( model.additionTerms, false );
    additionTermsNode.left = this.layoutBounds.left + 38;
    additionTermsNode.top = this.layoutBounds.top + 75;
    this.challengeLayer.addChild( additionTermsNode );

    // @private {StartGameLevelNode} - Shows buttons that allow selecting the level to play
    this.startGameLevelNode = new StartGameLevelNode( model );
    this.addChild( this.startGameLevelNode );

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
    this.addChild( this.infoButton );

    // @private {NextArrowButton} - Moves to the next challenge when clicked
    this.nextChallengeButton = new NextArrowButton( nextString, {
      listener: function() {
        model.moveToNextChallenge();
      },
      top: this.layoutBounds.centerY,
      right: this.layoutBounds.right - 20
    } );
    this.addChild( this.nextChallengeButton );

    // @private {SoundToggleButton} - Toggle whether audio is enabled
    this.soundToggleButton = new SoundToggleButton( model.soundEnabledProperty, {
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      x: 20,
      bottom: this.layoutBounds.height - 20
    } );
    this.addChild( this.soundToggleButton );

    // @private {GameStatusBar} - Status bar at the top of the screen
    this.gameStatusBar = new GameStatusBar( model );
    this.addChild( this.gameStatusBar );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

    // @private {Array.<Node>} - All controls that we'll want to potentially toggle visibility on.
    this.allControls = [ this.startGameLevelNode, this.resetAllButton, this.challengeLayer, this.soundToggleButton,
                         this.nextChallengeButton, this.infoButton, this.gameStatusBar ];

    // @private {Object} - Maps {GameState} => {Array.<Node>}, for what controls should be visible during that state.
    this.controlVisibilityMap = {};
    this.controlVisibilityMap[ GameState.CHOOSING_LEVEL ] = [
      this.startGameLevelNode, this.resetAllButton, this.soundToggleButton, this.infoButton
    ];
    this.controlVisibilityMap[ GameState.PRESENTING_INTERACTIVE_CHALLENGE ] = [
      this.challengeLayer, this.gameStatusBar
    ];
    this.controlVisibilityMap[ GameState.CORRECT_ANSWER ] = [
      this.challengeLayer, this.nextChallengeButton, this.gameStatusBar
    ];

    // Trigger initial layout
    this.layoutControls();

    // Hook up the update function for handling changes to game state.
    model.gameStateProperty.link( this.handleGameStateChange.bind( this ) );
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
     * When the game state changes, update the view with the appropriate buttons and readouts.
     * @private
     *
     * @param {GameState} gameState
     */
    handleGameStateChange: function( gameState ) {
      if ( gameState === GameState.PRESENTING_INTERACTIVE_CHALLENGE ) {
        this.model.setupChallenge( this.model.currentChallengeProperty.value );
      }
      if ( gameState === GameState.CORRECT_ANSWER ) {
        this.model.incrementScore();
        this.gameAudioPlayer.correctAnswer();
      }

      // Toggle visibility on controls as needed, showing the visibleControls and hiding the rest.
      var visibleControls = this.controlVisibilityMap[ gameState ];
      this.allControls.forEach( function( node ) {
        node.visible = _.contains( visibleControls, node );
      } );
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
