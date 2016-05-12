// Copyright 2015, University of Colorado Boulder

/**
 *
 * Represents a challenge, that is presented to the user during the MakingTens game.
 * Each challenge has two terms. The values of which depends on the level of challenge
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {number} leftTerm
   * @param {number} rightTerm
   * @param {Object} options
   * @constructor
   */
  function NumberChallenge( leftTerm, rightTerm, options ) {
    this.leftTerm = leftTerm;
    this.rightTerm = rightTerm;
    this.options = options;
  }

  makingTens.register( 'NumberChallenge', NumberChallenge );

  return inherit( Object, NumberChallenge );
} );
