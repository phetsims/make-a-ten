// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the terms in the addition "leftTerm + rightTerm =".
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );

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
