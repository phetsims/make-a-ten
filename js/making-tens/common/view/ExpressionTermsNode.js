// Copyright 2015, University of Colorado Boulder

/**
 * The node that displays the sum of all paper numbers placed on the explorer screen
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // constants
  var TERM_FONT = new PhetFont( { size: 45, weight: 'bold' } );
  var EQUATION_FONT = new PhetFont( { size: 45, weight: 'bold' } );
  var EQUATION_COLOR = 'rgb(63,63,183)';

  /**
   *
   *
   * @constructor
   */
  function ExpressionTermsNode( expressionTerms ) {
    Node.call( this );
    //background style for active Term. When a term is highlighted (ie keyboard is active, indicate
    //to the user using a different background)
    var activeNumberDisplayStyle = { fill: null, stroke: '#000', lineDash: [ 5, 5 ] };
    var normalNumberDisplayStyle = { fill: null, stroke: null, lineDash: [ ] };

    var leftNumberDisplayBackground = new Rectangle( 0, 0, 100, 78, 10, 10, {
      fill: '#fff', stroke: '#000', lineDash: [ 5, 5 ], lineWidth: 2
    } );

    var rightNumberDisplayBackGround = new Rectangle( 0, 0, 100, 78, 10, 10, {
      fill: '#fff', stroke: '#000', lineDash: [ 5, 5 ], lineWidth: 2
    } );

    var leftTermTextNode = new Text( '', { font: TERM_FONT, fill: EQUATION_COLOR } );
    var rightTermTextNode = new Text( '', { font: TERM_FONT, fill: EQUATION_COLOR } );
    leftTermTextNode.setDirection( 'rtl' );
    this.addChild( leftTermTextNode );
    this.addChild( rightTermTextNode );

    var pluTextNode = new Text( '+', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var equalsSignNode = new Text( '=', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var emptyNode = new Text( '', { font: EQUATION_FONT, fill: EQUATION_COLOR } );

    var spacing = 5;
    var numberDisplayBox = new HBox( {
      children: [ leftNumberDisplayBackground, pluTextNode,
        rightNumberDisplayBackGround, emptyNode ],
      spacing: spacing,
      resize: false
    } );

    this.addChild( numberDisplayBox );
    this.addChild( equalsSignNode );

    function updateEqualSpacing() {
      var termSpacing = 60;
      equalsSignNode.left = numberDisplayBox.right + rightTermTextNode.bounds.width - termSpacing;
      equalsSignNode.centerY = numberDisplayBox.top + numberDisplayBox.height / 1.9;
    }

    expressionTerms.leftTermProperty.link( function( leftTerm ) {
      leftTermTextNode.text = leftTerm;
      updateEqualSpacing();
    } );

    expressionTerms.rightTermProperty.link( function( rightTerm ) {
      rightTermTextNode.text = rightTerm;
      updateEqualSpacing();
    } );


    if ( expressionTerms.highlightBorders ) {
      expressionTerms.activeTermProperty.link( function( term ) {
        leftNumberDisplayBackground.mutate( normalNumberDisplayStyle );
        rightNumberDisplayBackGround.mutate( normalNumberDisplayStyle );
        equalsSignNode.visible = expressionTerms.hasBothTerms();
        if ( term === 'lt' ) {
          leftNumberDisplayBackground.mutate( activeNumberDisplayStyle );
        }
        if ( term === 'rt' ) {
          rightNumberDisplayBackGround.mutate( activeNumberDisplayStyle );
        }
      } );

    }


    leftTermTextNode.left = numberDisplayBox.left + leftNumberDisplayBackground.width / 1.2;
    leftTermTextNode.centerY = numberDisplayBox.top + numberDisplayBox.height / 2;

    rightTermTextNode.left = numberDisplayBox.left + rightNumberDisplayBackGround.left + rightNumberDisplayBackGround.width / 8;
    rightTermTextNode.centerY = numberDisplayBox.top + numberDisplayBox.height / 2;

    if ( !expressionTerms.highlightBorders ) {
      leftNumberDisplayBackground.visible = false;
      rightNumberDisplayBackGround.visible = false;
    }


  }

  makingTens.register( 'ExpressionTermsNode', ExpressionTermsNode );

  return inherit( Node, ExpressionTermsNode );

} );
