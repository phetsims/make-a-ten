// Copyright 2015-2017, University of Colorado Boulder

/**
 * Base model for Make a Ten screens.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function MakeATenCommonModel() {
    // @public {ObservableArray.<PaperNumber>} - Numbers in play that can be interacted with.
    this.paperNumbers = new ObservableArray();
  }

  makeATen.register( 'MakeATenCommonModel', MakeATenCommonModel );

  return inherit( Object, MakeATenCommonModel, {
    /**
     * Steps the model forward by a unit of time.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      // Cap large dt values, which can occur when the tab containing
      // the sim had been hidden and then re-shown
      dt = Math.min( 0.1, dt );

      for ( var i = 0; i < this.paperNumbers.length; i++ ) {
        this.paperNumbers.get( i ).step( dt );
      }
    },

    /**
     * Given two paper numbers, combine them (set one's value to the sum of their previous values, and remove the
     * other).
     *
     * @param {Bounds2} availableModelBounds - Constrain the location to be inside these bounds
     * @param {PaperNumber} draggedPaperNumber
     * @param {PaperNumber} dropTargetNumber
     */
    collapseNumberModels: function( availableModelBounds, draggedPaperNumber, dropTargetNumber ) {
      var dropTargetNumberValue = dropTargetNumber.numberValueProperty.value;
      var draggedNumberValue = draggedPaperNumber.numberValueProperty.value;
      var newValue = dropTargetNumberValue + draggedNumberValue;

      var numberToRemove;
      var numberToChange;

      // See https://github.com/phetsims/make-a-ten/issues/260
      if ( draggedPaperNumber.digitLength === dropTargetNumber.digitLength ) {
        numberToRemove = draggedPaperNumber;
        numberToChange = dropTargetNumber;
      }
      else {
        // The larger number gets changed, the smaller one gets removed.
        var droppingOnLarger = dropTargetNumberValue > draggedNumberValue;
        numberToRemove = droppingOnLarger ? draggedPaperNumber : dropTargetNumber;
        numberToChange = droppingOnLarger ? dropTargetNumber : draggedPaperNumber;
      }

      // Apply changes
      this.removePaperNumber( numberToRemove );
      numberToChange.changeNumber( newValue );
      numberToChange.setConstrainedDestination( availableModelBounds, numberToChange.positionProperty.value, false );
    },

    /**
     * Add a PaperNumber to the model
     * @public
     *
     * @param {PaperNumber} paperNumber
     */
    addPaperNumber: function( paperNumber ) {
      this.paperNumbers.push( paperNumber );
    },

    /**
     * Remove a PaperNumber from the model
     * @public
     *
     * @param {PaperNumber} paperNumber
     */
    removePaperNumber: function( paperNumber ) {
      this.paperNumbers.remove( paperNumber );
    },

    /**
     * Remove all PaperNumbers from the model.
     * @public
     *
     * @param {PaperNumber} paperNumber
     */
    removeAllPaperNumbers: function() {
      this.paperNumbers.clear();
    },

    /**
     * Given an array of integers, create and add paper numbers for each that are evenly distributed across the screen.
     * @public
     *
     * @param {Array.<number>} numbers
     */
    addMultipleNumbers: function( numbers ) {
      for ( var i = 0; i < numbers.length; i++ ) {
        var number = numbers[ i ];

        // Ingore 0s
        if ( !number ) { continue; }

        // evenly distribute across the screen
        var x = MakeATenConstants.LAYOUT_BOUNDS.width * ( 1 + i ) / ( numbers.length + 1 );
        var initialNumberPosition = new Vector2( x, MakeATenConstants.LAYOUT_BOUNDS.height / 2.5 );
        var paperNumber = new PaperNumber( number, initialNumberPosition );
        this.addPaperNumber( paperNumber );
      }
    },

    /**
     * @param {Bounds2} availableModelBounds - Constrain the location to be inside these bounds
     * @param {PaperNumber} paperNumber1
     * @param {PaperNumber} paperNumber2
     */
    repelAway: function( availableModelBounds, paperNumber1, paperNumber2 ) {
      // Determine which are 'left' and 'right'
      var isPaper1Left = paperNumber1.positionProperty.value.x < paperNumber2.positionProperty.value.x;
      var leftPaperNumber = isPaper1Left ? paperNumber1 : paperNumber2;
      var rightPaperNumber = isPaper1Left ? paperNumber2 : paperNumber1;

      // Determine offsets
      var repelLeftOffset = -MakeATenConstants.MOVE_AWAY_DISTANCE[ leftPaperNumber.digitLength ];
      var repelRightOffset = MakeATenConstants.MOVE_AWAY_DISTANCE[ rightPaperNumber.digitLength ];
      var leftPosition = leftPaperNumber.positionProperty.value.plusXY( repelLeftOffset, 0 );
      var rightPosition = rightPaperNumber.positionProperty.value.plusXY( repelRightOffset, 0 );

      // Kick off the animation to the destination
      var animateToDestination = true;
      leftPaperNumber.setConstrainedDestination( availableModelBounds, leftPosition, animateToDestination );
      rightPaperNumber.setConstrainedDestination( availableModelBounds, rightPosition, animateToDestination );
    },

    /**
     * Reset the model
     * @public
     */
    reset: function() {
      this.removeAllPaperNumbers();
    }
  } );
} );
