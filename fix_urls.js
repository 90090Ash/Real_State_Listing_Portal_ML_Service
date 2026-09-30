const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            // The bad string: '`$ {process.env.REACT_APP_API_URL || "http://localhost:5000"}'
            // Need to fix it to just use an API variable.
            
            // Actually, we can replace all axios.get('.../api/properties') etc.
            content = content.replace(/'`\$ \{process.env.REACT_APP_API_URL \|\| "http:\/\/localhost:5000"\}(\/api\/.*?)'/g, 'API_URL + \'$1\'');
            content = content.replace(/'`\$ \{process.env.REACT_APP_API_URL \|\| "http:\/\/localhost:5000"\}'/g, 'API_URL');
            
            content = content.replace(/http:\/\/localhost:5000/g, 'API_URL');
            
            // Prepend const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            if (originalContent !== content && !content.includes('const API_URL =')) {
                // Find first line after imports
                const lines = content.split('\n');
                let insertIdx = 0;
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].trim() === '' || lines[i].startsWith('import')) {
                        insertIdx = i + 1;
                    } else {
                        break;
                    }
                }
                lines.splice(insertIdx, 0, '\nconst API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";\n');
                content = lines.join('\n');
            }

            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

replaceInFiles('./client/src');
