// Copyright 2015-2017, University of Colorado Boulder

/**
 * Visual view of paper numbers (PaperNumber), with stacked images based on the digits of the number.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var ArithmeticRules = require( 'MAKE_A_TEN/make-a-ten/common/model/ArithmeticRules' );
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
  var BaseNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/BaseNumber' );
  var BaseNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/BaseNumberNode' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Mouse = require( 'SCENERY/input/Mouse' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   *
   * @param {PaperNumber} paperNumber
   * @param {Property.<Bounds2>} availableViewBoundsProperty
   * @param {Function} addAndDragNumber - function( event, paperNumber ), adds and starts a drag for a number
   * @param {Function} tryToCombineNumbers - function( paperNumber ), called to combine our paper number
   */
  function PaperNumberNode( paperNumber, availableViewBoundsProperty, addAndDragNumber, tryToCombineNumbers ) {
    var self = this;

    Node.call( this );

    // @public {PaperNumber} - Our model
    this.paperNumber = paperNumber;

    // @public {Emitter} - Triggered with self when this paper number node starts to get dragged
    this.moveEmitter = new Emitter();

    // @public {Emitter} - Triggered with self when this paper number node is split
    this.splitEmitter = new Emitter();

    // @public {Emitter} - Triggered when user interaction with this paper number begins.
    this.interactionStartedEmitter = new Emitter();

    // @private {boolean} - When true, don't emit from the moveEmitter (synthetic drag)
    this.preventMoveEmit = false;

    // @private {Bounds2}
    this.availableViewBoundsProperty = availableViewBoundsProperty;

    // @private {Node} - Container for the digit image nodes
    this.numberImageContainer = new Node( {
      pickable: false
    } );
    this.addChild( this.numberImageContainer );

    // @private {Rectangle} - Hit target for the "split" behavior, where one number would be pulled off from the
    //                        existing number.
    this.splitTarget = new Rectangle( 0, 0, 100, 100, {
      cursor: 'pointer'
    } );
    this.addChild( this.splitTarget );

    // @private {Rectangle} - Hit target for the "move" behavior, which just drags the existing paper number.
    this.moveTarget = new Rectangle( 0, 0, 100, 100, {
      cursor: 'move'
    } );
    this.addChild( this.moveTarget );

    // View-coordinate offset between our position and the pointer's position, used for keeping drags synced.
    // @private {DragListener}
    this.moveDragHandler = new DragListener( {
      targetNode: this,
      allowTouchSnag: true,
      isUserControlledProperty: paperNumber.userControlledProperty,
      start: function( event, listener ) {
        self.interactionStartedEmitter.emit1( self );
        if ( !self.preventMoveEmit ) {
          self.moveEmitter.emit1( self );
        }
      },

      drag: function( event, listener ) {
        paperNumber.setConstrainedDestination( availableViewBoundsProperty.value, listener.parentPoint );
      },

      end: function( event, listener ) {
        tryToCombineNumbers( self.paperNumber );
        paperNumber.endDragEmitter.emit1( paperNumber );
      }
    } );
    this.moveTarget.addInputListener( this.moveDragHandler );

    // @private {Object}
    this.splitDragHandler = {
      down: function( event ) {
        // Ignore non-left mouse buttons
        if ( event.pointer instanceof Mouse && event.domEvent && event.domEvent.button !== 0 ) {
          return;
        }

        var viewPosition = self.globalToParentPoint( event.pointer.point );

        // Determine how much (if any) gets moved off
        var pulledPlace = paperNumber.getBaseNumberAt( self.parentToLocalPoint( viewPosition ) ).place;
        var amountToRemove = ArithmeticRules.pullApartNumbers( paperNumber.numberValueProperty.value, pulledPlace );
        var amountRemaining = paperNumber.numberValueProperty.value - amountToRemove;

        // it cannot be split - so start moving
        if ( !amountToRemove ) {
          self.startSyntheticDrag( event );
          return;
        }

        paperNumber.changeNumber( amountRemaining );

        self.interactionStartedEmitter.emit1( self );
        self.splitEmitter.emit1( self );

        var newPaperNumber = new PaperNumber( amountToRemove, paperNumber.positionProperty.value );
        addAndDragNumber( event, newPaperNumber );
      }
    };
    this.splitTarget.addInputListener( this.splitDragHandler );

    // @private {Function} - Listener that hooks model position to view translation.
    this.translationListener = function( position ) {
      self.translation = position;
    };

    // @private {Function} - Listener for when our number changes
    this.updateNumberListener = this.updateNumber.bind( this );

    // @private {Function} - Listener reference that gets attached/detached. Handles moving the Node to the front.
    this.userControlledListener = function( userControlled ) {
      if ( userControlled ) {
        self.moveToFront();
      }
    };
  }

  makeATen.register( 'PaperNumberNode', PaperNumberNode );

  return inherit( Node, PaperNumberNode, {
    /**
     * Rebuilds the image nodes that display the actual paper number, and resizes the mouse/touch targets.
     * @private
     */
    updateNumber: function() {
      var self = this;

      var reversedBaseNumbers = this.paperNumber.baseNumbers.slice().reverse();
      // Reversing allows easier opacity computation and has the nodes in order for setting children.
      this.numberImageContainer.children = _.map( reversedBaseNumbers, function( baseNumber, index ) {
        // each number has successively less opacity on top
        return new BaseNumberNode( baseNumber, 0.95 * Math.pow( 0.97, index ) );
      } );

      // Grab the bounds of the biggest base number for the full bounds
      var fullBounds = this.paperNumber.baseNumbers[ this.paperNumber.baseNumbers.length - 1 ].bounds;

      // Split target only visible if our number is > 1. Move target can resize as needed.
      if ( this.paperNumber.numberValueProperty.value === 1 ) {
        self.splitTarget.visible = false;
        self.moveTarget.mouseArea = self.moveTarget.touchArea = self.moveTarget.rectBounds = fullBounds;
      }
      else {
        self.splitTarget.visible = true;

        // Locate the boundary between the "move" input area and "split" input area.
        var boundaryY = this.paperNumber.getBoundaryY();

        // Modify our move/split targets
        self.moveTarget.mouseArea = self.moveTarget.touchArea = self.moveTarget.rectBounds = fullBounds.withMinY( boundaryY );
        self.splitTarget.mouseArea = self.splitTarget.touchArea = self.splitTarget.rectBounds = fullBounds.withMaxY( boundaryY );
      }

      // Changing the number must have happened from an interaction. If combined, we want to put cues on this.
      this.interactionStartedEmitter.emit1( this );
    },

    /**
     * Called when we grab an event from a different input (like clicking the paper number in the explore panel, or
     * splitting paper numbers), and starts a drag on this paper number.
     * @public
     *
     * @param {Event} event - Scenery event from the relevant input handler
     */
    startSyntheticDrag: function( event ) {
      // Don't emit a move event, as we don't want the cue to disappear.
      this.preventMoveEmit = true;
      this.moveDragHandler.press( event );
      this.preventMoveEmit = false;
    },

    /**
     * Implements the API for ClosestDragListener.
     * @public
     *
     * @param {Event} event - Scenery event from the relevant input handler
     */
    startDrag: function( event ) {
      if ( this.globalToLocalPoint( event.pointer.point ).y < this.splitTarget.bottom && this.paperNumber.numberValueProperty.value > 1 ) {
        this.splitDragHandler.down( event );
      }
      else {
        this.moveDragHandler.press( event );
      }
    },

    /**
     * Implements the API for ClosestDragListener.
     * @public
     *
     * @param {Vector2} globalPoint
     */
    computeDistance: function( globalPoint ) {
      if ( this.paperNumber.userControlledProperty.value ) {
        return Number.POSITIVE_INFINITY;
      }
      else {
        var globalBounds = this.localToGlobalBounds( this.paperNumber.getLocalBounds() );
        return Math.sqrt( globalBounds.minimumDistanceToPointSquared( globalPoint ) );
      }
    },

    /**
     * Attaches listeners to the model. Should be called when added to the scene graph.
     * @public
     */
    attachListeners: function() {
      // mirrored unlinks in detachListeners()
      this.paperNumber.userControlledProperty.link( this.userControlledListener );
      this.paperNumber.numberValueProperty.link( this.updateNumberListener );
      this.paperNumber.positionProperty.link( this.translationListener );
    },

    /**
     * Removes listeners from the model. Should be called when removed from the scene graph.
     * @public
     */
    detachListeners: function() {
      this.paperNumber.positionProperty.unlink( this.translationListener );
      this.paperNumber.numberValueProperty.unlink( this.updateNumberListener );
      this.paperNumber.userControlledProperty.unlink( this.userControlledListener );
    },

    /**
     * Find all nodes which are attachable to the dragged node. This method is called once the user ends the dragging.
     * @public
     *
     * @param {Array.<PaperNumberNode>} allPaperNumberNodes
     * @returns {Array}
     */
    findAttachableNodes: function( allPaperNumberNodes ) {
      var self = this;
      var attachableNodeCandidates = allPaperNumberNodes.slice();
      arrayRemove( attachableNodeCandidates, this );

      return attachableNodeCandidates.filter( function( candidateNode ) {
        return PaperNumber.arePaperNumbersAttachable( self.paperNumber, candidateNode.paperNumber );
      } );
    }

  }, {
    /**
     * Given a number's digit and place, looks up the associated image.
     * @public
     *
     * @param {number} digit
     * @param {number} place
     * @returns {HTMLImageElement}
     */
    getNumberImage: function( digit, place ) {
      return new BaseNumberNode( new BaseNumber( digit, place ), 1 );
    }
  } );
} );
