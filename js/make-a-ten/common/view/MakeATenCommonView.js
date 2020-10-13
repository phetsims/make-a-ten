// Copyright 2015-2020, University of Colorado Boulder

/**
 * Common ScreenView for Make a Ten screens.
 *
 * @author Sharfudeen Ashraf
 */

import Property from '../../../../../axon/js/Property.js';
import ScreenView from '../../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Plane from '../../../../../scenery/js/nodes/Plane.js';
import ClosestDragListener from '../../../../../sun/js/ClosestDragListener.js';
import makeATen from '../../../makeATen.js';
import MakeATenConstants from '../MakeATenConstants.js';
import ArithmeticRules from '../model/ArithmeticRules.js';
import PaperNumberNode from './PaperNumberNode.js';

class MakeATenCommonView extends ScreenView {
  /**
   * @param {MakeATenModel} model
   */
  constructor( model ) {

    super( { layoutBounds: MakeATenConstants.LAYOUT_BOUNDS } );

    // @public {MakeATenModel}
    this.model = model;

    // @protected {Node} - Where all of the paper numbers are. NOTE: Subtypes need to add this as a child with the
    //                     proper place in layering (this common view doesn't do that).
    this.paperNumberLayerNode = new Node();

    // @private {Function}
    this.tryToCombineNumbersCallback = this.tryToCombineNumbers.bind( this );

    // @private {Function}
    this.addAndDragNumberCallback = this.addAndDragNumber.bind( this );

    // @private {number} PaperNumber.id => {PaperNumberNode} - lookup map for efficiency
    this.paperNumberNodeMap = {};

    // @public {Property.<Bounds2>} - The view coordinates where numbers can be dragged. Can update when the sim
    //                                is resized.
    this.availableViewBoundsProperty = new Property( MakeATenConstants.LAYOUT_BOUNDS );

    // @private {ClosestDragListener} - Handle touches nearby to the numbers, and interpret those as the proper drag.
    this.closestDragListener = new ClosestDragListener( 30, 0 );
    const backgroundDragTarget = new Plane();
    backgroundDragTarget.addInputListener( this.closestDragListener );
    this.addChild( backgroundDragTarget );

    // Persistent, no need to unlink
    this.availableViewBoundsProperty.lazyLink( availableViewBounds => {
      model.paperNumbers.forEach( paperNumber => {
        paperNumber.setConstrainedDestination( availableViewBounds, paperNumber.positionProperty.value );
      } );
    } );

    // @protected {ResetAllButton}
    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      }
    } );
    this.addChild( this.resetAllButton );
  }

  /**
   * Used to work around super initialization order
   * @public
   */
  finishInitialization() {
    const paperNumberAddedListener = this.onPaperNumberAdded.bind( this );
    const paperNumberRemovedListener = this.onPaperNumberRemoved.bind( this );

    // Add nodes for every already-existing paper number
    this.model.paperNumbers.forEach( paperNumberAddedListener );

    // Add and remove nodes to match the model
    this.model.paperNumbers.addItemAddedListener( paperNumberAddedListener );
    this.model.paperNumbers.addItemRemovedListener( paperNumberRemovedListener );
  }

  /**
   * Add a paper number to the model and immediately start dragging it with the provided event.
   * @public
   *
   * @param {SceneryEvent} event - The Scenery event that triggered this.
   * @param {PaperNumber} paperNumber - The paper number to add and then drag
   */
  addAndDragNumber( event, paperNumber ) {
    // Add it and lookup the related node.
    this.model.addPaperNumber( paperNumber );

    const paperNumberNode = this.findPaperNumberNode( paperNumber );
    paperNumberNode.startSyntheticDrag( event );
  }

  /**
   * Creates and adds a PaperNumberNode.
   * @public
   *
   * @param {PaperNumber} paperNumber
   * @returns {PaperNumberNode} - The created node
   */
  onPaperNumberAdded( paperNumber ) {
    const paperNumberNode = new PaperNumberNode( paperNumber, this.availableViewBoundsProperty,
      this.addAndDragNumberCallback, this.tryToCombineNumbersCallback );

    this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ] = paperNumberNode;
    this.paperNumberLayerNode.addChild( paperNumberNode );
    paperNumberNode.attachListeners();

    this.closestDragListener.addDraggableItem( paperNumberNode );

    return paperNumberNode;
  }

  /**
   * Handles removing the relevant PaperNumberNode
   * @public
   *
   * @param {PaperNumber} paperNumber
   */
  onPaperNumberRemoved( paperNumber ) {
    const paperNumberNode = this.findPaperNumberNode( paperNumber );

    delete this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ];
    this.paperNumberLayerNode.removeChild( paperNumberNode );
    paperNumberNode.detachListeners();

    this.closestDragListener.removeDraggableItem( paperNumberNode );
  }

  /**
   * Given a {PaperNumber}, find our current display ({PaperNumberNode}) of it.
   * @public
   *
   * @param {PaperNumber} paperNumber
   * @returns {PaperNumberNode}
   */
  findPaperNumberNode( paperNumber ) {
    const result = this.paperNumberNodeMap[ paperNumber.id ];
    assert && assert( result, 'Did not find matching Node' );
    return result;
  }

  /**
   * When the user drops a paper number they were dragging, see if it can combine with any other nearby paper numbers.
   * @public
   *
   * @param {PaperNumber} draggedPaperNumber
   */
  tryToCombineNumbers( draggedPaperNumber ) {
    const draggedNode = this.findPaperNumberNode( draggedPaperNumber );
    const draggedNumberValue = draggedPaperNumber.numberValueProperty.value;
    const allPaperNumberNodes = this.paperNumberLayerNode.children;
    const droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes );

    // Check them in reverse order (the one on the top should get more priority)
    droppedNodes.reverse();

    for ( var i = 0; i < droppedNodes.length; i++ ) {
      const droppedNode = droppedNodes[ i ];
      const droppedPaperNumber = droppedNode.paperNumber;
      const droppedNumberValue = droppedPaperNumber.numberValueProperty.value;

      if ( ArithmeticRules.canAddNumbers( draggedNumberValue, droppedNumberValue ) ) {
        this.model.collapseNumberModels( this.availableViewBoundsProperty.value, draggedPaperNumber, droppedPaperNumber );
        return; // A bit weird, but no need to relayer or try combining with others?
      }
      else {
        // repel numbers - show rejection
        this.model.repelAway( this.availableViewBoundsProperty.value, draggedPaperNumber, droppedPaperNumber );
        return; // A bit weird, but if repelled, no need to check for overlapping bits?
      }
    }

    // if the dragged number is  larger than the node below it (dropped node), reorder
    // them in a way to bring small number on the top. see issue #39
    for ( i = 0; i < allPaperNumberNodes.length; i++ ) {
      if ( allPaperNumberNodes[ i ] === draggedNode ) {
        continue;
      }

      if ( allPaperNumberNodes[ i ].bounds.intersectsBounds( draggedNode.bounds ) ) {
        if ( draggedNode.bounds.width > allPaperNumberNodes[ i ].bounds.width ) {
          allPaperNumberNodes[ i ].moveToFront();
        }
      }
    }
  }

  /**
   * Meant for subtypes to override to do additional component layout. Can't override layout(), as it takes additional
   * parameters that we may not have access to.
   * @protected
   */
  layoutControls() {
    this.resetAllButton.right = this.visibleBoundsProperty.value.right - 10;
    this.resetAllButton.bottom = this.visibleBoundsProperty.value.bottom - 10;
  }

  /**
   * Some views may need to constrain the vertical room at the top (for dragging numbers) due to a status bar.
   * This should be overridden to return the value required.
   * @public
   *
   * @returns {number} - Amount in view coordinates to leave at the top of the screen
   */
  getTopBoundsOffset() {
    return 0;
  }

  /**
   * @public
   * @override
   */
  layout( width, height ) {
    super.layout( width, height );

    // Some views may need to make extra room for a status bar
    const top = this.visibleBoundsProperty.value.minY + this.getTopBoundsOffset();
    this.availableViewBoundsProperty.value = this.visibleBoundsProperty.value.withMinY( top );

    this.layoutControls();
  }

  /**
   * To reset the view, should be overridden
   * @public
   */
  reset() {
    // Meant to be overridden
  }
}

makeATen.register( 'MakeATenCommonView', MakeATenCommonView );

export default MakeATenCommonView;