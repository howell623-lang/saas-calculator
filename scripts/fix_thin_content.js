const fs = require('fs');
const path = require('path');

const toolsDir = path.join(process.cwd(), 'app/data/tools');
const MIN_LENGTH = 1000;

const main = () => {
    if (!fs.existsSync(toolsDir)) {
        console.log("Tools directory not found.");
        return;
    }

    const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));
    let thinCount = 0;
    const thinTools = [];

    files.forEach(f => {
        const filePath = path.join(toolsDir, f);
        try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const tool = JSON.parse(raw);

            const length = tool.article ? tool.article.reduce((acc, s) => acc + (s.body?.length || 0), 0) : 0;

            if (length < MIN_LENGTH) {
                thinCount++;
                thinTools.push({ slug: tool.slug, length });
            }
        } catch (e) {
            console.error(`Error processing ${f}:`, e.message);
        }
    });

    console.log(`Found ${thinCount} thin tools (<${MIN_LENGTH} chars).`);
    console.log("These tools will be excluded from the sitemap via 'isToolIndexable'.");

    // Save the list to a file for review
    fs.writeFileSync('thin_tools_report.json', JSON.stringify(thinTools, null, 2));
    console.log("Report saved to thin_tools_report.json");
};

main();
