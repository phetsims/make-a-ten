// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var KeyBoardPanel = require( 'MAKING_TENS/making-tens/adding/view/KeyBoardPanel' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );
  var ExpressionTermsNode = require( 'MAKING_TENS/making-tens/common/view/ExpressionTermsNode' );
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );
  var ActiveTerm = require( 'MAKING_TENS/making-tens/adding/model/ActiveTerm' );

  //images
  var editIcon = require( 'image!MAKING_TENS/edit.png' );

  // constants
  var MAX_DIGITS = 3;
  var EDIT_ICON_SIZE = new Dimension2( 32, 28 );

  /**
   * @param {MakingTensAddingModel} makingTensAddingModel
   * @constructor
   */
  function MakingTensAddingScreenView( makingTensAddingModel ) {

    MakingTensCommonView.call( this, makingTensAddingModel, MakingTensSharedConstants.LAYOUT_BOUNDS );

    // dismiss any open keyboard if a click/touch hits the background directly
    var background = Rectangle.bounds( this.layoutBounds );
    background.addInputListener( {
      down: function( event ) {
        makingTensAddingModel.activeTerm = ActiveTerm.NONE; // this will close the keyboard button
      }
    } );


    // type is either "lt" or "rt" - (left or right)
    function createEditNumberButton( termProperty, type ) {
      var editNumberButton = new RectangularPushButton( {
        content: MakingTensUtil.createSizedImageNode( new Image( editIcon ), EDIT_ICON_SIZE ),
        listener: function() {
          termProperty.set( type );
        },
        baseColor: 'white'
      } );
      return editNumberButton;
    }

    this.addChild( background );
    this.addChild( this.paperNumberLayerNode );

    var leftEditNumberButton = createEditNumberButton( makingTensAddingModel.expressionTerms.activeTermProperty, ActiveTerm.LEFT );
    var rightEditNumberButton = createEditNumberButton( makingTensAddingModel.expressionTerms.activeTermProperty, ActiveTerm.RIGHT );

    var editButtonBox = new HBox( { children: [ leftEditNumberButton, rightEditNumberButton ], spacing: 45 } );
    this.addChild( editButtonBox );
    editButtonBox.left = this.layoutBounds.minX + 75;
    editButtonBox.top = this.layoutBounds.minY + 32;

    // The node that display "12 + 100 = "
    var expressionTermsNode = new ExpressionTermsNode( makingTensAddingModel.expressionTerms, {
      highlightBorders: true
    } );
    this.addChild( expressionTermsNode );

    expressionTermsNode.left = this.layoutBounds.minX + 38;
    expressionTermsNode.top = this.layoutBounds.minY + 85;

    function onNumberSubmit( value ) {
      if ( makingTensAddingModel.expressionTerms.activeTerm === ActiveTerm.LEFT ) {
        makingTensAddingModel.expressionTerms.leftTerm = value;
      }
      if ( makingTensAddingModel.expressionTerms.activeTerm === ActiveTerm.RIGHT ) {
        makingTensAddingModel.expressionTerms.rightTerm = value;
      }

      makingTensAddingModel.createTerms();
      makingTensAddingModel.expressionTerms.activeTerm = ActiveTerm.NONE;

    }

    var keyBoardPanel = new KeyBoardPanel( onNumberSubmit, MAX_DIGITS );
    this.addChild( keyBoardPanel );

    keyBoardPanel.centerX = expressionTermsNode.centerX - 25;
    keyBoardPanel.top = expressionTermsNode.top + 120;

    makingTensAddingModel.expressionTerms.activeTermProperty.link( function( term ) {

      // TODO: seems like this could be cleaned up a bit?
      if ( term === ActiveTerm.NONE ) {
        keyBoardPanel.visible = false;
        return;
      }

      keyBoardPanel.visible = true;
      if ( term === ActiveTerm.LEFT ) {
        keyBoardPanel.setValue( makingTensAddingModel.expressionTerms.leftTerm );
      }
      if ( term === ActiveTerm.RIGHT ) {
        keyBoardPanel.setValue( makingTensAddingModel.expressionTerms.rightTerm );
      }
    } );
  }

  makingTens.register( 'MakingTensAddingScreenView', MakingTensAddingScreenView );

  return inherit( MakingTensCommonView, MakingTensAddingScreenView );
} );