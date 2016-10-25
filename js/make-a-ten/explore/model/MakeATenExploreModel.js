// Copyright 2015, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );
  var ArrowCue = require( 'MAKE_A_TEN/make-a-ten/explore/model/ArrowCue' );

  /**
   * @constructor
   */
  function MakeATenExploreModel() {
    // @public {NumberProperty} - The total sum of the current numbers
    this.sumProperty = new NumberProperty( 0 );

    MakeATenCommonModel.call( this, {
      interactionAttempted: false,
      interactionSucceeded: false
    } );

    this.arrowCue = new ArrowCue();

    this.paperNumbers.lengthProperty.link( this.calculateTotal.bind( this ) );
  }

  makeATen.register( 'MakeATenExploreModel', MakeATenExploreModel );

  return inherit( MakeATenCommonModel, MakeATenExploreModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      MakeATenCommonModel.prototype.step.call( this, dt );
      this.arrowCue.step( dt );
    },

    /**
     * Every time the user creates a new paperModel call this to update the sum
     */
    calculateTotal: function() {
      var total = 0;
      this.paperNumbers.forEach( function( model ) {
        total += model.numberValue;
      } );
      this.sumProperty.value = total;
    },

    addPaperNumber: function( paperNumber ) {
      MakeATenCommonModel.prototype.addPaperNumber.call( this, paperNumber );
      var self = this;
      paperNumber.numberValueProperty.link( function( newValue ) {
        if ( !paperNumber.userControlled ) {
          self.calculateTotal();
          self.interactionSucceeded = true;
        }
      } );

      // The shape will be removed from the model if and when it returns to its origination point.  This is how a shape
      // can be 'put back' into the panel.
      paperNumber.on( 'returnedToOrigin', function() {
        if ( !paperNumber.userControlled ) {
          // The shape has been returned to the panel.
          self.paperNumbers.remove( paperNumber );
        }
      } );
    },

    reset: function() {
      MakeATenCommonModel.prototype.reset.call( this );

      this.sumProperty.reset();
    }

  } );
} );