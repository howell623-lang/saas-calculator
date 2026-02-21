const fs = require('fs');
const path = require('path');

const toolsDir = path.join(process.cwd(), 'app/data/tools');

const main = () => {
    if (!fs.existsSync(toolsDir)) {
        console.log("Tools directory not found at", toolsDir);
        return;
    }
    const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));
    const total = files.length;
    let indexable = 0;

    console.log(`Analyzing ${total} tools...`);

    files.forEach(f => {
        const slug = f.replace('.json', '');
        try {
            const raw = fs.readFileSync(path.join(toolsDir, f), 'utf-8');
            const tool = JSON.parse(raw);

            const hasArticle = tool.article && Array.isArray(tool.article) && tool.article.length >= 2;
            const length = tool.article ? tool.article.reduce((acc, s) => acc + (s.body?.length || 0), 0) : 0;
            const isIndexable = hasArticle && length >= 1000;

            if (isIndexable) {
                indexable++;
                // console.log(`[PASS] ${slug} (${length} chars)`);
            } else {
                console.log(`[FAIL] ${slug} (${length} chars) - Needs ${Math.max(0, 1000 - length)} more chars or sections`);
            }
        } catch (e) {
            console.error(`Error reading ${slug}:`, e.message);
        }
    });

    console.log(`\nSummary: ${indexable}/${total} tools are indexable.`);
};

main();
