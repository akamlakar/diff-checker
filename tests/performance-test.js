/**
 * Performance Testing Script
 * Run this to benchmark the diff comparison performance
 */

const fs = require('fs');

// Generate test data of various sizes
function generateTestData(lines) {
    const data = [];
    for (let i = 0; i < lines; i++) {
        data.push(`Line ${i}: This is test data with some content to compare`);
    }
    return data.join('\n');
}

// Performance test suite
const tests = [
    { name: 'Small (100 lines)', lines: 100 },
    { name: 'Medium (1000 lines)', lines: 1000 },
    { name: 'Large (5000 lines)', lines: 5000 },
    { name: 'Very Large (10000 lines)', lines: 10000 }
];

console.log('🧪 Diff Checker Performance Tests\n');
console.log('Generating test data...\n');

tests.forEach(test => {
    const original = generateTestData(test.lines);
    const changed = generateTestData(test.lines).replace(/Line 50:/, 'Line 50 MODIFIED:');
    
    const startTime = Date.now();
    
    // Simulate diff creation (simplified)
    const originalLines = original.split('\n');
    const changedLines = changed.split('\n');
    
    let diffCount = 0;
    for (let i = 0; i < originalLines.length; i++) {
        if (originalLines[i] !== changedLines[i]) {
            diffCount++;
        }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`${test.name}:`);
    console.log(`  Lines: ${test.lines}`);
    console.log(`  Differences: ${diffCount}`);
    console.log(`  Time: ${duration}ms`);
    console.log(`  Status: ${duration < 1000 ? '✅ PASS' : '⚠️  SLOW'}`);
    console.log('');
});

console.log('Performance test complete!');
console.log('\nRecommended limits:');
console.log('- Small files (<1000 lines): <100ms');
console.log('- Medium files (1000-5000 lines): <500ms');
console.log('- Large files (5000-10000 lines): <1000ms');
console.log('- Very large files (>10000 lines): Consider server-side processing');
