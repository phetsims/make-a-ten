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
      var droppedNumberValue = Number( droppedPaperNumberModel.numberValue );
      var draggedNumberValue = Number( draggedPaperNumberModel.numberValue );

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
      var width1 = paperNumberModel1.getBounds().width;
      var width2 = paperNumberModel2.getBounds().width;

      var repelRightDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE[ (paperNumberModel1.numberValue + "").length ];
      var repelLeftDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE[ (paperNumberModel2.numberValue + "").length ] * -1;

      var rightPaperModel = paperNumberModel1;
      var leftPaperModel = paperNumberModel2;

      if(rightPaperModel.position.x < leftPaperModel.position.x ){
        rightPaperModel = paperNumberModel2;
        leftPaperModel = paperNumberModel1;
       }

      // repel right
      if ( rightPaperModel.position.x + repelRightDistance > this.screenBounds.width - width1 ) {
        repelRightDistance = 0;
        repelLeftDistance = repelLeftDistance * 1.5;
      }

      // repel left
      if ( paperNumberModel2.position.x - repelLeftDistance < this.screenBounds.minX - width2 ) {
        repelLeftDistance = 0;
        repelRightDistance = repelRightDistance * 1.5;
      }

      var delta = new Vector2( repelRightDistance, 0 );
      rightPaperModel.setDestination( rightPaperModel.position.plus( delta ), true );

      delta = new Vector2( repelLeftDistance, 0 );
      leftPaperModel.setDestination( leftPaperModel.position.plus( delta ), true );


    },


    clearNumbers: function() {
      this.residentNumberModels.clear();
    }

  } );
} );