// Copyright 2015-2026, University of Colorado Boulder

/**
 * Possible game states.
 * @author Sharfudeen Ashraf
 */

const GameState = Object.freeze( {
  // Shows level selection buttons
  CHOOSING_LEVEL: 'CHOOSING_LEVEL',

  // In a level, challenge not completed
  PRESENTING_INTERACTIVE_CHALLENGE: 'PRESENTING_INTERACTIVE_CHALLENGE',

  // In a level, challenge completed (can move to next challenge)
  CORRECT_ANSWER: 'CORRECT_ANSWER'
} );

export default GameState;
