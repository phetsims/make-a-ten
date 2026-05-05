// Copyright 2016-2026, University of Colorado Boulder

/**
 * Panel that contains a 100, 10 and 1, which can be clicked/dragged to create draggable counting objects.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import type NumberProperty from '../../../../../axon/js/NumberProperty.js';
import type { TReadOnlyEmitter } from '../../../../../axon/js/TEmitter.js';
import CountingCreatorNode from '../../../../../counting-common/js/common/view/CountingCreatorNode.js';
import optionize, { type EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import HBox from '../../../../../scenery/js/layout/nodes/HBox.js';
import Panel, { type PanelOptions } from '../../../../../sun/js/Panel.js';
import type MakeATenExploreScreenView from './MakeATenExploreScreenView.js';

type SelfOptions = EmptySelfOptions;
export type ExplorePanelOptions = SelfOptions & PanelOptions;

class ExplorePanel extends Panel {

  public readonly digitLengthToTargetNode: Record<number, CountingCreatorNode>;

  /**
   * @param screenView
   * @param sumProperty
   * @param resetEmitter
   * @param providedOptions - Passed to Panel
   */
  public constructor( screenView: MakeATenExploreScreenView, sumProperty: NumberProperty, resetEmitter: TReadOnlyEmitter, providedOptions?: ExplorePanelOptions ) {

    const options = optionize<ExplorePanelOptions, SelfOptions, PanelOptions>()( {
      fill: 'rgb(208,222,239)',
      stroke: 'black',
      lineWidth: 1.5,
      xMargin: 30,
      yMargin: 18,
      resize: false
    }, providedOptions );

    const addAndDragCountingObject = screenView.addAndDragCountingObject.bind( screenView );
    const hundredTargetNode = new CountingCreatorNode( 2, screenView, sumProperty, resetEmitter, addAndDragCountingObject );
    const tenTargetNode = new CountingCreatorNode( 1, screenView, sumProperty, resetEmitter, addAndDragCountingObject );
    const oneTargetNode = new CountingCreatorNode( 0, screenView, sumProperty, resetEmitter, addAndDragCountingObject );

    const box = new HBox( {
      children: [ hundredTargetNode, tenTargetNode, oneTargetNode ],
      spacing: 30
    } );

    super( box, options );

    this.digitLengthToTargetNode = {
      1: oneTargetNode,
      2: tenTargetNode,
      3: hundredTargetNode,
      4: hundredTargetNode
    };
  }
}

export default ExplorePanel;
