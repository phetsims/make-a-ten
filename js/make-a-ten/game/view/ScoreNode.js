// Copyright 2015, University of Colorado Boulder

/**
 * Indicates a user's level score by displaying a star and the score number.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Sam Reid
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Emitter = require( 'AXON/Emitter' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );

  // constants
  var LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var STAR_OPTIONS = {
    outerRadius: 10,
    innerRadius: 5,
    filledLineWidth: 1.5,
    emptyLineWidth: 1.5,
    centerY: 0
  };

  /**
   * @constructor
   *
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   */
  function ScoreNode( scoreProperty, options ) {
    var self = this;

    Node.call( this );

    options = _.extend( {
      labelColor: 'black'
    }, options );

    // @public {Emitter} - Fires when the displayed score is changed. Exists to prevent relying on order of listeners
    //                     for the property.
    this.scoreChangedEmitter = new Emitter();

    var scoreText = new Text( '0', { font: LABEL_FONT, fill: options.labelColor } );
    this.addChild( scoreText );

    var emptyStar = new StarNode( _.extend( { value: 0, centerX: 0 }, STAR_OPTIONS ) );
    this.addChild( emptyStar );

    var fullStar = new StarNode( _.extend( { value: 1 }, STAR_OPTIONS ) );
    this.addChild( fullStar );

    // Update visibility and text based on the score
    scoreProperty.link( function( score ) {
      scoreText.text = score;
      scoreText.centerY = 0;

      if ( score > 0 ) {
        self.children = [ scoreText, fullStar ];

        // Center horizontally
        var width = scoreText.width + 8 + fullStar.width;
        scoreText.left = -width / 2;
        fullStar.right = width / 2;
      }
      else {
        self.children = [ emptyStar ];
      }

      // Possibly changegd bounds
      self.scoreChangedEmitter.emit();
    } );

    this.mutate( options );
  }

  makeATen.register( 'ScoreNode', ScoreNode );

  return inherit( Node, ScoreNode );
} );
