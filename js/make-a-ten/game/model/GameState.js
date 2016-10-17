// Copyright 2015, University of Colorado Boulder

/**
 * Possible game states.
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );

  var GameState = Object.freeze( {
    CHOOSING_LEVEL: 'CHOOSING_LEVEL',
    PRESENTING_INTERACTIVE_CHALLENGE: 'PRESENTING_INTERACTIVE_CHALLENGE',
    MOVE_TO_NEXT_CHALLENGE: 'MOVE_TO_NEXT_CHALLENGE',
    CORRECT_ANSWER: 'CORRECT_ANSWER'
  } );

  makeATen.register( 'GameState', GameState );

  return GameState;
} );