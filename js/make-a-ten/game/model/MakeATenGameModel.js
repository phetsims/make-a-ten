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
  var Vector2 = require( 'DOT/Vector2' );
  var GameState = require( 'MAKE_A_TEN/make-a-ten/game/model/GameState' );
  var NumberChallengeFactory = require( 'MAKE_A_TEN/make-a-ten/game/model/NumberChallengeFactory' );
  var MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );
  var Level = require( 'MAKE_A_TEN/make-a-ten/game/model/Level' );
  var ExpressionTerms = require( 'MAKE_A_TEN/make-a-ten/common/model/ExpressionTerms' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );

  // Level descriptions
  var gameInfoLevel1String = require( 'string!MAKE_A_TEN/game.info.level1' );
  var gameInfoLevel2String = require( 'string!MAKE_A_TEN/game.info.level2' );
  var gameInfoLevel3String = require( 'string!MAKE_A_TEN/game.info.level3' );
  var gameInfoLevel4String = require( 'string!MAKE_A_TEN/game.info.level4' );
  var gameInfoLevel5String = require( 'string!MAKE_A_TEN/game.info.level5' );
  var gameInfoLevel6String = require( 'string!MAKE_A_TEN/game.info.level6' );
  var gameInfoLevel7String = require( 'string!MAKE_A_TEN/game.info.level7' );
  var gameInfoLevel8String = require( 'string!MAKE_A_TEN/game.info.level8' );
  var gameInfoLevel9String = require( 'string!MAKE_A_TEN/game.info.level9' );
  var gameInfoLevel10String = require( 'string!MAKE_A_TEN/game.info.level10' );

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

    // TODO: can we not have to create this early?
    var numberChallengeFactory = new NumberChallengeFactory();

    this.levels = [
      new Level( 1, '#FC4280', levelIcon1, gameInfoLevel1String, numberChallengeFactory ),
      new Level( 2, '#FC4280', levelIcon2, gameInfoLevel2String, numberChallengeFactory ),
      new Level( 3, '#FC4280', levelIcon3, gameInfoLevel3String, numberChallengeFactory ),
      new Level( 4, '#06A5AD', levelIcon4, gameInfoLevel4String, numberChallengeFactory ),
      new Level( 5, '#06A5AD', levelIcon5, gameInfoLevel5String, numberChallengeFactory ),
      new Level( 6, '#06A5AD', levelIcon6, gameInfoLevel6String, numberChallengeFactory ),
      new Level( 7, '#06A5AD', levelIcon7, gameInfoLevel7String, numberChallengeFactory ),
      new Level( 8, '#8653BF', levelIcon8, gameInfoLevel8String, numberChallengeFactory ),
      new Level( 9, '#8653BF', levelIcon9, gameInfoLevel9String, numberChallengeFactory ),
      new Level( 10, '#8653BF', levelIcon10, gameInfoLevel10String, numberChallengeFactory )
    ];

    // Making Tens Commmon Model is a propertySet
    MakeATenCommonModel.call( this, {
      soundEnabled: true,
      currentLevel: this.levels[ 0 ],
      currentScore: 0,
      currentChallenge: null,
      // Current state of the game, see GameState for valid values.
      gameState: GameState.CHOOSING_LEVEL
    } );

    this.expressionTerms = new ExpressionTerms();

    this.paperNumbers.lengthProperty.link( function( modelLength, prevModelLength ) {
      if ( modelLength === 1 && prevModelLength === 2 && self.gameState === GameState.PRESENTING_INTERACTIVE_CHALLENGE ) { // The user has added the two numbers, trigger success state
        self.gameState = GameState.CORRECT_ANSWER;
      }
    } );

    // Keep our currentScore updated when the level changes.
    this.currentLevelProperty.link( function( level, oldLevel ) {
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
      this.currentLevel = level;

      // Set up the model for the next challenge
      this.currentChallenge = level.generateChallenge();

      // Change to new game state.
      this.gameState = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
    },

    /**
     * The user can play as many times as wants. And Each time, he
     * combines the numbers b making Tens his score for that level will be incremented
     */
    handleCorrectAnswer: function() {
      this.currentLevel.scoreProperty.value++;
      this.gameState = GameState.MOVE_TO_NEXT_CHALLENGE;
    },

    nextChallenge: function() {
      this.currentChallenge = this.currentLevel.generateChallenge();
      this.gameState = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
    },

    setChoosingLevelState: function() {
      this.gameState = GameState.CHOOSING_LEVEL;
      this.paperNumbers.clear();
    },

    /**
     * //@private
     * creates PaperNumbers based on the type of Number Challenge
     * @param {NumberChallenge} numberChallenge
     */
    createTerms: function( numberChallenge ) {
      var self = this;
      this.paperNumbers.clear();
      this.expressionTerms.leftTerm = numberChallenge.leftTerm;
      this.expressionTerms.rightTerm = numberChallenge.rightTerm;

      var valuesToCreate = [ numberChallenge.leftTerm, numberChallenge.rightTerm ];
      var xOffSet = 200;
      _.each( valuesToCreate, function( numberValue ) {
        if ( numberValue === '' || numberValue === 0 ) {
          return;
        }
        var initialPosition = new Vector2( xOffSet, MakeATenSharedConstants.LAYOUT_BOUNDS.height / 2.5 );
        self.addPaperNumber( new PaperNumber( numberValue, initialPosition ) );
        xOffSet += 350;
      } );
    },

    reset: function() {
      this.paperNumbers.clear();
      for ( var i = 0; i < this.levels.length; i++ ) {
        this.levels[ i ].reset();
      }
    }
  }, {
    // TODO: factor this out
    NUMBER_OF_LEVELS: 10
  } );
} );