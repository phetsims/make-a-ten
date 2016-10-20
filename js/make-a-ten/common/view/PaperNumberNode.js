// Copyright 2015, University of Colorado Boulder

/**
 * Visual view of paper numbers (PaperNumber), with stacked images based on the digits of the number.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var ArithmeticRules = require( 'MAKE_A_TEN/make-a-ten/common/model/ArithmeticRules' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var image1 = require( 'image!MAKE_A_TEN/1.png' );
  var image2 = require( 'image!MAKE_A_TEN/2.png' );
  var image3 = require( 'image!MAKE_A_TEN/3.png' );
  var image4 = require( 'image!MAKE_A_TEN/4.png' );
  var image5 = require( 'image!MAKE_A_TEN/5.png' );
  var image6 = require( 'image!MAKE_A_TEN/6.png' );
  var image7 = require( 'image!MAKE_A_TEN/7.png' );
  var image8 = require( 'image!MAKE_A_TEN/8.png' );
  var image9 = require( 'image!MAKE_A_TEN/9.png' );
  var image10 = require( 'image!MAKE_A_TEN/10.png' );
  var image20 = require( 'image!MAKE_A_TEN/20.png' );
  var image30 = require( 'image!MAKE_A_TEN/30.png' );
  var image40 = require( 'image!MAKE_A_TEN/40.png' );
  var image50 = require( 'image!MAKE_A_TEN/50.png' );
  var image60 = require( 'image!MAKE_A_TEN/60.png' );
  var image70 = require( 'image!MAKE_A_TEN/70.png' );
  var image80 = require( 'image!MAKE_A_TEN/80.png' );
  var image90 = require( 'image!MAKE_A_TEN/90.png' );
  var image100 = require( 'image!MAKE_A_TEN/100.png' );
  var image200 = require( 'image!MAKE_A_TEN/200.png' );
  var image300 = require( 'image!MAKE_A_TEN/300.png' );
  var image400 = require( 'image!MAKE_A_TEN/400.png' );
  var image500 = require( 'image!MAKE_A_TEN/500.png' );
  var image600 = require( 'image!MAKE_A_TEN/600.png' );
  var image700 = require( 'image!MAKE_A_TEN/700.png' );
  var image800 = require( 'image!MAKE_A_TEN/800.png' );
  var image900 = require( 'image!MAKE_A_TEN/900.png' );
  var image1000 = require( 'image!MAKE_A_TEN/1000.png' );
  var image2000 = require( 'image!MAKE_A_TEN/2000.png' );
  var image3000 = require( 'image!MAKE_A_TEN/3000.png' );
  var image4000 = require( 'image!MAKE_A_TEN/4000.png' );
  var image5000 = require( 'image!MAKE_A_TEN/5000.png' );
  var image6000 = require( 'image!MAKE_A_TEN/6000.png' );
  var image7000 = require( 'image!MAKE_A_TEN/7000.png' );
  var image8000 = require( 'image!MAKE_A_TEN/8000.png' );
  var image9000 = require( 'image!MAKE_A_TEN/9000.png' );

  // constants
  var SPLIT_OPACITY_FACTOR = 5; // for a distance of 5 apply some transparency to make the split effect realistic
  var MIN_SPLIT_DISTANCE = 6;
  var DROP_BOUNDS_HEIGHT_PROPORTION = 0.35; // the bounds proportion within which if user drops a number, we can consider collapsing them
  var MIN_DISTANCE_DIFFERENCE_TO_COLLAPSE = 30;
  var PAPER_NUMBER_IMAGES = {
    1: image1, 2: image2, 3: image3,
    4: image4, 5: image5, 6: image6,
    7: image7, 8: image8, 9: image9,
    10: image10, 20: image20, 30: image30,
    40: image40, 50: image50, 60: image60,
    70: image70, 80: image80, 90: image90,
    100: image100, 200: image200, 300: image300,
    400: image400, 500: image500, 600: image600,
    700: image700, 800: image800, 900: image900,
    1000: image1000, 2000: image2000, 3000: image3000,
    4000: image4000, 5000: image5000, 6000: image6000,
    7000: image7000, 8000: image8000, 9000: image9000
  };

  /**
   *
   * @param {PaperNumber} paperNumber
   * @param {Property<Bounds2>} availableViewBoundsProperty
   * @param {Function<paperNumber>} addNumberModelCallback A callback to invoke when a  Number is  split
   * @param {Function<paperNumber,droppedPoint>} tryToCombineNumbers A callback to invoke when a Number is  combined
   * @constructor
   */
  function PaperNumberNode( paperNumber, availableViewBoundsProperty, addNumberModelCallback, tryToCombineNumbers ) {
    var self = this;
    this.paperNumber = paperNumber;
    this.availableViewBoundsProperty = availableViewBoundsProperty;
    Node.call( this );

    this.addNumberModelCallback = addNumberModelCallback || _.noop;
    tryToCombineNumbers = tryToCombineNumbers || _.noop;

    var imageNumberNode = new Node();
    this.addChild( imageNumberNode );

    paperNumber.numberValueProperty.link( function( newNumber ) {
      imageNumberNode.removeAllChildren();

      _.each( paperNumber.baseNumbers, function( baseNumberObj ) {
        var baseNumberImage = PaperNumberNode.getNumberImage( baseNumberObj.numberValue );
        var baseNumberImageNode = new Image( baseNumberImage );
        baseNumberImageNode.leftTop = baseNumberObj.position;
        baseNumberImageNode.imageOpacity = baseNumberObj.opacity;
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

    paperNumber.positionProperty.linkAttribute( this, 'leftTop' );
    paperNumber.opacityProperty.linkAttribute( imageNumberNode, 'imageOpacity' );

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
          totalBounds.width, totalBounds.height * MakeATenSharedConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION );

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
          movableObject.constrainPosition( availableViewBoundsProperty.value, newPosition );

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
        localNodeBounds.width, localNodeBounds.height * MakeATenSharedConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION );

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

  makeATen.register( 'PaperNumberNode', PaperNumberNode );

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
     * Find all nodes which are attachable to the dragged node. This method is called once the user ends the dragging.
     * @public
     *
     * @param {Array.<PaperNumberNode>} allPaperNumberNodes
     * @returns {Array}
     */
    findAttachableNodes: function( allPaperNumberNodes ) {
      var attachableNodeCandidates = allPaperNumberNodes.slice();
      arrayRemove( attachableNodeCandidates, this );

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

  }, {
    /**
     * Given a number, looks up the associated image.
     * @public
     *
     * @param {number} number
     * @returns {HTMLImageElement}
     */
    getNumberImage: function( number ) {
      return PAPER_NUMBER_IMAGES[ number ];
    }
  } );
} );
