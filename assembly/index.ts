//#region <offsets.ts>
/** Screen size (64x64). Check the `<canvas>` element on HTML file. */
const SCREEN_SIZE: i32 = 64;

/** Number of colors on palette. */
const PALETTE_SIZE: u8 = 8;

/** Input states. There are 5 buttons, giving it one byte for each one. */
const INPUT_STATES: usize = 16;

/** Video RAM. Pixel data should be here. It contains up to 16KB of data. */
const VRAM: usize = 25;

//#endregion </offsets.ts>
//#region <sprites.ts>

/** Font spritesheet width. */
const SPR_FONT_WIDTH: i32 = 4;

/** Font spritesheet height. */
const SPR_FONT_HEIGHT: i32 = 60;

/** Minimal font. */
const SPR_FONT: usize = memory.data<u8>([
  0, 0, 0, 0,
  7, 7, 7, 0,
  7, 0, 7, 0,
  7, 0, 7, 0,
  7, 0, 7, 0,
  7, 7, 7, 0,

  0, 0, 0, 0,
  7, 7, 0, 0,
  0, 7, 0, 0,
  0, 7, 0, 0,
  0, 7, 0, 0,
  7, 7, 7, 0,

  0, 0, 0, 0,
  7, 7, 7, 0,
  0, 0, 7, 0,
  7, 7, 7, 0,
  7, 0, 0, 0,
  7, 7, 7, 0,

  0, 0, 0, 0,
  7, 7, 7, 0,
  0, 0, 7, 0,
  0, 7, 7, 0,
  0, 0, 7, 0,
  7, 7, 7, 0,

  0, 0, 0, 0,
  7, 0, 7, 0,
  7, 7, 7, 0,
  0, 0, 7, 0,
  0, 0, 7, 0,
  0, 0, 7, 0,

  0, 0, 0, 0,
  7, 7, 7, 0,
  7, 0, 0, 0,
  7, 7, 7, 0,
  0, 0, 7, 0,
  7, 7, 7, 0,

  0, 0, 0, 0,
  7, 0, 0, 0,
  7, 0, 0, 0,
  7, 7, 7, 0,
  7, 0, 7, 0,
  7, 7, 7, 0,

  0, 0, 0, 0,
  7, 7, 7, 0,
  0, 0, 7, 0,
  0, 0, 7, 0,
  0, 0, 7, 0,
  0, 0, 7, 0,

  0, 0, 0, 0,
  7, 7, 7, 0,
  7, 0, 7, 0,
  7, 7, 7, 0,
  7, 0, 7, 0,
  7, 7, 7, 0,

  0, 0, 0, 0,
  7, 7, 7, 0,
  7, 0, 7, 0,
  7, 7, 7, 0,
  0, 0, 7, 0,
  0, 0, 7, 0,
]);

/** Enemy spritesheet width. */
const SPR_ENEMIES_WIDTH: i32 = 8;

/** Enemy spritesheet height. */
const SPR_ENEMIES_HEIGHT: i32 = 32;

/** Enemy sprites. */
const SPR_ENEMIES: usize = memory.data<u8>([
  0, 0, 0, 0, 0, 0, 0, 0,
  6, 0, 0, 0, 0, 0, 6, 0,
  0, 6, 6, 6, 6, 6, 0, 0,
  6, 6, 0, 6, 0, 6, 6, 0,
  6, 6, 0, 6, 0, 6, 6, 0,
  6, 6, 6, 6, 6, 6, 6, 0,
  0, 6, 0, 0, 0, 6, 0, 0,
  6, 0, 0, 0, 0, 0, 6, 0,

  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 0, 0,
  3, 3, 3, 3, 3, 3, 3, 0,
  3, 0, 3, 3, 3, 0, 3, 0,
  3, 0, 3, 3, 3, 0, 3, 0,
  0, 3, 3, 3, 3, 3, 0, 0,
  3, 0, 0, 0, 0, 0, 3, 0,
  0, 3, 0, 0, 0, 3, 0, 0,

  0, 0, 0, 0, 0, 0, 0, 0,
  0, 5, 0, 0, 0, 5, 0, 0,
  5, 5, 5, 5, 5, 5, 5, 0,
  5, 0, 0, 5, 0, 0, 5, 0,
  5, 5, 5, 5, 5, 5, 5, 0,
  0, 5, 5, 0, 5, 5, 0, 0,
  0, 5, 0, 0, 0, 5, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,

  0, 0, 0, 0, 0, 0, 0, 0,
  0, 2, 2, 2, 2, 2, 0, 0,
  2, 2, 2, 2, 2, 2, 2, 0,
  2, 0, 0, 2, 0, 0, 2, 0,
  2, 2, 2, 2, 2, 2, 2, 0,
  2, 2, 2, 2, 2, 2, 2, 0,
  2, 2, 0, 2, 0, 2, 2, 0,
  2, 0, 0, 0, 0, 0, 2, 0,
]);

