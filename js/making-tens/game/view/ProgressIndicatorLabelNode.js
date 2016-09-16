// Copyright 2015, University of Colorado Boulder

/**
 * Indicates a user's progress on a level by displaying a star and the actual score in Text
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // constants
  var LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  /**
   * @param {number} numStars
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ProgressIndicatorLabelNode( numStars, scoreProperty, options ) {

    options = _.extend( {
      starOuterRadius: 10,
      starInnerRadius: 5,
      starFilledLineWidth: 1.5,
      starEmptyLineWidth: 1.5
    }, options );

    HBox.call( this, { spacing: 8, children: [] } );
    var self = this;

    // Update visibility of filled and half-filled stars based on score.
    // TODO: Could be rewritten to use deltas if it needs to animate
    scoreProperty.link( function( score ) {

      var children = [];

      var numFilledStars = score > 0 ? 1 : 0;
      var numEmptyStars = score === 0 ? 1 : 0;

      var starOptions = {
        outerRadius: options.starOuterRadius,
        innerRadius: options.starInnerRadius,
        filledLineWidth: options.starFilledLineWidth,
        emptyLineWidth: options.starEmptyLineWidth
      };

      for ( var i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 1 }, starOptions ) ) );
      }
      for ( i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 0 }, starOptions ) ) );
      }

      if ( score > 0 ) {
        var scoreLabel = new Text( score, { font: LABEL_FONT, fill: 'black' } );
        children.push( scoreLabel );
      }
      self.children = children;
    } );

    this.mutate( options );
  }

  makingTens.register( 'ProgressIndicatorLabelNode', ProgressIndicatorLabelNode );

  return inherit( HBox, ProgressIndicatorLabelNode );
} );