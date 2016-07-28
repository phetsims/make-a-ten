// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MakingTensCommonModel = require( 'MAKING_TENS/making-tens/common/model/MakingTensCommonModel' );
  var ArrowCueModel = require( 'MAKING_TENS/making-tens/explore/model/ArrowCueModel' );

  /**
   *
   * @constructor
   */
  function MakingTensExploreModel() {
    var self = this;
    MakingTensCommonModel.call( this, {
      sum: 0,
      hideTotal: false,
      interactionAttempted: false,
      interactionSucceeded: false
    } );

    this.arrowCueModel = new ArrowCueModel();

    self.paperNumbers.lengthProperty.link( function() {
      self.calculateTotal();
    } );
  }

  makingTens.register( 'MakingTensExploreModel', MakingTensExploreModel );

  return inherit( MakingTensCommonModel, MakingTensExploreModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      MakingTensCommonModel.prototype.step.call( this, dt );
      this.arrowCueModel.step( dt );
    },

    /**
     * Every time the user creates a new paperModel call this to update the sum
     */
    calculateTotal: function() {
      var self = this;
      var total = 0;
      self.paperNumbers.forEach( function( model ) {
        total += model.numberValue;
      } );
      self.sum = total;
    },

    addPaperNumber: function( paperNumberModel ) {
      MakingTensCommonModel.prototype.addPaperNumber.call( this, paperNumberModel );
      var self = this;
      paperNumberModel.numberValueProperty.link( function( newValue ) {
        if ( !paperNumberModel.userControlled ) {
          self.calculateTotal();
          self.interactionSucceeded = true;
        }
      } );


      // The shape will be removed from the model if and when it returns to its origination point.  This is how a shape
      // can be 'put back' into the panel.
      paperNumberModel.on( 'returnedToOrigin', function() {
        if ( !paperNumberModel.userControlled ) {
          // The shape has been returned to the panel.
          self.paperNumbers.remove( paperNumberModel );
        }
      } );
    },

    reset: function() {
      this.paperNumbers.clear();
      this.sum = 0;
    }

  } );
} );