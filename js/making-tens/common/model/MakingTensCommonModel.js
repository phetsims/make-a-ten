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
    this.paperNumbers = new ObservableArray();

  }

  makingTens.register( 'MakingTensCommonModel', MakingTensCommonModel );

  return inherit( PropertySet, MakingTensCommonModel, {

    /**
     *
     * @param {number} dt
     */
    step: function( dt ) {
      for ( var i = 0; i < this.paperNumbers.length; i++ ) {
        this.paperNumbers.get( i ).step( dt );
      }
    },

    /**
     *
     * When collapsing, we remove either the dropTarget object and change the number value of the dragged objects
     * but if the dropTarget is larger than the dragged number , reverse the objects to remove and change.
     *
     * @param {PaperNumber} draggedPaperNumber
     * @param {PaperNumber} dropTargetNumberModel
     */
    collapseNumberModels: function( draggedPaperNumber, dropTargetNumberModel ) {
      var dropTargetNumberValue = dropTargetNumberModel.numberValue;
      var draggedNumberValue = draggedPaperNumber.numberValue;

      var modelToRemove = dropTargetNumberModel;
      var modelToChange = draggedPaperNumber;

      if ( dropTargetNumberValue > draggedNumberValue ) {
        modelToRemove = draggedPaperNumber;
        modelToChange = dropTargetNumberModel;
      }
      this.paperNumbers.remove( modelToRemove );
      var newValue = dropTargetNumberValue + draggedNumberValue;
      modelToChange.changeNumber( newValue );
    },

    /**
     * Function for adding new movable shapes to this model when the user creates them, generally by clicking on some
     * some sort of creator node.
     * @public
     * @param paperNumber
     */
    addPaperNumber: function( paperNumber ) {
      this.paperNumbers.push( paperNumber );
    },

    /**
     *
     * @param {PaperNumber} paperNumber1
     * @param {PaperNumber} paperNumber2
     */
    repelAway: function( paperNumber1, paperNumber2 ) {
      var repelRightDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE[ paperNumber1.digitLength ];
      var repelLeftDistance = MakingTensSharedConstants.MOVE_AWAY_DISTANCE[ paperNumber2.digitLength ] * -1;

      var rightPaperModel = paperNumber1;
      var leftPaperModel = paperNumber2;

      if ( rightPaperModel.position.x < leftPaperModel.position.x ) {
        rightPaperModel = paperNumber2;
        leftPaperModel = paperNumber1;
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