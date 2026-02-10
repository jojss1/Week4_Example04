/*
Level.js (Simple Generated Maze)

Tile legend:
0 = floor
1 = wall
3 = goal

Responsibilities:
- Store the grid
- Provide collision/meaning queries (isWall, isGoal, inBounds)
- Draw the tiles (including a goal highlight)
*/

class Level {
  constructor(levelJson, tileSize) {
    this.ts = tileSize;
    this.name = levelJson.name || "Level";

    // Build an empty floor grid using rows/cols (loops)
    this.grid = this.makeEmpty(levelJson.rows, levelJson.cols);

    // Place border walls (loop)
    if (levelJson.walls?.border) {
      this.addBorderWalls();
    }

    // Place internal wall segments (loop)
    for (const line of levelJson.walls?.lines || []) {
      // horizontal: { "r": number, "c1": number, "c2": number }
      if (line.r !== undefined) this.addHLine(line.r, line.c1, line.c2);

      // vertical: { "c": number, "r1": number, "r2": number }
      if (line.c !== undefined) this.addVLine(line.c, line.r1, line.r2);
    }

    // Place start and goal
    this.start = { r: levelJson.start.r, c: levelJson.start.c };
    this.goal = { r: levelJson.goal.r, c: levelJson.goal.c };

    // Start should behave like floor (player spawns there)
    this.grid[this.start.r][this.start.c] = 0;

    // Goal tile
    this.grid[this.goal.r][this.goal.c] = 3;
  }

  // ----- grid build -----
  makeEmpty(rows, cols) {
    const g = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) row.push(0);
      g.push(row);
    }
    return g;
  }

  // ----- size helpers -----
  rows() {
    return this.grid.length;
  }

  cols() {
    return this.grid[0].length;
  }

  pixelWidth() {
    return this.cols() * this.ts;
  }

  pixelHeight() {
    return this.rows() * this.ts;
  }

  // ----- semantic helpers -----
  inBounds(r, c) {
    return r >= 0 && c >= 0 && r < this.rows() && c < this.cols();
  }

  tileAt(r, c) {
    return this.grid[r][c];
  }

  isWall(r, c) {
    return this.tileAt(r, c) === 1;
  }

  isGoal(r, c) {
    return this.tileAt(r, c) === 3;
  }

  // ----- wall helpers (loops) -----
  addBorderWalls() {
    const R = this.rows();
    const C = this.cols();

    // top + bottom
    for (let c = 0; c < C; c++) {
      this.grid[0][c] = 1;
      this.grid[R - 1][c] = 1;
    }

    // left + right
    for (let r = 0; r < R; r++) {
      this.grid[r][0] = 1;
      this.grid[r][C - 1] = 1;
    }
  }

  addHLine(r, c1, c2) {
    for (let c = c1; c <= c2; c++) {
      if (this.inBounds(r, c)) this.grid[r][c] = 1;
    }
  }

  addVLine(c, r1, r2) {
    for (let r = r1; r <= r2; r++) {
      if (this.inBounds(r, c)) this.grid[r][c] = 1;
    }
  }

  // ----- drawing -----
  draw() {
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        const v = this.grid[r][c];

        // Base tile fill
        if (v === 1)
          fill(30, 50, 60); // wall
        else fill(232); // floor

        rect(c * this.ts, r * this.ts, this.ts, this.ts);

        // Goal highlight overlay
        if (v === 3) {
          noStroke();
          fill(255, 200, 120, 200);
          rect(c * this.ts + 4, r * this.ts + 4, this.ts - 8, this.ts - 8, 6);
        }
      }
    }
  }
}
