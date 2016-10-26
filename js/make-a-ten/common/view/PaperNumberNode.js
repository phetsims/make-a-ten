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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var ArithmeticRules = require( 'MAKE_A_TEN/make-a-ten/common/model/ArithmeticRules' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
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
   * @param {Function<Event,number,Vector2>} createAndDragNumber - Returns a new PaperNumberNode reference.
   * @param {Function<>} tryToCombineNumbers - Called with no arguments to try to combine our paper number.
   * @constructor
   */
  function PaperNumberNode( paperNumber, availableViewBoundsProperty, createAndDragNumber, tryToCombineNumbers ) {
    var self = this;

    Node.call( this );

    this.paperNumber = paperNumber;

    // @private {Bounds2}
    this.availableViewBoundsProperty = availableViewBoundsProperty;

    this.numberImageContainer = new Node( {
      pickable: false
    } );
    this.addChild( this.numberImageContainer );

    this.splitTarget = new Rectangle( 0, 0, 100, 100, {
      cursor: 'pointer'
    } );
    this.addChild( this.splitTarget );

    this.moveTarget = new Rectangle( 0, 0, 100, 100, {
      cursor: 'move'
    } );
    this.addChild( this.moveTarget );

    var dragOffset;
    this.moveDragHandler = new SimpleDragHandler( {
      start: function( event, trail ) {
        paperNumber.userControlledProperty.value = true;

        var viewPosition = self.globalToParentPoint( event.pointer.point );
        dragOffset = paperNumber.positionProperty.value.minus( viewPosition );
      },

      drag: function( event, trail ) {
        var viewPosition = self.globalToParentPoint( event.pointer.point );

        // TODO: can we do a more direct set, without having to go through the animation bit?
        paperNumber.setConstrainedDestination( availableViewBoundsProperty.value, dragOffset.plus( viewPosition ) );
      },

      end: function( event, trail ) {
        paperNumber.userControlledProperty.value = false;

        tryToCombineNumbers();
        paperNumber.endDragEmitter.emit(); // TODO: why is this needed?
      }
    } );
    this.moveTarget.addInputListener( this.moveDragHandler );

    this.splitTarget.addInputListener( {
      down: function( event ) {
        // Ignore non-left mouse buttons
        if ( event.pointer.isMouse && event.domEvent && event.domEvent.button !== 0 ) {
          return;
        }

        var viewPosition = self.globalToParentPoint( event.pointer.point );

        // Determine how much (if any) gets moved off
        var pulledPlace = paperNumber.getBaseNumberAt( self.parentToLocalPoint( viewPosition ) ).place;
        var amountToRemove = ArithmeticRules.pullApartNumbers( paperNumber.numberValueProperty.value, pulledPlace );
        var amountRemaining = paperNumber.numberValueProperty.value - amountToRemove;

        // it cannot be split - so start moving
        if ( !amountToRemove ) {
          // TODO: can this actually happen?
          self.moveDragHandler.tryToSnag( event );
          return;
        }

        paperNumber.changeNumber( amountRemaining );
        createAndDragNumber( event, amountToRemove, viewPosition );
      }
    } );

    this.paperNumber.numberValueProperty.link( this.onNumberChange.bind( this ) );

    paperNumber.positionProperty.linkAttribute( this, 'translation' );

    // TODO: why are we setting this on ourself? Node's imageOpacity doesn't do anything?
    paperNumber.opacityProperty.linkAttribute( this, 'imageOpacity' );

    // @private {function} - Listener reference that gets attached/detached. Handles moving the Node to the front.
    this.userControlledListener = this.onUserControlledChange.bind( this );
  }

  makeATen.register( 'PaperNumberNode', PaperNumberNode );

  return inherit( Node, PaperNumberNode, {
    onNumberChange: function() {
      var self = this;

      this.numberImageContainer.removeAllChildren();

      var numBaseNumbers = this.paperNumber.baseNumbers.length;
      _.each( this.paperNumber.baseNumbers, function( baseNumber, index ) {
        var baseNumberImage = PaperNumberNode.getNumberImage( baseNumber.numberValue );
        var baseNumberImageNode = new Image( baseNumberImage );
        baseNumberImageNode.translation = baseNumber.offset;

        // Bottom number has full opacity, and each successive number has *0.97 the opacity.
        baseNumberImageNode.imageOpacity = Math.pow( 0.97, numBaseNumbers - index - 1 );
        self.numberImageContainer.insertChild( 0, baseNumberImageNode );
      } );

      var fullBounds = this.paperNumber.baseNumbers[ this.paperNumber.baseNumbers.length - 1 ].bounds;

      if ( this.paperNumber.numberValueProperty.value === 1 ) {
        self.splitTarget.visible = false;
        self.moveTarget.mouseArea = self.moveTarget.touchArea = self.moveTarget.rectBounds = fullBounds;
      }
      else {
        self.splitTarget.visible = true;

        // Locate the boundary between the "move" input area and "split" input area.
        var moveToSplitRatio = MakeATenConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION;
        var boundaryY = fullBounds.maxY * ( 1 - moveToSplitRatio ) + fullBounds.minY * moveToSplitRatio;

        // Modify our move/split targets
        self.moveTarget.mouseArea = self.moveTarget.touchArea = self.moveTarget.rectBounds = fullBounds.withMinY( boundaryY );
        self.splitTarget.mouseArea = self.splitTarget.touchArea = self.splitTarget.rectBounds = fullBounds.withMaxY( boundaryY );
      }
    },

    /**
     * When our model becomes user-controlled, move our node to the front.
     * @private
     */
    onUserControlledChange: function() {
      if ( this.paperNumber.userControlledProperty.value ) {
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
      return this.leftTop.copy(); // TODO: is this needed?
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
        var isOpposite = this.paperNumber.numberValueProperty.value > droppedNode.paperNumber.numberValueProperty.value;
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
