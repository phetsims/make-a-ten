// Copyright 2015, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ActiveTerm = require( 'MAKE_A_TEN/make-a-ten/adding/model/ActiveTerm' );

  // constants
  var TERM_FONT = new PhetFont( { size: 45, weight: 'bold' } );
  var EQUATION_FONT = new PhetFont( { size: 45, weight: 'bold' } );
  var EQUATION_COLOR = 'rgb(63,63,183)';
  var STROKE_COLOR = '#000';
  var LINE_DASH = [ 5, 5 ];
  var LAYOUT_MULTIPLIER = 1 / 8; // Fraction offset of the text from the background's border

  /**
   * @constructor
   */
  function ExpressionTermsNode( expressionTerms, options ) {
    options = _.extend( {
      highlightBorders: false
    }, options );

    Node.call( this, options );

    var backgroundOptions = {
      stroke: STROKE_COLOR,
      lineDash: LINE_DASH,
      lineWidth: 2,
      visible: options.highlightBorders
    };

    var leftNumberDisplayBackground = new Rectangle( 0, 0, 100, 78, 10, 10, backgroundOptions );
    var rightNumberDisplayBackground = new Rectangle( 0, 0, 100, 78, 10, 10, backgroundOptions );

    var plusText = new Text( '+', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var equalsSignText = new Text( '=', { font: EQUATION_FONT, fill: EQUATION_COLOR } );

    var numberDisplayBox = new HBox( {
      children: [ leftNumberDisplayBackground, plusText, rightNumberDisplayBackground ],
      spacing: 5,
      resize: false // since we toggle the stroke
    } );

    var leftTermText = new Text( '', { font: TERM_FONT, fill: EQUATION_COLOR } );
    var rightTermText = new Text( '', { font: TERM_FONT, fill: EQUATION_COLOR } );

    this.addChild( leftTermText );
    this.addChild( rightTermText );
    this.addChild( numberDisplayBox );
    this.addChild( equalsSignText );

    function layout() {
      if ( !rightTermText.bounds.isEmpty() ) {
        equalsSignText.left = rightTermText.right + 20;
      }
      if ( !leftTermText.bounds.isEmpty() ) {
        leftTermText.right = leftNumberDisplayBackground.right - leftNumberDisplayBackground.width * LAYOUT_MULTIPLIER;
      }
    }

    function termToString( termValue ) {
      assert && assert( typeof termValue === 'number', 'Sanity, due to the previous implementation' );
      return termValue ? ( '' + termValue ) : '';
    }

    expressionTerms.leftTermProperty.link( function( leftTerm ) {
      leftTermText.text = termToString( leftTerm );
      layout();
    } );

    expressionTerms.rightTermProperty.link( function( rightTerm ) {
      rightTermText.text = termToString( rightTerm );
      layout();
    } );

    // TODO: separate highlightBorders into a separate parameter (presumably)
    if ( options.highlightBorders ) {
      expressionTerms.activeTermProperty.link( function( term ) {
        // TODO: improve term enumeration
        leftNumberDisplayBackground.stroke = ( term === ActiveTerm.LEFT ) ? STROKE_COLOR : null;
        rightNumberDisplayBackground.stroke = ( term === ActiveTerm.RIGHT ) ? STROKE_COLOR : null;
        equalsSignText.visible = expressionTerms.hasBothTerms();
      } );
    }

    // Vertical layout
    var centerY = numberDisplayBox.centerY;
    leftTermText.centerY = centerY;
    rightTermText.centerY = centerY;
    equalsSignText.centerY = centerY;

    // Unchanging layout position of the right text node
    rightTermText.left = rightNumberDisplayBackground.left + rightNumberDisplayBackground.width * LAYOUT_MULTIPLIER;
  }

  makeATen.register( 'ExpressionTermsNode', ExpressionTermsNode );

  return inherit( Node, ExpressionTermsNode );

} );
