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
  var Image = require( 'SCENERY/nodes/Image' );
  var PaperImageCollection = require( 'MAKING_TENS/making-tens/common/model/PaperImageCollection' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // how much 2 digit and single digit must offset from parent
  var NUMBER_IMAGE_OFFSET_DIMENSIONS = {
    0: new Vector2( 0, 0 ),
    1: new Vector2( 70, 22 ),// how much a single digit image has to offset
    2: new Vector2( 50, 50 )// how much a 2 digit has to offset from its parent (a 3 digit number)
  };

  //based on where the user clicked on the node, determine if it is split or move
  var SPLIT_MODE_HEIGHT_PROPORTION = 0.4;

  var SPLIT_THRESHOLD_DISTANCE = 5;

  /**
   *
   * @param {PaperNumberModel} paperNumberModel
   * @param {Function<number,position>} A callback to invoke when a new Number is  added to the model
   * @constructor
   */
  function PaperNumberNode( paperNumberModel, addNumberToModel ) {
    var thisNode = this;
    Node.call( thisNode );

    var imageNumberNode = new Node();
    thisNode.addChild( imageNumberNode );

    thisNode.baseNumberPositions = {}; // the base number and its position within this composite node(made up may image nodes)

    paperNumberModel.numberValueProperty.link( function( newNumber ) {
      var baseNumbers = paperNumberModel.baseNumbers;
      imageNumberNode.removeAllChildren();
      var offsetX = 0;
      var offsetY = 0;
      var index = 1;
      var opacityValue = 1;
      _.each( baseNumbers, function( baseNumber ) {
        var baseNumberImage = PaperImageCollection.getNumberImageNode( baseNumber );
        var baseNumberImageNode = new Image( baseNumberImage );
        imageNumberNode.addChild( baseNumberImageNode );
        baseNumberImageNode.opacity = opacityValue;
        baseNumberImageNode.left = offsetX;
        baseNumberImageNode.top = offsetY;
        thisNode.baseNumberPositions[ index ] = new Vector2( offsetX, offsetY );
        var offSetIndex = baseNumbers.length - index;
        offsetX += NUMBER_IMAGE_OFFSET_DIMENSIONS[ offSetIndex ].x;
        offsetY += NUMBER_IMAGE_OFFSET_DIMENSIONS[ offSetIndex ].y;
        index++;
        opacityValue = opacityValue - 0.04;
      } );

    } );

    paperNumberModel.positionProperty.link( function( newPos ) {
      imageNumberNode.leftTop = newPos;
    } );

    paperNumberModel.opacityProperty.link( function( opacity ) {
      console.log( opacity );
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
          var initialPosition = thisNode.determinePulledOutNumberPosition( thisHandler.amountToRemove, overAllDelta );
          var options = {
            opacity: 0.9
          };
          thisHandler.splitNumberModel = addNumberToModel( amountToRemove, initialPosition, options );
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
      //hardcoded - TODO
      //thisNode.baseNumberPositions[ 2 ] || thisNode.baseNumberPositions[ 1 ]
      return thisNode.leftTop.plus( delta );
    }
  } );
} );

