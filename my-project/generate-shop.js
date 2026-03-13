const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('dicebear-options.json'));

const categories = {
    head: schema.head.default,
    face: schema.face.default,
    facialHair: schema.facialHair.default,
    accessories: schema.accessories.default,
    clothingColor: schema.clothingColor.default,
    skinColor: schema.skinColor.default,
    headContrastColor: schema.headContrastColor.default,
    backgroundColor: ['transparent', 'f3f4f6', 'fca5a5', 'fcd34d', '86efac', '93c5fd', 'c4b5fd', 'f9a8d4']
};

let shopItems = {};
for (const [cat, items] of Object.entries(categories)) {
    shopItems[cat] = items.map((val, idx) => ({
        id: `${cat}_${val}`,
        name: val.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        price: idx === 0 ? 0 : 150, // first item is free, others cost 150 points
        val: val
    }));
}

// Add empty strings 'None' defaults for items that can be removed
shopItems.facialHair.unshift({ id: 'facialHair_None', name: 'None', price: 0, val: '' });
shopItems.accessories.unshift({ id: 'accessories_None', name: 'None', price: 0, val: '' });

fs.writeFileSync('new-shop-items.json', JSON.stringify(shopItems, null, 4));
console.log('Done mapping.');
