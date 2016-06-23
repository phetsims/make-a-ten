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
   * @param [{number|null}leftTerm,{number|null}rightTerm,{string|null}activeTerm,{boolean|null}highlightBorders} options]
   * @constructor
   */
  function ExpressionTerms( options ) {
    options = options || {};
    PropertySet.call( this, {
      leftTerm: options.leftTerm,
      rightTerm: options.rightTerm,
      activeTerm:       options.activeTerm || 'none',
      highlightBorders: options.highlightBorders || false
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
      return (this.activeTerm === 'none') && (!!this.leftTerm && !!this.rightTerm);
    },

    reset: function() {
      this.leftTerm = null;
      this.rightTerm = null;
      this.activeTerm = 'none';
    }

  } );

} );