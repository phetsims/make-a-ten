// Copyright 2015, University of Colorado Boulder

/**
 * Cue that informs the user they can drag from the upper-half to split (pull apart) numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

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

    var updatePositionListener = this.updatePosition.bind( this );

    cue.visibilityProperty.linkAttribute( this, 'visible' );
    cue.opacityProperty.linkAttribute( this, 'opacity' );
    cue.visibilityProperty.link( updatePositionListener ); // update position when we become visible
    cue.paperNumberProperty.link( function( newPaperNumber, oldPaperNumber ) {
      if ( newPaperNumber ) {
        newPaperNumber.positionProperty.link( updatePositionListener ); // translation
        newPaperNumber.numberValueProperty.link( updatePositionListener ); // may have changed bounds
      }
      if ( oldPaperNumber ) {
        oldPaperNumber.numberValueProperty.unlink( updatePositionListener );
        oldPaperNumber.positionProperty.unlink( updatePositionListener );
      }
    } );

    var arrowOptions = {
      fill: MakeATenConstants.CUE_FILL,
      stroke: null,
      headHeight: 14,
      headWidth: 22,
      tailWidth: 9,
      x: 7,
      y: 3
    };

    this.addChild( new ArrowNode( 0, 0, 30, -30, arrowOptions ) );

    this.addChild( new Image( handImage, {
      scale: 0.3,
      rotation: Math.PI / 6 - Math.PI / 5
    } ) );
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
        this.setTranslation(
          position.x + localBounds.right - 22,
          position.y + localBounds.top + 15
        );
      }
    }
  } );
} );
