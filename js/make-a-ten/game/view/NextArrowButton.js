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
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );

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
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      xMargin: 12,
      yMargin: 10,
      content: labelArrowBox
    }, options ) );
  }

  makeATen.register( 'NextArrowButton', NextArrowButton );

  return inherit( RectangularPushButton, NextArrowButton );
} );