//#endregion </sprites.ts>
//#region <api.ts>
/**
 * @class Input
 * 
 * @description
 * Represents a single input controller, which can hold a state.
 */
class Input {
  /** Memory offset. */
  offset: usize;
  
  /**
   * @constructor
   * 
   * @param {usize} offset Memory offset.
   */
  constructor(offset: usize) {
    this.offset = offset;
  }

  /**
   * Input state.
   */
  get state(): u8 {
    return load<u8>(this.offset);
  }

  /**
   * Check if it's idle.
   */
  get idle(): bool {
    return this.state === 0;
  }

  /**
   * Check if it has been pressed.
   */
  get pressed(): bool {
    return this.state === 1;
  }

  /**
   * Check if it has been kept held.
   */
  get held(): bool {
    return this.state === 2;
  }

  /**
   * Check if it has been released.
   */
  get released(): bool {
    return this.state === 3;
  }
}

/**
 * @class Gamepad
 * 
 * @description
 * Represents a basic gamepad with 5 buttons.
 */
class Gamepad {
  static up:    Input = new Input(INPUT_STATES);
  static down:  Input = new Input(INPUT_STATES + 1);
  static left:  Input = new Input(INPUT_STATES + 2);
  static right: Input = new Input(INPUT_STATES + 3);
  static space: Input = new Input(INPUT_STATES + 4);
}

/**
 * Get one pixel from the screen.
 * 
 * @param {i32} x X position.
 * @param {i32} y Y position.
 * 
 * @returns {i32}
 */
function getPixel(x: i32, y: i32): i32 {
  // Prevent from drawing offscreen...
  if(x < 0 || x >= SCREEN_SIZE || y < 0 || y >= SCREEN_SIZE) {
    return 0;
  }

  // Calculate offset position on grid.
  const offset: usize = (y * SCREEN_SIZE) + x;

  return load<u8>(VRAM + offset);
}

/**
 * Set one pixel on screen.
 * 
 * @param {i32} x X position.
 * @param {i32} y Y position.
 * @param {i32} color Pixel color index.
 * 
 * @returns {bool}
 */
function setPixel(x: i32, y: i32, color: i32): bool {
  // Prevent from drawing offscreen...
  if(x < 0 || x >= SCREEN_SIZE || y < 0 || y >= SCREEN_SIZE) {
    return false;
  }

  // Calculate offset position on grid.
  const offset: usize = (y * SCREEN_SIZE) + x;

  store<u8>(VRAM + offset, (color as u8) % PALETTE_SIZE);
  return true;
}

/**
 * Draw a rectangle on screen (fill).
 * 
 * @param {i32} x X position.
 * @param {i32} y Y position.
 * @param {i32} width Width.
 * @param {i32} height Height.
 * @param {i32} color Pixel color index.
 * 
 * @returns {bool}
 */
function drawRect(x: i32, y: i32, width: i32, height: i32, color: i32): bool {
  for(let row: i32 = 0; row < height; row += 1) {
    for(let column: i32 = 0; column < width; column += 1) {
      setPixel(x + column, y + row, color);
    }
  }

  return true;
}

/**
 * Draw a rectangle on screen (border).
 * 
 * @param {i32} x X position.
 * @param {i32} y Y position.
 * @param {i32} width Width.
 * @param {i32} height Height.
 * @param {i32} color Pixel color index.
 * 
 * @returns {bool}
 */
function drawRectBorder(x: i32, y: i32, width: i32, height: i32, color: i32): bool {
  // Draw horizontal lines...
  for(let column: i32 = 0; column < width; column += 1) {
    setPixel(x + column, y, color);
    setPixel(x + column, y + height, color);
  }

  // Draw vertical lines...
  for(let row: i32 = 1; row < height - 1; row += 1) {
    setPixel(x, y + row, color);
    setPixel(x + width, y + row, color);
  }

  return true;
}

