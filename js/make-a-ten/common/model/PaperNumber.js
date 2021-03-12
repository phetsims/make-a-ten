// Copyright 2015-2020, University of Colorado Boulder

/**
 * Represents a number ranging from 1 to 9999, that the user can interact with. Contains multiple "base numbers"
 * for each non-zero digit.
 *
 * @author Sharfudeen Ashraf
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../../dot/js/Vector2Property.js';
import makeATen from '../../../makeATen.js';
import MakeATenConstants from '../MakeATenConstants.js';
import MakeATenUtils from '../MakeATenUtils.js';
import BaseNumber from './BaseNumber.js';

// Incremented for PaperNumber IDs
let nextPaperNumberId = 1;

class PaperNumber {
  /**
   * @param {number} numberValue - Numeric value, e.g. 123
   * @param {Vector2} initialPosition
   */
  constructor( numberValue, initialPosition ) {
    // @public {number} - IDs required for map-like lookup, see https://github.com/phetsims/make-a-ten/issues/199
    this.id = nextPaperNumberId++;

    // @public {NumberProperty} - The number that this model represents, e.g. 324
    this.numberValueProperty = new NumberProperty( numberValue );

    // @public Property that indicates where in model space the upper left corner of this shape is. In general, this
    // should not be set directly outside of this type, and should be manipulated through the methods defined below.
    this.positionProperty = new Vector2Property( initialPosition.copy() );

    // @public {BooleanProperty} - Flag that tracks whether the user is dragging this number around. Should be set
    //                             externally, generally by the view node.
    this.userControlledProperty = new BooleanProperty( false );

    // @public {Vector2} - Destination is used for animation, and should be set through accessor methods only.
    this.destination = initialPosition.copy(); // @private

    // @public {boolean} - Whether this element is animating from one position to another, do not set externally.
    this.animating = false;

    // @public {Array.<BaseNumber>} - Represents the non-zero place values in this number. 1034 will have three place
    //                                values, 4, 30 and 1000, which when summed will equal our number.
    this.baseNumbers = PaperNumber.getBaseNumbers( this.numberValueProperty.value );

    // @public {Emitter} - Fires when the user stops dragging a paper number.
    this.endDragEmitter = new Emitter( { parameters: [ { valueType: PaperNumber } ] } );

    // @public {Emitter} - Fires when the animation towards our destination ends (we hit our destination).
    this.endAnimationEmitter = new Emitter( { parameters: [ { valueType: PaperNumber } ] } );
  }

  /**
   * Animates the number towards its destination.
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    if ( !this.userControlledProperty.value ) {
      const currentPosition = this.positionProperty.value;
      assert && assert( currentPosition.isFinite() );
      assert && assert( this.destination.isFinite() );

      // perform any animation
      const distanceToDestination = currentPosition.distance( this.destination );
      if ( distanceToDestination > dt * MakeATenConstants.ANIMATION_VELOCITY ) {
        // Move a step toward the destination.
        const stepVector = this.destination.minus( currentPosition ).setMagnitude( MakeATenConstants.ANIMATION_VELOCITY * dt );
        assert && assert( stepVector.isFinite() );
        this.positionProperty.value = currentPosition.plus( stepVector );

      }
      else if ( this.animating ) {
        // Less than one time step away, so just go to the destination.
        this.positionProperty.value = this.destination;
        this.animating = false;
        this.endAnimationEmitter.emit( this );
      }
    }
  }

  /**
   * The number of digits in the number, including zeros, e.g. 1204 has 4 digits.
   * @public
   *
   * @returns {number}
   */
  get digitLength() {
    assert && assert( this.numberValueProperty.value > 0 );

    return MakeATenUtils.digitsInNumber( this.numberValueProperty.value );
  }

  /**
   * Returns the bounds of the paper number relative to the paper number's origin.
   * @public
   *
   * @returns {Bounds2}
   */
  getLocalBounds() {
    // Use the largest base number
    return this.baseNumbers[ this.baseNumbers.length - 1 ].bounds;
  }

  /**
   * Locate the boundary between the "move" input area and "split" input area, in the number's local bounds.
   * @public
   *
   * @returns {Bounds2}
   */
  getBoundaryY() {
    const bounds = this.getLocalBounds();
    const moveToSplitRatio = MakeATenConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION;
    return bounds.maxY * ( 1 - moveToSplitRatio ) + bounds.minY * moveToSplitRatio;
  }

  /**
   * Returns the ideal spot to "drag" a number from (near the center of its move target) relative to its origin.
   * @public
   *
   * @returns {Vector2}
   */
  getDragTargetOffset() {
    const bounds = this.getLocalBounds();

    const ratio = MakeATenConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION / 2;
    return new Vector2( bounds.centerX, bounds.minY * ratio + bounds.maxY * ( 1 - ratio ) );
  }

  /**
   * Changes the number that this paper number represents.
   * @public
   *
   * @param {number} numberValue
   */
  changeNumber( numberValue ) {
    assert && assert( typeof numberValue === 'number' );

    this.baseNumbers = PaperNumber.getBaseNumbers( numberValue );
    this.numberValueProperty.value = numberValue;
  }

  /**
   * Sets the destination of the number. If animate is false, it also sets the position.
   * @public
   *
   * @param {Vector2} destination
   * @param {boolean} animate - Whether to animate. If true, it will slide towards the destination. If false, it will
   *                            immediately set the position to be the same as the destination.
   */
  setDestination( destination, animate ) {
    assert && assert( destination.isFinite() );

    this.destination = destination;

    if ( animate ) {
      this.animating = true;
    }
    else {
      this.positionProperty.value = destination;
    }
  }

  /**
   * If our paper number is outside of the available view bounds, move in inside those bounds.
   * @public
   *
   * @param {Bounds2} viewBounds
   * @param {Vector2} position
   * @param {boolean} [animate] - Indicates if the new constrained position should be directly set or animated
   */
  setConstrainedDestination( viewBounds, newDestination, animate ) {
    // Determine how our number's origin can be placed in the bounds
    const localBounds = this.getLocalBounds();
    const padding = 10;
    const originBounds = new Bounds2( viewBounds.left - localBounds.left,
      viewBounds.top - localBounds.top,
      viewBounds.right - localBounds.right,
      viewBounds.bottom - localBounds.bottom ).eroded( padding );
    this.setDestination( originBounds.closestPointTo( newDestination ), animate );
  }

  /**
   * Returns the lowest place number whose bounds include the position.
   * @public
   *
   * @param {Vector2} position - Position relative to this number's origin.
   * @returns {BaseNumber}
   */
  getBaseNumberAt( position ) {
    for ( let i = 0; i < this.baseNumbers.length; i++ ) {
      assert && assert( i === 0 || this.baseNumbers[ i ].place > this.baseNumbers[ i - 1 ].place,
        'Ensure that we start at lower places, required for this to work properly' );

      const baseNumber = this.baseNumbers[ i ];

      if ( baseNumber.bounds.containsPoint( position ) ) {
        return baseNumber;
      }
    }

    // Outside of the bounds, so we need to check each and determine the closest.
    for ( let i = 0; i < this.baseNumbers.length; i++ ) {
      const baseNumber = this.baseNumbers[ i ];
      if ( position.x > baseNumber.bounds.left ) {
        return baseNumber;
      }
    }

    // Default the largest one.
    return this.baseNumbers[ this.baseNumbers.length - 1 ];
  }

  /**
   * Given a number, returns an array of BaseNumbers that will represent the digit places.
   * @public
   *
   * @param {number} number - The number we want to break into digit places.
   * @returns {Array.<BaseNumber>}
   */
  static getBaseNumbers( number ) {
    assert && assert( number > 0 && number % 1 === 0 );

    const result = [];

    // Divide by 10 each loop, using the remainder and place index to create the place numbers.
    let remainder = number;
    let place = 0;
    while ( remainder ) {
      const digit = remainder % 10;
      if ( digit ) {
        result.push( new BaseNumber( digit, place ) );
      }

      remainder = ( remainder - digit ) / 10;
      place++;
    }

    return result;
  }

  /**
   * Returns whether the two paper numbers are close enough to be "attached" to each other.
   * @public
   *
   * @param {PaperNumber} paperNumber1
   * @param {PaperNumber} paperNumber2
   * @returns {boolean}
   */
  static arePaperNumbersAttachable( paperNumber1, paperNumber2 ) {
    const firstLarger = paperNumber1.numberValueProperty.value > paperNumber2.numberValueProperty.value;
    const largePaperNumber = firstLarger ? paperNumber1 : paperNumber2;
    const smallPaperNumber = firstLarger ? paperNumber2 : paperNumber1;

    const smallCenter = smallPaperNumber.positionProperty.value.plus( smallPaperNumber.getLocalBounds().center );
    const largePosition = largePaperNumber.positionProperty.value;
    const largeBounds = largePaperNumber.getLocalBounds().shiftedXY( largePosition.x, largePosition.y );

    const unitX = ( smallCenter.x - largeBounds.centerX ) / ( largeBounds.width / 2 );
    const unitY = ( smallCenter.y - largeBounds.centerY ) / ( largeBounds.height / 2 );

    return unitX * unitX + 2 * unitY * unitY < 1;
  }
}

makeATen.register( 'PaperNumber', PaperNumber );

export default PaperNumber;
