const { avatarOptions, SHOP_ITEMS } = require('./controllers/gamificationController');

console.log('--- Verifying Farm Themes Shop Items ---');

const farmThemes = avatarOptions.farmTheme;
console.log('Avatar Options farmTheme:', farmThemes);

const shopFarmThemes = SHOP_ITEMS.farmTheme;
if (shopFarmThemes) {
    console.log(`Found ${shopFarmThemes.length} farm theme items in the shop.`);
    shopFarmThemes.forEach(item => {
        console.log(`- ${item.name} (${item.val}): ${item.price} pts`);
    });
} else {
    console.log('❌ Error: farmTheme items not found in SHOP_ITEMS');
}

// Basic logic check
const classic = shopFarmThemes.find(at => at.val === 'classic');
console.log('Classic Price (expected 0):', classic?.price);

const winter = shopFarmThemes.find(at => at.val === 'winter');
console.log('Winter Price (expected 150 or more):', winter?.price);
