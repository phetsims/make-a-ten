// Copyright 2015, University of Colorado Boulder

/**
 *
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ExpressionTerms( options ) {
    if ( !options ) {
      options = {};
    }
    assert && assert( options.leftTerm === undefined || typeof options.leftTerm === 'number', 'Types' );
    assert && assert( options.rightTerm === undefined || typeof options.rightTerm === 'number', 'Types' );

    options = options || {};
    PropertySet.call( this, {
      // @public {number} - The left term number, or 0 if there is no current term
      leftTerm: options.leftTerm !== undefined ? options.leftTerm : 0,

      // @public {number} - The left term number, or 0 if there is no current term
      rightTerm: options.rightTerm !== undefined ? options.rightTerm : 0,

      // @public {ActiveTerm} - The active term.
      activeTerm: ActiveTerm.NONE
    } );

  }

  makeATen.register( 'ExpressionTerms', ExpressionTerms );

  return inherit( PropertySet, ExpressionTerms, {

    /**
     * Useful for showing equals sign
     *
     * @returns {boolean}
     */
    hasBothTerms: function() {
      return this.activeTerm === ActiveTerm.NONE && this.leftTerm > 0 && this.rightTerm > 0;
    }
  } );

} );