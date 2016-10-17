// Copyright 2015, University of Colorado Boulder

/**
 * Holds the images against the number key
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );

  // TODO: Move to view
  var image1 = require( 'image!MAKE_A_TEN/1.png' );
  var image2 = require( 'image!MAKE_A_TEN/2.png' );
  var image3 = require( 'image!MAKE_A_TEN/3.png' );
  var image4 = require( 'image!MAKE_A_TEN/4.png' );
  var image5 = require( 'image!MAKE_A_TEN/5.png' );
  var image6 = require( 'image!MAKE_A_TEN/6.png' );
  var image7 = require( 'image!MAKE_A_TEN/7.png' );
  var image8 = require( 'image!MAKE_A_TEN/8.png' );
  var image9 = require( 'image!MAKE_A_TEN/9.png' );
  var image10 = require( 'image!MAKE_A_TEN/10.png' );
  var image20 = require( 'image!MAKE_A_TEN/20.png' );
  var image30 = require( 'image!MAKE_A_TEN/30.png' );
  var image40 = require( 'image!MAKE_A_TEN/40.png' );
  var image50 = require( 'image!MAKE_A_TEN/50.png' );
  var image60 = require( 'image!MAKE_A_TEN/60.png' );
  var image70 = require( 'image!MAKE_A_TEN/70.png' );
  var image80 = require( 'image!MAKE_A_TEN/80.png' );
  var image90 = require( 'image!MAKE_A_TEN/90.png' );
  var image100 = require( 'image!MAKE_A_TEN/100.png' );
  var image200 = require( 'image!MAKE_A_TEN/200.png' );
  var image300 = require( 'image!MAKE_A_TEN/300.png' );
  var image400 = require( 'image!MAKE_A_TEN/400.png' );
  var image500 = require( 'image!MAKE_A_TEN/500.png' );
  var image600 = require( 'image!MAKE_A_TEN/600.png' );
  var image700 = require( 'image!MAKE_A_TEN/700.png' );
  var image800 = require( 'image!MAKE_A_TEN/800.png' );
  var image900 = require( 'image!MAKE_A_TEN/900.png' );
  var image1000 = require( 'image!MAKE_A_TEN/1000.png' );
  var image2000 = require( 'image!MAKE_A_TEN/2000.png' );
  var image3000 = require( 'image!MAKE_A_TEN/3000.png' );
  var image4000 = require( 'image!MAKE_A_TEN/4000.png' );
  var image5000 = require( 'image!MAKE_A_TEN/5000.png' );
  var image6000 = require( 'image!MAKE_A_TEN/6000.png' );
  var image7000 = require( 'image!MAKE_A_TEN/7000.png' );
  var image8000 = require( 'image!MAKE_A_TEN/8000.png' );
  var image9000 = require( 'image!MAKE_A_TEN/9000.png' );

  var allImages = {
    1: image1, 2: image2, 3: image3,
    4: image4, 5: image5, 6: image6,
    7: image7, 8: image8, 9: image9,
    10: image10, 20: image20, 30: image30,
    40: image40, 50: image50, 60: image60,
    70: image70, 80: image80, 90: image90,
    100: image100, 200: image200, 300: image300,
    400: image400, 500: image500, 600: image600,
    700: image700, 800: image800, 900: image900,
    1000: image1000, 2000: image2000, 3000: image3000,
    4000: image4000, 5000: image5000, 6000: image6000,
    7000: image7000, 8000: image8000, 9000: image9000
  };

  var PaperImageCollection = {
    /**
     *
     * @param {number} number
     * @returns {ImageNode}
     */
    getNumberImage: function( number ) {
      return allImages[ number ];
    }
  };

  makeATen.register( 'PaperImageCollection', PaperImageCollection );

  return PaperImageCollection;

} );

