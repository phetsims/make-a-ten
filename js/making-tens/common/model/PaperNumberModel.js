//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Represents a number ranging from 1 to 1999. This is the model class that user
 * drags,splits and combines based on certain arithmetic rules.
 *
 * All these numbers are built from a set of few base numbers
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var PaperImageCollection = require( 'MAKING_TENS/making-tens/common/model/PaperImageCollection' );

  // constants
  // how much 2 digit and single digit must offset from parent
  var NUMBER_IMAGE_OFFSET_DIMENSIONS = {
    0: new Vector2( 0, 0 ),
    1: new Vector2( 100, 22 ),// how much a single digit image has to offset
    2: new Vector2( 95, 50 )// how much a 2 digit has to offset from its parent (a 3 digit number)
  };

  /**
   *
   * @param {number} numberValue
   * @param {Vector2} initialPosition
   * @param {object} options
   * @constructor
   */
  function PaperNumberModel( numberValue, initialPosition, options ) {
    var thisModel = this;
    options = _.extend( { opacity: 1 }, options );

    PropertySet.call( this, {

      // number this paper model represents ex 324
      numberValue: numberValue,

      // Property that indicates where in model space the upper left corner of this shape is.  In general, this should
      // not be set directly outside of this type, and should only be manipulated through the methods defined below.
      position: initialPosition,

      // Flag that tracks whether the user is dragging this shape around.  Should be set externally, generally by the a
      // view node.
      userControlled: false,

      // Flag that indicates whether this element is animating from one location to another, should not be set externally.
      animating: false,

      // Value that indicates how faded out this shape is.  This is used as part of a feature where shapes can fade
      // out.  Once fade has started, it doesn't stop until it is fully faded, i.e. the value is 1.  This should not be
      // set externally.
      fadeProportion: 0,

      opacity: options.opacity

    } );

    // Destination is used for animation, and should be set through accessor methods only.
    thisModel.destination = initialPosition.copy(); // @private

    thisModel.baseNumbers = []; // for each of these base number, we have a corresponding image file
    thisModel.baseImages = [];
    thisModel.baseNumberPositions = {}; // the base number and its position within this composite node(made up may image nodes)

    thisModel.decomposeIntoBaseNumbers( this.numberValue );
  }

  return inherit( PropertySet, PaperNumberModel, {

    step: function( dt ) {

      if ( !this.userControlled ) {

        // perform any animation
        var distanceToDestination = this.position.distance( this.destination );
        if ( distanceToDestination > dt * MakingTensSharedConstants.ANIMATION_VELOCITY ) {
          // Move a step toward the destination.
          var stepAngle = Math.atan2( this.destination.y - this.position.y, this.destination.x - this.position.x );
          var stepVector = Vector2.createPolar( MakingTensSharedConstants.ANIMATION_VELOCITY * dt, stepAngle );
          this.position = this.position.plus( stepVector );
        }
        else if ( this.animating ) {
          // Less than one time step away, so just go to the destination.
          this.position = this.destination;
          this.animating = false;
        }

      }
    },

    /**
     * A number such as 238 will result in 200,30,8 as base numbers for which we have corresponding images
     *
     * @param {number} value
     */
    decomposeIntoBaseNumbers: function( value ) {
      var self = this;
      self.baseNumbers = [];
      var valueStr = value + "";
      var digits = valueStr.length;
      for ( var i = 0; i < digits; i++ ) {
        var charPos = valueStr.charAt( i );
        var posValue = (+charPos) * Math.pow( 10, digits - i - 1 );
        if ( (posValue + "").startsWith( "0" ) ) {
          continue;
        }
        this.baseNumbers.push( posValue + "" );
      }

      self.baseImages = [];
      self.baseNumberPositions = {};
      var offsetX = 0;
      var offsetY = 0;
      var index = 1;
      var opacityValue = 1;
      _.each( self.baseNumbers, function( baseNumber ) {
        var baseNumberImage = PaperImageCollection.getNumberImage( baseNumber );
        var baseNumberImageNode = new Image( baseNumberImage );
        baseNumberImageNode.opacity = opacityValue;
        baseNumberImageNode.left = offsetX;
        baseNumberImageNode.top = offsetY;
        self.baseNumberPositions[ index ] = new Vector2( offsetX, offsetY );
        self.baseImages.push( baseNumberImageNode );
        var offSetIndex = self.baseNumbers.length - index;
        offsetX += NUMBER_IMAGE_OFFSET_DIMENSIONS[ offSetIndex ].x;
        offsetY += NUMBER_IMAGE_OFFSET_DIMENSIONS[ offSetIndex ].y;
        index++;
        opacityValue = opacityValue - 0.04;
      } );


    },

    canPullApart: function() {
      return (this.numberValue !== 1);
    },


    /**
     * At which point the split must happen
     * @param newPulledNumber
     * @returns {Vector2}
     */
    getDigitOffsetPosition: function( newPulledNumber ) {
      var thisModel = this;

      //Multiples of 10 or 100 can be split from any position
      if ( thisModel.numberValue % 10 === 0 ) {
        return NUMBER_IMAGE_OFFSET_DIMENSIONS[ 0 ];
      }
      var digitDifference = (thisModel.numberValue + "").length - (newPulledNumber + "").length;
      return NUMBER_IMAGE_OFFSET_DIMENSIONS[ digitDifference ];
    },

    /**
     *
     * @param newNumber
     */
    changeNumber: function( newNumber ) {
      this.decomposeIntoBaseNumbers( newNumber );
      this.numberValue = newNumber;
      this.trigger( "changeValue" );
    },

    /**
     * @param {Vector2} destination
     * @param {boolean} animate
     */
    setDestination: function( destination, animate ) {
      this.destination = destination;
      if ( animate ) {
        this.animating = true;
      }
      else {
        this.position = destination;
      }
    },

    getWidth: function() {
      var self = this;
      var minX = _.min( self.baseNumberPositions, function( baseNumberPosition ) {
        return baseNumberPosition.x;
      } );

      var maxX = _.max( self.baseNumberPositions, function( baseNumberPosition ) {
        return baseNumberPosition.x;
      } );

      return (maxX - minX);
    },

    /**
     *
     * @param {Vector2} position
     * @param {Bounds2} draggedNodeBounds
     * @returns {number}
     */
    getNumberAt: function( position, draggedNodeBounds ) {
      if ( this.baseNumbers.length === 1 ) {
        return this.baseNumbers[ 0 ];
      }
      for ( var i = 0; i < this.baseNumberPositions - 1; i++ ) {
        if ( position.x >= this.baseNumberPositions[ i ].x && position <= this.baseNumberPositions[ i + 1 ].x ) {
          return this.baseNumbers[ i ];
        }
      }
      return this.numberValue;
    }
  } );

} );
