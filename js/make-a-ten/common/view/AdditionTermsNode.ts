// Copyright 2015-2026, University of Colorado Boulder

/**
 * Displays a partial addition formula (or fragments), like "7 + 2 =", where parts can be filled in, and layout
 * automatically adjusts.
 *
 * @author Sharfudeen Ashraf
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import ManualConstraint from '../../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import MakeATenConstants from '../MakeATenConstants.js';
import type AdditionTerms from '../model/AdditionTerms.js';

// constants
const EQUATION_FONT = new PhetFont( { size: 45, weight: 'bold' } );
const STROKE_COLOR = '#000';
const LAYOUT_MULTIPLIER = 1 / 8; // Fraction offset of the text from the background's border
const NUMBER_DISPLAY_WIDTH = 100;
const NUMBER_DISPLAY_HEIGHT = 78;
const OPERATOR_SPACING = 5;
const EQUALS_SIGN_SPACING = 20;

class AdditionTermsNode extends Node {

  public readonly getLeftAlignment: () => number;
  public readonly getRightAlignment: () => number;

  /**
   * @param additionTerms - Our model, contains information about the left/right and active terms
   * @param highlightBorders - Whether there should be highlighted borders around the active term.
   */
  public constructor( additionTerms: AdditionTerms, highlightBorders: boolean ) {
    super();

    const backgroundOptions = {
      stroke: STROKE_COLOR,
      lineDash: [ 5, 5 ],
      lineWidth: 2,
      visible: highlightBorders
    };

    const leftNumberDisplayBackground = new Rectangle( 0, 0, NUMBER_DISPLAY_WIDTH, NUMBER_DISPLAY_HEIGHT, 10, 10, backgroundOptions );
    const rightNumberDisplayBackground = new Rectangle( 0, 0, NUMBER_DISPLAY_WIDTH, NUMBER_DISPLAY_HEIGHT, 10, 10, backgroundOptions );

    const plusText = new Text( MathSymbols.PLUS, { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );
    const equalsSignText = new Text( MathSymbols.EQUAL_TO, {
      font: EQUATION_FONT,
      fill: MakeATenConstants.EQUATION_FILL
    } );

    const leftTermText = new Text( '', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );
    const rightTermText = new Text( '', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );

    this.addChild( leftNumberDisplayBackground );
    this.addChild( plusText );
    this.addChild( rightNumberDisplayBackground );
    this.addChild( leftTermText );
    this.addChild( rightTermText );
    this.addChild( equalsSignText );

    additionTerms.leftTermProperty.link( term => {
      leftTermText.string = term ? term : '';
    } );

    additionTerms.rightTermProperty.link( term => {
      rightTermText.string = term ? term : '';
    } );

    // Add highlights if applicable
    if ( highlightBorders ) {
      Multilink.multilink( [ additionTerms.leftTermProperty, additionTerms.activeTermProperty ], ( leftTerm, activeTerm ) => {
        leftNumberDisplayBackground.stroke = ( leftTerm === 0 || activeTerm === 'LEFT' ) ? STROKE_COLOR : null;
        leftNumberDisplayBackground.fill = activeTerm === 'LEFT' ? 'white' : null;
      } );
      Multilink.multilink( [ additionTerms.rightTermProperty, additionTerms.activeTermProperty ], ( rightTerm, activeTerm ) => {
        rightNumberDisplayBackground.stroke = ( rightTerm === 0 || activeTerm === 'RIGHT' ) ? STROKE_COLOR : null;
        rightNumberDisplayBackground.fill = activeTerm === 'RIGHT' ? 'white' : null;
      } );

      Multilink.multilink( [ additionTerms.leftTermProperty, additionTerms.rightTermProperty, additionTerms.activeTermProperty ], () => {
        equalsSignText.visible = additionTerms.hasBothTerms();
      } );
    }

    ManualConstraint.create( this, [
      leftNumberDisplayBackground,
      plusText,
      rightNumberDisplayBackground,
      leftTermText,
      rightTermText,
      equalsSignText
    ], ( leftNumberDisplayProxy, plusProxy, rightNumberDisplayProxy, leftTermProxy, rightTermProxy, equalsSignProxy ) => {
      leftNumberDisplayProxy.left = 0;
      leftNumberDisplayProxy.top = 0;
      plusProxy.left = leftNumberDisplayProxy.right + OPERATOR_SPACING;
      plusProxy.centerY = leftNumberDisplayProxy.centerY;
      rightNumberDisplayProxy.left = plusProxy.right + OPERATOR_SPACING;
      rightNumberDisplayProxy.top = leftNumberDisplayProxy.top;

      leftTermProxy.centerY = leftNumberDisplayProxy.centerY;
      rightTermProxy.centerY = leftNumberDisplayProxy.centerY;
      equalsSignProxy.centerY = leftNumberDisplayProxy.centerY;

      if ( !leftTermProxy.bounds.isEmpty() ) {
        leftTermProxy.right = leftNumberDisplayProxy.right - leftNumberDisplayProxy.width * LAYOUT_MULTIPLIER;
      }

      if ( !rightTermProxy.bounds.isEmpty() ) {
        rightTermProxy.left = rightNumberDisplayProxy.left + rightNumberDisplayProxy.width * LAYOUT_MULTIPLIER;
      }

      equalsSignProxy.left = ( rightTermProxy.bounds.isEmpty() ? rightNumberDisplayProxy.right : rightTermProxy.right ) + EQUALS_SIGN_SPACING;
    } );

    this.getLeftAlignment = () => leftNumberDisplayBackground.right - leftNumberDisplayBackground.width * LAYOUT_MULTIPLIER;
    this.getRightAlignment = () => rightNumberDisplayBackground.left + rightNumberDisplayBackground.width * LAYOUT_MULTIPLIER;
  }
}

export default AdditionTermsNode;
