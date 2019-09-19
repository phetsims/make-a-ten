// Copyright 2015-2019, University of Colorado Boulder

/**
 * Model for the game screen of Make a Ten.
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const AdditionTerms = require( 'MAKE_A_TEN/make-a-ten/common/model/AdditionTerms' );
  const GameState = require( 'MAKE_A_TEN/make-a-ten/game/model/GameState' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Level = require( 'MAKE_A_TEN/make-a-ten/game/model/Level' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );
  const NumberChallengeFactory = require( 'MAKE_A_TEN/make-a-ten/game/model/NumberChallengeFactory' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );

  // Level descriptions
  const level10DescriptionString = require( 'string!MAKE_A_TEN/level10Description' );
  const level1DescriptionString = require( 'string!MAKE_A_TEN/level1Description' );
  const level2DescriptionString = require( 'string!MAKE_A_TEN/level2Description' );
  const level3DescriptionString = require( 'string!MAKE_A_TEN/level3Description' );
  const level4DescriptionString = require( 'string!MAKE_A_TEN/level4Description' );
  const level5DescriptionString = require( 'string!MAKE_A_TEN/level5Description' );
  const level6DescriptionString = require( 'string!MAKE_A_TEN/level6Description' );
  const level7DescriptionString = require( 'string!MAKE_A_TEN/level7Description' );
  const level8DescriptionString = require( 'string!MAKE_A_TEN/level8Description' );
  const level9DescriptionString = require( 'string!MAKE_A_TEN/level9Description' );

  // Level icons
  const levelIcon1 = require( 'image!MAKE_A_TEN/level-1.png' );
  const levelIcon10 = require( 'image!MAKE_A_TEN/level-10.png' );
  const levelIcon2 = require( 'image!MAKE_A_TEN/level-2.png' );
  const levelIcon3 = require( 'image!MAKE_A_TEN/level-3.png' );
  const levelIcon4 = require( 'image!MAKE_A_TEN/level-4.png' );
  const levelIcon5 = require( 'image!MAKE_A_TEN/level-5.png' );
  const levelIcon6 = require( 'image!MAKE_A_TEN/level-6.png' );
  const levelIcon7 = require( 'image!MAKE_A_TEN/level-7.png' );
  const levelIcon8 = require( 'image!MAKE_A_TEN/level-8.png' );
  const levelIcon9 = require( 'image!MAKE_A_TEN/level-9.png' );

  /**
   * @constructor
   */
  function MakeATenGameModel() {
    const self = this;

    MakeATenCommonModel.call( this );

    // Created here, since due to the initialization of phet.joist.random we need to delay until the model is created
    // (can't do at require.js load time), thus we have a separate challenge factory.
    const numberChallengeFactory = new NumberChallengeFactory();

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

      this.currentLevelProperty.reset();
      this.currentScoreProperty.reset();
      this.currentChallengeProperty.reset();
      this.gameStateProperty.reset();

      for ( let i = 0; i < this.levels.length; i++ ) {
        this.levels[ i ].reset();
      }
    }
  } );
} );