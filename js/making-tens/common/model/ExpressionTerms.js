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
   * TODO: fix documentation here
   * @param [{number|null}leftTerm,{number|null}rightTerm,{string|null}activeTerm} options]
   * @constructor
   */
  function ExpressionTerms( options ) {
    if ( !options ) {
      options = {};
    }
    assert && assert( options.leftTerm === undefined || typeof options.leftTerm === 'number', 'Types' );
    assert && assert( options.rightTerm === undefined || typeof options.rightTerm === 'number', 'Types' );
    assert && assert( options.activeTerm === undefined || typeof options.activeTerm === 'string', 'Types' );

    options = options || {};
    PropertySet.call( this, {
      // @public {number} - The left term number, or 0 if there is no current term
      leftTerm: options.leftTerm !== undefined ? options.leftTerm : 0,

      // @public {number} - The left term number, or 0 if there is no current term
      rightTerm: options.rightTerm !== undefined ? options.rightTerm : 0,

      // @public {string} - The active term. TODO: make an enumeration?
      activeTerm: options.activeTerm !== undefined ? options.activeTerm : 'none'
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
    }
  } );

} );