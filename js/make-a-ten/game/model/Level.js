// Copyright 2016-2017, University of Colorado Boulder

/**
 * Represents a game level. Contains information and the ability to generate challenges for the particular level.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionItemNode = require( 'VEGAS/LevelSelectionItemNode' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  var ICON_SIZE = new Dimension2( 729 / 2, 420 / 2 );

  /**
   * @constructor
   *
   * @param {number} number - The number of the level, from 1 to 10
   * @param {string} color - The color for the level
   * @param {HTMLImageElement} icon - Image to be shown as the icon for the level
   * @param {string} description - Translated description to be shown in info and the status bar
   * @param {NumberChallengeFactory} numberChallengeFactory - For generating challenges
   */
  function Level( number, color, icon, description, numberChallengeFactory ) {

    // @public {number} - The level number, from 1 to 10
    this.number = number;

    // @public {number} - The color of the level, used for backgrounds mostly
    this.color = color;

    // @public {Node} - A properly sized node for use as an icon representing the level
    this.iconNode = LevelSelectionItemNode.createSizedImageNode( new Image( icon ), ICON_SIZE );

    // @public {string} - Translated description to be shown in info and the status bar
    this.description = description;

    // @public {Property.<number>} - The total score for this level
    this.scoreProperty = new NumberProperty( 0 );

    // @private {NumberChallengeFactory}
    this.numberChallengeFactory = numberChallengeFactory;
  }

  makeATen.register( 'Level', Level );

  inherit( Object, Level, {
    /**
     * Resets all of our mutable state to the initial values.
     * @public
     */
    reset: function() {
      this.scoreProperty.reset();
    },

    /**
     * Creates a NumberChallenge that should be used as the next challenge for this level.
     * @public
     *
     * @returns {NumberChallenge}
     */
    generateChallenge: function() {
      return this.numberChallengeFactory.generateChallenge( this.number - 1 );
    }
  } );

  return Level;
} );
