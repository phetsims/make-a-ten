// Copyright 2016, University of Colorado Boulder

/**
 * Panel shown for the reward, that gives the user a choice to continue, or go back to level selection.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Panel = require( 'SUN/Panel' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ScoreNode = require( 'MAKE_A_TEN/make-a-ten/game/view/ScoreNode' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // images
  var gameRewardImage = require( 'image!MAKE_A_TEN/game-reward.png' );

  // strings
  var keepGoingString = require( 'string!MAKE_A_TEN/keepGoing' );
  var newLevelString = require( 'string!MAKE_A_TEN/newLevel' );

  var BUTTON_OPTIONS = {
    font: new PhetFont( 24 ),
    xMargin: 15,
    yMargin: 12
  };

  /**
   * @constructor
   *
   * @param {function} keepGoing - Called with no args to dismiss
   * @param {function} goToLevelSelection - Called with no args to go to level selection
   */
  function RewardPanel( keepGoing, goToLevelSelection ) {
    var content = new HBox( {
      spacing: 50,
      children: [
        new Image( gameRewardImage ),
        new VBox( {
          spacing: 30,
          children: [
            new AlignBox( new ScoreNode( new Property( 10 ), { labelColor: 'black', scale: 3 } ), {
              bottomMargin: 40
            } ),
            new TextPushButton( keepGoingString, _.extend( {
              baseColor: 'white',
              listener: keepGoing,
              maxWidth: 500
            }, BUTTON_OPTIONS ) ),
            new TextPushButton( newLevelString, _.extend( {
              baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
              listener: goToLevelSelection,
              maxWidth: 500
            }, BUTTON_OPTIONS ) )
          ]
        } ),
      ]
    } );
    Panel.call( this, content, {
      xMargin: 50,
      yMargin: 30
    } );
  }

  makeATen.register( 'RewardPanel', RewardPanel );

  return inherit( Panel, RewardPanel );
} );
