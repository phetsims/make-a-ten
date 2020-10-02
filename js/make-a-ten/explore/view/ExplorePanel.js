// Copyright 2016-2020, University of Colorado Boulder

/**
 * Panel that contains a 100, 10 and 1, which can be clicked/dragged to create draggable paper numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../../sun/js/Panel.js';
import makeATen from '../../../makeATen.js';
import BaseNumber from '../../common/model/BaseNumber.js';
import PaperNumber from '../../common/model/PaperNumber.js';
import BaseNumberNode from '../../common/view/BaseNumberNode.js';

const MAX_SUM = 9999;

class ExplorePanel extends Panel {
  /**
   * @param {MakeATenExploreScreenView} screenView
   * @param {NumberProperty} sumProperty
   * @param {Object} [options] - Passed to Node
   */
  constructor( screenView, sumProperty, options ) {

    options = merge( {
      fill: 'rgb(208,222,239)',
      stroke: 'black',
      lineWidth: 1.5,
      xMargin: 30,
      yMargin: 5,
      resize: false
    }, options );

    function createTarget( place ) {
      const numberValue = Math.pow( 10, place );
      const node = new Node( {
        cursor: 'pointer',
        // empirically determined stacking
        children: [ new Vector2( -8, -8 ), new Vector2( 0, 0 ) ].map( function( offset ) {
          const paperNode = new BaseNumberNode( new BaseNumber( 1, place ), 1 );
          paperNode.scale( 0.64, 0.55 );
          paperNode.translation = offset;
          return paperNode;
        } )
      } );
      node.touchArea = node.localBounds.dilatedX( 15 ).dilatedY( 5 );

      // We need to be disabled if adding this number would increase the sum past the maximum sum.
      new DerivedProperty( [ sumProperty ], function( sum ) {
        return sum + numberValue <= MAX_SUM;
      } ).linkAttribute( node, 'visible' );

      node.addInputListener( {
        down: function( event ) {
          if ( !event.canStartPress() ) { return; }

          // We want this relative to the screen view, so it is guaranteed to be the proper view coordinates.
          const viewPosition = screenView.globalToLocalPoint( event.pointer.point );
          const paperNumber = new PaperNumber( numberValue, new Vector2( 0, 0 ) );

          // Once we have the number's bounds, we set the position so that our pointer is in the middle of the drag target.
          paperNumber.setDestination( viewPosition.minus( paperNumber.getDragTargetOffset() ), false );

          // Create and start dragging the new paper number node
          screenView.addAndDragNumber( event, paperNumber );
        }
      } );

      return node;
    }

    const hundredTarget = createTarget( 2 );
    const tenTarget = createTarget( 1 );
    const oneTarget = createTarget( 0 );

    const box = new HBox( {
      children: [ hundredTarget, tenTarget, oneTarget ],
      spacing: 30
    } );

    super( box, options );

    // @private {MakeATenExploreScreenView}
    this.screenView = screenView;
  }

  /**
   * Given a specified number of digits for a paper number, return the view coordinates of the closest matching
   * target, so that it can animate back to this position.
   * @public
   *
   * @param {number} digits
   * @returns {Vector2}
   */
  getOriginPosition( digits ) {
    let target;
    switch( digits ) {
      case 1:
        target = this.oneTarget;
        break;
      case 2:
        target = this.tenTarget;
        break;
      case 3:
        target = this.hundredTarget;
        break;
      default:
        // Probably something big, no better place to send it
        target = this.hundredTarget;
    }

    // Trail to screenView, not including the screenView
    let trail = this.screenView.getUniqueLeafTrailTo( target );
    trail = trail.slice( 1, trail.length );

    // Transformed to view coordinates
    return trail.localToGlobalPoint( target.localBounds.center );
  }
}

makeATen.register( 'ExplorePanel', ExplorePanel );
export default ExplorePanel;
