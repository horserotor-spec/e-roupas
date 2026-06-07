const fs = require('fs');
const path = 'src/lib/api/orders.ts';
let content = fs.readFileSync(path, 'utf8');

const fields = `
    corte_grid?: Record<string, number>;
    costura_grid?: Record<string, number>;
    corte_unit_price?: number;
    costura_unit_price?: number;
`;

if (!content.includes('corte_grid')) {
    content = content.replace(
        /costura_end_date\?:\s*string\s*\|\s*null;/,
        "costura_end_date?: string | null;" + fields
    );
    fs.writeFileSync(path, content, 'utf8');
    console.log('orders.ts updated');
} else {
    console.log('orders.ts already has these fields');
}
