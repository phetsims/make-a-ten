// Copyright 2015-2026, University of Colorado Boulder

/**
 * Possible game states.
 * @author Sharfudeen Ashraf
 */

type GameState =
  'CHOOSING_LEVEL' | // Shows level selection buttons
  'PRESENTING_INTERACTIVE_CHALLENGE' | // In a level, challenge not completed
  'CORRECT_ANSWER'; // In a level, challenge completed (can move to next challenge)

export default GameState;
