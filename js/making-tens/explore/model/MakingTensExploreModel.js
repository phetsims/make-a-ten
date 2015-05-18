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
  var PaperNumberModel = require( 'MAKING_TENS/making-tens/common/model/PaperNumberModel' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function MakingTensExploreModel() {
    PropertySet.call( this, {} );

    // Observable array of the numbers that have been placed
    this.residentNumbers = new ObservableArray(); // @public, read only

    //test
   // var paperNumberModel1 = new PaperNumberModel( 80, new Vector2( 110, 220 ) );
    // var paperNumberModel2 = new PaperNumberModel( 234, new Vector2( 410, 220 ) );
    var paperNumberModel3 = new PaperNumberModel( 546, new Vector2( 610, 220 ) );
   // this.residentNumbers.add( paperNumberModel1 );
    //this.residentNumbers.add( paperNumberModel2 );
   this.residentNumbers.add( paperNumberModel3 );

  }

  return inherit( PropertySet, MakingTensExploreModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    },

    /**
     *
     * @param {number} numberValue
     * @param {Vector2} initialPosition
     * @param {object} options
     */
    addNewNumber: function( numberValue, initialPosition, options ) {
      var newPaperNumberModel = new PaperNumberModel( numberValue, initialPosition, options );
      this.residentNumbers.add( newPaperNumberModel );
      return newPaperNumberModel;
    },



    /**
     *
     * @param {number} numberValue // the value of number dropped
     * @param {Vector2} droppedPoint
     */
    combineNumbersCallback: function(numberValue,droppedPoint) {

    }

  } );
} );