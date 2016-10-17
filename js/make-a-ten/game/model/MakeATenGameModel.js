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
  var ExpressionTerms = require( 'MAKE_A_TEN/make-a-ten/common/model/ExpressionTerms' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );
  var Property = require( 'AXON/Property' );

  /**
   *
   * @constructor
   */
  function MakeATenGameModel() {
    var self = this;

    // Making Tens Commmon Model is a propertySet
    MakeATenCommonModel.call( this, {
      soundEnabled: true,
      currentLevel: 0,
      currentChallenge: null,
      // Current state of the game, see GameState for valid values.
      gameState: GameState.CHOOSING_LEVEL
    } );

    this.expressionTerms =  new ExpressionTerms();

    // Best times and scores.
    this.bestTimes = []; // @public
    this.scores = []; // @public
    _.times( MakeATenGameModel.NUMBER_OF_LEVELS, function() {
      self.bestTimes.push( 0 );
      self.scores.push( new Property( 0 ) );
    } );

    this.numberChallengeFactory = new NumberChallengeFactory();

    this.paperNumbers.lengthProperty.link( function( modelLength, prevModelLength ) {
      if ( modelLength === 1 && prevModelLength === 2 && self.gameState === GameState.PRESENTING_INTERACTIVE_CHALLENGE ) { // The user has added the two numbers, trigger success state
        self.gameState = GameState.CORRECT_ANSWER;
      }
    } );
  }

  makeATen.register( 'MakeATenGameModel', MakeATenGameModel );

  return inherit( MakeATenCommonModel, MakeATenGameModel, {

    // starts new level
    startLevel: function( level ) {
      this.currentLevel = level;

      // Set up the model for the next challenge
      this.currentChallenge = this.generateChallenge( level );

      // Change to new game state.
      this.gameState = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
    },

    /**
     * The user can play as many times as wants. And Each time, he
     * combines the numbers b making Tens his score for that level will be incremented
     */
    handleCorrectAnswer: function() {
      this.scores[ this.currentLevel ].set( this.scores[ this.currentLevel ].get() + 1 );
      this.gameState = GameState.MOVE_TO_NEXT_CHALLENGE;
    },

    nextChallenge: function() {
      this.currentChallenge = this.generateChallenge( this.currentLevel );
      this.gameState = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
    },


    generateChallenge: function( level ) {
      var numberChallenge = null;
      switch( level ) {
        case 0:
          numberChallenge = this.numberChallengeFactory.tenAndUnderChallenge();
          break;
        case 1:
          numberChallenge = this.numberChallengeFactory.addWithNineChallenge();
          break;
        case 2:
          numberChallenge = this.numberChallengeFactory.underTwentyChallenge();
          break;
        case 3:
          numberChallenge = this.numberChallengeFactory.addWithTensChallenge();
          break;
        case 4:
          numberChallenge = this.numberChallengeFactory.addWithSinglesChallenge();
          break;
        case 5:
          numberChallenge = this.numberChallengeFactory.underHundredsChallenge();
          break;
        case 6:
          numberChallenge = this.numberChallengeFactory.overHundredChallenge();
          break;
        case 7:
          numberChallenge = this.numberChallengeFactory.addWithSinglesThreeDigit();
          break;
        case 8:
          numberChallenge = this.numberChallengeFactory.addWithTensThreeDigit();
          break;
        case 9:
          numberChallenge = this.numberChallengeFactory.triplesChallenge();
          break;
        default:
          throw new Error( 'invalid level: ' + level );
      }

      return numberChallenge;
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
        var initialPosition = new Vector2( xOffSet, MakeATenSharedConstants.LAYOUT_BOUNDS.height / 4 );
        self.addPaperNumber( new PaperNumber( numberValue, initialPosition ) );
        xOffSet += 350;
      } );
    },

    reset: function() {
      this.paperNumbers.clear();
      for ( var i = 0; i < MakeATenGameModel.NUMBER_OF_LEVELS; i++ ) {
        this.bestTimes[ i ] = 0;
        this.scores[ i ].set( 0 );
      }
    }
  }, {
    NUMBER_OF_LEVELS: 10
  } );
} );