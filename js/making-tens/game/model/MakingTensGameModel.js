// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var GameState = require( 'MAKING_TENS/making-tens/game/model/GameState' );
  var NumberChallengeFactory = require( 'MAKING_TENS/making-tens/game/model/NumberChallengeFactory' );

  /**
   * @constructor
   */
  function MakingTensGameModel( options ) {
    var thisModel = this;

    options = _.extend( {
      numberOfLevels: 10
    }, options );

    PropertySet.call( this, {
      soundEnabled: true,
      timerEnabled: false,
      level: 10, // Zero-based in the model, though levels appear to the user to start at 1.
      challengeIndex: 0,
      currentChallenge: null,
      score: 0,
      elapsedTime: 0,
      numberOfLevels: options.numberOfLevels,

      // Current state of the game, see GameState for valid values.
      gameState: GameState.CHOOSING_LEVEL
    } );

    // Best times and scores.
    thisModel.bestTimes = []; // @public
    thisModel.bestScores = []; // @public
    _.times( thisModel.numberOfLevels, function() {
      thisModel.bestTimes.push( null );
      thisModel.bestScores.push( new Property( 0 ) );
    } );

    this.numberChallengeFactory = new NumberChallengeFactory();
  }

  return inherit( PropertySet, MakingTensGameModel, {

    startLevel: function( level ) {
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
      }

     return numberChallenge;
    },


    reset: function() {

    }

  } );
} );