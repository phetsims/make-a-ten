// Copyright 2015-2026, University of Colorado Boulder

/**
 * Possible game states.
 * @author Sharfudeen Ashraf
 */

const GameStateValues = [
  // Shows level selection buttons
  'CHOOSING_LEVEL',

  // In a level, challenge not completed
  'PRESENTING_INTERACTIVE_CHALLENGE',

  // In a level, challenge completed (can move to next challenge)
  'CORRECT_ANSWER'
] as const;

type GameState = typeof GameStateValues[ number ];

export default GameState;
