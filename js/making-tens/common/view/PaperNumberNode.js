// Copyright 2015, University of Colorado Boulder

/**
 *
 * Represents the view of the PaperNumber.
 * It uses one or more number images based on the "Tens" in a given number.
 * These collections of images are positioned in a way to give "stacked" appearance
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PaperNumber = require( 'MAKING_TENS/making-tens/common/model/PaperNumber' );
  var ArithmeticRules = require( 'MAKING_TENS/making-tens/common/model/ArithmeticRules' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var PaperImageCollection = require( 'MAKING_TENS/making-tens/common/model/PaperImageCollection' );
  var Image = require( 'SCENERY/nodes/Image' );

  // constants
  var SPLIT_OPACITY_FACTOR = 5; // for a distance of 5 apply some transparency to make the split effect realistic
  var MIN_SPLIT_DISTANCE = 6;
  var DROP_BOUNDS_HEIGHT_PROPORTION = 0.35; // the bounds proportion within which if user drops a number, we can consider collapsing them
  var MIN_DISTANCE_DIFFERENCE_TO_COLLAPSE = 30;

  /**
   *
   * @param {PaperNumber} paperNumber
   * @param {MakingTensCommonView} makingTensView
   * @param {Function<paperNumber>} addNumberModelCallback A callback to invoke when a  Number is  split
   * @param {Function<paperNumber,droppedPoint>} tryToCombineNumbers A callback to invoke when a Number is  combined
   * @constructor
   */
  function PaperNumberNode( paperNumber, makingTensView, addNumberModelCallback, tryToCombineNumbers ) {
    var self = this;
    this.paperNumber = paperNumber;
    this.makingTensView = makingTensView;
    Node.call( this );

    this.addNumberModelCallback = addNumberModelCallback || _.noop;
    tryToCombineNumbers = tryToCombineNumbers || _.noop;

    var imageNumberNode = new Node();
    this.addChild( imageNumberNode );

    paperNumber.numberValueProperty.link( function( newNumber ) {
      imageNumberNode.removeAllChildren();

      _.each( paperNumber.baseNumbers, function( baseNumberObj ) {
        var baseNumberImage = PaperImageCollection.getNumberImage( baseNumberObj.numberValue );
        var baseNumberImageNode = new Image( baseNumberImage );
        baseNumberImageNode.leftTop = baseNumberObj.position;
        baseNumberImageNode.opacity = baseNumberObj.opacity;
        imageNumberNode.addChild( baseNumberImageNode );
      } );

      changeMouseAndTouchAreas();

    } );

    function changeMouseAndTouchAreas() {
      // Set up the mouse and touch areas for this node so that we can pass
      // the query parameter ?showPointerAreas to visualize the areas
      var paperNumberBounds = self.getBounds();

      var mouseArea = Shape.rectangle( 0, 0,
        paperNumberBounds.width,
        paperNumberBounds.height );

      self.touchArea = mouseArea;
      self.mouseArea = mouseArea;
    }

    paperNumber.positionProperty.link( function( newPos ) {
      self.leftTop = newPos;
    } );


    paperNumber.opacityProperty.link( function( opacity ) {
      imageNumberNode.opacity = opacity;
    } );

    var movableObject = null;
    var startOffset = null;
    var splitObjectContext = null;
    var currentPoint = null;

    function resetDrag() {
      startOffset = null;
      currentPoint = null;
      splitObjectContext = null;
      movableObject = null;
    }

    function startMoving( paperNumber ) {
      movableObject = paperNumber;
      movableObject.userControlled = true;
    }

    var paperNodeDragHandler = new SimpleDragHandler( {

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      dragCursor: null,

      start: function( event, trail ) {
        resetDrag();
        startOffset = self.globalToParentPoint( event.pointer.point );
        currentPoint = startOffset.copy();

        if ( paperNumber.numberValue === 1 ) {
          startMoving( paperNumber );
          return;
        }

        var pulledOutIndex = self.determineDigitIndex( startOffset );
        var amountToRemove = ArithmeticRules.pullApartNumbers( paperNumber.numberValue, pulledOutIndex );
        var amountRemaining = paperNumber.numberValue - amountToRemove;

        // it cannot be split - so start moving
        if ( !amountToRemove ) {
          startMoving( paperNumber );
          return;
        }

        // When splitting a single digit from a two, make sure the mouse is near that second digit (or third digit)
        // In the case of splitting equal digits (ex 30 splitting in to 20 and 10) we don't need to check this condition
        var amountRemovingOffsetPosition = self.paperNumber.getDigitOffsetPosition( amountRemaining );
        var totalBounds = self.bounds;
        var splitRect = Bounds2.rect( totalBounds.x, totalBounds.y,
          totalBounds.width, totalBounds.height * MakingTensSharedConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION );

        //if the below condition is true, start splitting
        if ( splitRect.containsPoint( startOffset ) ) {
          var pulledOutPosition = self.determinePulledOutNumberPosition( amountToRemove );
          var pulledApartPaperNumber = new PaperNumber( amountToRemove, pulledOutPosition, {
            opacity: 0.95
          } );
          splitObjectContext = {
            pulledApartPaperNumber: pulledApartPaperNumber,
            amountRemaining: amountRemaining,
            amountRemovingOffsetPosition: amountRemovingOffsetPosition
          };
          return;
        }

        // none matched, start moving
        startMoving( paperNumber );
      },

      // Handler that moves the shape in model space.
      translate: function( translationParams ) {
        // How far it has moved from the original position
        var delta = translationParams.delta;
        currentPoint = currentPoint.plus( delta );
        var transDistance = currentPoint.distance( startOffset );

        //if it is splitMode
        if ( splitObjectContext && transDistance > MIN_SPLIT_DISTANCE ) {
          self.addNumberModelCallback( splitObjectContext.pulledApartPaperNumber );
          paperNumber.changeNumber( splitObjectContext.amountRemaining );
          startMoving( splitObjectContext.pulledApartPaperNumber );

          // After a Number is pulled the  remaining digits must stay in the same place.We use the amountRemovingOffsetPosition
          // to adjust the new paperModel's position
          // see issue #7

          if ( splitObjectContext.pulledApartPaperNumber.digitLength >=
               (splitObjectContext.amountRemaining + '').length ) {
            paperNumber.setDestination( paperNumber.position.plus(
              splitObjectContext.amountRemovingOffsetPosition ) );
          }
          if ( splitObjectContext.pulledApartPaperNumber.digitLength >
               (splitObjectContext.amountRemaining + '').length ) {
            self.moveToFront();
          }

          splitObjectContext = null;
        }

        //in case of split mode, the movableObject is set, only if the "move" started after a certain distance
        if ( movableObject ) {
          var newPosition = movableObject.position.plus( delta );
          //constrain
          movableObject.constrainPosition( makingTensView.availableViewBoundsProperty.get(), newPosition );

          // if it is a new created object, change the opacity
          if ( movableObject !== paperNumber ) {
            // gradually increase the opacity from 0.8 to 1 as we move away from the number, otherwise the change looks sudden
            movableObject.opacity = 0.9 + (0.005 * Math.min( 20, transDistance / SPLIT_OPACITY_FACTOR ));
          }
        }

        return translationParams.position;
      },

      end: function( event, trail ) {
        if ( movableObject ) {
          movableObject.userControlled = false;
          var droppedPoint = event.pointer.point;
          tryToCombineNumbers( movableObject, droppedPoint );
          movableObject.trigger( 'endDrag' );
        }

        resetDrag();
      }

    } );

    this.addInputListener( paperNodeDragHandler );

    // show proper cursor to differentiate move and split
    paperNodeDragHandler.move = function( event ) {

      // if it is 1, we can only move
      if ( paperNumber.numberValue === 1 ) {
        self.cursor = 'move';
        return;
      }

      var localNodeBounds = self.localBounds;
      var pullBounds = Bounds2.rect( localNodeBounds.x, localNodeBounds.y,
        localNodeBounds.width, localNodeBounds.height * MakingTensSharedConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION );

      var globalBounds = self.localToGlobalBounds( pullBounds );
      if ( globalBounds.containsPoint( event.pointer.point ) ) {
        self.cursor = 'pointer';
      }
      else {
        self.cursor = 'move';
      }
    };

    paperNodeDragHandler.out = function( args ) {
      self.cursor = 'default';
    };

    // @private {function} - Listener reference that gets attached/detached. Handles moving the Node to the front.
    this.userControlledListener = this.onUserControlledChange.bind( this );
  }

  makingTens.register( 'PaperNumberNode', PaperNumberNode );

  return inherit( Node, PaperNumberNode, {
    /**
     * When our model becomes user-controlled, move our node to the front.
     * @private
     */
    onUserControlledChange: function() {
      if ( this.paperNumber.userControlled ) {
        this.moveToFront();
      }
    },

    /**
     * Attaches listeners to the model. Should be called when added to the scene graph.
     * @public
     */
    attachListeners: function() {
      this.paperNumber.userControlledProperty.link( this.userControlledListener );
    },

    /**
     * Removes listeners from the model. Should be called when removed from the scene graph.
     * @public
     */
    detachListeners: function() {
      this.paperNumber.userControlledProperty.unlink( this.userControlledListener );
    },

    /**
     * Each number is made up of base numbers. This method tells at what position the pulled out number ly
     *
     * @param newPulledNumber
     */
    determinePulledOutNumberPosition: function( newPulledNumber ) {
      return this.leftTop.plus( this.paperNumber.getDigitOffsetPosition( newPulledNumber ) );
    },

    /**
     * Based on the position (relative to the node, determine if the point is one the first digit
     * or  second digit or third digit
     *
     * @param {number} return value is either 0,1 or 2
     */
    determineDigitIndex: function( parentPos ) {
      var localPos = this.parentToLocalPoint( parentPos );
      return this.paperNumber.determineDigitIndex( localPos );
    },

    /**
     * Find all nodes which are attachable to the dragged node. This method is called once th user ends the dragging
     * @param allPaperNumberNodes
     * @returns {Array}
     */
    findAttachableNodes: function( allPaperNumberNodes ) {
      var self = this;
      // TODO: this looks like it could be cleaned up
      _.remove( allPaperNumberNodes, function( node ) {
        return node === self;
      } );

      var attachableNodeCandidates = allPaperNumberNodes;
      var attachableNodes = [];

      for ( var i = 0; i < attachableNodeCandidates.length; i++ ) {
        var droppedNode = attachableNodeCandidates[ i ];
        var isOpposite = this.paperNumber.numberValue > droppedNode.paperNumber.numberValue;
        var widerNode = isOpposite ? this : droppedNode;
        var smallerNode = isOpposite ? droppedNode : this;

        var smallerDigitLength = smallerNode.paperNumber.digitLength;
        var widerDigitLength = widerNode.paperNumber.digitLength;

        var yDiff = Math.abs( droppedNode.top - this.top );
        var dropPositionHeightTolerance = smallerNode.bounds.height * DROP_BOUNDS_HEIGHT_PROPORTION;
        var yInRange = Math.abs( yDiff ) < dropPositionHeightTolerance;

        var withinXRange = false;
        var distanceBetweenEdges = 10000;
        //if same length
        if ( smallerDigitLength === widerDigitLength ) {
          distanceBetweenEdges = Math.abs( widerNode.x - smallerNode.x );
          //if the distance is between 2 left edges is less than half the width, consider close enough
          withinXRange = distanceBetweenEdges < MIN_DISTANCE_DIFFERENCE_TO_COLLAPSE;
        }
        else {
          distanceBetweenEdges = Math.abs( widerNode.bounds.maxX - smallerNode.bounds.maxX );
          if ( smallerNode.bounds.maxX > widerNode.bounds.maxX ) {
            withinXRange = distanceBetweenEdges < MIN_DISTANCE_DIFFERENCE_TO_COLLAPSE / 2;
          }
          else {
            withinXRange = distanceBetweenEdges < MIN_DISTANCE_DIFFERENCE_TO_COLLAPSE;
          }
        }


        if ( withinXRange && yInRange ) {
          attachableNodes.push( droppedNode );
        }

      }

      return attachableNodes;
    }

  } );
} )
;

