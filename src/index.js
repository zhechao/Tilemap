import Game from './game';
import Player from './player';

import tilemapData from './tilemap_ref/tilemaps.json';

// Create the game
var game = new Game(1024, 768,tilemapData);
// Create the playser and add it to the game
game.addEntity(new Player(60, 60));

// Start the main game loop
game.loop();
