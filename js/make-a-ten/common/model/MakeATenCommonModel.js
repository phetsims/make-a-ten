// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function MakeATenCommonModel() {
    //filled by View
    this.viewPortBounds = null; // filled by the view during resize

    // Observable array of the numbers that have been placed
    this.paperNumbers = new ObservableArray();
  }

  makeATen.register( 'MakeATenCommonModel', MakeATenCommonModel );

  return inherit( Object, MakeATenCommonModel, {
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
     * When collapsing, we remove either the dropTarget object and change the number value of the dragged objects
     * but if the dropTarget is larger than the dragged number , reverse the objects to remove and change.
     *
     * @param {PaperNumber} draggedPaperNumber
     * @param {PaperNumber} dropTargetNumber
     */
    collapseNumberModels: function( draggedPaperNumber, dropTargetNumber ) {
      var dropTargetNumberValue = dropTargetNumber.numberValueProperty.value;
      var draggedNumberValue = draggedPaperNumber.numberValueProperty.value;

      var numberToRemove = dropTargetNumber;
      var numberToChange = draggedPaperNumber;

      if ( dropTargetNumberValue > draggedNumberValue ) {
        numberToRemove = draggedPaperNumber;
        numberToChange = dropTargetNumber;
      }
      this.removePaperNumber( numberToRemove );
      var newValue = dropTargetNumberValue + draggedNumberValue;
      numberToChange.changeNumber( newValue );
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

    // TODO: doc
    removePaperNumber: function( paperNumber ) {
      this.paperNumbers.remove( paperNumber );
    },

    // TODO: doc
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
     *
     * @param {PaperNumber} paperNumber1
     * @param {PaperNumber} paperNumber2
     */
    repelAway: function( paperNumber1, paperNumber2 ) {
      var repelRightDistance = MakeATenConstants.MOVE_AWAY_DISTANCE[ paperNumber1.digitLength ];
      var repelLeftDistance = MakeATenConstants.MOVE_AWAY_DISTANCE[ paperNumber2.digitLength ] * -1;

      var rightPaperNumber = paperNumber1;
      var leftPaperNumber = paperNumber2;

      if ( rightPaperNumber.positionProperty.value.x < leftPaperNumber.positionProperty.value.x ) {
        rightPaperNumber = paperNumber2;
        leftPaperNumber = paperNumber1;
      }

      var animateToDestination = true;
      var delta = new Vector2( repelRightDistance, 0 );
      rightPaperNumber.setConstrainedDestination( this.viewPortBounds, rightPaperNumber.positionProperty.value.plus( delta ), animateToDestination );

      delta = new Vector2( repelLeftDistance, 0 );
      leftPaperNumber.setConstrainedDestination( this.viewPortBounds, leftPaperNumber.positionProperty.value.plus( delta ), animateToDestination );
    },

    reset: function() {
      this.removeAllPaperNumbers();
    }
  } );
} );
