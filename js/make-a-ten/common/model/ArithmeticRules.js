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

  //constants
  var MULTIPLES_OF_TEN = [ 20, 30, 40, 50, 60, 70, 80, 90, 100 ];
  var MULTIPLES_OF_HUNDRED = [ 200, 300, 400, 500, 600, 700, 800, 900, 1000 ];

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

        var amountToRemove = 0;

        var numberPulledPartModel = null;
        if ( numberValue === 1 ) {
          return numberPulledPartModel;
        }

        // single digit
        if ( numberValue <= 10 && numberValue > 1 ) {
          amountToRemove = 1;
        }

        // 2 digits
        if ( numberValue > 10 && numberValue < 100 ) {
          if ( pulledIndex === 0 ) { // from left
            amountToRemove = 10; // pull off 10 when left most digit is pulled out
          }
          else {
            amountToRemove = numberValue % 10;
          }
        }

        // 3 digits
        if ( numberValue >= 100 && numberValue < 1000 ) {
          if ( pulledIndex === 0 ) {
            amountToRemove = 100;
          }
          if ( pulledIndex === 1 ) {
            amountToRemove = numberValue % 100;
          }
          if ( pulledIndex === 2 ) {
            amountToRemove = numberValue % 10;

            // issue #38
            if ( amountToRemove === 0 ) {
              amountToRemove = numberValue % 100;
            }
          }
        }

        // 4 digits
        if ( numberValue >= 1000 && numberValue < 9999 ) {
          if ( pulledIndex === 0 ) {
            amountToRemove = 1000;
          }
          if ( pulledIndex === 1 ) {
            amountToRemove = numberValue % 1000;
          }
          if ( pulledIndex === 2 ) {
            amountToRemove = numberValue % 100;
            // issue #38
            if ( amountToRemove === 0 ) {
              amountToRemove = numberValue % 1000;
            }
          }
          if ( pulledIndex === 3 ) {
            amountToRemove = numberValue % 10;
            // issue #38
            if ( amountToRemove === 0 ) {
              amountToRemove = numberValue % 100;
            }

            if ( amountToRemove === 0 ) {
              amountToRemove = numberValue % 1000;
            }
          }
        }

        if ( amountToRemove < 1 ) {
          amountToRemove = 1;
        }

        if ( _.contains( MULTIPLES_OF_TEN, numberValue ) ) {
          amountToRemove = 10;
        }

        if ( _.contains( MULTIPLES_OF_HUNDRED, numberValue ) ) {
          amountToRemove = 100;
        }


        return amountToRemove;
      }


    } );
} );