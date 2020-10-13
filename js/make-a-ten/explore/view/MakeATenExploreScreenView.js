// Copyright 2015-2020, University of Colorado Boulder

/**
 * Explore screenview of Make a Ten. Provides a panel where 100s, 10s or 1s can be dragged out, combined, and pulled
 * apart, and displays the total in the upper-left.
 *
 * @author Sharfudeen Ashraf
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import makeATen from '../../../makeATen.js';
import makeATenStrings from '../../../makeATenStrings.js';
import MakeATenConstants from '../../common/MakeATenConstants.js';
import PaperNumber from '../../common/model/PaperNumber.js';
import MakeATenCommonView from '../../common/view/MakeATenCommonView.js';
import ExplorePanel from './ExplorePanel.js';
import SplitCueNode from './SplitCueNode.js';

const hideTotalString = makeATenStrings.hideTotal;

// constants
const EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );

class MakeATenExploreScreenView extends MakeATenCommonView {
  /**
   * @param {MakeATenExploreModel} model
   */
  constructor( model ) {

    super( model );

    // @private {Function} - Called with function( paperNumberNode ) on number splits
    this.numberSplitListener = this.onNumberSplit.bind( this );

    // @private {Function} - Called with function( paperNumberNode ) when a number begins to be interacted with.
    this.numberInteractionListener = this.onNumberInteractionStarted.bind( this );

    // @private {Function} - Called with function( paperNumber ) when a number finishes animation
    this.numberAnimationFinishedListener = this.onNumberAnimationFinished.bind( this );

    // @private {Function} - Called with function( paperNumber ) when a number finishes being dragged
    this.numberDragFinishedListener = this.onNumberDragFinished.bind( this );

    this.finishInitialization();

    // @private {BooleanProperty} - Whether the total (sum) is hidden
    this.hideSumProperty = new BooleanProperty( false );

    const sumText = new Text( '0', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );
    model.sumProperty.linkAttribute( sumText, 'text' );

    // @private {HBox} - Displays the sum of our numbers and an equals sign, e.g. "256 ="
    this.sumNode = new HBox( {
      children: [
        sumText,
        new Text( MathSymbols.EQUAL_TO, { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } )
      ], spacing: 15
    } );

    this.addChild( this.sumNode );

    // @private {ExplorePanel} - Shows 100,10,1 that can be dragged.
    this.explorePanel = new ExplorePanel( this, model.sumProperty );
    this.addChild( this.explorePanel );

    const hideSumText = new Text( hideTotalString, {
      maxWidth: 150,
      font: new PhetFont( {
        size: 25,
        weight: 'bold'
      } ),
      fill: 'black'
    } );

    // @private {Checkbox} - When checked, hides the sum in the upper-left
    this.hideSumCheckbox = new Checkbox( hideSumText, this.hideSumProperty, {
      spacing: 10,
      boxWidth: 30
    } );
    this.hideSumCheckbox.touchArea = this.hideSumCheckbox.localBounds.dilatedXY( 10, 4 );
    this.addChild( this.hideSumCheckbox );

    this.hideSumProperty.link( hideSum => {
      this.sumNode.visible = !hideSum;
    } );

    this.addChild( this.paperNumberLayerNode );

    this.addChild( new SplitCueNode( model.splitCue ) );

    this.layoutControls();
  }

  /**
   * @public
   * @override
   */
  layoutControls() {
    super.layoutControls();

    const visibleBounds = this.visibleBoundsProperty.value;

    this.explorePanel.centerX = visibleBounds.centerX;
    this.explorePanel.bottom = visibleBounds.bottom - 10;

    this.hideSumCheckbox.left = this.explorePanel.right + 20;
    this.hideSumCheckbox.bottom = visibleBounds.bottom - 10;

    this.sumNode.left = visibleBounds.left + 30;
    this.sumNode.top = visibleBounds.top + 30;
  }

  /**
   * Whether the paper number is predominantly over the explore panel (should be collected).
   * @private
   *
   * @param {PaperNumber} paperNumber
   * @returns {boolean}
   */
  isNumberInReturnZone( paperNumber ) {
    // Compute the local point on the number that would need to go into the return zone.
    // This point is a bit farther down than the exact center, as it was annoying to "miss" the return zone
    // slightly by being too high (while the mouse WAS in the return zone).
    const localBounds = paperNumber.getLocalBounds();
    const localReturnPoint = localBounds.center.plus( localBounds.centerBottom ).dividedScalar( 2 );

    // And the bounds of our panel
    const panelBounds = this.explorePanel.bounds.withMaxY( this.visibleBoundsProperty.value.bottom );

    // View coordinate of our return point
    const paperCenter = paperNumber.positionProperty.value.plus( localReturnPoint );

    return panelBounds.containsPoint( paperCenter );
  }

  /**
   * @public
   * @override
   */
  onPaperNumberAdded( paperNumber ) {
    const paperNumberNode = super.onPaperNumberAdded( paperNumber );

    // Add listeners
    paperNumberNode.splitEmitter.addListener( this.numberSplitListener );
    paperNumberNode.interactionStartedEmitter.addListener( this.numberInteractionListener );
    paperNumber.endAnimationEmitter.addListener( this.numberAnimationFinishedListener );
    paperNumber.endDragEmitter.addListener( this.numberDragFinishedListener );
  }

  /**
   * @public
   * @override
   */
  onPaperNumberRemoved( paperNumber ) {
    const paperNumberNode = this.findPaperNumberNode( paperNumber );

    // Remove listeners
    paperNumber.endDragEmitter.removeListener( this.numberDragFinishedListener );
    paperNumber.endAnimationEmitter.removeListener( this.numberAnimationFinishedListener );
    paperNumberNode.interactionStartedEmitter.removeListener( this.numberInteractionListener );
    paperNumberNode.splitEmitter.removeListener( this.numberSplitListener );

    // Detach any attached cues
    if ( this.model.splitCue.paperNumberProperty.value === paperNumber ) {
      this.model.splitCue.detach();
    }

    super.onPaperNumberRemoved( paperNumber );
  }

  /**
   * Called when a paper number node is split.
   * @private
   *
   * @param {PaperNumberNode} paperNumberNode
   */
  onNumberSplit( paperNumberNode ) {
    this.model.splitCue.triggerFade();
  }

  /**
   * Called when a paper number node starts being interacted with.
   * @private
   *
   * @param {PaperNumberNode} paperNumberNode
   */
  onNumberInteractionStarted( paperNumberNode ) {
    const paperNumber = paperNumberNode.paperNumber;
    if ( paperNumber.numberValueProperty.value > 1 ) {
      this.model.splitCue.attachToNumber( paperNumber );
    }
  }

  /**
   * Called when a paper number has finished animating to its destination.
   * @private
   *
   * @param {PaperNumber} paperNumber
   */
  onNumberAnimationFinished( paperNumber ) {
    // If it animated to the return zone, it's probably split and meant to be returned.
    if ( this.isNumberInReturnZone( paperNumber ) ) {
      this.model.removePaperNumber( paperNumber );
    }
  }

  /**
   * Called when a paper number has finished being dragged.
   * @private
   *
   * @param {PaperNumber} paperNumber
   */
  onNumberDragFinished( paperNumber ) {
    // Return it to the panel if it's been dropped in the panel.
    if ( this.isNumberInReturnZone( paperNumber ) ) {
      const baseNumbers = paperNumber.baseNumbers;

      // Split it into a PaperNumber for each of its base numbers, and animate them to their targets in the
      // explore panel.
      for ( let i = baseNumbers.length - 1; i >= 0; i-- ) {
        const baseNumber = baseNumbers[ i ];
        const basePaperNumber = new PaperNumber( baseNumber.numberValue, paperNumber.positionProperty.value );

        // Set its destination to the proper target (with the offset so that it will disappear once centered).
        let targetPosition = this.explorePanel.getOriginPosition( baseNumber.digitLength );
        const paperCenterOffset = new PaperNumber( baseNumber.numberValue, new Vector2( 0, 0 ) ).getLocalBounds().center;
        targetPosition = targetPosition.minus( paperCenterOffset );
        basePaperNumber.setDestination( targetPosition, true );

        // Add the new base paper number
        this.model.addPaperNumber( basePaperNumber );
      }

      // Remove the original paper number (as we have added its components).
      this.model.removePaperNumber( paperNumber );
    }
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();

    this.hideSumProperty.reset();
  }
}

makeATen.register( 'MakeATenExploreScreenView', MakeATenExploreScreenView );

export default MakeATenExploreScreenView;
