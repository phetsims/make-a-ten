// Copyright 2015-2017, University of Colorado Boulder

/**
 * Displays a partial addition formula (or fragments), like "7 + 2 =", where parts can be filled in, and layout
 * automatically adjusts.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  // constants
  var EQUATION_FONT = new PhetFont( { size: 45, weight: 'bold' } );
  var STROKE_COLOR = '#000';
  var LAYOUT_MULTIPLIER = 1 / 8; // Fraction offset of the text from the background's border

  /**
   * @constructor
   *
   * @param {AdditionTerms} additionTerms - Our model, contains information about the left/right and active terms
   * @param {boolean} highlightBorders - Whether there should be highlighted borders around the active term.
   */
  function AdditionTermsNode( additionTerms, highlightBorders ) {
    Node.call( this );

    var backgroundOptions = {
      stroke: STROKE_COLOR,
      lineDash: [ 5, 5 ],
      lineWidth: 2,
      visible: highlightBorders
    };

    var leftNumberDisplayBackground = new Rectangle( 0, 0, 100, 78, 10, 10, backgroundOptions );
    var rightNumberDisplayBackground = new Rectangle( 0, 0, 100, 78, 10, 10, backgroundOptions );

    var plusText = new Text( '+', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );
    var equalsSignText = new Text( '=', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );

    var numberDisplayBox = new HBox( {
      children: [ leftNumberDisplayBackground, plusText, rightNumberDisplayBackground ],
      spacing: 5,
      resize: false // since we toggle the stroke
    } );

    var leftTermText = new Text( '', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );
    var rightTermText = new Text( '', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );

    this.addChild( numberDisplayBox );
    this.addChild( leftTermText );
    this.addChild( rightTermText );
    this.addChild( equalsSignText );

    function layout() {
      if ( !rightTermText.bounds.isEmpty() ) {
        equalsSignText.left = rightTermText.right + 20;
      }
      if ( !leftTermText.bounds.isEmpty() ) {
        leftTermText.right = leftNumberDisplayBackground.right - leftNumberDisplayBackground.width * LAYOUT_MULTIPLIER;
      }
    }

    additionTerms.leftTermProperty.link( function( term ) {
      leftTermText.text = term ? term : '';
      layout();
    } );

    additionTerms.rightTermProperty.link( function( term ) {
      rightTermText.text = term ? term : '';
      layout();
    } );

    // Add highlights if applicable
    if ( highlightBorders ) {
      Property.multilink( [ additionTerms.leftTermProperty, additionTerms.activeTermProperty ], function( leftTerm, activeTerm ) {
        leftNumberDisplayBackground.stroke = ( leftTerm === 0 || activeTerm === ActiveTerm.LEFT ) ? STROKE_COLOR : null;
        leftNumberDisplayBackground.fill = activeTerm === ActiveTerm.LEFT ? 'white' : null;
      } );
      Property.multilink( [ additionTerms.rightTermProperty, additionTerms.activeTermProperty ], function( rightTerm, activeTerm ) {
        rightNumberDisplayBackground.stroke = ( rightTerm === 0 || activeTerm === ActiveTerm.RIGHT ) ? STROKE_COLOR : null;
        rightNumberDisplayBackground.fill = activeTerm === ActiveTerm.RIGHT ? 'white' : null;
      } );

      Property.multilink( [ additionTerms.leftTermProperty, additionTerms.rightTermProperty, additionTerms.activeTermProperty ], function() {
        equalsSignText.visible = additionTerms.hasBothTerms();
      } );
    }

    // Center everything vertically
    var centerY = numberDisplayBox.centerY;
    leftTermText.centerY = centerY;
    rightTermText.centerY = centerY;
    equalsSignText.centerY = centerY;

    // Unchanging layout position of the right text node
    rightTermText.left = rightNumberDisplayBackground.left + rightNumberDisplayBackground.width * LAYOUT_MULTIPLIER;

    // @public
    this.getLeftAlignment = function() {
      return leftTermText.right;
    };
    this.getRightAlignment = function() {
      return rightTermText.left;
    };
  }

  makeATen.register( 'AdditionTermsNode', AdditionTermsNode );

  return inherit( Node, AdditionTermsNode );
} );
