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
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var CurvedArrowShape = require( 'SCENERY_PHET/CurvedArrowShape' );
  var CueNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/CueNode' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  var handImage = require( 'image!SCENERY_PHET/hand.png' );

  /**
   * @constructor
   *
   * @param {Cue} cue - Our cue model
   */
  function SplitCueNode( cue ) {
    CueNode.call( this, cue );

    var arrowShape = new CurvedArrowShape( 30, 1.05 * Math.PI, 1.7 * Math.PI, {
      headHeight: 14,
      headWidth: 22,
      tailWidth: 9
    } );
    this.addChild( new Path( arrowShape, {
      fill: MakeATenConstants.CUE_FILL,
      x: 35,
      y: 11
    } ) );

    this.addChild( new Image( handImage, {
      scale: 0.3,
      rotation: Math.PI / 6 - Math.PI / 5
    } ) );
  }

  makeATen.register( 'SplitCueNode', SplitCueNode );

  return inherit( CueNode, SplitCueNode, {
    /**
     * @override
     */
    updatePosition: function() {
      var visible = this.cue.visibilityProperty.value;
      var paperNumber = this.cue.paperNumberProperty.value;

      if ( visible && paperNumber ) {
        var position = paperNumber.positionProperty.value;
        var localBounds = paperNumber.getLocalBounds();
        this.setTranslation(
          position.x + localBounds.right - 20,
          position.y + localBounds.top + 20
        );
      }
    }
  } );
} );
