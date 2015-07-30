// Copyright 2002-2013, University of Colorado Boulder

/**
 *
 * Represents the view of the PaperNumberModel.
 * It uses one or more number images based on the "Tens" in a given number.
 * These collections of images are positioned in a way to give "stacked" appearance
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PaperNumberModel = require( 'MAKING_TENS/making-tens/common/model/PaperNumberModel' );
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );
  var ArithmeticRules = require( 'MAKING_TENS/making-tens/common/model/ArithmeticRules' );

  // constants
  //based on where the user clicked on the node, determine if it is split or move
  var SPLIT_MODE_HEIGHT_PROPORTION = 0.3;
  var SPLIT_OPACITY_FACTOR = 5; // for a distance of 5 apply some transparency to make the split effect realistic
  var MIN_SPLIT_DISTANCE = 6;
  var DROP_BOUNDS_WIDTH_PROPORTION = 0.35; // the bounds proportion within which if user drops a number we can consider collapsing them
  var DROP_BOUNDS_HEIGHT_PROPORTION = 0.35; // the bounds proportion within which if user drops a number we can consider collapsing them

  /**
   *
   * @param {PaperNumberModel} paperNumberModel
   * @param {Function<paperNumberModel>} addNumberModelCallBack A callback to invoke when a  Number is  split
   * @param {Function<paperNumberModel,droppedPoint>} combineNumbersIfApplicableCallback A callback to invoke when a Number is  combined
   * @constructor
   */
  function PaperNumberNode( paperNumberModel, addNumberModelCallBack, combineNumbersIfApplicableCallback ) {
    var thisNode = this;
    thisNode.paperNumberModel = paperNumberModel;
    Node.call( thisNode );

    addNumberModelCallBack = addNumberModelCallBack || _.noop();
    combineNumbersIfApplicableCallback = combineNumbersIfApplicableCallback || _.noop();

    var imageNumberNode = new Node();
    thisNode.addChild( imageNumberNode );

    paperNumberModel.numberValueProperty.link( function( newNumber ) {
      imageNumberNode.removeAllChildren();
      _.each( paperNumberModel.baseImages, function( imageNode ) {
        imageNumberNode.addChild( imageNode );
      } );
    } );

    paperNumberModel.positionProperty.link( function( newPos ) {
      thisNode.leftTop = newPos;
    } );


    paperNumberModel.opacityProperty.link( function( opacity ) {
      imageNumberNode.opacity = opacity;
    } );

    var paperNodeDragHandler = new SimpleDragHandler( {

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      movableObject: null,

      startOffSet: null,

      currentPoint: null,

      splitObjectContext: null,

      dragCursor: null,


      reset: function() {
        var thisHandler = this;
        thisHandler.startOffSet = null;
        thisHandler.currentPoint = null;
        thisHandler.splitObjectContext = null;
        thisHandler.movableObject = null;
      },

      startMoving: function( paperNumberModel ) {
        var thisHandler = this;
        thisHandler.movableObject = paperNumberModel;
        thisHandler.movableObject.userControlled = true;
      },

      start: function( event, trail ) {
        var thisHandler = this;
        thisHandler.reset();
        thisHandler.startOffSet = thisNode.globalToParentPoint( event.pointer.point );
        thisHandler.currentPoint = thisHandler.startOffSet.copy();

        if ( paperNumberModel.numberValue === 1 ) {
          this.startMoving( paperNumberModel );
          return;
        }

        var pulledOutIndex = thisNode.determineDigitIndex( thisHandler.startOffSet );
        var numberPulledApart = ArithmeticRules.pullApartNumbers( paperNumberModel.numberValue, pulledOutIndex );

        // it cannot be split - so start moving
        if ( !numberPulledApart ) {
          this.startMoving( paperNumberModel );
          return;
        }

        //check if split needs to happen
        var amountToRemove = numberPulledApart.amountToRemove;
        var amountRemaining = numberPulledApart.amountRemaining;

        // When splitting a single digit from a two, make sure the mouse is near that second digit (or third digit)
        // In the case of splitting equal digits (ex 30 splitting in to 20 and 10) we dont need to check this condition
        var removalOffsetPosition = thisNode.paperNumberModel.getDigitOffsetPosition( amountToRemove );
        var amountRemovingOffsetPosition = thisNode.paperNumberModel.getDigitOffsetPosition( amountRemaining );
        var totalBounds = thisNode.bounds;
        var splitRect = Bounds2.rect( totalBounds.x + removalOffsetPosition.x, totalBounds.y,
          totalBounds.width - removalOffsetPosition.x, totalBounds.height * SPLIT_MODE_HEIGHT_PROPORTION );

        //if the below condition is true, start splitting
        if ( splitRect.containsPoint( thisHandler.startOffSet ) ) {
          var pulledOutPosition = thisNode.determinePulledOutNumberPosition( amountToRemove );
          var pulledApartPaperNumberModel = new PaperNumberModel( amountToRemove, pulledOutPosition, {
            opacity: 0.95
          } );
          thisHandler.splitObjectContext = {};
          thisHandler.splitObjectContext.pulledApartPaperNumberModel = pulledApartPaperNumberModel;
          thisHandler.splitObjectContext.amountRemaining = amountRemaining;
          thisHandler.splitObjectContext.amountRemovingOffsetPosition = amountRemovingOffsetPosition;
          return;
        }

        // none matched, start moving
        this.startMoving( paperNumberModel );
        return;
      },

      // Handler that moves the shape in model space.
      translate: function( translationParams ) {
        var thisHandler = this;

        // How far it has moved from the original position
        var delta = translationParams.delta;
        thisHandler.currentPoint = thisHandler.currentPoint.plus( delta );
        var transDistance = thisHandler.currentPoint.distance( thisHandler.startOffSet );

        //if it is splitMode
        if ( thisHandler.splitObjectContext && transDistance > MIN_SPLIT_DISTANCE ) {
          addNumberModelCallBack( thisHandler.splitObjectContext.pulledApartPaperNumberModel );
          paperNumberModel.changeNumber( thisHandler.splitObjectContext.amountRemaining );
          this.startMoving( thisHandler.splitObjectContext.pulledApartPaperNumberModel );

          // After a Number is pulled the  remainaing digits must stay in the same place.We use the amountRemovingOffsetPosition to adjust the new paperModel's position
          // see issue #7

          if ( thisHandler.splitObjectContext.pulledApartPaperNumberModel.getDigitLength() >= (thisHandler.splitObjectContext.amountRemaining + "").length ) {
            paperNumberModel.setDestination( paperNumberModel.position.plus( thisHandler.splitObjectContext.amountRemovingOffsetPosition ) );
          }
          if ( thisHandler.splitObjectContext.pulledApartPaperNumberModel.getDigitLength() > (thisHandler.splitObjectContext.amountRemaining + "").length ) {
            thisNode.moveToFront();
          }

          thisHandler.splitObjectContext = null;
        }

        //in case of split mode, the movableObject is set, only if the "move" started after a certain distance
        if ( thisHandler.movableObject ) {
          var movableObject = thisHandler.movableObject;
          movableObject.setDestination( movableObject.position.plus( delta ), false );
          // if it is a new created object, change the opacity
          if ( movableObject !== paperNumberModel ) {
            // gradually increase the opacity from 0.8 to 1 as we move away from the number, otherwise the change looks sudden
            movableObject.opacity = 0.9 + (0.005 * Math.min( 20, transDistance / SPLIT_OPACITY_FACTOR ));
          }
        }

        return translationParams.position;
      },

      end: function( event, trail ) {
        var thisHandler = this;
        var movableObject = thisHandler.movableObject;
        if ( movableObject ) {
          movableObject.userControlled = false;
          var droppedPoint = event.pointer.point;
          combineNumbersIfApplicableCallback( movableObject, droppedPoint );
        }

        thisHandler.reset();
      }

    } );

    thisNode.addInputListener( paperNodeDragHandler );

    // show proper cursor to differentiate move and split
    paperNodeDragHandler.move = function( event ) {

      // if it is 1, we can only move
      if ( paperNumberModel.numberValue === 1 ) {
        thisNode.cursor = 'move';
        return;
      }

      var localNodeBounds = thisNode.localBounds;
      var pullBounds = Bounds2.rect( localNodeBounds.x, localNodeBounds.y,
        localNodeBounds.width, localNodeBounds.height * SPLIT_MODE_HEIGHT_PROPORTION );

      var globalBounds = thisNode.localToGlobalBounds( pullBounds );
      if ( globalBounds.containsPoint( event.pointer.point ) ) {
        thisNode.cursor = 'pointer';
      }
      else {
        thisNode.cursor = 'move';
      }
    };

    paperNodeDragHandler.out = function( args ) {
      thisNode.cursor = 'default';
    };

  }

  return inherit( Node, PaperNumberNode, {

    /**
     * Each number is made up of base numbers. This method tells at what position the pulled out number ly
     *
     * @param newPulledNumber
     */
    determinePulledOutNumberPosition: function( newPulledNumber ) {
      var thisNode = this;
      return thisNode.leftTop.plus( thisNode.paperNumberModel.getDigitOffsetPosition( newPulledNumber ) );
    },

    /**
     * Based on the position (relative to the node, determine if the point is one the first digit
     * or  second digit or third digit
     *
     * @param {number} return value is either 0,1 or 2
     */
    determineDigitIndex: function( parentPos ) {
      var thisNode = this;
      var localPos = thisNode.parentToLocalPoint( parentPos );
      return thisNode.paperNumberModel.determineDigitIndex( localPos );
    },

    /**
     * Find all nodes which are attachable to the dragged node. This method is called once th user ends the dragging
     * @param allPaperNumberNodes
     * @param {Vector} droppedPoint // in screen coordinates
     * @returns {Array}
     */
    findAttachableNodes: function( allPaperNumberNodes, droppedPoint ) {

      var draggedNode = this;

      _.remove( allPaperNumberNodes, function( node ) {
        return node === draggedNode;
      } );

      var attachableNodeCandidates = allPaperNumberNodes;
      var attachableNodes = [];

      for ( var i = 0; i < attachableNodeCandidates.length; i++ ) {
        var droppedNode = attachableNodeCandidates[ i ];
        var widerNode = droppedNode;
        var smallerNode = draggedNode;
        if ( smallerNode.paperNumberModel.numberValue > widerNode.paperNumberModel.numberValue ) {
          widerNode = draggedNode;
          smallerNode = droppedNode;
        }
        var widthDiff = widerNode.bounds.width - smallerNode.bounds.width;
        var xDiff = widerNode.left - (smallerNode.left - widthDiff);
        var yDiff = Math.abs( droppedNode.top - draggedNode.top );

        var dropPositionWidthTolerance = smallerNode.bounds.width * DROP_BOUNDS_WIDTH_PROPORTION;
        var dropPositionHeightTolerance = smallerNode.bounds.height * DROP_BOUNDS_HEIGHT_PROPORTION;

        var xInRange = MakingTensUtil.isBetween( xDiff, -dropPositionWidthTolerance, dropPositionWidthTolerance );
        var yInRange = MakingTensUtil.isBetween( yDiff, -dropPositionHeightTolerance, dropPositionHeightTolerance );

        if ( xInRange && yInRange ) {
          attachableNodes.push( droppedNode );
        }
      }

      return attachableNodes;
    }

  } );
} )
;

