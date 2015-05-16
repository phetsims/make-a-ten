//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Represents a number ranging from 1 to 1999. This is the model class that user
 * drags,splits and combines based on certain arithmetic rules.
 *
 * All these numbers are built from a set of few base numbers
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );


  //constants
  var MULTIPLES_OF_TEN = [ 20, 30, 40, 50, 60, 70, 80, 90, 100 ];
  var MULTIPLES_OF_HUNDRED = [ 200, 300, 400, 500, 600, 700, 800, 900, 1000 ];

  /**
   *
   * @param {number} numberValue
   * @param {Vector2} initialPosition
   * @constructor
   */
  function PaperNumberModel( numberValue, initialPosition ) {
    PropertySet.call( this, {

      // number this paper model represents ex 324
      numberValue: numberValue,

      // Property that indicates where in model space the upper left corner of this shape is.  In general, this should
      // not be set directly outside of this type, and should only be manipulated through the methods defined below.
      position: initialPosition,

      // Flag that tracks whether the user is dragging this shape around.  Should be set externally, generally by the a
      // view node.
      userControlled: false,

      // Flag that indicates whether this element is animating from one location to another, should not be set externally.
      animating: false,

      // Value that indicates how faded out this shape is.  This is used as part of a feature where shapes can fade
      // out.  Once fade has started, it doesn't stop until it is fully faded, i.e. the value is 1.  This should not be
      // set externally.
      fadeProportion: 0

    } );

    this.baseNumbers = []; // for each of these base number, we have a corresponding image file

    this.decomposeIntoBaseNumbers( this.numberValue );
  }

  return inherit( PropertySet, PaperNumberModel, {

    /**
     * A number such as 238 will result in 200,30,8 as base numbers for which we have corresponding images
     *
     * @param {number} value
     */
    decomposeIntoBaseNumbers: function( value ) {
      this.baseNumbers = [];
      var valueStr = value + "";
      var digits = valueStr.length;
      for ( var i = 0; i < digits; i++ ) {
        var charPos = valueStr.charAt( i );
        var posValue = (+charPos) * Math.pow( 10, digits - i - 1 );
        if ( (posValue + "").startsWith( "0" ) ) {
          continue;
        }
        this.baseNumbers.push( posValue + "" );
      }
    },

    /**
     * Handles how the number should be split
     * Ex : 9 splits into 8 and 1, number 60 splits into 50 and 10 etc
     *
     * @param {Function} addNumberToModel - A function for adding the new numbers  to the model
     */
    pullApart: function( addNumberToModel ) {
      var amountToRemove = 1;
      var amountRemaining = 1;
      if ( this.number <= 10 && this.number > 1 ) {
        amountToRemove = 1;
      }
      else if ( this.number > 10 && this.number < 100 ) {
        amountToRemove = this.number % 10;
      }
      else if ( this.number >= 100 && this.number < 1000 ) {
        amountToRemove = this.number % 100;
      }
      else if ( this.number >= 1000 && this.number < 2000 ) {
        amountToRemove = this.number % 1000;
      }

      if ( amountToRemove < 1 ) {
        amountToRemove = 1;
      }

      if ( _.includes( MULTIPLES_OF_TEN, this.number ) ) {
        amountToRemove = 10;
      }

      if ( _.includes( MULTIPLES_OF_HUNDRED, this.number ) ) {
        amountToRemove = 100;
      }

      this.changeCurrentNumber( amountRemaining );
      addNumberToModel( amountToRemove );
    },

    changeCurrentNumber: function( newNumber ) {

    }


  } );

} );
