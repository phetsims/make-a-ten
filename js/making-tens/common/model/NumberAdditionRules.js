// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );


  /**
   * @constructor
   */
  function NumberAdditionRules() {


  }

  return inherit( Object, NumberAdditionRules, {},

    {
      /**
       *
       * @param numberA
       * @param numberB
       * @returns {boolean}
       */
      canAddNumbers: function( numberA, numberB ) {
        numberA = +numberA; // make it an int
        numberB = +numberB;
        var sum = numberA + numberB;
        var modA10 = numberA % 10;
        var modB10 = numberB % 10;

        if ( sum <= 10 ) {
          return true;
        }

        var twoDigits = ((numberA + "").length <= 2 && (numberB + "").length <= 2);

        if ( twoDigits ) {
          // Add with decades. 24 + 50 = 74.
          // Add with decades  20 + 50 = 70
          // cannot cross decades
          // no 24 + 59
          if ( modA10 === 0 || modB10 === 0 ) {
            return true;
          }
        }

        // Add singles to doubles if you don’t go over the decade.(this logic includes the single digit logic above)
        // 23 + 5 = 28
        // 23 +7 = 30
        // cannot cross decades except to meet decade with a single digit.
        // 23 + 7 = 30 okay.
        // but not 23 + 37 (neither A nor B <10)
        // no 23 + 9     (3+9 = 12 not less than = 10)
        // the sum<100  will force user to make 100 when going over 100.

        if ( (numberA || numberB < 10) && ((modA10 + modB10) <= 10) && sum < 100 ) {
          return true;
        }

       // var threeDigits = ((numberA + "").length <= 3 && (numberB + "").length <= 3); // TODO for 3 digits
        return false;
      }

    } );
} );