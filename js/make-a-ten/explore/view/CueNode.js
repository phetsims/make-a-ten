// Copyright 2015, University of Colorado Boulder

/**
 * Base type for the move and split cue nodes.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @constructor
   *
   * @param {Cue} cue - Our cue model
   */
  function CueNode( cue ) {
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
  }

  makeATen.register( 'CueNode', CueNode );

  return inherit( Node, CueNode, {
    /**
     * Updates our position.
     * @protected
     */
    updatePosition: function() {
      throw new Error( 'abstract method, please override' );
    }
  } );
} );
