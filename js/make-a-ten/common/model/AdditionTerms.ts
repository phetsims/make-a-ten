// Copyright 2016-2026, University of Colorado Boulder

/**
 * Model for the terms in the addition "leftTerm + rightTerm =".
 *
 * @author Sharfudeen Ashraf
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Property from '../../../../../axon/js/Property.js';
import ActiveTerm from '../../adding/model/ActiveTerm.js';

class AdditionTerms {

  // The left-hand term for the addition.
  public readonly leftTermProperty: NumberProperty;

  // The left-hand term for the addition.
  public readonly rightTermProperty: NumberProperty;

  // The active term being edited (left, right or none basically)
  public readonly activeTermProperty: Property<ActiveTerm>;

  public constructor() {
    this.leftTermProperty = new NumberProperty( 0 );

    this.rightTermProperty = new NumberProperty( 0 );

    this.activeTermProperty = new Property<ActiveTerm>( 'NONE' );
  }

  /**
   * Returns whether both of the terms have non-zero values (and are not being edited).
   */
  public hasBothTerms(): boolean {
    return this.activeTermProperty.value === 'NONE' && this.leftTermProperty.value > 0 && this.rightTermProperty.value > 0;
  }

  /**
   * Reset all of the terms
   */
  public reset(): void {
    this.leftTermProperty.reset();
    this.rightTermProperty.reset();
    this.activeTermProperty.reset();
  }
}

export default AdditionTerms;
