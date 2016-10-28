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
  var Vector2 = require( 'DOT/Vector2' );
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
    options = _.extend( {
      opacity: 1
    }, options );

    // @public {number} - IDs required for map-like lookup, see https://github.com/phetsims/make-a-ten/issues/199
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

    // @public {Vector2} - Destination is used for animation, and should be set through accessor methods only.
    this.destination = initialPosition.copy(); // @private

    // @public {boolean} - Whether this element is animating from one location to another, do not set externally.
    this.animating = false;

    // @public {Array.<BaseNumber>} - Represents the non-zero place values in this number. 1034 will have three place
    //                                values, 4, 30 and 1000, which when summed will equal our number.
    this.baseNumbers = PaperNumber.getBaseNumbers( this.numberValueProperty.value );

    // @public {Emitter} - Fires when the user stops dragging a paper number.
    this.endDragEmitter = new Emitter();

    // @public {Emitter} - Fires when the animation towards our destination ends (we hit our destination).
    this.endAnimationEmitter = new Emitter();
  }

  makeATen.register( 'PaperNumber', PaperNumber );

  return inherit( Object, PaperNumber, {
    /**
     * Animates the number towards its destination.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      if ( !this.userControlledProperty.value ) {
        var currentPosition = this.positionProperty.value;

        // perform any animation
        var distanceToDestination = currentPosition.distance( this.destination );
        if ( distanceToDestination > dt * MakeATenConstants.ANIMATION_VELOCITY ) {
          // Move a step toward the destination.
          var stepVector = this.destination.minus( currentPosition ).setMagnitude( MakeATenConstants.ANIMATION_VELOCITY * dt );
          this.positionProperty.value = currentPosition.plus( stepVector );

        }
        else if ( this.animating ) {
          // Less than one time step away, so just go to the destination.
          this.positionProperty.value = this.destination;
          this.animating = false;
          this.endAnimationEmitter.emit1( this );
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
     * Returns the bounds of the paper number relative to the paper number's origin.
     * @public
     *
     * @returns {Bounds2}
     */
    getLocalBounds: function() {
      // Use the largest base number
      return this.baseNumbers[ this.baseNumbers.length - 1 ].bounds;
    },

    // TODO: doc
    getDragTargetOffset: function() {
      var bounds = this.getLocalBounds();

      var ratio = MakeATenConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION / 2;
      var x = bounds.centerX;
      var y = bounds.minY * ratio + bounds.maxY * ( 1 - ratio );

      return new Vector2( x, y );
    },

    /**
     * Changes the number that this paper number represents.
     * @public
     *
     * @param {number} numberValue
     */
    changeNumber: function( numberValue ) {
      assert && assert( typeof numberValue === 'number' );

      this.baseNumbers = PaperNumber.getBaseNumbers( numberValue );
      this.numberValueProperty.value = numberValue;
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
        this.positionProperty.value = destination;
      }
    },

    /**
     * If our paper number is outside of the available view bounds, move in inside those bounds.
     * @public
     *
     * @param {Bounds2} viewBounds
     * @param {Vector2} position
     * @param {boolean} [animate] - Indicates if the new constrained position should be directly set or animated
     */
    setConstrainedDestination: function( viewBounds, newDestination, animate ) {
      // Determine how our number's origin can be placed in the bounds
      var localBounds = this.getLocalBounds();
      var center = localBounds.center;

      var extraBottomPadding = 10;
      var originBounds = viewBounds.withMaxY( viewBounds.maxY - localBounds.height / 2 - extraBottomPadding )
                                   .shifted( -center.x, -center.y );
      this.setDestination( originBounds.closestPointTo( newDestination ), animate );
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

      // TODO: is this ever a problem?
      assert && assert( false, 'WARNING: outside number bounds' );

      return this.baseNumbers[ this.baseNumbers.length - 1 ];
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
