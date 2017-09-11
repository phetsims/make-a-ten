// Copyright 2015, University of Colorado Boulder

/**
 * Creates image views for base numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

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

  // place => mipmap info
  var BACKGROUND_IMAGE_MAP = {
    0: imagePaperBackground1,
    1: imagePaperBackground10,
    2: imagePaperBackground100,
    3: imagePaperBackground1000
  };

  // digit => mipmap info
  var DIGIT_IMAGE_MAP = {
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

  // place => x/y offsets for the first digit in each place
  var PLACE_X_OFFSET = { 0: 48, 1: 108, 2: 70, 3: 94 };
  var PLACE_Y_OFFSET = { 0: 65, 1: 85, 2: 163, 3: 197 };

  // digit => horizontal offset for that digit (applied to all places, includes digit-specific information)
  var DIGIT_X_OFFSET = { 1: 93, 2: -7, 3: -7, 4: -9, 5: -18, 6: -5, 7: -24, 8: -2, 9: -10 };

  // digit => horizontal offset, customized for each single digit base number
  var FIRST_PLACE_DIGIT_X_OFFSET = { 1: -61, 2: 0, 3: 0, 4: 0, 5: 5, 6: 0, 7: 15, 8: 10, 9: 15 };

  // place => horizontal locations of the zeros in the base number
  var ZERO_OFFSET = {
    0: [],
    1: [ 335 ],
    2: [ 560, 314 ],
    3: [ 825, 580, 335 ]
  };

  // Scale was increased from 72dpi (pixels) to 300dpi, so that we can have crisper graphics.
  var SCALE = 72 / 300;

  /**
   * @constructor
   * @extends Node
   *
   * @param {BaseNumber} baseNumber
   * @param {number} opacity
   */
  function BaseNumberNode( baseNumber, opacity ) {
    Node.call( this, { scale: SCALE } );

    // Location of the initial digit
    var x = PLACE_X_OFFSET[ baseNumber.place ] + DIGIT_X_OFFSET[ baseNumber.digit ];
    var y = PLACE_Y_OFFSET[ baseNumber.place ];

    // We need to slightly offset some
    if ( baseNumber.place === 0 ) {
      x += FIRST_PLACE_DIGIT_X_OFFSET[ baseNumber.digit ];
    }

    // Translate everything by our offset
    this.translation = baseNumber.offset;

    // The paper behind the numbers
    this.addChild( new Image( BACKGROUND_IMAGE_MAP[ baseNumber.place ], {
      imageOpacity: opacity
    } ) );

    // The initial (non-zero) digit
    this.addChild( new Image( DIGIT_IMAGE_MAP[ baseNumber.digit ], {
      x: x,
      y: y
    } ) );

    // Add the zeros
    var digitZeroOffsets = ZERO_OFFSET[ baseNumber.place ];
    for ( var i = 0; i < digitZeroOffsets.length; i++ ) {
      this.addChild( new Image( imageDigit0, {
        x: digitZeroOffsets[ i ],
        y: y
      } ) );
    }
  }

  makeATen.register( 'BaseNumberNode', BaseNumberNode );

  inherit( Node, BaseNumberNode, {}, {
    /**
     * @public {Object} - Maps place (0-3) to a {Dimension2} with the width/height
     */
    PAPER_NUMBER_DIMENSIONS: _.mapValues( BACKGROUND_IMAGE_MAP, function( mipmap ) {
      return new Dimension2( mipmap[ 0 ].width * SCALE, mipmap[ 0 ].height * SCALE );
    } ),

    /**
     * @public {Array.<Vector2>} - Maps place (0-3) to a {Vector2} that is the offset of the upper-left corner of the
     *                             BaseNumberNode relative to a 1-digit BaseNumberNode.
     */
    IMAGE_OFFSETS: [
      new Vector2( 0, 0 ),
      new Vector2( -70, -( PLACE_Y_OFFSET[ 1 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE ),
      new Vector2( -70 - ( ZERO_OFFSET[ 2 ][ 0 ] - ZERO_OFFSET[ 1 ][ 0 ] ) * SCALE, -( PLACE_Y_OFFSET[ 2 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE ),
      new Vector2( -70 - ( ZERO_OFFSET[ 3 ][ 0 ] - ZERO_OFFSET[ 1 ][ 0 ] ) * SCALE, -( PLACE_Y_OFFSET[ 3 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE )
    ]
  } );

  return BaseNumberNode;
} );
