// Copyright 2002-2014, University of Colorado Boulder

/**
 * Generates a number set based on the Game Level
 *
 *  @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberChallenge = require( 'MAKING_TENS/making-tens/game/model/NumberChallenge' );


  function NumberChallengeFactory() {

    this.addWithNineChallengeTermsLeft9 = [];
    this.addWithNineChallengeTermsRight9 = [];
    this.addWithNineChallengeTermAlternator = 1;

    this.underTwentyChallengeTerms = [];
    this.addWithTensChallengeTerms = [];
    this.addWithSinglesChallengeTerms = [];
    this.underHundredsChallengeTerms = [];
    this.overHundredsChallengeTerms = [];


    //generate random terms
    this.generateAddWithNineChallengeTerms();
    this.generateUnderTwentyChallengeTerms();
    this.generateAddWithTensChallengeTerms();
    this.generateAddWithSinglesChallengeTerms();
    this.generateUnderHundredsChallengeTerms();
    this.generateOverHundredsChallengeTerms();

  }

  return inherit( Object, NumberChallengeFactory, {

    /**
     * Single digit sums, one digit is always 9 (randomly placed as the first or second digit).
     * Total is always GREATER THAN ten and less than 20
     *
     * Example combinations
     * 9 +2, 9 +3, 9 +4, 9 +5, 9 +6, 9 +7, 9 +8, 9 +9, 2 +9, 3 + 9, 4 + 9, 5 + 9, 6 + 9, 7 + 9, 8 + 9
     */
    generateAddWithNineChallengeTerms: function() {
      for ( var i = 0; i < 8; i++ ) {
        this.addWithNineChallengeTermsLeft9.push( [ 9, i + 2 ] );
      }
      for ( i = 0; i < 7; i++ ) {
        this.addWithNineChallengeTermsRight9.push( [ this.addWithNineChallengeTermsLeft9[ i ][ 1 ], this.addWithNineChallengeTermsLeft9[ i ][ 0 ] ] );
      }
    },


    /**
     * Random single digits whose sum is less than 20, but GREATER THAN 10.  Pick from:
     *
     * 9 +2, 9 +3, 9 +4, 9 +5, 9 +6, 9 +7, 9 +8, 9 +9, 2 +9, 3 + 9, 4 + 9, 5 + 9, 6 + 9, 7 + 9, 8 + 9,
     * 8 +3, 8 +4,8 +5, 8 +6, 8 +7, 8 +8, 3 + 8, 4 + 8, 5 + 8, 6 + 8 , 7 + 8,
     * 7 +4, 7 +5, 7 +6, 7 +7, 4 + 7, 5 + 7, 6 +7,
     * 6 + 5, 6 + 6, 5 +6

     * @returns {NumberChallenge}
     */
    generateUnderTwentyChallengeTerms: function() {
      var _8basedTerms = [];

      for ( var i = 0; i < 6; i++ ) {
        _8basedTerms.push( [ 8, i + 3 ] );

      }
      for ( i = 0; i < 5; i++ ) {
        _8basedTerms.push( [ _8basedTerms[ i ][ 1 ], _8basedTerms[ i ][ 0 ] ] );
      }


      var _7basedTerms = [];

      for ( i = 0; i < 4; i++ ) {
        _7basedTerms.push( [ 7, i + 4 ] );
      }

      for ( i = 0; i < 3; i++ ) {
        _7basedTerms.push( [ _7basedTerms[ i ][ 1 ], _7basedTerms[ i ][ 0 ] ] );
      }


      var _6basedTerms = [];

      for ( i = 0; i < 2; i++ ) {
        _6basedTerms.push( [ 6, i + 5 ] );
      }

      for ( i = 0; i < 1; i++ ) {
        _6basedTerms.push( [ _6basedTerms[ i ][ 1 ], _6basedTerms[ i ][ 0 ] ] );
      }

      this.underTwentyChallengeTerms = [].concat( this.addWithNineChallengeTermsLeft9, this.addWithNineChallengeTermsRight9, _8basedTerms, _7basedTerms, _6basedTerms );
    },

    /**
     * Add with 10’s.  Identical to Level three, but each number is multiplied by 10.
     * Pick from 90 + 20, 90 + 30 etc
     */
    generateAddWithTensChallengeTerms: function() {
      this.addWithTensChallengeTerms = this.underTwentyChallengeTerms.map( function( term ) {
        var tensTerm = [ term[ 0 ] * 10, term[ 1 ] * 10 ];
        return tensTerm;
      } );
    },


    /**
     * Add double digit numbers to singles.  Again, use number pairs from Level 3, but pick one digit and add it by a random “decade number.”
     * For example, if you have 5 + 8, add the 5 by 30 to get 35 + 8.  This way you will always cross a decade number
     */
    generateAddWithSinglesChallengeTerms: function() {

      for ( var i = 0; i < this.underTwentyChallengeTerms.length; i++ ) {
        var term = this.underTwentyChallengeTerms[ i ];
        var randomDecade = _.random( 1, 8 ) * 10;
        var tensTerm = [ term[ 0 ] + randomDecade, term[ 1 ] ];
        this.addWithSinglesChallengeTerms.push( tensTerm );
        tensTerm = [ term[ 1 ], term[ 0 ] + randomDecade ];
        this.addWithSinglesChallengeTerms.push( tensTerm );
      }

    },


    /**
     * Add double digit numbers whose sum is less than 100. Pick random double digit pairs whose sum is less than 100
     */
    generateUnderHundredsChallengeTerms: function() {
      var lTerms = [];
      for ( var i = 10; i < 50; i++ ) {
        lTerms.push( i );
      }
      var rTerms = [];
      for ( i = 0; i < 39; i++ ) {
        rTerms.push( lTerms[ _.random( 0, lTerms.length - 1 ) ] );
      }

      for ( i = 0; i < 39; i++ ) {
        this.underHundredsChallengeTerms.push( [ lTerms[ i ], rTerms[ i ] ] );
        this.underHundredsChallengeTerms.push( [ rTerms[ i ], lTerms[ i ] ] );
      }
    },

    /**
     * Add double digit sums whose sums are greater than or equal to 100.
     */
    generateOverHundredsChallengeTerms: function() {
      var lTerms = [];
      for ( var i = 50; i < 100; i++ ) {
        lTerms.push( i );
      }
      var rTerms = [];
      for ( i = 0; i < 49; i++ ) {
        rTerms.push( lTerms[ _.random( 0, lTerms.length - 1 ) ] );
      }

      for ( i = 0; i < 49; i++ ) {
        this.overHundredsChallengeTerms.push( [ lTerms[ i ], rTerms[ i ] ] );
        this.overHundredsChallengeTerms.push( [ rTerms[ i ], lTerms[ i ] ] );
      }
    },


    /**
     * Level 1 should include challenges that sum to 10 and under
     *
     * @returns {NumberChallenge}
     */
    tenAndUnderChallenge: function() {
      var leftTerm = _.random( 1, 9 );
      var rightTerm = _.random( 1, 10 - leftTerm );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    /**
     * This is Level 2
     *
     * Alternates between n,9 and 9,n
     * @returns {NumberChallenge}
     */
    addWithNineChallenge: function() {

      var addWithNineChallengeTerms = this.addWithNineChallengeTermsLeft9;
      if ( this.addWithNineChallengeTermAlternator < 0 ) {
        addWithNineChallengeTerms = this.addWithNineChallengeTermsRight9;
      }
      this.addWithNineChallengeTermAlternator *= -1;

      var termIndex = _.random( 0, addWithNineChallengeTerms.length - 1 );
      return new NumberChallenge( addWithNineChallengeTerms[ termIndex ][ 0 ], addWithNineChallengeTerms[ termIndex ][ 1 ], {} );
    },

    /**
     *
     * @returns {NumberChallenge}
     */
    addWithTensChallenge: function() {
      var termIndex = _.random( 0, this.addWithTensChallengeTerms.length - 1 );
      return new NumberChallenge( this.addWithTensChallengeTerms[ termIndex ][ 0 ], this.addWithTensChallengeTerms[ termIndex ][ 1 ], {} );
    },

    /**
     * Level 3
     * @returns {NumberChallenge}
     */
    underTwentyChallenge: function() {
      var termIndex = _.random( 0, this.underTwentyChallengeTerms.length - 1 );
      return new NumberChallenge( this.underTwentyChallengeTerms[ termIndex ][ 0 ], this.underTwentyChallengeTerms[ termIndex ][ 1 ], {} );
    },

    addWithSinglesChallenge: function() {
      var termIndex = _.random( 0, this.addWithSinglesChallengeTerms.length - 1 );
      return new NumberChallenge( this.addWithSinglesChallengeTerms[ termIndex ][ 0 ], this.addWithSinglesChallengeTerms[ termIndex ][ 1 ], {} );
    },

    /**
     * @returns {NumberChallenge}
     */
    underHundredsChallenge: function() {
      var termIndex = _.random( 0, this.underHundredsChallengeTerms.length - 1 );
      return new NumberChallenge( this.underHundredsChallengeTerms[ termIndex ][ 0 ], this.underHundredsChallengeTerms[ termIndex ][ 1 ], {} );
    },

    /**
     *
     * @returns {NumberChallenge}
     */
    overHundredChallenge: function() {
      var termIndex = _.random( 0, this.overHundredsChallengeTerms.length - 1 );
      return new NumberChallenge( this.overHundredsChallengeTerms[ termIndex ][ 0 ], this.overHundredsChallengeTerms[ termIndex ][ 1 ], {} );
    },

    /**
     * Add single digit numbers to triple digit multiples of 100
     *
     * @returns {NumberChallenge}
     */
    addWithSinglesThreeDigit: function() {
      var leftTerm = _.random( 1, 9 ) * 100;
      var rightTerm = _.random( 1, 9 );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    /**
     * Add triple digits which always have a “0” in the tens place. Sums as high as 1980.
     *
     * @returns {NumberChallenge}
     */
    addWithTensThreeDigit: function() {
      var leftTerm = _.random( 10, 100 ) * 10;
      var rightTerm = _.random( 10, 100 ) * 10;
      return new NumberChallenge( leftTerm, rightTerm, {} );
    },

    /**
     * Add random triple digits. Sums up to 1998
     *
     * @returns {NumberChallenge}
     */
    triplesChallenge: function() {
      var leftTerm = _.random( 101, 998 );
      var rightTerm = _.random( 101, 998 );
      return new NumberChallenge( leftTerm, rightTerm, {} );
    }

  } );
} );
