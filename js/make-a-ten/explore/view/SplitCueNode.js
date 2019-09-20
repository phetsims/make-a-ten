// Copyright 2016-2019, University of Colorado Boulder

/**
 * Cue that informs the user they can drag from the upper-half to split (pull apart) numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Color = require( 'SCENERY/util/Color' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // images
  const handImage = require( 'image!SCENERY_PHET/hand.png' );

  /**
   * @constructor
   *
   * @param {Cue} cue - Our cue model
   */
  function SplitCueNode( cue ) {
    Node.call( this, {
      pickable: false,
      usesOpacity: true
    } );

    // @private {Cue}
    this.cue = cue;

    const arrowOptions = {
      fill: MakeATenConstants.CUE_FILL,
      stroke: null,
      headHeight: 14,
      headWidth: 22,
      tailWidth: 9,
      x: 7,
      y: 3
    };

    this.seeThroughRectangle = new Rectangle( 0, 0, 100, 100, {
      fill: new Color( MakeATenConstants.CUE_FILL ).withAlpha( 0.2 )
    } );
    this.addChild( this.seeThroughRectangle );

    this.arrowContainer = new Node( {
      children: [
        new ArrowNode( 0, 0, 30, -30, arrowOptions ),
        new Image( handImage, {
          scale: 0.3,
          rotation: Math.PI / 6 - Math.PI / 5
        } )
      ]
    } );
    this.addChild( this.arrowContainer );

    const updatePositionListener = this.updatePosition.bind( this );
    const updateRectangleListener = this.updateRectangle.bind( this );

    cue.visibilityProperty.linkAttribute( this, 'visible' );
    cue.opacityProperty.linkAttribute( this, 'opacity' );
    cue.visibilityProperty.link( updatePositionListener ); // update position when we become visible
    cue.paperNumberProperty.link( function( newPaperNumber, oldPaperNumber ) {
      if ( newPaperNumber ) {
        newPaperNumber.positionProperty.link( updatePositionListener ); // translation
        newPaperNumber.numberValueProperty.link( updatePositionListener ); // may have changed bounds
        newPaperNumber.numberValueProperty.link( updateRectangleListener ); // may have changed bounds
      }
      if ( oldPaperNumber ) {
        oldPaperNumber.numberValueProperty.unlink( updateRectangleListener );
        oldPaperNumber.numberValueProperty.unlink( updatePositionListener );
        oldPaperNumber.positionProperty.unlink( updatePositionListener );
      }
    } );
  }

  makeATen.register( 'SplitCueNode', SplitCueNode );

  return inherit( Node, SplitCueNode, {
    /**
     * Updates the position of the cue.
     * @private
     */
    updatePosition: function() {
      const visible = this.cue.visibilityProperty.value;
      const paperNumber = this.cue.paperNumberProperty.value;

      if ( visible && paperNumber ) {
        const position = paperNumber.positionProperty.value;
        const localBounds = paperNumber.getLocalBounds();
        this.setTranslation( position );
        this.arrowContainer.setTranslation( localBounds.right - 22, localBounds.top + 15 );
      }
    },

    /**
     * Updates the size of the semi-transparent rectangle.
     * @private
     */
    updateRectangle: function() {
      const paperNumber = this.cue.paperNumberProperty.value;

      if ( paperNumber ) {
        const bounds = paperNumber.getLocalBounds();
        const boundaryY = paperNumber.getBoundaryY();
        this.seeThroughRectangle.setRectBounds( bounds.withMaxY( boundaryY ) );
      }
    }
  } );
} );
