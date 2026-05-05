// Copyright 2015-2026, University of Colorado Boulder

/**
 * Represents a challenge, that is presented to the user during the MakeATen game.
 * Each challenge has two terms. The values of which depends on the level of challenge
 *
 * @author Sharfudeen Ashraf
 */

class NumberChallenge {

  // The left-hand term for addition
  public readonly leftTerm: number;

  // The right-hand term for addition
  public readonly rightTerm: number;

  public constructor( leftTerm: number, rightTerm: number ) {
    this.leftTerm = leftTerm;

    this.rightTerm = rightTerm;

    // This object is immutable
    Object.freeze( this );
  }
}

export default NumberChallenge;
