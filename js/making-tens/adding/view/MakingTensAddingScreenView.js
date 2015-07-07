// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var KeyBoardPanel = require( 'MAKING_TENS/making-tens/adding/view/KeyBoardPanel' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );
  var ExpressionTermsNode = require( 'MAKING_TENS/making-tens/common/view/ExpressionTermsNode' );

  // constants
  var MAX_DIGITS = 3;

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

    // The node that display "12 + 100 = "
    var expressionTermsNode = new ExpressionTermsNode( makingTensAddingModel.leftTermProperty,
      makingTensAddingModel.rightTermProperty, makingTensAddingModel );
    this.addChild( expressionTermsNode );

    expressionTermsNode.left = this.layoutBounds.minX + 38;
    expressionTermsNode.top = this.layoutBounds.minY + 85;


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
    keyBoardPanel.centerX = expressionTermsNode.centerX - 25;
    keyBoardPanel.top = expressionTermsNode.top + 120;

    makingTensAddingModel.activeTermProperty.link( function( term ) {
      makingTensAddingModel.leftTermBackgroundStyle = makingTensAddingModel.normalNumberDisplayStyle;
      makingTensAddingModel.rightTermBackgroundStyle = makingTensAddingModel.normalNumberDisplayStyle;

      if ( term === "none" ) {
        keyBoardPanel.visible = false;
        return;
      }

      keyBoardPanel.visible = true;
      if ( term === "lt" ) {
        makingTensAddingModel.leftTermBackgroundStyle = makingTensAddingModel.activeNumberDisplayStyle;
        keyBoardPanel.setValue( makingTensAddingModel.leftTerm );
      }
      if ( term === "rt" ) {
        makingTensAddingModel.rightTermBackgroundStyle = makingTensAddingModel.activeNumberDisplayStyle;
        keyBoardPanel.setValue( makingTensAddingModel.rightTerm );
      }
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
  }

  return inherit( MakingTensCommonView, MakingTensAddingScreenView );
} );