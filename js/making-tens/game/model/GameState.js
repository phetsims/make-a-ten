// Copyright 2002-2014, University of Colorado Boulder

/**
 * Possible game states.
 *
 * @author John Blanco
 */
define( function() {
  'use strict';

  return Object.freeze( {
    CHOOSING_LEVEL: 'choosingLevel',
    PRESENTING_INTERACTIVE_CHALLENGE: 'presentingInteractiveChallenge',
    MOVE_TO_NEXT_CHALLENGE: 'MoveToNextChallenge',
    CORRECT_ANSWER: 'CORRECT_ANSWER',
    SHOWING_LEVEL_RESULTS: 'showingLevelResults'
  } );
} );