// Copyright 2015-2019, University of Colorado Boulder

/**
 * Possible game states.
 */
define( require => {
  'use strict';

  // modules
  const makeATen = require( 'MAKE_A_TEN/makeATen' );

  const GameState = Object.freeze( {
    // Shows level selection buttons
    CHOOSING_LEVEL: 'CHOOSING_LEVEL',

    // In a level, challenge not completed
    PRESENTING_INTERACTIVE_CHALLENGE: 'PRESENTING_INTERACTIVE_CHALLENGE',

    // In a level, challenge completed (can move to next challenge)
    CORRECT_ANSWER: 'CORRECT_ANSWER'
  } );

  makeATen.register( 'GameState', GameState );

  return GameState;
} );
