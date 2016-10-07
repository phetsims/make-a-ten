// Copyright 2015, University of Colorado Boulder

/**
 * Possible game states.
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );

  var GameState = Object.freeze( {
    CHOOSING_LEVEL: 'CHOOSING_LEVEL',
    PRESENTING_INTERACTIVE_CHALLENGE: 'PRESENTING_INTERACTIVE_CHALLENGE',
    MOVE_TO_NEXT_CHALLENGE: 'MOVE_TO_NEXT_CHALLENGE',
    CORRECT_ANSWER: 'CORRECT_ANSWER'
  } );

  makingTens.register( 'GameState', GameState );

  return GameState;
} );