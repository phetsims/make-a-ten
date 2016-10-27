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
   * @constructor
   *
   * @param {PaperNumber} paperNumber
   * @param {Property.<Bounds2>} availableViewBoundsProperty
   * @param {Function} createAndDragNumber - function( event, numberValue, viewPosition ), creates a new dragged number.
   * @param {Function} tryToCombineNumbers - function(), called with no arguments to try to combine our paper number.
   */
  function PaperNumberNode( paperNumber, availableViewBoundsProperty, createAndDragNumber, tryToCombineNumbers ) {
    var self = this;

    Node.call( this );

    // @public {PaperNumber} - Our model
    this.paperNumber = paperNumber;

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
    var dragOffset;
    // @public {SimpleDragHandler} - TODO: Can we add a function for hooking, instead of leaving public?
    this.moveDragHandler = new SimpleDragHandler( {
      start: function( event, trail ) {
        paperNumber.userControlledProperty.value = true;

        // Record our initial offset (where on the paper number the pointer is).
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

    this.paperNumber.numberValueProperty.link( this.updateNumber.bind( this ) );

    // Hook model position to view position
    paperNumber.positionProperty.linkAttribute( this, 'translation' );

    // @private {function} - Listener reference that gets attached/detached. Handles moving the Node to the front.
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
        return new Image( PaperNumberNode.getNumberImage( baseNumber.numberValue ), {
          translation: baseNumber.offset,
          imageOpacity: 0.95 * Math.pow( 0.97, index ) // each number has successively less opacity on top
        } );
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
        var moveToSplitRatio = MakeATenConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION;
        var boundaryY = fullBounds.maxY * ( 1 - moveToSplitRatio ) + fullBounds.minY * moveToSplitRatio;

        // Modify our move/split targets
        self.moveTarget.mouseArea = self.moveTarget.touchArea = self.moveTarget.rectBounds = fullBounds.withMinY( boundaryY );
        self.splitTarget.mouseArea = self.splitTarget.touchArea = self.splitTarget.rectBounds = fullBounds.withMaxY( boundaryY );
      }
    },

    /**
     * Attaches listeners to the model. Should be called when added to the scene graph.
     * @public
     */
    attachListeners: function() {
      // TODO: checks for leaks
      this.paperNumber.userControlledProperty.link( this.userControlledListener );
    },

    /**
     * Removes listeners from the model. Should be called when removed from the scene graph.
     * @public
     */
    detachListeners: function() {
      // TODO: checks for leaks
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
      // TODO: Can we do this in the model?
      var attachableNodeCandidates = allPaperNumberNodes.slice();
      arrayRemove( attachableNodeCandidates, this );

      var currentPosition = this.paperNumber.positionProperty.value;
      return attachableNodeCandidates.filter( function( candidateNode ) {
        var distance = currentPosition.distance( candidateNode.paperNumber.positionProperty.value );
        return distance < 70;
      } );
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
