// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function MakingTensExploreModel( explorerScreenBounds ) {
    var self = this;
    PropertySet.call( this, {
      sum: 0
    } );

    this.explrorerScreenBounds = explorerScreenBounds;
    // Observable array of the numbers that have been placed
    this.residentNumberModels = new ObservableArray(); // @public, read only

    this.residentNumberModels.lengthProperty.link( function() {
      self.calculateTotal();
    } );

  }

  return inherit( PropertySet, MakingTensExploreModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      this.residentNumberModels.forEach( function( numberModel ) { numberModel.step( dt ); } );
    },

    /**
     * Every time the user creates a new paperModel call this to update the sum
     */
    calculateTotal: function() {
      var self = this;
      var total = 0;
      self.residentNumberModels.forEach( function( model ) {
        total += model.numberValue;
      } );
      self.sum = total;
    },

    /**
     *
     * @param {PaperNumberModel} draggedPaperNumberModel
     * @param {PaperNumberModel} droppedPaperNumberModel
     */
    collapseNumberModels: function( draggedPaperNumberModel, droppedPaperNumberModel ) {
      this.residentNumberModels.remove( draggedPaperNumberModel );
      var newSum = draggedPaperNumberModel.numberValue + droppedPaperNumberModel.numberValue;
      droppedPaperNumberModel.changeNumber( newSum );
    },

    /**
     * Function for adding new movable shapes to this model when the user creates them, generally by clicking on some
     * some sort of creator node.
     * @public
     * @param paperNumberModel
     */
    addUserCreatedNumberModel: function( paperNumberModel ) {
      var self = this;
      this.residentNumberModels.push( paperNumberModel );

      // The number will be removed from the model if and when it returns to its origination point.  This is how a shape
      // can be 'put back' into the collection.
      paperNumberModel.on( 'returnedToOrigin', function() {
        if ( !paperNumberModel.userControlled ) {
          // The number has been returned to the collection.
          self.residentNumberModels.remove( paperNumberModel );
        }
      } );

      paperNumberModel.on( 'changeValue', function() {
        if ( !paperNumberModel.userControlled ) {
          self.calculateTotal();
        }
      } );
    },

    /**
     *
     * @param {PaperNumberModel} paperNumberModel
     */
    moveAway: function( paperNumberModel ) {
      var offsetDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE;
      if ( paperNumberModel.position.x + offsetDistance > this.explrorerScreenBounds.width / 2 ) {
        offsetDistance *= -1;
      }

      var delta = new Vector2( offsetDistance, 0 );
      paperNumberModel.setDestination( paperNumberModel.position.plus( delta ), true );

    }

  } );
} );