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
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );

  /**
   * @constructor
   */
  function AdditionTerms() {
    // @public {NumberProperty} - The left-hand term for the addition.
    this.leftTermProperty = new NumberProperty( 0 );

    // @public {NumberProperty} - The left-hand term for the addition.
    this.rightTermProperty = new NumberProperty( 0 );

    // @public {Property.<ActiveTerm>} - The active term being edited (left, right or none basically)
    this.activeTermProperty = new Property( ActiveTerm.NONE );
  }

  makeATen.register( 'AdditionTerms', AdditionTerms );

  return inherit( Object, AdditionTerms, {
    /**
     * Returns whether both of the terms have non-zero values (and are not being edited).
     * @public
     *
     * @returns {boolean}
     */
    hasBothTerms: function() {
      return this.activeTermProperty.value === ActiveTerm.NONE && this.leftTermProperty.value > 0 && this.rightTermProperty.value > 0;
    },

    /**
     * Reset all of the terms
     * @public
     */
    reset: function() {
      this.leftTermProperty.reset();
      this.rightTermProperty.reset();
      this.activeTermProperty.reset();
    }
  } );
} );
