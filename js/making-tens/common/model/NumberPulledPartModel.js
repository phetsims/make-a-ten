// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {number} originalNumber
   * @param {number} amountToRemove
   * @param {number} amountRemaining
   * @constructor
   */
  function NumberPulledPartModel( originalNumber, amountToRemove, amountRemaining ) {
    this.originalNumber = originalNumber;
    this.amountToRemove = amountToRemove;
    this.amountRemaining = amountRemaining;
  }

  return inherit( Object, NumberPulledPartModel, {} );
} );