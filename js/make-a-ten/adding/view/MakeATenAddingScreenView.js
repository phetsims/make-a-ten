// Copyright 2015, University of Colorado Boulder

/**
 * Adding screenview for Make a Ten. Allows entering two numbers with a keypad, so that the user can experiment with
 * adding with the sim's usual constraints.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var KeyboardPanel = require( 'MAKE_A_TEN/make-a-ten/adding/view/KeyboardPanel' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var AdditionTermsNode = require( 'MAKE_A_TEN/make-a-ten/common/view/AdditionTermsNode' );
  var ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );

  // images
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

    // Dismiss any open keyboard if a click/touch hits the background directly
    var background = new Plane();
    background.addInputListener( {
      down: function( event ) {
        model.additionTerms.activeTermProperty.value = ActiveTerm.NONE; // this will close the keyboard button
      }
    } );
    this.addChild( background );

    // Where all of the paper numbers go (from supertype)
    this.addChild( this.paperNumberLayerNode );

    function createEditNumberButton( term ) {
      return new RectangularPushButton( {
        content: LevelSelectionButton.createSizedImageNode( new Image( editIcon ), EDIT_ICON_SIZE ),
        listener: function() {
          model.additionTerms.activeTermProperty.value = term;
        },
        baseColor: 'white'
      } );
    }

    var editButtonBox = new HBox( {
      children: [
        createEditNumberButton( ActiveTerm.LEFT ),
        createEditNumberButton( ActiveTerm.RIGHT )
      ],
      spacing: 45
    } );
    this.addChild( editButtonBox );

    editButtonBox.left = this.layoutBounds.left + 75;
    editButtonBox.top = this.layoutBounds.top + 32;

    // The node that display "12 + 100 = "
    var additionTermsNode = new AdditionTermsNode( model.additionTerms, true );
    this.addChild( additionTermsNode );

    additionTermsNode.left = this.layoutBounds.left + 38;
    additionTermsNode.top = this.layoutBounds.top + 85;

    function onNumberSubmit( value ) {
      if ( model.additionTerms.activeTermProperty.value === ActiveTerm.LEFT ) {
        model.additionTerms.leftTermProperty.value = value;
      }
      if ( model.additionTerms.activeTermProperty.value === ActiveTerm.RIGHT ) {
        model.additionTerms.rightTermProperty.value = value;
      }

      model.setupTerms();
      model.additionTerms.activeTermProperty.value = ActiveTerm.NONE;
    }

    var keyboardPanel = new KeyboardPanel( onNumberSubmit, MAX_DIGITS );
    this.addChild( keyboardPanel );

    keyboardPanel.centerX = additionTermsNode.centerX - 25;
    keyboardPanel.top = additionTermsNode.top + 120;

    model.additionTerms.activeTermProperty.link( function( term ) {
      keyboardPanel.visible = term !== ActiveTerm.NONE;

      if ( term === ActiveTerm.LEFT ) {
        keyboardPanel.setValue( model.additionTerms.leftTermProperty.value );
      }
      if ( term === ActiveTerm.RIGHT ) {
        keyboardPanel.setValue( model.additionTerms.rightTermProperty.value );
      }
    } );

    this.layoutControls();
  }

  makeATen.register( 'MakeATenAddingScreenView', MakeATenAddingScreenView );

  return inherit( MakeATenCommonView, MakeATenAddingScreenView );
} );
