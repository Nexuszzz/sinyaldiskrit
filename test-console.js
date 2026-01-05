// Test file untuk dijalankan di browser console
// Copy-paste ke browser console di http://localhost:5173

// Import functions would work differently in browser
// This is a standalone test

// === MANUAL TEST ===
// Paste these values and compare:

const EXPECTED_X_N = {
    // Signal asli x(n)
    "-2": 2,   // -(-2) = 2
    "-1": 1,   // -(-1) = 1  
    "0": -1,   // 0-1 = -1
    "1": 0,    // 1-1 = 0
    "2": 1,    // 2-1 = 1
    "3": 2     // 3-1 = 2
};

const EXPECTED_Y_N = {
    // y(n) = x(-n-2)
    "-5": 2,   // x(3) = 2
    "-4": 1,   // x(2) = 1
    "-3": 0,   // x(1) = 0
    "-2": -1,  // x(0) = -1
    "-1": 1,   // x(-1) = 1
    "0": 2,    // x(-2) = 2
    "1": 0,    // x(-3) = 0
    "2": 0     // x(-4) = 0
};

console.log("Expected x(n):", EXPECTED_X_N);
console.log("Expected y(n) = x(-n-2):", EXPECTED_Y_N);
console.log("\nCompare with values in the Value Table on the right panel!");
