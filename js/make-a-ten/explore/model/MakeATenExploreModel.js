// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model for the Explore screen in Make a Ten. Includes the total, cues, and adding in initial numbers.
 *
 * @author Sharfudeen Ashraf
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import makeATen from '../../../makeATen.js';
import MakeATenQueryParameters from '../../common/MakeATenQueryParameters.js';
import MakeATenCommonModel from '../../common/model/MakeATenCommonModel.js';
import Cue from './Cue.js';

class MakeATenExploreModel extends MakeATenCommonModel {
  constructor() {

    super();

    // @public {NumberProperty} - The total sum of the current numbers
    this.sumProperty = new NumberProperty( 0 );

    // @public {Cue} - Visually indicates numbers can be split (pulled apart)
    this.splitCue = new Cue();

    // @private {Function} - To be called when we need to recalculate the total
    const calculateTotalListener = this.calculateTotal.bind( this );

    this.paperNumbers.lengthProperty.link( calculateTotalListener );

    // Listen to number changes of paper numbers
    this.paperNumbers.addItemAddedListener( paperNumber => {
      paperNumber.numberValueProperty.link( calculateTotalListener );
    } );
    this.paperNumbers.addItemRemovedListener( paperNumber => {
      paperNumber.numberValueProperty.unlink( calculateTotalListener );
    } );

    this.addInitialNumbers();
  }

  /**
   * Steps forward in time
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    super.step( dt );

    // Cap large dt values, which can occur when the tab containing
    // the sim had been hidden and then re-shown
    dt = Math.min( 0.1, dt );

    // Animate fading if necessary
    this.splitCue.step( dt );
  }

  /**
   * Updates the total sum of the paper numbers.
   * @private
   */
  calculateTotal() {
    let total = 0;
    this.paperNumbers.forEach( paperNumber => {
      total += paperNumber.numberValueProperty.value;
    } );
    this.sumProperty.value = total;
  }

  /**
   * Adds any required initial numbers.
   * @private
   */
  addInitialNumbers() {
    // Check for an array of numbers, e.g. ?exploreNumbers=10,51, where 0 indicates none
    this.addMultipleNumbers( MakeATenQueryParameters.exploreNumbers );

    // Attach cues to any available numbers
    this.paperNumbers.forEach( paperNumber => {
      if ( paperNumber.numberValueProperty.value > 1 ) {
        this.splitCue.attachToNumber( paperNumber );
      }
    } );
  }

  /**
   * Resets values to their original state
   * @public
   * @override
   */
  reset() {
    super.reset();

    this.sumProperty.reset();
    this.splitCue.reset();
    this.addInitialNumbers();
  }
}

makeATen.register( 'MakeATenExploreModel', MakeATenExploreModel );

export default MakeATenExploreModel;