// Copyright 2016-2021, University of Colorado Boulder

/**
 * Panel that contains a 100, 10 and 1, which can be clicked/dragged to create draggable paper numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingCreatorNode from '../../../../../counting-common/js/common/view/CountingCreatorNode.js';
import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Panel from '../../../../../sun/js/Panel.js';
import makeATen from '../../../makeATen.js';

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
      yMargin: 18,
      resize: false
    }, options );

    const hundredTargetNode = new CountingCreatorNode( 2, screenView, sumProperty );
    const tenTargetNode = new CountingCreatorNode( 1, screenView, sumProperty );
    const oneTargetNode = new CountingCreatorNode( 0, screenView, sumProperty );

    const box = new HBox( {
      children: [ hundredTargetNode, tenTargetNode, oneTargetNode ],
      spacing: 30
    } );

    super( box, options );

    // @public (read-only)
    this.digitLengthToTargetNode = {
      1: oneTargetNode,
      2: tenTargetNode,
      3: hundredTargetNode
    };
  }
}

makeATen.register( 'ExplorePanel', ExplorePanel );
export default ExplorePanel;
