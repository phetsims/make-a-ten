// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var HSlider = require( 'SUN/HSlider' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Property = require( 'AXON/Property' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );
  var EQUATION_COLOR = "rgb(63,63,183)";

  // images
  var mockupImage = require( 'image!MAKING_TENS/adding-mockup.png' );

  /**
   * @param {MakingTensAddingModel} makingTensAddingModel
   * @constructor
   */
  function MakingTensAddingScreenView( makingTensAddingModel ) {

    ScreenView.call( this );

    var leftEditNumberButton = new RectangularPushButton( {
      content: new Rectangle( 0, 0, 32, 28 ),
      listener: function() {},
      baseColor: 'white'
    } );

    var rightEditNumberButton = new RectangularPushButton( {
      content: new Rectangle( 0, 0, 32, 28 ),
      listener: function() {},
      baseColor: 'white'
    } );

    var editButtonBox = new HBox( { children: [ leftEditNumberButton, rightEditNumberButton ], spacing: 45 } );
    this.addChild( editButtonBox );
    editButtonBox.left = this.layoutBounds.minX + 75;
    editButtonBox.top = this.layoutBounds.minY + 32;

    var leftNumberDisplay = new Rectangle( 0, 0, 85, 78, 10, 10, {
      fill: '#fff',
      stroke: '#000',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );
    var rightNumberDisplay = new Rectangle( 0, 0, 85, 78, 10, 10, {
      fill: '#fff',
      stroke: '#000',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );

    var pluTextNode = new Text( '+', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var equalsSignNode = new Text( '=', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var emptyNode = new Text( '', { font: EQUATION_FONT, fill: EQUATION_COLOR } );

    var numberDisplayBox = new HBox( {
      children: [ leftNumberDisplay, pluTextNode,
        rightNumberDisplay, emptyNode, equalsSignNode ], spacing: 5
    } );
    this.addChild( numberDisplayBox );

    numberDisplayBox.left = this.layoutBounds.minX + 38;
    numberDisplayBox.top = this.layoutBounds.minY + 85;

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        makingTensAddingModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.4 );
    var image = new Image( mockupImage, { pickable: false } );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, { min: 0, max: 1 }, { top: 10, left: 500 } ) );
  }

  return inherit( ScreenView, MakingTensAddingScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );