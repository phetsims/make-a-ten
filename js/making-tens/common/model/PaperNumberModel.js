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

  /**
   *
   * @param {number} number
   * @constructor
   */
  function PaperNumberModel( number ) {
    this.number = number;
    this.baseNumbers = []; // for each of these base number, we have a corresponding image file
  }

  return inherit( Object, PaperNumberModel, {

    /**
     * A number such as 238 will result in 200,30,8 as base numbers for which we have corresponding images
     *
     * @param {number} value
     */
    decomposeIntoBaseNumbers: function( value ) {
      var valueStr = value + "";
      var digits = valueStr.length;
      for ( var i = 0; i < digits; i++ ) {
        var charPos = valueStr.charAt( i );
        var posValue = (+charPos) * Math.pow( 10, digits - i - 1 );
        this.baseNumbers.push( posValue + "" );
      }

    }
  } );

} );
