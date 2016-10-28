// Copyright 2015, University of Colorado Boulder

/**
 * Button for showing "next" label and a arrow button.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // constants
  var LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );

  /**
   * @constructor
   *
   * @param {string} buttonText
   * @param {Object} [options]
   */
  function NextArrowButton( buttonText, options ) {

    var arrowShape = new ArrowShape( 0, 0, 28.5, 0, {
      tailWidth: 2,
      headWidth: 8,
      headHeight: 8
    } );

    var labelArrowBox = new HBox( {
      children: [
        new Text( buttonText, { font: LABEL_FONT, fill: 'black', maxWidth: 150 } ),
        new Path( arrowShape, { fill: 'black' } )
      ],
      spacing: 15
    } );

    RectangularPushButton.call( this, _.extend( {
      // Default base code matches the yellow in the PhET logo (the one with the paper airplane).
      baseColor: new Color( 242, 233, 22 ),
      xMargin: 12,
      yMargin: 10,
      content: labelArrowBox
    }, options ) );
  }

  makeATen.register( 'NextArrowButton', NextArrowButton );

  return inherit( RectangularPushButton, NextArrowButton );
} );
