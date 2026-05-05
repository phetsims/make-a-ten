// Copyright 2016-2026, University of Colorado Boulder

/**
 * Common move/split cue model. The cue represents a visual indicator that sticks to a counting object, and lets the user
 * know they can do an operation. It will fade away when the operation is performed, but will return upon reset all.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import type CountingObject from '../../../../counting-common/js/common/model/CountingObject.js';

// constants
const FADE_SPEED = 0.8;

class Cue {

  // What CountingObject the cue is attached to.
  public readonly countingObjectProperty: Property<CountingObject | null>;

  // Whether the cue should be visible at all
  public readonly visibilityProperty: BooleanProperty;

  // What the visibility of the cue should be.
  public readonly opacityProperty: NumberProperty;

  private readonly stateProperty: Property<string>;

  public constructor() {
    this.countingObjectProperty = new Property<CountingObject | null>( null );

    this.visibilityProperty = new BooleanProperty( false );

    this.opacityProperty = new NumberProperty( 1 );

    this.stateProperty = new Property( 'UNATTACHED' );
  }

  /**
   * Step the cue (handle opacity if fading).
   *
   * @param dt - Changed model time
   */
  public step( dt: number ): void {
    if ( this.stateProperty.value === 'FADING' ) {
      // Fade
      this.opacityProperty.value = Math.max( 0, this.opacityProperty.value - FADE_SPEED * dt );

      // If fully done, change to faded
      if ( !this.opacityProperty.value ) {
        this.changeToFaded();
      }
    }
  }

  /**
   * Attaches the cue to the number (if it hasn't faded fully).
   */
  public attachToNumber( countingObject: CountingObject ): void {
    if ( this.stateProperty.value === 'FADED' ) { return; }

    this.stateProperty.value = ( this.stateProperty.value === 'FADING' ) ? this.stateProperty.value : 'ATTACHED';
    this.countingObjectProperty.value = countingObject;
    this.visibilityProperty.value = true;
  }

  /**
   * Detach from the current counting object, without fading.
   */
  public detach(): void {
    if ( this.stateProperty.value === 'FADED' ) { return; }

    if ( this.stateProperty.value === 'FADING' ) {
      this.changeToFaded();
    }
    else {
      this.changeToUnattached();
    }
  }

  /**
   * The cue will start fading if it hasn't started (or completed) fading already.
   */
  public triggerFade(): void {
    if ( this.stateProperty.value === 'ATTACHED' ) {
      this.stateProperty.value = 'FADING';
    }
    else if ( this.stateProperty.value === 'UNATTACHED' ) {
      // If we're not attached, just immediately switch to fully faded.
      this.changeToFaded();
    }
  }

  /**
   * Resets the cue to the initial state.
   */
  public reset(): void {
    this.changeToUnattached();
  }

  /**
   * Changes to an unattached state
   */
  private changeToUnattached(): void {
    this.stateProperty.value = 'UNATTACHED';
    this.visibilityProperty.value = false;
    this.opacityProperty.value = 1;
    this.countingObjectProperty.value = null;
  }

  /**
   * Changes to a fully-faded state
   */
  private changeToFaded(): void {
    this.stateProperty.value = 'FADED';
    this.visibilityProperty.value = false;
    this.opacityProperty.value = 1;
    this.countingObjectProperty.value = null;
  }
}

export default Cue;
