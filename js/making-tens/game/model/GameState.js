// Copyright 2015, University of Colorado Boulder

/**
 * Possible game states.
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );

  var GameState = Object.freeze( {
    CHOOSING_LEVEL: 'choosingLevel',
    PRESENTING_INTERACTIVE_CHALLENGE: 'presentingInteractiveChallenge',
    MOVE_TO_NEXT_CHALLENGE: 'MoveToNextChallenge',
    CORRECT_ANSWER: 'CORRECT_ANSWER',
    SHOWING_LEVEL_RESULTS: 'showingLevelResults'
  } );

  makingTens.register( 'GameState', GameState );

  return GameState;
} );