// Copyright 2016-2018, University of Colorado Boulder

/**
 * Cue that informs the user they can drag from the upper-half to split (pull apart) numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // images
  var handImage = require( 'image!SCENERY_PHET/hand.png' );

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

    var arrowOptions = {
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

    var updatePositionListener = this.updatePosition.bind( this );
    var updateRectangleListener = this.updateRectangle.bind( this );

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
      var visible = this.cue.visibilityProperty.value;
      var paperNumber = this.cue.paperNumberProperty.value;

      if ( visible && paperNumber ) {
        var position = paperNumber.positionProperty.value;
        var localBounds = paperNumber.getLocalBounds();
        this.setTranslation( position );
        this.arrowContainer.setTranslation( localBounds.right - 22, localBounds.top + 15 );
      }
    },

    /**
     * Updates the size of the semi-transparent rectangle.
     * @private
     */
    updateRectangle: function() {
      var paperNumber = this.cue.paperNumberProperty.value;

      if ( paperNumber ) {
        var bounds = paperNumber.getLocalBounds();
        var boundaryY = paperNumber.getBoundaryY();
        this.seeThroughRectangle.setRectBounds( bounds.withMaxY( boundaryY ) );
      }
    }
  } );
} );
