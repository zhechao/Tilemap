import * as Calculate from './calculate';

export default class Tilemap{

  constructor(mapData){
    this.tiles = [];
    this.tilesets = [];
    this.layers = [];
    this.tileWidth = 0;
    this.tileHeight = 0;
    this.mapWidth = 0;
    this.mapHeight = 0;

    var loading = 0

    this.tileWidth = mapData.tilewidth;
    this.tileHeight = mapData.tileheight;
    this.mapWidth = mapData.width;
    this.mapHeight = mapData.height;
    console.log(mapData);
    // Load the tileset(s)
    mapData.tilesets.forEach((tilesetmapData, index) => {
      console.log(tilesetmapData)
      // Load the tileset image
      var tileset = new Image();
      tileset.src = tilesetmapData.image;
      this.tilesets.push(tileset);


      // Create the tileset's tiles
      var colCount = Math.floor(tilesetmapData.imagewidth / this.tileWidth),
          rowCount = Math.floor(tilesetmapData.imageheight / this.tileHeight),
          tileCount = colCount * rowCount;

      for(var i = 0; i < tileCount; i++) {
        var tile = {
          // Reference to the image, shared amongst all tiles in the tileset
          image: tileset,
          // Source x position.  i % colCount == col number (as we remove full rows)
          sx: (i % colCount) * this.tileWidth,
          // Source y position. i / colWidth (integer division) == row number
          sy: Math.floor(i / rowCount) * this.tileHeight,
          // Indicates a solid tile (i.e. solid property is true).  As properties
          // can be left blank, we need to make sure the property exists.
          // We'll assume any tiles missing the solid property are *not* solid
          solid: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].solid == "true") ? true : false
        }
        this.tiles.push(tile);

      }

    });

    mapData.layers.forEach((layerData) => {

      // Tile layers need to be stored in the engine for later
      // rendering
      if(layerData.type == "tilelayer") {
        // Create a layer object to represent this tile layer
        var layer = {
          name: layerData.name,
          width: layerData.width,
          height: layerData.height,
          visible: layerData.visible
        }

        // Set up the layer's data array.  We'll try to optimize
        // by keeping the index data type as small as possible
        if(this.tiles.length < Math.pow(2,8))
          layer.data = new Uint8Array(layerData.data);
        else if (this.tiles.length < Math.Pow(2, 16))
          layer.data = new Uint16Array(layerData.data);
        else
          layer.data = new Uint32Array(layerData.data);

        // save the tile layer
        this.layers.push(layer);
      }
    });
  }

  render(screenCtx) {
    // Render tilemap layers - note this assumes
    // layers are sorted back-to-front so foreground
    // layers obscure background ones.
    // see http://en.wikipedia.org/wiki/Painter%27s_algorithm
    this.layers.forEach((layer) => {

      // Only draw layers that are currently visible
      if(layer.visible) {
        for(var y = 0; y < layer.height; y++) {
          for(var x = 0; x < layer.width; x++) {
            var tileId = layer.data[x + layer.width * y];

            // tiles with an id of 0 don't exist
            if(tileId != 0) {
              var tile = this.tiles[tileId - 1];
              if(tile.image) { // Make sure the image has loaded
                screenCtx.drawImage(
                  tile.image,     // The image to draw
                  tile.sx, tile.sy, this.tileWidth, this.tileHeight, // The portion of image to draw
                  x*this.tileWidth, y*this.tileHeight, this.tileWidth, this.tileHeight // Where to draw the image on-screen
                );
              }
            }

          }
        }
      }

    });
  }

  tileAt(x, y, layer,input) {
    // sanity check
    if(layer < 0 || x < 0 || y < 0 || layer >= this.layers.length || x > 1024 || y > 768){
      return undefined;
    }
    else{
      return this.tiles[this.layers[layer].data[Calculate.getlayer(x, y,input)] - 1];
    }

  }

}
