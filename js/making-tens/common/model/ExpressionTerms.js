// Copyright 2015, University of Colorado Boulder

/**
 *
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   *
   * @param leftTerm
   * @param rightTerm
   * @param activeTerm
   * @param highlightBorders
   * @constructor
   */
  function ExpressionTerms( leftTerm, rightTerm, activeTerm, highlightBorders ) {
    PropertySet.call( this, {
      leftTerm:         leftTerm || '',
      rightTerm:        rightTerm || '',
      activeTerm:       activeTerm || 'none',
      highlightBorders: highlightBorders || false
    } );

  }

  makingTens.register( 'ExpressionTerms', ExpressionTerms );

  return inherit( PropertySet, ExpressionTerms, {

    /**
     * Useful for showing equals sign
     *
     * @returns {boolean}
     */
    hasBothTerms: function() {
      return this.activeTerm === 'none' && this.leftTerm && this.rightTerm;
    },

    reset: function() {
      this.leftTerm = '';
      this.rightTerm = '';
      this.activeTerm = 'none';
    }

  } );

} );