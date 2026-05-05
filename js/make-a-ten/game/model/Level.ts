// Copyright 2016-2026, University of Colorado Boulder

/**
 * Represents a game level. Contains information and the ability to generate challenges for the particular level.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import type NumberChallenge from './NumberChallenge.js';
import type NumberChallengeFactory from './NumberChallengeFactory.js';

class Level {
  /**
   * @param number - The number of the level, from 1 to 10
   * @param color - The color for the level
   * @param icon - Image to be shown as the icon for the level
   * @param description - Translated description to be shown in info and the status bar
   * @param numberChallengeFactory - For generating challenges
   */
  public constructor( number: number, color: string, icon: HTMLImageElement, description: string, numberChallengeFactory: NumberChallengeFactory ) {

    // @public {number} - The level number, from 1 to 10
    this.number = number;

    // @public {number} - The color of the level, used for backgrounds mostly
    this.color = color;

    // @public {Node} - A properly sized node for use as an icon representing the level
    this.iconNode = new Image( icon );

    // @public {string} - Translated description to be shown in info and the status bar
    this.description = description;

    // @public {Property.<number>} - The total score for this level
    this.scoreProperty = new NumberProperty( 0 );

    // @private {NumberChallengeFactory}
    this.numberChallengeFactory = numberChallengeFactory;
  }

  /**
   * Resets all of our mutable state to the initial values.
   */
  public reset(): void {
    this.scoreProperty.reset();
  }

  /**
   * Creates a NumberChallenge that should be used as the next challenge for this level.
   */
  public generateChallenge(): NumberChallenge {
    return this.numberChallengeFactory.generateChallenge( this.number - 1 );
  }
}

export default Level;
