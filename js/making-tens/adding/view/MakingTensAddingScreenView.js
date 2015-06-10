// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HSlider = require( 'SUN/HSlider' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var KeyBoardPanel = require( 'MAKING_TENS/making-tens/adding/view/KeyBoardPanel' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );

  // constants
  var EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );
  var TERM_FONT = new PhetFont( { size: 35, weight: 'bold' } );
  var EQUATION_COLOR = "rgb(63,63,183)";
  var activeNumberDisplayStyle = { fill: null, stroke: '#000', lineDash: [ 5, 5 ] };
  var normalNumberDisplayStyle = { fill: null, stroke: null, lineDash: [ 0, 0 ] };
  var MAX_DIGITS = 3;

  // images
  var mockupImage = require( 'image!MAKING_TENS/adding-mockup.png' );

  /**
   * @param {MakingTensAddingModel} makingTensAddingModel
   * @constructor
   */
  function MakingTensAddingScreenView( makingTensAddingModel ) {
    var paperNumberLayerNode = new Node();
    MakingTensCommonView.call( this, makingTensAddingModel, MakingTensSharedConstants.LAYOUT_BOUNDS, paperNumberLayerNode );

    // type is either "lt" or "rt" - (left or right)
    function createEditNumberButton( termProperty, type ) {
      var editNumberButton = new RectangularPushButton( {
        content: new Rectangle( 0, 0, 32, 28 ),
        listener: function() {
          termProperty.set( type );
        },
        baseColor: 'white'
      } );
      return editNumberButton;
    }

    // mouse down on background is used for dismissing the active keyboard
    var backGroundRectangle = new Rectangle( this.layoutBounds.minX,
      this.layoutBounds.minY, this.layoutBounds.width, this.layoutBounds.height, 0, 0, {
        lineWidth: 0,
        fill: MakingTensSharedConstants.ADDING_SCREEN_BACKGROUND_COLOR
      } );

    this.addChild( backGroundRectangle );
    this.addChild( paperNumberLayerNode );

    var leftEditNumberButton = createEditNumberButton( makingTensAddingModel.activeTermProperty, "lt" );
    var rightEditNumberButton = createEditNumberButton( makingTensAddingModel.activeTermProperty, "rt" );

    var editButtonBox = new HBox( { children: [ leftEditNumberButton, rightEditNumberButton ], spacing: 45 } );
    this.addChild( editButtonBox );
    editButtonBox.left = this.layoutBounds.minX + 75;
    editButtonBox.top = this.layoutBounds.minY + 32;

    var leftNumberDisplayBackground = new Rectangle( 0, 0, 85, 78, 10, 10, {
      fill: '#fff', stroke: '#000', lineDash: [ 5, 5 ], lineWidth: 2
    } );

    var rightNumberDisplayBackGround = new Rectangle( 0, 0, 85, 78, 10, 10, {
      fill: '#fff', stroke: '#000', lineDash: [ 5, 5 ], lineWidth: 2
    } );

    var leftTermTextNode = new Text( '', { font: TERM_FONT, fill: EQUATION_COLOR } );
    var rightTermTextNode = new Text( '', { font: TERM_FONT, fill: EQUATION_COLOR } );
    leftTermTextNode.setDirection( "rtl" );
    this.addChild( leftTermTextNode );
    this.addChild( rightTermTextNode );

    var pluTextNode = new Text( '+', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var equalsSignNode = new Text( '=', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var emptyNode = new Text( '', { font: EQUATION_FONT, fill: EQUATION_COLOR } );

    var spacing = 5;
    var numberDisplayBox = new HBox( {
      children: [ leftNumberDisplayBackground, pluTextNode,
        rightNumberDisplayBackGround, emptyNode, equalsSignNode ], spacing: spacing
    } );
    this.addChild( numberDisplayBox );

    numberDisplayBox.left = this.layoutBounds.minX + 38;
    numberDisplayBox.top = this.layoutBounds.minY + 85;

    leftTermTextNode.left = numberDisplayBox.left + leftNumberDisplayBackground.width / 1.2;
    leftTermTextNode.centerY = numberDisplayBox.top + numberDisplayBox.height / 2;

    rightTermTextNode.left = numberDisplayBox.left + rightNumberDisplayBackGround.left + rightNumberDisplayBackGround.width / 8;
    rightTermTextNode.centerY = numberDisplayBox.top + numberDisplayBox.height / 2;

    function onNumberSubmit( value ) {
      if ( makingTensAddingModel.activeTerm === "lt" ) {
        makingTensAddingModel.leftTerm = value;
      }
      if ( makingTensAddingModel.activeTerm === "rt" ) {
        makingTensAddingModel.rightTerm = value;
      }

      makingTensAddingModel.createTerms();

      makingTensAddingModel.activeTerm = "none";
    }

    var keyBoardPanel = new KeyBoardPanel( onNumberSubmit, MAX_DIGITS );
    this.addChild( keyBoardPanel );
    keyBoardPanel.centerX = numberDisplayBox.centerX - 25;
    keyBoardPanel.top = numberDisplayBox.top + 120;

    makingTensAddingModel.activeTermProperty.link( function( term ) {
      leftNumberDisplayBackground.mutate( normalNumberDisplayStyle );
      rightNumberDisplayBackGround.mutate( normalNumberDisplayStyle );
      if ( term === "none" ) {
        keyBoardPanel.visible = false;
        return;
      }

      keyBoardPanel.visible = true;
      if ( term === "lt" ) {
        leftNumberDisplayBackground.mutate( activeNumberDisplayStyle );
        keyBoardPanel.setValue( leftTermTextNode.text );
      }
      if ( term === "rt" ) {
        rightNumberDisplayBackGround.mutate( activeNumberDisplayStyle );
        keyBoardPanel.setValue( rightTermTextNode.text );
      }
    } );

    makingTensAddingModel.leftTermProperty.link( function( term ) {
      leftTermTextNode.text = term;
    } );

    makingTensAddingModel.rightTermProperty.link( function( term ) {
      rightTermTextNode.text = term;
    } );

    backGroundRectangle.addInputListener( new DownUpListener( {
        down: function( event, trail ) {
          if ( event.target === backGroundRectangle ) {
            makingTensAddingModel.activeTerm = "none"; // this will close the keyboard button
          }
        }
      }
    ) );

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

  return inherit( MakingTensCommonView, MakingTensAddingScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );