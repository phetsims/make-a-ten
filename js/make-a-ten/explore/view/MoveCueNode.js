// Copyright 2015, University of Colorado Boulder

/**
 * Cue that informs the user they can drag from the lower-half to move the entire composite paper number.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var CueNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/CueNode' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  var handImage = require( 'image!SCENERY_PHET/hand.png' );

  /**
   * @constructor
   *
   * @param {Cue} cue - Our cue model
   */
  function MoveCueNode( cue ) {
    CueNode.call( this, cue );

    this.addChild( new Image( handImage, {
      scale: 0.3,
      rotation: Math.PI / 6
    } ) );

    var arrowY = 48;
    var arrowLength = 30;
    var leftArrowOffset = -22;
    var rightArrowOffset = 40;

    var arrowOptions = {
      fill: MakeATenConstants.CUE_FILL,
      stroke: null,
      headHeight: 14,
      headWidth: 22,
      tailWidth: 9
    };

    this.addChild( new ArrowNode( rightArrowOffset, arrowY, rightArrowOffset + arrowLength, arrowY, arrowOptions ) );
    this.addChild( new ArrowNode( leftArrowOffset, arrowY, leftArrowOffset - arrowLength, arrowY, arrowOptions ) );
  }

  makeATen.register( 'MoveCueNode', MoveCueNode );

  return inherit( CueNode, MoveCueNode, {
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
          position.x + localBounds.centerX,
          position.y + localBounds.bottom - 30
        );
      }
    }
  } );
} );
