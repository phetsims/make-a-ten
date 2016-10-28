// Copyright 2015, University of Colorado Boulder

/**
 * Common move/split cue model.
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
  var FADE_SPEED = 0.5;

  // state enumeration for the cue
  var CueState = Object.freeze( {
    UNATTACHED: 'UNATTACHED',
    ATTACHED: 'ATTACHED',
    FADING: 'FADING',
    FADED: 'FADED'
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

    // @private {CueState}
    this.state = CueState.UNATTACHED;
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
      if ( this.state === CueState.FADING ) {
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
      if ( this.state === CueState.FADED ) { return; }

      this.state = ( this.state === CueState.FADING ) ? this.state : CueState.ATTACHED;
      this.paperNumberProperty.value = paperNumber;
      this.visibilityProperty.value = true;
    },

    /**
     * Detach from the current paper number, without fading.
     * @public
     */
    detach: function() {
      if ( this.state === CueState.FADED ) { return; }

      if ( this.state === CueState.FADING ) {
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
      if ( this.state === CueState.ATTACHED ) {
        this.state = CueState.FADING;
      }
      else if ( this.state === CueState.UNATTACHED ) {
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
      this.state = CueState.UNATTACHED;
      this.visibilityProperty.value = false;
      this.opacityProperty.value = 1;
      this.paperNumberProperty.value = null;
    },

    /**
     * Changes to a fully-faded state
     * @private
     */
    changeToFaded: function() {
      this.state = CueState.FADED;
      this.visibilityProperty.value = false;
      this.opacityProperty.value = 1;
      this.paperNumberProperty.value = null;
    }
  } );
} );
