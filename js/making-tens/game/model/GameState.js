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
    SHOWING_CORRECT_ANSWER_FEEDBACK: 'showingCorrectAnswerFeedback',
    SHOWING_INCORRECT_ANSWER_FEEDBACK_TRY_AGAIN: 'showingIncorrectAnswerFeedbackTryAgain',
    SHOWING_INCORRECT_ANSWER_FEEDBACK_MOVE_ON: 'showingIncorrectAnswerFeedbackMoveOn',
    CORRECT_ANSWER: 'CORRECT_ANSWER',
    SHOWING_LEVEL_RESULTS: 'showingLevelResults'
  } );
} );