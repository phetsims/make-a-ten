// Copyright 2015-2019, University of Colorado Boulder

/**
 * Adding screenview for Make a Ten. Allows entering two numbers with a keypad, so that the user can experiment with
 * adding with the sim's usual constraints.
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );
  const AdditionTermsNode = require( 'MAKE_A_TEN/make-a-ten/common/view/AdditionTermsNode' );
  const Color = require( 'SCENERY/util/Color' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const KeyboardPanel = require( 'MAKE_A_TEN/make-a-ten/adding/view/KeyboardPanel' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  const MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  const editMage = require( 'image!MAKE_A_TEN/edit.png' );

  // constants
  const MAX_DIGITS = 3;

  /**
   * @param {MakeATenAddingModel} model
   * @constructor
   */
  function MakeATenAddingScreenView( model ) {

    MakeATenCommonView.call( this, model );

    function createEditNumberButton( term ) {
      return new RectangularPushButton( {
        touchAreaXDilation: 10,
        touchAreaYDilation: 10,
        content: new Image( editMage, { scale: 0.5 } ),
        listener: function() {
          model.additionTerms.activeTermProperty.value = term;
        },
        baseColor: 'white'
      } );
    }

    // The node that display "12 + 100 = "
    const additionTermsNode = new AdditionTermsNode( model.additionTerms, true );
    this.addChild( additionTermsNode );

    additionTermsNode.left = this.layoutBounds.left + 38;
    additionTermsNode.top = this.layoutBounds.top + 85;

    const leftEditButton = createEditNumberButton( ActiveTerm.LEFT );
    const rightEditButton = createEditNumberButton( ActiveTerm.RIGHT );
    leftEditButton.top = rightEditButton.top = this.layoutBounds.top + 32;
    leftEditButton.right = additionTermsNode.getLeftAlignment() + additionTermsNode.x;
    rightEditButton.left = additionTermsNode.getRightAlignment() + additionTermsNode.x;
    this.addChild( leftEditButton );
    this.addChild( rightEditButton );

    // Where all of the paper numbers go (from supertype)
    this.addChild( this.paperNumberLayerNode );

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

    const dimBackground = new Rectangle( {
      fill: new Color( MakeATenConstants.SCREEN_BACKGROUND_COLOR ).colorUtilsDarker( 0.4 ).withAlpha( 0.4 )
    } );
    dimBackground.addInputListener( {
      down: function( event ) {
        model.additionTerms.activeTermProperty.value = ActiveTerm.NONE; // this will close the keyboard button
      }
    } );
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      dimBackground.rectBounds = visibleBounds.dilated( 5 ); // Extra dilation so anti-aliasing doesn't mess with borders
    } );
    this.addChild( dimBackground );

    const keyboardPanel = new KeyboardPanel( onNumberSubmit, MAX_DIGITS );
    this.addChild( keyboardPanel );

    keyboardPanel.centerX = additionTermsNode.centerX - 25;
    keyboardPanel.top = additionTermsNode.top + 120;

    model.additionTerms.activeTermProperty.link( function( term ) {
      keyboardPanel.visible = dimBackground.visible = term !== ActiveTerm.NONE;

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
