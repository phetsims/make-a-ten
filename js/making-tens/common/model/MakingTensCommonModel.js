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
   *
   * @param {Bounds2} screenBounds
   * @param {Object} props
   * @constructor
   */
  function MakingTensCommonModel( screenBounds, props ) {
    PropertySet.call( this, props );
    this.screenBounds = screenBounds;

    // Observable array of the numbers that have been placed
    this.residentNumberModels = new ObservableArray();
  }

  return inherit( PropertySet, MakingTensCommonModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      this.residentNumberModels.forEach( function( numberModel ) { numberModel.step( dt ); } );
    },

    /**
     * When collapsing, we remove either the dropped object and change the number value of the dragged objects
     * but if the droppedNumber is larger than the dragged number , reverse the objects to remove and change.
     *
     * @param {PaperNumberModel} draggedPaperNumberModel
     * @param {PaperNumberModel} droppedPaperNumberModel
     */
    collapseNumberModels: function( draggedPaperNumberModel, droppedPaperNumberModel ) {
      var droppedNumberValue = Number(droppedPaperNumberModel.numberValue);
      var draggedNumberValue = Number(draggedPaperNumberModel.numberValue);

      var modelToRemove = droppedPaperNumberModel;
      var modelToChange = draggedPaperNumberModel;

      if ( droppedNumberValue > draggedNumberValue ) {
        modelToRemove = draggedPaperNumberModel;
        modelToChange = droppedPaperNumberModel;
      }
      this.residentNumberModels.remove( modelToRemove );
      var newValue = droppedNumberValue + draggedNumberValue;
      modelToChange.changeNumber( newValue );
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
    },

    /**
     *
     * @param {PaperNumberModel} paperNumberModel
     */
    moveAway: function( paperNumberModel ) {
      var offsetDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE;
      if ( paperNumberModel.position.x + offsetDistance > this.screenBounds.width / 2 ) {
        offsetDistance *= -1;
      }
      var delta = new Vector2( offsetDistance, 0 );
      paperNumberModel.setDestination( paperNumberModel.position.plus( delta ), true );
    },


    clearNumbers: function() {
      this.residentNumberModels.clear();
    }

  } );
} );