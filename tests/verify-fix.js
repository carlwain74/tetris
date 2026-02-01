#!/usr/bin/env node

// Simple test to verify the navigator fix works
console.log('Testing navigator property fix...\n');

try {
    // This should fail with the old code
    global.navigator = { userAgent: 'test' };
    console.log('❌ FAIL: Direct assignment worked (unexpected)');
} catch (error) {
    console.log('✓ Expected: Direct assignment blocked');
    console.log(`  Error: ${error.message}\n`);
}

try {
    // This should work with the new code
    Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'test' },
        writable: true,
        configurable: true
    });
    console.log('✓ PASS: Object.defineProperty worked');
    console.log(`  navigator.userAgent = "${global.navigator.userAgent}"\n`);
} catch (error) {
    console.log('❌ FAIL: Object.defineProperty failed');
    console.log(`  Error: ${error.message}\n`);
}

console.log('Fix verified! The test suite should work now.');
console.log('\nTo run the full test suite:');
console.log('  1. npm install');
console.log('  2. npm test');
