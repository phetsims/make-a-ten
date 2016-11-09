// Copyright 2015, University of Colorado Boulder

/**
 * Creates image views for base numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var imageDigit0 = require( 'mipmap!MAKE_A_TEN/digit-0.png' );
  var imageDigit1 = require( 'mipmap!MAKE_A_TEN/digit-1.png' );
  var imageDigit2 = require( 'mipmap!MAKE_A_TEN/digit-2.png' );
  var imageDigit3 = require( 'mipmap!MAKE_A_TEN/digit-3.png' );
  var imageDigit4 = require( 'mipmap!MAKE_A_TEN/digit-4.png' );
  var imageDigit5 = require( 'mipmap!MAKE_A_TEN/digit-5.png' );
  var imageDigit6 = require( 'mipmap!MAKE_A_TEN/digit-6.png' );
  var imageDigit7 = require( 'mipmap!MAKE_A_TEN/digit-7.png' );
  var imageDigit8 = require( 'mipmap!MAKE_A_TEN/digit-8.png' );
  var imageDigit9 = require( 'mipmap!MAKE_A_TEN/digit-9.png' );

  var imagePaperBackground1 = require( 'mipmap!MAKE_A_TEN/paper-background-1.png' );
  var imagePaperBackground10 = require( 'mipmap!MAKE_A_TEN/paper-background-10.png' );
  var imagePaperBackground100 = require( 'mipmap!MAKE_A_TEN/paper-background-100.png' );
  var imagePaperBackground1000 = require( 'mipmap!MAKE_A_TEN/paper-background-1000.png' );

  // numZeros => mipmap info
  var backgroundImages = {
    0: imagePaperBackground1,
    1: imagePaperBackground10,
    2: imagePaperBackground100,
    3: imagePaperBackground1000
  };

  // digit => mipmap info
  var digitHtmlImages = {
    1: imageDigit1,
    2: imageDigit2,
    3: imageDigit3,
    4: imageDigit4,
    5: imageDigit5,
    6: imageDigit6,
    7: imageDigit7,
    8: imageDigit8,
    9: imageDigit9
  };

  var overallDigitOffsets = {
    1: 93,
    2: -7,
    3: -7,
    4: -9,
    5: -18,
    6: -5,
    7: -24,
    8: -2,
    9: -10
  };

  var digitPlacementOffsets = {
    0: {
      1: -61,
      2: -3,
      3: -6,
      4: 4,
      5: 5,
      6: 2,
      7: 19,
      8: 12,
      9: 16
    },
    1: {
      1: 4,
      2: 7,
      3: 4,
      4: 0,
      5: -2,
      6: -1,
      7: -13,
      8: -8,
      9: -13
    },
    2: {
      1: -4,
      2: -1,
      3: 0,
      4: -3,
      5: -2,
      6: -2,
      7: -3,
      8: -1,
      9: -1
    },
    3: {
      1: -1,
      2: -2,
      3: 1,
      4: -3,
      5: -3,
      6: -1,
      7: -2,
      8: -3,
      9: -3
    }
  };

  var horizontalOffset = {
    0: 48,
    1: 108,
    2: 70,
    3: 94
  };

  var verticalOffset = {
    0: 65,
    1: 85,
    2: 163,
    3: 197
  };

  var zeroOffsets = {
    0: [],
    1: [ 335 ],
    2: [ 560, 314 ],
    3: [ 825, 580, 335 ]
  };

  var mapScale = 72 / 300;

  var PaperImage = {
    createNumberImage: function( baseNumber, opacity ) {
      var digit = baseNumber.digit;
      var place = baseNumber.place;
      var x = horizontalOffset[ place ] + digitPlacementOffsets[ place ][ digit ] + overallDigitOffsets[ digit ];
      var y = verticalOffset[ place ];
      var digitZeroOffsets = zeroOffsets[ place ];

      var node = new Node( { scale: mapScale } );
      node.translation = baseNumber.offset;

      node.addChild( new Image( backgroundImages[ place ], {
        imageOpacity: opacity
      } ) );

      node.addChild( new Image( digitHtmlImages[ digit ], {
        x: x,
        y: y
      } ) );

      for ( var i = 0; i < digitZeroOffsets.length; i++ ) {
        node.addChild( new Image( imageDigit0, {
          x: digitZeroOffsets[ i ],
          y: y
        } ) );
      }

      return node;
    },

    PAPER_NUMBER_DIMENSIONS: {
      0: new Dimension2( imagePaperBackground1[ 0 ].width * mapScale, imagePaperBackground1[ 0 ].height * mapScale ),
      1: new Dimension2( imagePaperBackground10[ 0 ].width * mapScale, imagePaperBackground10[ 0 ].height * mapScale ),
      2: new Dimension2( imagePaperBackground100[ 0 ].width * mapScale, imagePaperBackground100[ 0 ].height * mapScale ),
      3: new Dimension2( imagePaperBackground1000[ 0 ].width * mapScale, imagePaperBackground1000[ 0 ].height * mapScale )
    },

    IMAGE_OFFSETS: [
      new Vector2( 0, 0 ),
      new Vector2( -70, -( verticalOffset[ 1 ] - verticalOffset[ 0 ] ) * mapScale ),
      new Vector2( -70 - ( zeroOffsets[ 2 ][ 0 ] - zeroOffsets[ 1 ][ 0 ] ) * mapScale, -( verticalOffset[ 2 ] - verticalOffset[ 0 ] ) * mapScale ),
      new Vector2( -70 - ( zeroOffsets[ 3 ][ 0 ] - zeroOffsets[ 1 ][ 0 ] ) * mapScale, -( verticalOffset[ 3 ] - verticalOffset[ 0 ] ) * mapScale )
    ]
  };

  makeATen.register( 'PaperImage', PaperImage );

  return PaperImage;
} );
