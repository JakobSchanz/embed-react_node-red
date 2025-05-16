const fs = require('fs').promises;
const path = require('path');
const nodesDir = path.resolve(__dirname, '../../data/custom-nodes');

const config = {
    path: "../../data/programm_data/node_templates/",
    js_template_path: "js_template/js_node_template.txt",
    html_template_path: "html_template/html_node_template.txt",
    js_file: ".js",
    html_file: ".html"
}

function generateSafeFileName(name) {
    return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

async function generateNodeContent(safeName, name, description, category, color, icon, templateFilePath) {
    const funcName = safeName.replace(/-/g, '_');

    let templateContent;
    try {
        templateContent = await fs.readFile(templateFilePath, 'utf8');
    } catch (err) {
        throw new Error(`Error reading the HTML template file: ${err.message}`);
    }
    const generatedContent = templateContent
        .replace(/{{category}}/g, category)
        .replace(/{{funcName}}/g, funcName)
        .replace(/{{safeName}}/g, safeName)
        .replace(/{{name}}/g, name)
        .replace(/{{color}}/g, color)
        .replace(/{{icon}}/g, icon)
        .replace(/{{description}}/g, name + ": " + description);

    return generatedContent;
}

async function createCustomNodesFromDB(nodes) {
    await fs.rm(nodesDir, { recursive: true, force: true });
    await fs.mkdir(nodesDir, { recursive: true });
    const jsTemplateFilePath = path.join(__dirname, config.path + config.js_template_path);
    const htmlTemplateFilePath = path.join(__dirname, config.path + config.html_template_path);

    for (const { name, description, category, color, icon } of nodes) {
        const safeName = generateSafeFileName(name);
        const js = await generateNodeContent(safeName, name, description, category, color, icon, jsTemplateFilePath);
        const html = await generateNodeContent(safeName, name, description, category, color, icon, htmlTemplateFilePath);
        const nodePath = path.join(nodesDir, safeName);
        await fs.mkdir(nodePath, { recursive: true });
        await fs.writeFile(path.join(nodePath, safeName + config.js_file), js);
        await fs.writeFile(path.join(nodePath, safeName + config.html_file), html);
    }
}

module.exports = { createCustomNodesFromDB };