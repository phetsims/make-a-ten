// Copyright 2015, University of Colorado Boulder

/**
 * Common move/split cue model. The cue represents a visual indicator that sticks to a paper number, and lets the user
 * know they can do an operation. It will fade away when the operation is performed, but will return upon reset all.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  var FADE_SPEED = 0.8;

  // state enumeration for the cue
  var CueState = Object.freeze( {
    UNATTACHED: 'UNATTACHED', // "not faded, but not visible"
    ATTACHED: 'ATTACHED', // "on a number, but not fading"
    FADING: 'FADING', // "on a number, but fading"
    FADED: 'FADED' // "faded, will not return until reset all"
  } );

  /**
   * @constructor
   */
  function Cue() {
    // @public {Property.<PaperNumber|null>} - What PaperNumber the cue is attached to.
    this.paperNumberProperty = new Property( null );

    // @public {BooleanProperty} - Whether the cue should be visible at all
    this.visibilityProperty = new BooleanProperty( false );

    // @public {NumberProperty} - What the visibility of the cue shoudl be.
    this.opacityProperty = new NumberProperty( 1 );

    // @private {Property.<CueState>}
    this.stateProperty = new Property( CueState.UNATTACHED );
  }

  makeATen.register( 'Cue', Cue );

  return inherit( Object, Cue, {
    /**
     * Step the cue (handle opacity if fading).
     * @public
     *
     * @param {number} dt - Changed model time
     */
    step: function( dt ) {
      if ( this.stateProperty.value === CueState.FADING ) {
        // Fade
        this.opacityProperty.value = Math.max( 0, this.opacityProperty.value - FADE_SPEED * dt );

        // If fully done, change to faded
        if ( !this.opacityProperty.value ) {
          this.changeToFaded();
        }
      }
    },

    /**
     * Attaches the cue to the number (if it hasn't faded fully).
     * @public
     *
     * @param {PaperNumber} paperNumber
     */
    attachToNumber: function( paperNumber ) {
      if ( this.stateProperty.value === CueState.FADED ) { return; }

      this.stateProperty.value = ( this.stateProperty.value === CueState.FADING ) ? this.stateProperty.value : CueState.ATTACHED;
      this.paperNumberProperty.value = paperNumber;
      this.visibilityProperty.value = true;
    },

    /**
     * Detach from the current paper number, without fading.
     * @public
     */
    detach: function() {
      if ( this.stateProperty.value === CueState.FADED ) { return; }

      if ( this.stateProperty.value === CueState.FADING ) {
        this.changeToFaded();
      }
      else {
        this.changeToUnattached();
      }
    },

    /**
     * The cue will start fading if it hasn't started (or completed) fading already.
     * @public
     */
    triggerFade: function() {
      if ( this.stateProperty.value === CueState.ATTACHED ) {
        this.stateProperty.value = CueState.FADING;
      }
      else if ( this.stateProperty.value === CueState.UNATTACHED ) {
        // If we're not attached, just immediately switch to fully faded.
        this.changeToFaded();
      }
    },

    /**
     * Resets the cue to the intial state.
     * @public
     */
    reset: function() {
      this.changeToUnattached();
    },

    /**
     * Changes to an unattached state
     * @private
     */
    changeToUnattached: function() {
      this.stateProperty.value = CueState.UNATTACHED;
      this.visibilityProperty.value = false;
      this.opacityProperty.value = 1;
      this.paperNumberProperty.value = null;
    },

    /**
     * Changes to a fully-faded state
     * @private
     */
    changeToFaded: function() {
      this.stateProperty.value = CueState.FADED;
      this.visibilityProperty.value = false;
      this.opacityProperty.value = 1;
      this.paperNumberProperty.value = null;
    }
  } );
} );