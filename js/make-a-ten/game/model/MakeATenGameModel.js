// Copyright 2015, University of Colorado Boulder

/**
 * Model for the game screen of Make a Ten.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var GameState = require( 'MAKE_A_TEN/make-a-ten/game/model/GameState' );
  var NumberChallengeFactory = require( 'MAKE_A_TEN/make-a-ten/game/model/NumberChallengeFactory' );
  var MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );
  var Level = require( 'MAKE_A_TEN/make-a-ten/game/model/Level' );
  var AdditionTerms = require( 'MAKE_A_TEN/make-a-ten/common/model/AdditionTerms' );

  // Level descriptions
  var level1DescriptionString = require( 'string!MAKE_A_TEN/level1Description' );
  var level2DescriptionString = require( 'string!MAKE_A_TEN/level2Description' );
  var level3DescriptionString = require( 'string!MAKE_A_TEN/level3Description' );
  var level4DescriptionString = require( 'string!MAKE_A_TEN/level4Description' );
  var level5DescriptionString = require( 'string!MAKE_A_TEN/level5Description' );
  var level6DescriptionString = require( 'string!MAKE_A_TEN/level6Description' );
  var level7DescriptionString = require( 'string!MAKE_A_TEN/level7Description' );
  var level8DescriptionString = require( 'string!MAKE_A_TEN/level8Description' );
  var level9DescriptionString = require( 'string!MAKE_A_TEN/level9Description' );
  var level10DescriptionString = require( 'string!MAKE_A_TEN/level10Description' );

  // Level icons
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

  /**
   * @constructor
   */
  function MakeATenGameModel() {
    var self = this;

    MakeATenCommonModel.call( this );

    // Created here, since due to the initialization of phet.joist.random we need to delay until the model is created
    // (can't do at require.js load time), thus we have a separate challenge factory.
    var numberChallengeFactory = new NumberChallengeFactory();

    // @public {Array.<Level>} - All of the game levels for this screen.
    this.levels = [
      new Level( 1, '#FC4280', levelIcon1, level1DescriptionString, numberChallengeFactory ),
      new Level( 2, '#FC4280', levelIcon2, level2DescriptionString, numberChallengeFactory ),
      new Level( 3, '#FC4280', levelIcon3, level3DescriptionString, numberChallengeFactory ),
      new Level( 4, '#06A5AD', levelIcon4, level4DescriptionString, numberChallengeFactory ),
      new Level( 5, '#06A5AD', levelIcon5, level5DescriptionString, numberChallengeFactory ),
      new Level( 6, '#06A5AD', levelIcon6, level6DescriptionString, numberChallengeFactory ),
      new Level( 7, '#06A5AD', levelIcon7, level7DescriptionString, numberChallengeFactory ),
      new Level( 8, '#9778CC', levelIcon8, level8DescriptionString, numberChallengeFactory ),
      new Level( 9, '#9778CC', levelIcon9, level9DescriptionString, numberChallengeFactory ),
      new Level( 10, '#9778CC', levelIcon10, level10DescriptionString, numberChallengeFactory )
    ];

    // @public {BooleanProperty} - Whether sounds will occur on completion of game actions.
    this.soundEnabledProperty = new BooleanProperty( true );

    // @public {Property.<Level>} - The current level
    this.currentLevelProperty = new Property( this.levels[ 0 ] );

    // @public {NumberProperty} - The score for whatever the current level is.
    this.currentScoreProperty = new NumberProperty( 0 );

    // @public {Property.<NumberChallenge|null>} - The current challenge when in a level
    this.currentChallengeProperty = new Property( null );

    // @public {Property.<GameState>} - Current game state
    this.gameStateProperty = new Property( GameState.CHOOSING_LEVEL );

    // @public {AdditionTerms} - Our left and right terms to be added.
    this.additionTerms = new AdditionTerms();

    // Check for when the challenge is completed
    this.paperNumbers.lengthProperty.link( function( newLength, oldLength ) {
      // Check oldLength to make sure it's not from the paper numbers just added.
      if ( newLength === 1 && oldLength === 2 && self.gameStateProperty.value === GameState.PRESENTING_INTERACTIVE_CHALLENGE ) { // The user has added the two numbers, trigger success state
        self.gameStateProperty.value = GameState.CORRECT_ANSWER;
      }
    } );

    // Keep our currentScore updated when the level changes.
    this.currentLevelProperty.link( function( level ) {
      self.currentScoreProperty.value = level.scoreProperty.value;
    } );

    // Keep our currentScore updated when our current level's score changes.
    this.levels.forEach( function( level ) {
      level.scoreProperty.link( function( score ) {
        if ( level === self.currentLevelProperty.value ) {
          self.currentScoreProperty.value = score;
        }
      } );
    } );
  }

  makeATen.register( 'MakeATenGameModel', MakeATenGameModel );

  return inherit( MakeATenCommonModel, MakeATenGameModel, {
    /**
     * Starts a new challenge with the level specified
     * @public
     *
     * @param {Level} level
     */
    startLevel: function( level ) {
      this.removeAllPaperNumbers();

      this.currentLevelProperty.value = level;

      // Set up the model for the next challenge
      this.currentChallengeProperty.value = level.generateChallenge();

      // Change to new game state.
      this.gameStateProperty.value = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
    },

    /**
     * Increments the score of the current level.
     * @public
     */
    incrementScore: function() {
      this.currentLevelProperty.value.scoreProperty.value++;
    },

    /**
     * Moves to the next challenge (the current challenge's solution was correct).
     * @public
     */
    moveToNextChallenge: function() {
      this.removeAllPaperNumbers();

      this.currentChallengeProperty.value = this.currentLevelProperty.value.generateChallenge();
      this.gameStateProperty.value = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
    },

    /**
     * Moves back to the level selection.
     * @public
     */
    moveToChoosingLevel: function() {
      this.gameStateProperty.value = GameState.CHOOSING_LEVEL;
    },

    /**
     * Creates paper numbers for the specified challenge.
     * @public
     *
     * @param {NumberChallenge} numberChallenge
     */
    setupChallenge: function( numberChallenge ) {
      this.removeAllPaperNumbers();
      this.additionTerms.leftTermProperty.value = numberChallenge.leftTerm;
      this.additionTerms.rightTermProperty.value = numberChallenge.rightTerm;
      this.addMultipleNumbers( [ numberChallenge.leftTerm, numberChallenge.rightTerm ] );
    },

    /**
     * Resets our game model.
     * @public
     */
    reset: function() {
      MakeATenCommonModel.prototype.reset.call( this );

      this.soundEnabledProperty.reset();
      this.currentLevelProperty.reset();
      this.currentScoreProperty.reset();
      this.currentChallengeProperty.reset();
      this.gameStateProperty.reset();

      for ( var i = 0; i < this.levels.length; i++ ) {
        this.levels[ i ].reset();
      }
    }
  } );
} );