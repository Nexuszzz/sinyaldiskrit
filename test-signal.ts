// Test file untuk debug signal processing
// Jalankan dengan: npx ts-node test-signal.ts atau di browser console

// Simulasi fungsi dari aplikasi
function evaluateSignal(expression: string, n: number): number {
    // u(n) - unit step
    const u = (val: number) => val >= 0 ? 1 : 0;
    // r(n) - ramp  
    const r = (val: number) => val >= 0 ? val : 0;
    // d(n) - delta/impulse
    const d = (val: number) => val === 0 ? 1 : 0;
    
    // Parse expression: (-n) * (u(n+2) - u(n)) + (n-1) * (u(n) - u(n-4))
    const part1 = (-n) * (u(n+2) - u(n));
    const part2 = (n-1) * (u(n) - u(n-4));
    return part1 + part2;
}

console.log("=== TEST SIGNAL x(n) ===");
for (let n = -4; n <= 5; n++) {
    console.log(`x(${n}) = ${evaluateSignal("test", n)}`);
}

console.log("\n=== TEST y(n) = x(-n-2) ===");
for (let n = -5; n <= 2; n++) {
    const m = -n - 2;
    const y = evaluateSignal("test", m);
    console.log(`y(${n}) = x(${m}) = ${y}`);
}

// Expected from handout:
console.log("\n=== EXPECTED (from handout) ===");
const expected: {[key: number]: number} = {
    [-5]: 2,
    [-4]: 1, 
    [-3]: 0,
    [-2]: -1,
    [-1]: 1,
    [0]: 2,
    [1]: 0,
    [2]: 0
};

console.log("\n=== COMPARISON ===");
for (let n = -5; n <= 2; n++) {
    const m = -n - 2;
    const calculated = evaluateSignal("test", m);
    const exp = expected[n];
    const match = calculated === exp ? "✓" : "✗ WRONG!";
    console.log(`y(${n}): calculated=${calculated}, expected=${exp} ${match}`);
}
