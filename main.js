#!/usr/bin/env node
(function () {
    "use strict";
    
    /**
     * Uses the filename passed into argv[2]
     */
    
    /**
     * Read the file, parse each cell into a format like this:
     * {x, y, height, pathLength, peakHeight}
     */
    let filename = process.argv[2];
    let text = require("fs").readFileSync(filename).toString();
    let time = Date.now();
    let maxValue = 0;
    let lines = text.trim().split(/\n/g);
    let firstLine = lines.shift().split(/ /g).map(v => +v);
    let width = firstLine[0];
    let height = firstLine[1];
    let grid = lines.map((v, y) => v.trim().split(/ /g).map((v, x) => {
        let asNumber = +v;
        maxValue = Math.max(maxValue, asNumber);
        return {
            x, y, height: asNumber,
            pathLength: 0, peakHeight: 0, /* parents: [],*/
        };
    }));
    let bestPathLength = 0;
    let bestDropHeight = 0;
    
    
    /**
     * Create an array containing the grid cells sorted by their height.
     * Use bucket sort to keep it O(n).
     */
    let buckets = new Array(maxValue);
    grid.forEach(v => v.forEach(v => {
        let key = maxValue - v.height;
        if (buckets[key]) { buckets[key].push(v); } else { buckets[key] = [v]; }
    }));
    let sortedByHeight = [].concat.apply([], buckets.filter(v => v));
    
    
    /**
     * Updates the best scores.
     * Each cell has a score 1 better than the best surrounding cell.
     * If the neighbour cell is unexplored, returns 1 and doesn't change anything.
     * Returns 0 otherwise.
     * 
     * This assumes that this is called on cells in descending order of height.
     */
    function updateIfBetter (current, neighbour) {
        
        // Neighbour is not explored or neighbour is explored and is equal (so we don't care about it).
        if (neighbour.pathLength === 0 || neighbour.height === current.height) { return 1; }
        
        let newPathLength = neighbour.pathLength;
        let newPeakHeight = neighbour.peakHeight;
        
        // This neighbour cell is tied for the best path.
        if (newPathLength === current.pathLength - 1 && newPeakHeight === current.peakHeight) {
            /* current.parents.push(neighbour); */
        
        // This neighbour cell is the best path.
        } else if (newPathLength > current.pathLength - 1 || (newPathLength === current.pathLength - 1 &&
                                                              newPeakHeight > current.peakHeight)) {
            /* current.parents.length = 0; */
            /* current.parents.push(neighbour); */
        
        // This neighbour is bad.
        } else {
            return 0;
        }
        
        // Update state for this cell.
        current.pathLength = newPathLength + 1;
        current.peakHeight = newPeakHeight;
        
        // Store the best score we've seen so far
        if (current.pathLength > bestPathLength || (current.pathLength === bestPathLength &&
                                                    (current.peakHeight - current.height) > bestDropHeight)) {
            bestPathLength = current.pathLength;
            bestDropHeight = current.peakHeight - current.height;
        }
        
        return 0;
    }
    
    
    /**
     * Call the above function on each cell and each of it's neighbours. If it's a peak,
     * set it to the initial state for peaks.
     */
    for (let i = 0; i < sortedByHeight.length; i++) {
        let cell = sortedByHeight[i], connections = 4;
        
        // Update neighbours
        connections -= (cell.x > 0) ?           updateIfBetter(cell, grid[cell.y][cell.x - 1]) : 1;
        connections -= (cell.y > 0) ?           updateIfBetter(cell, grid[cell.y - 1][cell.x]) : 1;
        connections -= (cell.x < width - 1) ?   updateIfBetter(cell, grid[cell.y][cell.x + 1]) : 1;
        connections -= (cell.y < height - 1) ?  updateIfBetter(cell, grid[cell.y + 1][cell.x]) : 1;
        
        // This cell has no taller neighbours - mark it as a peak.
        if (connections === 0) {
            cell.pathLength = 1;
            cell.peakHeight = cell.height;
        }
        
    }
    
    console.log("Time: " + ((Date.now() - time) / 1000).toFixed(2));
    console.log("Length:", bestPathLength);
    console.log("Drop:", bestDropHeight);
    
}());
