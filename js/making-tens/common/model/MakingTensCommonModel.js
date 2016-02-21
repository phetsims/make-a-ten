// Copyright 2015, University of Colorado Boulder

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
   * @param {Object} props
   * @constructor
   */
  function MakingTensCommonModel( props ) {
    PropertySet.call( this, props );

    //filled by View
    this.viewPortBounds = null; // filled by the view during resize

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
      var droppedNumberValue = droppedPaperNumberModel.numberValue;
      var draggedNumberValue = draggedPaperNumberModel.numberValue;

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
      this.residentNumberModels.push( paperNumberModel );
    },

    /**
     *
     * @param {PaperNumberModel} paperNumberModel1
     * @param {PaperNumberModel} paperNumberModel2
     */
    repelAway: function( paperNumberModel1, paperNumberModel2 ) {
      var repelRightDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE[ paperNumberModel1.digitLength ];
      var repelLeftDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE[ paperNumberModel2.digitLength ] * -1;

      var rightPaperModel = paperNumberModel1;
      var leftPaperModel = paperNumberModel2;

      if ( rightPaperModel.position.x < leftPaperModel.position.x ) {
        rightPaperModel = paperNumberModel2;
        leftPaperModel = paperNumberModel1;
      }

      var animateToDestination = true;
      var delta = new Vector2( repelRightDistance, 0 );
      rightPaperModel.constrainPosition( this.viewPortBounds, rightPaperModel.position.plus( delta ), animateToDestination );

      delta = new Vector2( repelLeftDistance, 0 );
      leftPaperModel.constrainPosition( this.viewPortBounds, leftPaperModel.position.plus( delta ), animateToDestination );
    },

    reset: function() {
      PropertySet.prototype.reset.call( this );
    }

  } );
} );