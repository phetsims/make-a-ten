// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );

  /**
   *
   * @param {number} amountToRemove
   * @param {number} amountRemaining
   * @constructor
   */
  function NumberPulledApartModel( amountToRemove, amountRemaining ) {
    this.amountToRemove = amountToRemove;
    this.amountRemaining = amountRemaining;
  }

  return inherit( Object, NumberPulledApartModel, {
    /**
     *
     * @returns {boolean}
     */
    isEqualDigitLength: function() {
      return MakingTensUtil.isEqualDigitLength( this.amountToRemove, this.amountRemaining );
    }
  } );
} );