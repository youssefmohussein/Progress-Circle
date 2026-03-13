const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, 'controllers', 'gamificationController.js');
const content = fs.readFileSync(controllerPath, 'utf8');

console.log('--- Verifying Expanded Avatar Options Pricing ---');

const checkCategory = (cat, shouldBeFree) => {
    // This is a bit tricky with string parsing, but let's look for the category in avatarOptions
    // and then check if the price logic would make it free.
    const freeCatsMatch = content.match(/const FREE_CATEGORIES = \[(.*?)\];/);
    const freeCats = freeCatsMatch ? freeCatsMatch[1].replace(/['"\s]/g, '').split(',') : [];
    
    const isCatInFreeList = freeCats.includes(cat);
    
    if (isCatInFreeList === shouldBeFree) {
        console.log(`✅ ${cat}: Properly ${shouldBeFree ? 'marked as FREE category' : 'not in free list'}`);
    } else {
        console.log(`❌ ${cat}: Expected to be ${shouldBeFree ? 'FREE' : 'PAID'} but was not.`);
    }
};

checkCategory('skinColor', true);
checkCategory('clothingColor', true);
checkCategory('headContrastColor', true);
checkCategory('backgroundColor', true);
checkCategory('head', false);
checkCategory('face', false);

console.log('\n--- Verifying price logic (idx === 0 || val === \'\' || FREE_CATEGORIES.includes(cat)) ---');
if (content.includes("price: (idx === 0 || val === '' || FREE_CATEGORIES.includes(cat)) ? 0 : 150")) {
    console.log('✅ Price logic matches expectation for categorical free items.');
} else {
    console.log('❌ Price logic mismatch!');
}