/**
 * Clear screen.
 * 
 * @param {i32} color Pixel color index.
 * 
 * @returns {bool}
 */
function clearScreen(color: i32 = 0): bool {
  drawRect(0, 0, SCREEN_SIZE, SCREEN_SIZE, color);
  return true;
}

/**
 * Draw one image on screen.
 * 
 * @param {usize} data Image data offset.
 * @param {i32} x X position.
 * @param {i32} y Y position.
 * @param {i32} width Image width.
 * @param {i32} height Image height.
 * @param {i32} mask Alpha mask (set to `-1` to draw as-is).
 * 
 * @returns {bool}
 */
function drawImage(data: usize, x: i32, y: i32, width: i32, height: i32, mask: i32 = -1): bool {
  // Calculate image area.
  const area: i32 = width * height;

  // Set variables for offset spacing, and row/column cursors.
  let offset: usize = 0;
  let row: i32 = 0;
  let column: i32 = 0;
  
  // Iterate through each pixel...
  for(let index: i32 = 0; index < area; index += 1) {
    const color: i32 = load<u8>(data + offset + column) as i32;
    
    // Draw each pixel...
    if(color !== mask) {
      setPixel(x + column, y + row, color);
    }

    // Advance line-by-line...
    column += 1;

    // Jump to next line...
    if(column === width) {
      offset += width;
      column = 0;
      row += 1;
    }
  }

  return true;
}

/**
 * Draw one fragment of image on screen.
 * 
 * @param {usize} data Image data offset.
 * @param {i32} x X position.
 * @param {i32} y Y position.
 * @param {i32} width Image width.
 * @param {i32} height Image height.
 * @param {i32} xCut X cut position.
 * @param {i32} yCut Y cut position.
 * @param {i32} widthCut Fragment width.
 * @param {i32} heightCut Fragment height.
 * @param {i32} mask Alpha mask (set to `-1` to draw as-is).
 * 
 * @returns {bool}
 */
function drawImagePart(data: usize, x: i32, y: i32, width: i32, height: i32, xCut: i32, yCut: i32, widthCut: i32, heightCut: i32, mask: i32 = -1): bool {
  // Calculate image area.
  const area: i32 = widthCut * heightCut;

  // Set variables for offset spacing, and row/column cursors.
  let offset: usize = width * yCut;
  let row: i32 = 0;
  let column: i32 = 0;
  
  // Iterate through each pixel...
  for(let index: i32 = 0; index < area; index += 1) {
    const color: i32 = load<u8>(data + offset + column + xCut) as i32;

    // Draw each pixel...
    if(color !== mask) {
      setPixel(x + column, y + row, color);
    }

    // Advance line-by-line...
    column += 1;

    // Jump to next line...
    if(column === widthCut) {
      offset += width;
      column = 0;
      row += 1;
    }
  }  

  return true;
}

/**
 * get a random value between two numbers.
 * 
 * @param {i32} min Minimum value.
 * @param {i32} max Maximum value.
 * 
 * @returns {i32}
 */
function range(min: i32 = 0, max: i32 = 0): i32 {
  const cmin: f64 = Math.ceil(min);
  const fmax: f64 = Math.floor(max);

  return (Math.floor(Math.random() * (fmax - cmin)) as i32) + min;
}

//#endregion </api.ts>
//#region <game.ts>
/**
 * @class Rect
 * 
 * @description
 * Represent a collision rectangle. It's used for AABB collision detection.
 */
class Rect {
  /** X position. */
  x: i32;

  /** Y position. */
  y: i32;

  /** Width. */
  width: i32;

  /** Height. */
  height: i32;

  /**
   * @constructor
   * 
   * @param {i32} x X position.
   * @param {i32} y Y position.
   * @param {i32} width Width.
   * @param {i32} height Height.
   */
  constructor(x: i32 = 0, y: i32 = 0, width: i32 = 1, height: i32 = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Check collision between two rectangles.
   *
   * @param {Rect} rect Collision box.
   *
   * @returns {bool}
   */
  intersect(rect: Rect): bool {
    return (
      rect != this
      && this.x               < rect.x + rect.width
      && this.x + this.width  > rect.x
      && this.y               < rect.y + rect.height
      && this.height + this.y > rect.y
    );
  }
}

/**
 * @class Sprite @extends Rect
 * 
 * @description
 * Represent a basic game sprite.
 */
abstract class Sprite extends Rect {
  /**
   * @event update
   * 
   * This should be called each frame.
   */
  update(): void {}

