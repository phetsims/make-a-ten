// Copyright 2015-2021, University of Colorado Boulder

/**
 * Model for the game screen of Make a Ten.
 *
 * @author Sharfudeen Ashraf
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Property from '../../../../../axon/js/Property.js';
import CountingCommonModel from '../../../../../counting-common/js/common/model/CountingCommonModel.js';
import levelIcon10 from '../../../../images/level-10_png.js';
import levelIcon1 from '../../../../images/level-1_png.js';
import levelIcon2 from '../../../../images/level-2_png.js';
import levelIcon3 from '../../../../images/level-3_png.js';
import levelIcon4 from '../../../../images/level-4_png.js';
import levelIcon5 from '../../../../images/level-5_png.js';
import levelIcon6 from '../../../../images/level-6_png.js';
import levelIcon7 from '../../../../images/level-7_png.js';
import levelIcon8 from '../../../../images/level-8_png.js';
import levelIcon9 from '../../../../images/level-9_png.js';
import makeATen from '../../../makeATen.js';
import makeATenStrings from '../../../makeATenStrings.js';
import AdditionTerms from '../../common/model/AdditionTerms.js';
import GameState from './GameState.js';
import Level from './Level.js';
import NumberChallengeFactory from './NumberChallengeFactory.js';

// Level descriptions
const level10DescriptionString = makeATenStrings.level10Description;
const level1DescriptionString = makeATenStrings.level1Description;
const level2DescriptionString = makeATenStrings.level2Description;
const level3DescriptionString = makeATenStrings.level3Description;
const level4DescriptionString = makeATenStrings.level4Description;
const level5DescriptionString = makeATenStrings.level5Description;
const level6DescriptionString = makeATenStrings.level6Description;
const level7DescriptionString = makeATenStrings.level7Description;
const level8DescriptionString = makeATenStrings.level8Description;
const level9DescriptionString = makeATenStrings.level9Description;

// Level icons

class MakeATenGameModel extends CountingCommonModel {
  constructor() {
    super();

    // Created here, since due to the initialization of dotRandom to support PhET-iO, we need to delay until the model
    // is created (can't do at static load time), thus we have a separate challenge factory.
    const numberChallengeFactory = new NumberChallengeFactory();

    // @public {Array.<Level>} - All of the game levels for this screen.
    this.levels = [
      new Level( 1, '#FC4280', levelIcon1, level1DescriptionString, numberChallengeFactory ),
      new Level( 2, '#FC4280', levelIcon2, level2DescriptionString, numberChallengeFactory ),
      new Level( 3, '#FC4280', levelIcon3, level3DescriptionString, numberChallengeFactory ),
      new Level( 4, '#06A5AD', levelIcon4, level4DescriptionString, numberChallengeFactory ),
      new Level( 5, '#06A5AD', levelIcon5, level5DescriptionString, numberChallengeFactory ),
      new Level( 6, '#06A5AD', levelIcon6, level6DescriptionString, numberChallengeFactory ),
      new Level( 7, '#06A5AD', levelIcon7, level7DescriptionString, numberChallengeFactory ),
      new Level( 8, '#9778CC', levelIcon8, level8DescriptionString, numberChallengeFactory ),
      new Level( 9, '#9778CC', levelIcon9, level9DescriptionString, numberChallengeFactory ),
      new Level( 10, '#9778CC', levelIcon10, level10DescriptionString, numberChallengeFactory )
    ];

    // @public {Property.<Level>} - The current level
    this.currentLevelProperty = new Property( this.levels[ 0 ] );

    // @public {NumberProperty} - The score for whatever the current level is.
    this.currentScoreProperty = new NumberProperty( 0 );

    // @public {Property.<NumberChallenge|null>} - The current challenge when in a level
    this.currentChallengeProperty = new Property( null );

    // @public {Property.<GameState>} - Current game state
    this.gameStateProperty = new Property( GameState.CHOOSING_LEVEL );

    // @public {AdditionTerms} - Our left and right terms to be added.
    this.additionTerms = new AdditionTerms();

    // Check for when the challenge is completed
    this.paperNumbers.lengthProperty.link( ( newLength, oldLength ) => {
      // Check oldLength to make sure it's not from the paper numbers just added.
      if ( newLength === 1 && oldLength === 2 && this.gameStateProperty.value === GameState.PRESENTING_INTERACTIVE_CHALLENGE ) { // The user has added the two numbers, trigger success state
        this.gameStateProperty.value = GameState.CORRECT_ANSWER;
      }
    } );

    // Keep our currentScore updated when the level changes.
    this.currentLevelProperty.link( level => {
      this.currentScoreProperty.value = level.scoreProperty.value;
    } );

    // Keep our currentScore updated when our current level's score changes.
    this.levels.forEach( level => {
      level.scoreProperty.link( score => {
        if ( level === this.currentLevelProperty.value ) {
          this.currentScoreProperty.value = score;
        }
      } );
    } );
  }

  /**
   * Starts a new challenge with the level specified
   * @public
   *
   * @param {Level} level
   */
  startLevel( level ) {
    this.removeAllPaperNumbers();

    this.currentLevelProperty.value = level;

    // Set up the model for the next challenge
    this.currentChallengeProperty.value = level.generateChallenge();

    // Change to new game state.
    this.gameStateProperty.value = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
  }

  /**
   * Increments the score of the current level.
   * @public
   */
  incrementScore() {
    this.currentLevelProperty.value.scoreProperty.value++;
  }

  /**
   * Moves to the next challenge (the current challenge's solution was correct).
   * @public
   */
  moveToNextChallenge() {
    this.removeAllPaperNumbers();

    this.currentChallengeProperty.value = this.currentLevelProperty.value.generateChallenge();
    this.gameStateProperty.value = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
  }

  /**
   * Moves back to the level selection.
   * @public
   */
  moveToChoosingLevel() {
    this.gameStateProperty.value = GameState.CHOOSING_LEVEL;
  }

  /**
   * Creates paper numbers for the specified challenge.
   * @public
   *
   * @param {NumberChallenge} numberChallenge
   */
  setupChallenge( numberChallenge ) {
    this.removeAllPaperNumbers();
    this.additionTerms.leftTermProperty.value = numberChallenge.leftTerm;
    this.additionTerms.rightTermProperty.value = numberChallenge.rightTerm;
    this.addMultipleNumbers( [ numberChallenge.leftTerm, numberChallenge.rightTerm ] );
  }

  /**
   * Resets our game model.
   * @public
   */
  reset() {
    super.reset();

    this.currentLevelProperty.reset();
    this.currentScoreProperty.reset();
    this.currentChallengeProperty.reset();
    this.gameStateProperty.reset();

    for ( let i = 0; i < this.levels.length; i++ ) {
      this.levels[ i ].reset();
    }
  }
}

makeATen.register( 'MakeATenGameModel', MakeATenGameModel );

export default MakeATenGameModel;