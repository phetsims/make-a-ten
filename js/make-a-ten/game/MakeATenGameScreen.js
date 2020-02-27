// Copyright 2016-2019, University of Colorado Boulder

/**
 * Game screen for make-a-ten. Includes 10 levels, where the goal for each is to combine the 2 numbers together into
 * one number by manipulating with the concept of making a ten. Each level can generate an infinite number of
 * challenges, so the score for each level is an integer (instead of a proportion like other sims).
 *
 * @author Sharfudeen Ashraf
 */

import Property from '../../../../axon/js/Property.js';
import Screen from '../../../../joist/js/Screen.js';
import inherit from '../../../../phet-core/js/inherit.js';
import gameHomeScreenImage from '../../../images/game-home-screen_png.js';
import gameNavBarImage from '../../../images/game-nav-bar_png.js';
import makeATenStrings from '../../make-a-ten-strings.js';
import makeATen from '../../makeATen.js';
import MakeATenConstants from '../common/MakeATenConstants.js';
import MakeATenUtils from '../common/MakeATenUtils.js';
import MakeATenGameModel from './model/MakeATenGameModel.js';
import MakeATenGameScreenView from './view/MakeATenGameScreenView.js';

const screenGameString = makeATenStrings.screen.game;

/**
 * @constructor
 */
function MakeATenGameScreen() {

  const options = {
    name: screenGameString,
    backgroundColorProperty: new Property( MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
    homeScreenIcon: MakeATenUtils.createIconWithBackgroundColor( gameHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
    navigationBarIcon: MakeATenUtils.createIconWithBackgroundColor( gameNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR )
  };

  Screen.call( this,
    function() { return new MakeATenGameModel(); },
    function( model ) { return new MakeATenGameScreenView( model ); },
    options );
}

makeATen.register( 'MakeATenGameScreen', MakeATenGameScreen );

inherit( Screen, MakeATenGameScreen );
export default MakeATenGameScreen;