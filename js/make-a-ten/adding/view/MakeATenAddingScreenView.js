// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var KeyboardPanel = require( 'MAKE_A_TEN/make-a-ten/adding/view/KeyboardPanel' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var ExpressionTermsNode = require( 'MAKE_A_TEN/make-a-ten/common/view/ExpressionTermsNode' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );

  //images
  var editIcon = require( 'image!MAKE_A_TEN/edit.png' );

  // constants
  var MAX_DIGITS = 3;
  var EDIT_ICON_SIZE = new Dimension2( 32, 28 );

  /**
   * @param {MakeATenAddingModel} model
   * @constructor
   */
  function MakeATenAddingScreenView( model ) {

    MakeATenCommonView.call( this, model );

    // dismiss any open keyboard if a click/touch hits the background directly
    var background = Rectangle.bounds( this.layoutBounds );
    background.addInputListener( {
      down: function( event ) {
        model.expressionTerms.activeTermProperty.value = ActiveTerm.NONE; // this will close the keyboard button
      }
    } );


    // type is either "lt" or "rt" - (left or right)
    function createEditNumberButton( termProperty, type ) {
      var editNumberButton = new RectangularPushButton( {
        content: MakeATenUtil.createSizedImageNode( new Image( editIcon ), EDIT_ICON_SIZE ),
        listener: function() {
          termProperty.value = type;
        },
        baseColor: 'white'
      } );
      return editNumberButton;
    }

    this.addChild( background );
    this.addChild( this.paperNumberLayerNode );

    var leftEditNumberButton = createEditNumberButton( model.expressionTerms.activeTermProperty, ActiveTerm.LEFT );
    var rightEditNumberButton = createEditNumberButton( model.expressionTerms.activeTermProperty, ActiveTerm.RIGHT );

    var editButtonBox = new HBox( { children: [ leftEditNumberButton, rightEditNumberButton ], spacing: 45 } );
    this.addChild( editButtonBox );
    editButtonBox.left = this.layoutBounds.left + 75;
    editButtonBox.top = this.layoutBounds.top + 32;

    // The node that display "12 + 100 = "
    var expressionTermsNode = new ExpressionTermsNode( model.expressionTerms, {
      highlightBorders: true
    } );
    this.addChild( expressionTermsNode );

    expressionTermsNode.left = this.layoutBounds.left + 38;
    expressionTermsNode.top = this.layoutBounds.top + 85;

    function onNumberSubmit( value ) {
      if ( model.expressionTerms.activeTermProperty.value === ActiveTerm.LEFT ) {
        model.expressionTerms.leftTermProperty.value = value;
      }
      if ( model.expressionTerms.activeTermProperty.value === ActiveTerm.RIGHT ) {
        model.expressionTerms.rightTermProperty.value = value;
      }

      model.createTerms();
      model.expressionTerms.activeTermProperty.value = ActiveTerm.NONE;

    }

    var keyBoardPanel = new KeyboardPanel( onNumberSubmit, MAX_DIGITS );
    this.addChild( keyBoardPanel );

    keyBoardPanel.centerX = expressionTermsNode.centerX - 25;
    keyBoardPanel.top = expressionTermsNode.top + 120;

    model.expressionTerms.activeTermProperty.link( function( term ) {

      // TODO: seems like this could be cleaned up a bit?
      if ( term === ActiveTerm.NONE ) {
        keyBoardPanel.visible = false;
        return;
      }

      keyBoardPanel.visible = true;
      if ( term === ActiveTerm.LEFT ) {
        keyBoardPanel.setValue( model.expressionTerms.leftTermProperty.value );
      }
      if ( term === ActiveTerm.RIGHT ) {
        keyBoardPanel.setValue( model.expressionTerms.rightTermProperty.value );
      }
    } );

    this.layoutControls();
  }

  makeATen.register( 'MakeATenAddingScreenView', MakeATenAddingScreenView );

  return inherit( MakeATenCommonView, MakeATenAddingScreenView );
} );