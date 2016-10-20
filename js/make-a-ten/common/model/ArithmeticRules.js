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
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   */
  function ArithmeticRules() {
  }

  makeATen.register( 'ArithmeticRules', ArithmeticRules );

  return inherit( Object, ArithmeticRules, {},
    {
      /**
       * @param a
       * @param b
       *
       * @returns {boolean}
       */
      canAddNumbers: function( a, b ) {
        assert && assert( typeof a === 'number' );
        assert && assert( typeof b === 'number' );

        // Don't allow carrying "past" the 10s, 100s or 1000s place.
        return ( a % 1000 ) + ( b % 1000 ) <= 1000 &&
               ( a % 100 ) + ( b % 100 ) <= 100 &&
               ( a % 10 ) + ( b % 10 ) <= 10 &&
               ( a <= 10 || b <= 10 || a + b >= 100 || a % 10 === 0 || b % 10 === 0 || ( a + b ) % 10 !== 0 );
      },

      /**
       * Handles how the number should be split and returns the new pulledout number
       * Ex : 9 splits into 8 and 1, number 60 splits into 50 and 10 etc
       *
       * @param {number} pulledIndex // in number 309 if the pulled index is 2, it mean users pulled 9
       * @returns {number} // zero means no value is pulled out
       */
      pullApartNumbers: function( numberValue, pulledIndex ) {
        if ( numberValue <= 1 ) {
          return null;
        }

        // Find the minimum place (0: singles, 1: doubles, etc.) where we can pull off from
        var minimumPlace = 0;
        for ( var i = 1; i < 3; i++ ) {
          var power = Math.pow( 10, i );
          if ( numberValue % power === 0 && numberValue > power ) {
            minimumPlace = i;
          }
        }

        // How many places are on the number?
        var maximumPlace = Math.floor( Util.log10( numberValue ) );

        // Grab the place we'll try to remove from.
        var place = Math.max( minimumPlace, maximumPlace - pulledIndex );

        var amountToRemove;
        if ( place === maximumPlace ) {
          amountToRemove = Math.pow( 10, place );
        }
        else {
          amountToRemove = numberValue % Math.pow( 10, place + 1 );
        }
        if ( amountToRemove === 0 ) {
          amountToRemove = Math.pow( 10, place );
        }
        if ( amountToRemove === numberValue ) {
          amountToRemove = Math.pow( 10, place - 1 );
        }

        return amountToRemove;
      }
    } );
} );