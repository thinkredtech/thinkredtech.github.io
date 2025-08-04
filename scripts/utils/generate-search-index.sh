#!/bin/bash

# Documentation Search Index Generator
# Creates a searchable index of all documentation content

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
FRONTEND_DIR="$REPO_ROOT/frontend"
SEARCH_INDEX_DIR="$FRONTEND_DIR/public/search"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 Generating Documentation Search Index...${NC}"

# Create search index directory
mkdir -p "$SEARCH_INDEX_DIR"

# Function to extract metadata from markdown files
extract_metadata() {
    local file="$1"
    local title=$(grep -m 1 "^# " "$file" 2>/dev/null | sed 's/^# //' || basename "$file" .md)
    local relative_path="${file#$REPO_ROOT/}"
    
    # Extract description from file (first paragraph or second heading)
    local description=$(grep -A 5 "^## " "$file" 2>/dev/null | head -1 | sed 's/^## //' || echo "Documentation")
    
    # Get file stats
    local last_modified=$(stat -f "%m" "$file" 2>/dev/null || stat -c "%Y" "$file" 2>/dev/null || echo "0")
    local size=$(wc -c < "$file")
    
    echo "{
        \"title\": \"$title\",
        \"path\": \"$relative_path\",
        \"description\": \"$description\",
        \"lastModified\": $last_modified,
        \"size\": $size,
        \"type\": \"markdown\"
    }"
}

# Function to create full-text search content
create_search_content() {
    local file="$1"
    local relative_path="${file#$REPO_ROOT/}"
    
    # Remove markdown formatting for search content
    local content=$(cat "$file" | \
        sed 's/```[^`]*```//g' | \
        sed 's/`[^`]*`//g' | \
        sed 's/\[([^]]*)\]([^)]*)/\1/g' | \
        sed 's/[#*_-]//g' | \
        tr '\n' ' ' | \
        sed 's/  */ /g')
    
    echo "{
        \"path\": \"$relative_path\",
        \"content\": \"$content\"
    }"
}

echo -e "${YELLOW}📝 Processing documentation files...${NC}"

# Initialize search index
echo "[]" > "$SEARCH_INDEX_DIR/index.json"
echo "[]" > "$SEARCH_INDEX_DIR/content.json"

# Process all markdown files
index_entries=()
content_entries=()

# Process main README
if [[ -f "$REPO_ROOT/README.md" ]]; then
    echo -e "${BLUE}Processing: README.md${NC}"
    index_entries+=("$(extract_metadata "$REPO_ROOT/README.md")")
    content_entries+=("$(create_search_content "$REPO_ROOT/README.md")")
fi

# Process docs directory
find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
    echo -e "${BLUE}Processing: ${file#$REPO_ROOT/}${NC}"
    extract_metadata "$file" >> "$SEARCH_INDEX_DIR/temp_index.json"
    create_search_content "$file" >> "$SEARCH_INDEX_DIR/temp_content.json"
done

