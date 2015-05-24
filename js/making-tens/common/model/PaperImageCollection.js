// Copyright 2002-2013, University of Colorado Boulder

/**
 * Holds the images against the number key
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var image1 = require( 'image!MAKING_TENS/1.png' );
  var image2 = require( 'image!MAKING_TENS/2.png' );
  var image3 = require( 'image!MAKING_TENS/3.png' );
  var image4 = require( 'image!MAKING_TENS/4.png' );
  var image5 = require( 'image!MAKING_TENS/5.png' );
  var image6 = require( 'image!MAKING_TENS/6.png' );
  var image7 = require( 'image!MAKING_TENS/7.png' );
  var image8 = require( 'image!MAKING_TENS/8.png' );
  var image9 = require( 'image!MAKING_TENS/9.png' );
  var image10 = require( 'image!MAKING_TENS/10.png' );
  var image20 = require( 'image!MAKING_TENS/20.png' );
  var image30 = require( 'image!MAKING_TENS/30.png' );
  var image40 = require( 'image!MAKING_TENS/40.png' );
  var image50 = require( 'image!MAKING_TENS/50.png' );
  var image60 = require( 'image!MAKING_TENS/60.png' );
  var image70 = require( 'image!MAKING_TENS/70.png' );
  var image80 = require( 'image!MAKING_TENS/80.png' );
  var image90 = require( 'image!MAKING_TENS/90.png' );
  var image100 = require( 'image!MAKING_TENS/100.png' );
  var image200 = require( 'image!MAKING_TENS/200.png' );
  var image300 = require( 'image!MAKING_TENS/300.png' );
  var image400 = require( 'image!MAKING_TENS/400.png' );
  var image500 = require( 'image!MAKING_TENS/500.png' );
  var image600 = require( 'image!MAKING_TENS/600.png' );
  var image700 = require( 'image!MAKING_TENS/700.png' );
  var image800 = require( 'image!MAKING_TENS/800.png' );
  var image900 = require( 'image!MAKING_TENS/900.png' );

  var allImages = {
    1: image1, 2: image2, 3: image3,
    4: image4, 5: image5, 6: image6,
    7: image7, 8: image8, 9: image9,
    10: image10, 20: image20, 30: image30,
    40: image40, 50: image50, 60: image60,
    70: image70, 80: image80, 90: image90,
    100: image100, 200: image200, 300: image300,
    400: image400, 500: image500, 600: image600,
    700: image700, 800: image800, 900: image900
  };

  function PaperImageCollection() {

  }

  return inherit( Object, PaperImageCollection, {},
    //statics
    {
      /**
       *
       * @param {number} number
       * @returns {ImageNode}
       */
      getNumberImage: function( number ) {
        return allImages[ number ];
      }
    } );
} );