  /**
   * @event draw
   * 
   * Draw-related events should go here.
   */
  draw(): void {}
}

/**
 * @class Enemy @extends Sprite
 * 
 * @description
 * An enemy. The player must prevent it from reaching the bottom of screen.
 */
class Enemy extends Sprite {
  /** Enemy type (sprite). There are four of them. */
  enemyType: i32;

  /**
   * 
   * @param {i32} x X position.
   * @param {i32} y Y position.
   * @param {i32} enemyType Enemy type (sprite). There are four of them.
   */
  constructor(x: i32, y: i32, enemyType: i32) {
    super(x, y, 8, 8);
    this.enemyType = enemyType % 4;
  }

  /**
   * Check if this enemy reached one of the sides of screen.
   */
  get isOnSide(): bool {
    return this.x <= 0 || this.x >= (SCREEN_SIZE - this.width);
  }

  update(): void {
  }

  draw(): void {
    drawImagePart(
      SPR_ENEMIES, 
      this.x, 
      this.y, 
      SPR_ENEMIES_WIDTH, 
      SPR_ENEMIES_HEIGHT, 
      0, 
      this.enemyType * 8, 
      8, 
      8
    );
  }
}

/**
 * @class PlayScene
 * 
 * @description
 * Main game scene.
 */
class PlayScene {
  /** Enemies on scren. */
  enemies: Enemy[];

  /** Vertical speed for all enemies. */
  vspeed: i32;

  /** Horizontal speed for all enemies. */
  hspeed: i32;

  /** Request enemies to change direction. */
  changeDirection: bool;

  /** If `true`, enemies will move to right. */
  movingToRight: bool;

  /** Ticks per enemy movement. The lower it is, the faster they move. */
  ticksPerMove: i32;

  /** Enem movement tick counter. */
  ticks: i32;

  /**
   * @constructor
   */
  constructor() {
    this.enemies = [];
    this.vspeed = 0;
    this.hspeed = 1;
    this.movingToRight = true;
    this.changeDirection = false;
    this.ticksPerMove = 10;
    this.ticks = 10;

    this.createEnemies();
  }

  /**
   * Fill the scene with a grid of enemies.
   */
  createEnemies(): void {
    for(let row: i32 = 0; row < 4; row += 1) {
      for(let column: i32 = 0; column < 6; column += 1) {
        const enemy: Enemy = new Enemy((column * 9), (row * 9), row);
        this.enemies.push(enemy);
      }
    }
  }

  /**
   * Move enemy grid.
   */
  moveEnemies(): void {
    // When requested to change direction, enemies will fall and bounce back
    // to the opposing side...
    if(this.changeDirection === true) {
      this.vspeed = 1;
      this.movingToRight = !this.movingToRight;
      this.changeDirection = false;
    }

    // Iterate through enemies...
    for(let index: i32 = 0; index < this.enemies.length; index += 1) {
      const enemy: Enemy = this.enemies[index];

      // Move enemies...
      enemy.x += this.movingToRight? this.hspeed: -this.hspeed;
      enemy.y += this.vspeed;

      // The first enemies to hit one of the sides of screen will request
      // everyone to bounce back to the opposing side. This will happen on
      // the next tick...
      if(this.changeDirection === false && enemy.isOnSide) {
        this.changeDirection = true;
      }

      enemy.update();
    }

    // Reset vertical speed and prepare for the next tick...
    this.vspeed = 0;
    this.ticks = this.ticksPerMove;
  }

  update(): void {
    this.ticks -= 1;
    
    if(this.ticks <= 0) {
      this.moveEnemies();
    }
  }

  draw(): void {
    for(let index: i32 = 0; index < this.enemies.length; index += 1) {
      const enemy: Enemy = this.enemies[index];
      enemy.draw();
    }
  }
}

//#endregion </game.ts>
//#region <index.ts>
/** @todo Temporary scene. */
const scene: PlayScene = new PlayScene();

/**
 * @event start
 * 
 * This event should run only once, right at the start.
 */
export function start(): void {
}

/**
 * @event update
 * 
 * This event should run each frame.
 */
export function update(): void {
  clearScreen(0);

  scene.update();
  scene.draw();
}
//#endregion </index.ts>
