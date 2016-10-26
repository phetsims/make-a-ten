// Copyright 2015, University of Colorado Boulder

/**
 * Represents a number ranging from 1 to 1999. This is the model class that user
 * drags,splits and combines based on certain arithmetic rules.
 *
 * All these numbers are built from a set of few base numbers
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var Property = require( 'AXON/Property' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var BaseNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/BaseNumber' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );

  // Incremented for number IDs
  var nextPaperNumberId = 1;

  /**
   *
   * @param {number} numberValue
   * @param {Vector2} initialPosition
   * @param {Object} options
   * @constructor
   */
  function PaperNumber( numberValue, initialPosition, options ) {
    var self = this;

    // TODO: check if this is overridden
    options = _.extend( {
      opacity: 1
    }, options );

    // IDs required for map-like lookup, see https://github.com/phetsims/make-a-ten/issues/199
    this.id = nextPaperNumberId++;

    // @public {NumberProperty} - The number that this model represents, e.g. 324
    this.numberValueProperty = new NumberProperty( numberValue );

    // @public {Property.<Vector2>} - Property that indicates where in model space the upper left corner of this shape
    //                                is. In general, this should not be set directly outside of this type, and should
    //                                only be manipulated through the methods defined below.
    this.positionProperty = new Property( initialPosition.copy() );

    // @public {BooleanProperty} - Flag that tracks whether the user is dragging this number around. Should be set
    //                             externally, generally by the view node.
    this.userControlledProperty = new BooleanProperty( false );

    // @public {BooleanProperty} - Whether this element is animating from one location to another, do not set externally.
    this.animatingProperty = new BooleanProperty( false );

    // @public {NumberProperty}
    this.opacityProperty = new NumberProperty( options.opacity );

    // Destination is used for animation, and should be set through accessor methods only.
    this.destination = initialPosition.copy(); // @private


    // A number like 120 is composed of  to 2 number images in this simulation.
    // The baseNumber object represents the "parts"
    this.baseNumbers = [];

    this.animationVelocity = MakeATenConstants.ANIMATION_VELOCITY;

    this.baseNumbers = PaperNumber.getBaseNumbers( this.numberValueProperty.value );

    this.returnedToOriginEmitter = new Emitter();
    this.endDragEmitter = new Emitter();

    // Trigger an event whenever this shape returns to its original position.
    this.positionProperty.lazyLink( function( position ) {
      assert && assert( isFinite( position.y ) );
      if ( position.equals( initialPosition ) ) {
        self.returnedToOriginEmitter.emit();
      }
    } );
  }

  makeATen.register( 'PaperNumber', PaperNumber );

  return inherit( Object, PaperNumber, {
    /**
     *
     * @param {number} dt
     */
    step: function( dt ) {
      if ( !this.userControlledProperty.value ) {

        // perform any animation
        var distanceToDestination = this.positionProperty.value.distance( this.destination );
        if ( distanceToDestination > dt * this.animationVelocity ) {
          // Move a step toward the destination.
          var stepVector = this.destination.minus( this.positionProperty.value ).setMagnitude( this.animationVelocity * dt );
          this.positionProperty.value = this.positionProperty.value.plus( stepVector );

        }
        else if ( this.animatingProperty.value ) {
          // Less than one time step away, so just go to the destination.
          this.positionProperty.value = this.destination;
          this.animatingProperty.value = false;
        }

      }
    },

    get digitLength() {
      assert && assert( this.numberValueProperty.value > 0 );

      return MakeATenUtil.digitsInNumber( this.numberValueProperty.value );
    },

    canPullApart: function() {
      return this.numberValueProperty.value !== 1;
    },

    /**
     * returns the Dimensions of the Model (based on Image Size)
     * @returns {*}
     */
    getDimension: function() {
      return MakeATenConstants.PAPER_NUMBER_DIMENSIONS[ this.digitLength - 1 ];
    },

    /**
     * @param newNumber
     */
    changeNumber: function( newNumber ) {
      newNumber = +newNumber; // TODO: eek, cast?
      // TODO: reduce duplication with constructor
      this.baseNumbers = PaperNumber.getBaseNumbers( newNumber );
      this.numberValueProperty.value = newNumber;
    },

    /**
     * @param {Vector2} destination
     * @param {boolean} animate
     * @param {number} [animationVelocity]
     */
    setDestination: function( destination, animate, animationVelocity ) {
      this.destination = destination;
      this.animationVelocity = ( animationVelocity !== undefined ) ? animationVelocity : MakeATenConstants.ANIMATION_VELOCITY;

      if ( animate ) {
        this.animatingProperty.value = true;
      }
      else {
        this.positionProperty.value = destination;
      }
    },

    /**
     *
     * Make sure the paper number is within view Port
     * @param {Bounds2} viewBounds
     * @param {Vector2} position
     * @param {boolean} animate // (optional) indicates if the new constrained position should be directly set or animated
     */
    constrainPosition: function( viewBounds, newPosition, animate ) {
      var paperDimension = this.getDimension();
      var paperWidth = paperDimension.width;
      var paperHeight = paperDimension.height;
      var overAllBounds = Bounds2.rect( viewBounds.x - paperWidth / 2, viewBounds.y - paperHeight / 2,
        viewBounds.width, viewBounds.height - paperHeight / 2 );
      var newPos = overAllBounds.closestPointTo( newPosition );
      this.setDestination( newPos, animate );
    },

    /**
     * Return the shape to the place where it was originally created.
     * @param {boolean} animate
     * @param {number} [animationVelocity]
     */
    returnToOrigin: function( animate, animationVelocity ) {
      this.setDestination( this.positionProperty.initialValue, animate, animationVelocity );
    },

    /**
     * Returns the lowest place number whose bounds include the position.
     * @public
     *
     * @param {Vector2} position - Position relative to this number's origin.
     * @returns {BaseNumber}
     */
    getBaseNumberAt: function( position ) {
      for ( var i = 0; i < this.baseNumbers.length; i++ ) {
        assert && assert( i === 0 || this.baseNumbers[ i ].place > this.baseNumbers[ i - 1 ].place,
          'Ensure that we start at lower places, required for this to work properly' );

        var baseNumber = this.baseNumbers[ i ];

        if ( baseNumber.bounds.containsPoint( position ) ) {
          return baseNumber;
        }
      }

      // TODO: remove for production, or assert?
      console.log( 'WARNING: outside number bounds' );

      return this.baseNumbers[ this.baseNumbers.length - 1 ];
    },

    resetOpacity: function() {
      this.opacityProperty.reset();
    }

  }, {
    /**
     * Given a number, returns an array of BaseNumbers that will represent the digit places.
     * @public
     *
     * @param {number} number - The number we want to break into digit places.
     * @returns {Array.<BaseNumber>}
     */
    getBaseNumbers: function( number ) {
      assert && assert( number > 0 && number % 1 === 0 );

      var result = [];

      var remainder = number;
      var place = 0;
      while ( remainder ) {
        var digit = remainder % 10;
        if ( digit ) {
          result.push( new BaseNumber( digit, place ) );
        }

        remainder = ( remainder - digit ) / 10;
        place++;
      }

      return result;
    }
  } );
} );