# Process frontend docs
find "$FRONTEND_DIR" -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/build/*" -type f | while read -r file; do
    echo -e "${BLUE}Processing: ${file#$REPO_ROOT/}${NC}"
    extract_metadata "$file" >> "$SEARCH_INDEX_DIR/temp_index.json"
    create_search_content "$file" >> "$SEARCH_INDEX_DIR/temp_content.json"
done

# Combine into proper JSON arrays
echo "[" > "$SEARCH_INDEX_DIR/index.json"
if [[ -f "$SEARCH_INDEX_DIR/temp_index.json" ]]; then
    sed '$!s/$/,/' "$SEARCH_INDEX_DIR/temp_index.json" >> "$SEARCH_INDEX_DIR/index.json"
    rm "$SEARCH_INDEX_DIR/temp_index.json"
fi
echo "]" >> "$SEARCH_INDEX_DIR/index.json"

echo "[" > "$SEARCH_INDEX_DIR/content.json"
if [[ -f "$SEARCH_INDEX_DIR/temp_content.json" ]]; then
    sed '$!s/$/,/' "$SEARCH_INDEX_DIR/temp_content.json" >> "$SEARCH_INDEX_DIR/content.json"
    rm "$SEARCH_INDEX_DIR/temp_content.json"
fi
echo "]" >> "$SEARCH_INDEX_DIR/content.json"

# Create search configuration
cat > "$SEARCH_INDEX_DIR/config.json" << EOF
{
    "indexVersion": "1.0",
    "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "totalDocuments": $(grep -c '"path"' "$SEARCH_INDEX_DIR/index.json" || echo "0"),
    "searchFields": [
        "title",
        "description",
        "content"
    ],
    "facets": [
        "type",
        "directory"
    ],
    "boosts": {
        "title": 3,
        "description": 2,
        "content": 1
    }
}
EOF

# Create a simple search HTML interface
cat > "$SEARCH_INDEX_DIR/search.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation Search</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f5f5f5;
        }
        .search-container { 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .search-box { 
            width: 100%; 
            padding: 15px; 
            font-size: 16px; 
            border: 2px solid #ddd; 
            border-radius: 8px; 
            margin-bottom: 20px;
        }
        .search-box:focus { 
            outline: none; 
            border-color: #007acc; 
        }
        .result { 
            padding: 15px; 
            border-bottom: 1px solid #eee; 
            margin-bottom: 10px;
        }
        .result:last-child { 
            border-bottom: none; 
        }
        .result-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #007acc; 
            margin-bottom: 5px;
        }
        .result-path { 
            font-size: 12px; 
            color: #666; 
            margin-bottom: 8px;
        }
        .result-description { 
            color: #333; 
            line-height: 1.4;
        }
        .no-results { 
            text-align: center; 
            color: #666; 
            font-style: italic; 
            margin-top: 40px;
        }
        .stats { 
            font-size: 12px; 
            color: #666; 
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="search-container">
        <h1>📚 Documentation Search</h1>
        <input type="text" class="search-box" placeholder="Search documentation..." id="searchInput">
        <div class="stats" id="stats"></div>
        <div id="results"></div>
    </div>

    <script>
        let searchIndex = [];
        let searchContent = [];

        // Load search data
        Promise.all([
            fetch('./index.json').then(r => r.json()),
            fetch('./content.json').then(r => r.json())
        ]).then(([index, content]) => {
            searchIndex = index;
            searchContent = content;
            document.getElementById('stats').textContent = `${index.length} documents indexed`;
        });

        // Simple search function
        function search(query) {
            if (!query.trim()) return [];
            
            const terms = query.toLowerCase().split(' ');
            const results = [];

            searchIndex.forEach((item, index) => {
                let score = 0;
                const content = searchContent[index]?.content?.toLowerCase() || '';
                const title = item.title.toLowerCase();
                const description = item.description.toLowerCase();

                terms.forEach(term => {
                    if (title.includes(term)) score += 3;
                    if (description.includes(term)) score += 2;
                    if (content.includes(term)) score += 1;
                });

                if (score > 0) {
                    results.push({ ...item, score });
                }
            });

            return results.sort((a, b) => b.score - a.score);
        }

        // Display results
        function displayResults(results) {
            const resultsDiv = document.getElementById('results');
            
            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results">No results found</div>';
                return;
            }

            resultsDiv.innerHTML = results.map(result => `
                <div class="result">
                    <div class="result-title">${result.title}</div>
                    <div class="result-path">${result.path}</div>
                    <div class="result-description">${result.description}</div>
                </div>
            `).join('');
        }

        // Search on input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const results = search(e.target.value);
            displayResults(results);
        });
    </script>
</body>
</html>
EOF

echo -e "${GREEN}✅ Search index generated successfully!${NC}"
echo "📊 Index location: $SEARCH_INDEX_DIR"
echo "🔍 Search interface: $SEARCH_INDEX_DIR/search.html"
echo ""
echo -e "${YELLOW}💡 To integrate search into your website:${NC}"
echo "1. Copy the search files to your web server"
echo "2. Include the search component in your site"
echo "3. Configure search endpoint in your application"
