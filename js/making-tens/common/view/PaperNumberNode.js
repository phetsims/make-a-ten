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

  // constants
  //based on where the user clicked on the node, determine if it is split or move
  var SPLIT_MODE_HEIGHT_PROPORTION = 0.4;
  var SPLIT_THRESHOLD_DISTANCE = 5;

  /**
   *
   * @param {PaperNumberModel} paperNumberModel
   * @param {Function<number,position>} addNewNumberCallback A callback to invoke when a  Number is  split
   * @param {Function<imageNode,number,droppedPoint>} canDropNumberCallback A callback to invoke when a dropped number can be added to an existng number
   * @param {Function<imageNode,number,droppedPoint>} combineNumbersCallback A callback to invoke when a  Number is  combined
   * @constructor
   */
  function PaperNumberNode( paperNumberModel, addNewNumberCallback, canDropNumberCallback, combineNumbersCallback ) {
    var thisNode = this;
    thisNode.paperNumberModel = paperNumberModel;
    Node.call( thisNode );

    var imageNumberNode = new Node();
    thisNode.addChild( imageNumberNode );

    paperNumberModel.numberValueProperty.link( function( newNumber ) {
      imageNumberNode.removeAllChildren();
      _.each( paperNumberModel.baseImages, function( imageNode ) {
        imageNumberNode.addChild( imageNode );
      } );
    } );

    paperNumberModel.positionProperty.link( function( newPos ) {
      imageNumberNode.leftTop = newPos;
    } );

    paperNumberModel.opacityProperty.link( function( opacity ) {
      imageNumberNode.opacity = opacity;
    } );

    thisNode.addInputListener( new SimpleDragHandler( {

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      // Based on the pointer position at "start", determine if the user wants to pullApart or move the number
      splitNumberModel: null,

      numberPulledPart: null,

      startOffSet: null,

      currentPoint: null,

      moveMode: false,

      start: function( event, trail ) {
        var thisHandler = this;
        if ( paperNumberModel.numberValue === 1 ) {
          thisHandler.moveMode = true;
          return;
        }
        thisHandler.splitNumberModel = null;
        thisHandler.numberPulledPart = null;
        thisHandler.moveMode = false;
        thisHandler.startOffSet = thisNode.globalToParentPoint( event.pointer.point );
        thisHandler.currentPoint = thisHandler.startOffSet;
        var totalBounds = thisNode.bounds;
        var splitRect = Bounds2.rect( totalBounds.x, totalBounds.y,
          totalBounds.width, totalBounds.height * SPLIT_MODE_HEIGHT_PROPORTION );
        if ( splitRect.containsPoint( thisHandler.startOffSet ) ) {
          thisHandler.numberPulledPart = paperNumberModel.pullApart();
        }
        else {
          thisHandler.moveMode = true;
        }
      },

      end: function( event, trail ) {
        var thisHandler = this;
        thisHandler.splitNumberModel = null;
        thisHandler.numberPulledPart = null;
        thisHandler.startOffSet = null;
        thisHandler.currentPoint = null;
        thisHandler.moveMode = false;
        var droppedPoint = event.pointer.point;

        //check if a number can be combined with the number above which it is dropped
        if ( canDropNumberCallback( imageNumberNode, paperNumberModel.numberValue, droppedPoint ) ) {
          combineNumbersCallback( paperNumberModel.numberValue, droppedPoint );
        }
      },

      // Handler that moves the shape in model space.
      translate: function( translationParams ) {
        var thisHandler = this;
        var delta = translationParams.delta;
        if ( thisHandler.moveMode ) {
          paperNumberModel.setDestination( paperNumberModel.position.plus( delta ), false );
          return translationParams.position;
        }

        var transDistance = thisHandler.currentPoint.distance( thisHandler.startOffSet );
        thisHandler.currentPoint = thisHandler.currentPoint.plus( delta );
        var overAllDelta = thisHandler.currentPoint.minus( thisHandler.startOffSet );

        if ( thisHandler.numberPulledPart ) {
          var amountToRemove = thisHandler.numberPulledPart.amountToRemove;
          var initialPosition = thisNode.determinePulledOutNumberPosition( amountToRemove, overAllDelta );
          var options = {
            opacity: 0.9
          };
          thisHandler.splitNumberModel = addNewNumberCallback( amountToRemove, initialPosition, options );
          paperNumberModel.changeNumber( thisHandler.numberPulledPart.amountRemaining );
          thisHandler.numberPulledPart = null;
          return translationParams.position;
        }

        if ( thisHandler.splitNumberModel ) {
          thisHandler.splitNumberModel.setDestination( thisHandler.splitNumberModel.position.plus( delta ), false );

          // gradually increase the opacity from 0.8 to 1 as we move away from the nuber, otherwise the change looks sudden
          thisHandler.splitNumberModel.opacity = 0.9 + (0.005 * Math.min( 20, transDistance / SPLIT_THRESHOLD_DISTANCE ));
        }
        return translationParams.position;
      }

    } ) );

  }

  return inherit( Node, PaperNumberNode, {
    /**
     *
     * @param newPulledNumber
     * @return {Vector2}
     */
    determinePulledOutNumberPosition: function( newPulledNumber, delta ) {
      var thisNode = this;
      if ( (newPulledNumber + "").length === (this.paperNumberModel.numberValue + "").length ) {
        return thisNode.leftTop.plus( delta );
      }
      //hardcoded - TODO
      return thisNode.leftTop.plus( this.paperNumberModel.getImagePartOffsetPosition( newPulledNumber ) );
    }
  } );
} );

