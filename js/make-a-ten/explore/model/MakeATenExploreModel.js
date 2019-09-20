// Copyright 2015-2019, University of Colorado Boulder

/**
 * Model for the Explore screen in Make a Ten. Includes the total, cues, and adding in initial numbers.
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const Cue = require( 'MAKE_A_TEN/make-a-ten/explore/model/Cue' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );
  const MakeATenQueryParameters = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   */
  function MakeATenExploreModel() {
    // @public {NumberProperty} - The total sum of the current numbers
    this.sumProperty = new NumberProperty( 0 );

    MakeATenCommonModel.call( this );

    // @public {Cue} - Visually indicates numbers can be split (pulled apart)
    this.splitCue = new Cue();

    // @private {Function} - To be called when we need to recalculate the total
    const calculateTotalListener = this.calculateTotal.bind( this );

    this.paperNumbers.lengthProperty.link( calculateTotalListener );

    // Listen to number changes of paper numbers
    this.paperNumbers.addItemAddedListener( function( paperNumber ) {
      paperNumber.numberValueProperty.link( calculateTotalListener );
    } );
    this.paperNumbers.addItemRemovedListener( function( paperNumber ) {
      paperNumber.numberValueProperty.unlink( calculateTotalListener );
    } );

    this.addInitialNumbers();
  }

  makeATen.register( 'MakeATenExploreModel', MakeATenExploreModel );

  return inherit( MakeATenCommonModel, MakeATenExploreModel, {
    /**
     * @override
     */
    step: function( dt ) {
      MakeATenCommonModel.prototype.step.call( this, dt );

      // Cap large dt values, which can occur when the tab containing
      // the sim had been hidden and then re-shown
      dt = Math.min( 0.1, dt );

      // Animate fading if necessary
      this.splitCue.step( dt );
    },

    /**
     * Updates the total sum of the paper numbers.
     * @private
     */
    calculateTotal: function() {
      let total = 0;
      this.paperNumbers.forEach( function( paperNumber ) {
        total += paperNumber.numberValueProperty.value;
      } );
      this.sumProperty.value = total;
    },

    /**
     * Adds any required initial numbers.
     * @private
     */
    addInitialNumbers: function() {
      const self = this;

      // Check for an array of numbers, e.g. ?exploreNumbers=10,51, where 0 indicates none
      this.addMultipleNumbers( MakeATenQueryParameters.exploreNumbers );

      // Attach cues to any available numbers
      this.paperNumbers.forEach( function( paperNumber ) {
        if ( paperNumber.numberValueProperty.value > 1 ) {
          self.splitCue.attachToNumber( paperNumber );
        }
      } );
    },

    /**
     * @override
     */
    reset: function() {
      MakeATenCommonModel.prototype.reset.call( this );

      this.sumProperty.reset();
      this.splitCue.reset();
      this.addInitialNumbers();
    }
  } );
} );
