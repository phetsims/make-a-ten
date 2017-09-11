// Copyright 2015, University of Colorado Boulder

/**
 * Behavior that allows sliding between two full-screenview sized panels based on a Property.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   *
   * @param {Node} leftNode
   * @param {Node} rightNode
   * @param {Property.<Bounds2>} visibleBoundsProperty - ScreenView's visibleBoundsProperty
   * @param {Property.<boolean>} showingLeftProperty - Whether the left-hand side should be in the view. When
   *                                                   false, the right-hand side should be in view.
   */
  function SlidingScreen( leftNode, rightNode, visibleBoundsProperty, showingLeftProperty ) {

    Node.call( this );

    // @private
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.visibleBoundsProperty = visibleBoundsProperty;
    this.showingLeftProperty = showingLeftProperty;

    this.addChild( leftNode );
    this.addChild( rightNode );

    showingLeftProperty.link( this.onPropertyChange.bind( this ) );
    visibleBoundsProperty.link( this.onVisibleBoundsChange.bind( this ) );

    // @private {MoveTo|null} - Current animation, if it exists
    this.moveTo = null;
  }

  makeATen.register( 'SlidingScreen', SlidingScreen );

  return inherit( Node, SlidingScreen, {
    /**
     * Sets options that depend on whether our view is moving (switching from level selection to challenges or back).
     * @public
     */
    setMoving: function( isMoving ) {
      this.leftNode.pickable = !isMoving;
      this.rightNode.pickable = !isMoving;
    },

    /**
     * The x offset that should be applied to this when we are in a particular game state.
     * @private
     *
     * @returns {number}
     */
    getIdealSlideOffset: function( showingLeft ) {
      var mainOffset = this.visibleBoundsProperty.value.left - this.visibleBoundsProperty.value.right;
      return showingLeft ? 0 : mainOffset;
    },

    /**
     * Stops animation.
     * @private
     */
    stopAnimation: function() {
      if ( this.moveTo ) {
        this.moveTo.stop();
        this.moveTo = null;
      }
    },

    /**
     * Moves into place immediately, instead of sliding.
     * @private
     */
    moveImmediately: function() {
      this.stopAnimation();
      this.x = this.getIdealSlideOffset( this.showingLeftProperty.value );
      this.setMoving( false );
    },

    /**
     * Called when the visible bounds change
     * @private
     */
    onVisibleBoundsChange: function() {
      this.rightNode.x = -this.getIdealSlideOffset( false );
      this.moveImmediately();
    },

    /**
     * Called when our showingLeftProperty changes.
     * @private
     */
    onPropertyChange: function() {
      var self = this;

      var idealOffset = this.getIdealSlideOffset( this.showingLeftProperty.value );

      if ( this.x !== idealOffset ) {
        this.stopAnimation();
        this.moveTo = new MoveTo( this, new Vector2( idealOffset, 0 ), {
          duration: 0.5,
          onComplete: function() {
            self.setMoving( false );
          }
        } );
        this.moveTo.start();
        this.setMoving( true );
      }
    },
  } );
} );
