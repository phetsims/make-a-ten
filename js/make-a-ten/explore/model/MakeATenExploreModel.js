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
  var Vector2 = require( 'DOT/Vector2' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  /**
   * @constructor
   */
  function MakeATenExploreModel() {
    // @public {NumberProperty} - The total sum of the current numbers
    this.sumProperty = new NumberProperty( 0 );

    MakeATenCommonModel.call( this );

    this.addInitialNumbers();

    this.paperNumbers.lengthProperty.link( this.calculateTotal.bind( this ) );
  }

  makeATen.register( 'MakeATenExploreModel', MakeATenExploreModel );

  return inherit( MakeATenCommonModel, MakeATenExploreModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      MakeATenCommonModel.prototype.step.call( this, dt );
    },

    /**
     * Every time the user creates a new paperModel call this to update the sum
     */
    calculateTotal: function() {
      var total = 0;
      this.paperNumbers.forEach( function( paperNumber ) {
        total += paperNumber.numberValueProperty.value;
      } );
      this.sumProperty.value = total;
    },

    addPaperNumber: function( paperNumber ) {
      MakeATenCommonModel.prototype.addPaperNumber.call( this, paperNumber );
      var self = this;
      paperNumber.numberValueProperty.link( function( newValue ) {
        if ( !paperNumber.userControlledProperty.value ) {
          self.calculateTotal();
          self.interactionSucceeded = true;
        }
      } );

      // The shape will be removed from the model if and when it returns to its origination point.  This is how a shape
      // can be 'put back' into the panel.
      paperNumber.returnedToOriginEmitter.addListener( function() {
        if ( !paperNumber.userControlledProperty.value ) {
          // The shape has been returned to the panel.
          self.paperNumbers.remove( paperNumber );
        }
      } );
    },

    /**
     * Adds any required initial numbers.
     * @private
     */
    addInitialNumbers: function() {
      var self = this;

      // Check for an array of numbers, e.g. ?exploreNumbers=10,51, where 0 indicates none
      var initialNumbers = QueryStringMachine.get( 'exploreNumbers', {
        type: 'array',
        elementSchema: {
          type: 'number'
        },
        defaultValue: [ 10 ]
      } );
      _.forEach( initialNumbers, function( number, index ) {
        if ( !number ) { return; } // TODO: how to get empty arrays?

        // evenly distribute across the screen
        var x = MakeATenConstants.LAYOUT_BOUNDS.width * ( 1 + index ) / ( initialNumbers.length + 1 );
        var initialNumberPosition = new Vector2( x, MakeATenConstants.LAYOUT_BOUNDS.height / 2.5 );
        self.addPaperNumber( new PaperNumber( number, initialNumberPosition ) );
      } );
    },

    reset: function() {
      MakeATenCommonModel.prototype.reset.call( this );

      this.sumProperty.reset();
      this.addInitialNumbers();
    }
  } );
} );