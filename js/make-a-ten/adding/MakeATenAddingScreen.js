// Copyright 2016-2020, University of Colorado Boulder

/**
 * Adding screen for Make a Ten. Allows entering two numbers with a keypad, so that the user can experiment with adding
 * with the sim's usual constraints.
 *
 * @author Sharfudeen Ashraf
 */

import Property from '../../../../axon/js/Property.js';
import Screen from '../../../../joist/js/Screen.js';
import inherit from '../../../../phet-core/js/inherit.js';
import addingHomeScreenImage from '../../../images/adding-home-screen_png.js';
import addingNavBarImage from '../../../images/adding-nav-bar_png.js';
import makeATenStrings from '../../make-a-ten-strings.js';
import makeATen from '../../makeATen.js';
import MakeATenConstants from '../common/MakeATenConstants.js';
import MakeATenUtils from '../common/MakeATenUtils.js';
import MakeATenAddingModel from './model/MakeATenAddingModel.js';
import MakeATenAddingScreenView from './view/MakeATenAddingScreenView.js';

const screenAddingString = makeATenStrings.screen.adding;

/**
 * @constructor
 */
function MakeATenAddingScreen() {

  const options = {
    name: screenAddingString,
    backgroundColorProperty: new Property( MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
    homeScreenIcon: MakeATenUtils.createIconWithBackgroundColor( addingHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
    navigationBarIcon: MakeATenUtils.createIconWithBackgroundColor( addingNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR )
  };

  Screen.call( this,
    function() { return new MakeATenAddingModel(); },
    function( model ) { return new MakeATenAddingScreenView( model ); },
    options );
}

makeATen.register( 'MakeATenAddingScreen', MakeATenAddingScreen );

inherit( Screen, MakeATenAddingScreen );
export default MakeATenAddingScreen;