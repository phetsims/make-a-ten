// Copyright 2015, University of Colorado Boulder

/**
 *
 * Represents a challenge, that is presented to the user during the MakeATen game.
 * Each challenge has two terms. The values of which depends on the level of challenge
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   *
   * @param {number} leftTerm
   * @param {number} rightTerm
   */
  function NumberChallenge( leftTerm, rightTerm ) {
    // @public {number} - The left-hand term for addition
    this.leftTerm = leftTerm;

    // @public {number} - The right-hand term for addition
    this.rightTerm = rightTerm;

    // This object is immutable
    Object.freeze( this );
  }

  makeATen.register( 'NumberChallenge', NumberChallenge );

  return inherit( Object, NumberChallenge );
} );
