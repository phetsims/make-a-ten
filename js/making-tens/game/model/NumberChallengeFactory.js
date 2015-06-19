// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 *  @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberChallenge = require( 'MAKING_TENS/making-tens/game/model/NumberChallenge' );

  function NumberChallengeFactory() {

  }

  return inherit( Object, NumberChallengeFactory, {

    tenAndUnderChallenge: function() {
      var leftTerm = _.random( 1, 9 );
      var rightTerm = 10 - leftTerm;
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    addWithNineChallenge: function() {
      var leftTerm = 9;
      var rightTerm = _.random( 1, 9 );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    underTwentyChallenge: function() {
      var leftTerm = _.random( 1, 9 );
      var rightTerm = _.random( 1, 9 );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    addWithTensChallenge: function() {
      var leftTerm = _.random( 1, 9 ) * 10;
      var rightTerm = _.random( 1, 9 ) * 10;
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    addWithSinglesChallenge: function() {
      var leftTerm = _.random( 10, 100 );
      var rightTerm = _.random( 1, 9 );
      return new NumberChallenge( leftTerm, rightTerm, {} );

    },

    underHundredsChallenge: function() {
      var leftTerm = _.random( 10, 100 );
      var rightTerm = 100 - leftTerm;
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    overHundredChallenge: function() {
      var overHundred = 100 + _.random( 10, 50 );
      var leftTerm = overHundred - _.random( 10, 50 );
      var rightTerm = overHundred - _.random( 10, 50 );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    addWithSinglesThreeDigit: function() {
      var leftTerm = _.random( 1, 9 ) * 100;
      var rightTerm = _.random( 1, 9 );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    addWithTensThreeDigit: function() {
      var leftTerm = _.random( 10, 100 ) * 10;
      var rightTerm = _.random( 10, 100 ) * 10;
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    triplesChallenge: function() {
      var leftTerm = _.random( 100, 999 );
      var rightTerm = _.random( 100, 999 );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    }


  } );
} );
