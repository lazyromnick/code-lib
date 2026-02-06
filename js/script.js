const languages = ['C++', 'Java', 'Python', 'HTML', 'CSS', 'JS'];
        
        const languageMap = {
            'C++': 'cpp',
            'Java': 'java',
            'Python': 'python',
            'HTML': 'html',
            'CSS': 'css',
            'JS': 'javascript'
        };
        
        const defaultSnippets = {
            'C++': [
                {
                    id: 1,
                    title: 'Binary Search',
                    category: 'Algorithms',
                    tags: ['Array', 'Search', 'O(log n)'],
                    code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    
    return -1;
}`,
                    explanation: 'Binary search efficiently finds an element in a sorted array with O(log n) time complexity. It repeatedly divides the search interval in half.'
                },
                {
                    id: 2,
                    title: 'Vector Initialization',
                    category: 'Data Structures',
                    tags: ['Vector', 'STL', 'Beginner'],
                    difficulty: 'Beginner',
                    favorite: false,
                    code: `vector<int> v1;
vector<int> v2(5);
vector<int> v3(5, 10);
vector<int> v4 = {1, 2, 3, 4, 5};
vector<vector<int>> matrix(3, vector<int>(4, 0));`,
                    explanation: 'Different ways to initialize vectors in C++. Vectors are dynamic arrays that automatically resize.'
                }
            ],
            'Java': [
                {
                    id: 3,
                    title: 'ArrayList Operations',
                    category: 'Data Structures',
                    tags: ['ArrayList', 'Collections', 'Beginner'],
                    code: `ArrayList<Integer> list = new ArrayList<>();
list.add(5);
list.add(0, 10);
list.get(0);
list.set(0, 20);
list.remove(0);
list.size();`,
                    explanation: 'Common ArrayList operations in Java. Provides O(1) random access and dynamic resizing.'
                },
                {
                    id: 4,
                    title: 'HashMap Usage',
                    category: 'Data Structures',
                    tags: ['HashMap', 'Key-Value', 'O(1)'],
                    code: `HashMap<String, Integer> map = new HashMap<>();
map.put("apple", 5);
map.get("apple");
map.getOrDefault("banana", 0);
map.containsKey("apple");`,
                    explanation: 'HashMap operations with O(1) average time complexity. Perfect for frequency counting and lookups.'
                }
            ],
            'Python': [
                {
                    id: 5,
                    title: 'List Comprehension',
                    category: 'Syntax',
                    tags: ['List', 'Pythonic', 'Beginner'],
                    code: `squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
matrix = [[i+j for j in range(3)] for i in range(3)]`,
                    explanation: 'List comprehensions provide a concise way to create lists. More readable than traditional loops.'
                }
            ],
            'HTML': [
                {
                    id: 6,
                    title: 'Form Structure',
                    category: 'Syntax',
                    tags: ['Form', 'Input', 'Accessibility'],
                    code: `<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" required>
    
    <button type="submit">Submit</button>
</form>`,
                    explanation: 'Basic HTML form with accessibility features. Always use labels for better UX.'
                }
            ],
            'CSS': [
                {
                    id: 7,
                    title: 'Flexbox Centering',
                    category: 'Patterns',
                    tags: ['Flexbox', 'Layout', 'Center'],
                    code: `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}`,
                    explanation: 'Simple way to center content both horizontally and vertically using Flexbox.'
                }
            ],
            'JS': [
                {
                    id: 8,
                    title: 'Array Methods',
                    category: 'Syntax',
                    tags: ['Array', 'Functional', 'ES6'],
                    code: `const arr = [1, 2, 3, 4, 5];
const doubled = arr.map(x => x * 2);
const evens = arr.filter(x => x % 2 === 0);
const sum = arr.reduce((acc, x) => acc + x, 0);`,
                    explanation: 'Modern JavaScript array methods for functional programming. Immutable and chainable.'
                }
            ]
        };

        let snippets = {};
        let currentLang = localStorage.getItem('currentLanguage') || 'C++';
        let currentSnippet = null;
        let isEditing = false;
        let editingId = null;
        let searchQuery = '';
        let currentFilter = 'all';
        let selectedTheme = 'dracula';
        let screenshots = [];
        let currentPreviewIndex = -1;
        let sortMode = 'manual';
        let draggedElement = null;
        let draggedSnippetId = null;
        let folders = {};
        let currentFolder = null;
        let showAutoFolders = true;
        let showCustomFolders = true;

        const themeStyles = {
            dracula: {
                bg: '#282a36',
                titleBg: '#44475a',
                text: '#f8f8f2',
                accent: '#bd93f9',
                code: '#f8f8f2',
                comment: '#6272a4',
                keyword: '#ff79c6',
                string: '#f1fa8c',
                function: '#50fa7b'
            },
            monokai: {
                bg: '#272822',
                titleBg: '#3e3d32',
                text: '#f8f8f2',
                accent: '#a6e22e',
                code: '#f8f8f2',
                comment: '#75715e',
                keyword: '#f92672',
                string: '#e6db74',
                function: '#a6e22e'
            },
            nord: {
                bg: '#2e3440',
                titleBg: '#3b4252',
                text: '#eceff4',
                accent: '#88c0d0',
                code: '#d8dee9',
                comment: '#616e88',
                keyword: '#81a1c1',
                string: '#a3be8c',
                function: '#88c0d0'
            },
            'github-light': {
                bg: '#ffffff',
                titleBg: '#f6f8fa',
                text: '#24292f',
                accent: '#0969da',
                code: '#24292f',
                comment: '#6e7781',
                keyword: '#cf222e',
                string: '#0a3069',
                function: '#8250df'
            },
            synthwave: {
                bg: '#2b213a',
                titleBg: '#241b2f',
                text: '#ffffff',
                accent: '#ff7edb',
                code: '#ffffff',
                comment: '#848bbd',
                keyword: '#ff7edb',
                string: '#fede5d',
                function: '#36f9f6'
            },
            ocean: {
                bg: '#0f4c75',
                titleBg: '#1b262c',
                text: '#bbe1fa',
                accent: '#3282b8',
                code: '#bbe1fa',
                comment: '#7fa8c9',
                keyword: '#3282b8',
                string: '#ffd23f',
                function: '#61dafb'
            }
        };

        // Initialize
        function loadSnippets() {
            const saved = localStorage.getItem('codeSnippets');
            if (saved) {
                try {
                    snippets = JSON.parse(saved);
                    languages.forEach(lang => {
                        if (!snippets[lang]) snippets[lang] = defaultSnippets[lang] || [];
                    });
                } catch (e) {
                    console.error('Error loading snippets:', e);
                    languages.forEach(lang => {
                        snippets[lang] = defaultSnippets[lang] || [];
                    });
                }
            } else {
                languages.forEach(lang => {
                    snippets[lang] = defaultSnippets[lang] || [];
                });
                saveSnippets();
            }
            
            const savedSortMode = localStorage.getItem('sortMode');
            if (savedSortMode) {
                sortMode = savedSortMode;
            }
            
            const savedAutoFolders = localStorage.getItem('showAutoFolders');
            if (savedAutoFolders !== null) {
                showAutoFolders = savedAutoFolders === 'true';
            }

            const savedCustomFolders = localStorage.getItem('showCustomFolders');
            if (savedCustomFolders !== null) {
                showCustomFolders = savedCustomFolders === 'true';
            }
        }

        function saveSnippets() {
            try {
                localStorage.setItem('codeSnippets', JSON.stringify(snippets));
            } catch (e) {
                console.error('Error saving snippets:', e);
                showToast('Error saving snippets!');
            }
        }

        function loadFolders() {
            const saved = localStorage.getItem('codeFolders');
            if (saved) {
                try {
                    folders = JSON.parse(saved);
                } catch (e) {
                    console.error('Error loading folders:', e);
                    languages.forEach(lang => {
                        folders[lang] = [];
                    });
                }
            } else {
                languages.forEach(lang => {
                    folders[lang] = [];
                });
            }
        }

        function saveFolders() {
            try {
                localStorage.setItem('codeFolders', JSON.stringify(folders));
            } catch (e) {
                console.error('Error saving folders:', e);
            }
        }

        function loadScreenshots() {
            const saved = localStorage.getItem('codeScreenshots');
            if (saved) {
                screenshots = JSON.parse(saved);
            }
            updateGalleryBadge();
        }

        function saveScreenshots() {
            try {
                localStorage.setItem('codeScreenshots', JSON.stringify(screenshots));
                updateGalleryBadge();
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    showToast('Storage full! Delete old screenshots.');
                }
            }
        }

        function updateGalleryBadge() {
            const badge = document.getElementById('galleryBadge');
            if (screenshots.length > 0) {
                badge.textContent = screenshots.length;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }

        function loadTheme() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
                const icon = document.querySelector('#themeToggle i');
                if (icon) icon.className = 'bi bi-sun-fill';
            }
        }

        function renderLanguageTabs() {
            const container = document.getElementById('languageTabs');
            container.innerHTML = languages.map(lang => 
                `<button class="lang-tab ${lang === currentLang ? 'active' : ''}" data-lang="${lang}">${lang}</button>`
            ).join('');

            document.querySelectorAll('.lang-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    currentLang = tab.dataset.lang;
                    localStorage.setItem('currentLanguage', currentLang);
                    clearFolderFilter();
                    renderLanguageTabs();
                    if (showCustomFolders) renderFolderChips();
                    if (showAutoFolders) renderAutoFolderChips();
                    renderSnippetList();
                });
            });
        }
        
        function renderFolderChips() {
            const container = document.getElementById('folderChips');
            if (!container) return;
            
            const langFolders = folders[currentLang] || [];
            
            if (!showCustomFolders || langFolders.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            container.innerHTML = langFolders.map(folder => `
                <button class="filter-pill folder-chip" data-folder-id="${folder.id}">
                    <i class="bi bi-folder"></i>
                    ${escapeHtml(folder.name)}
                    <span style="opacity: 0.7; margin-left: 4px;">(${folder.snippetIds.length})</span>
                </button>
            `).join('');
            
            document.querySelectorAll('.folder-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const folderId = parseInt(chip.dataset.folderId);
                    selectFolder(folderId);
                });
            });
        }

        function generateAutoFolders() {
            if (!currentLang || !snippets[currentLang]) {
                return [];
            }
            
            const langSnippets = snippets[currentLang] || [];
            const tagMap = {};
            
            langSnippets.forEach(snippet => {
                if (snippet.tags && snippet.tags.length > 0) {
                    snippet.tags.forEach(tag => {
                        if (!tagMap[tag]) {
                            tagMap[tag] = [];
                        }
                        tagMap[tag].push(snippet.id);
                    });
                }
            });
            
            return Object.keys(tagMap).sort().map(tag => ({
                id: `auto_${tag}`,
                name: tag,
                snippetIds: tagMap[tag],
                isAuto: true
            }));
        }

        function renderAutoFolderChips() {
            const container = document.getElementById('autoFolderChips');
            if (!container || !showAutoFolders) {
                if (container) container.innerHTML = '';
                return;
            }
            
            const autoFolders = generateAutoFolders();
            
            if (autoFolders.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            container.innerHTML = `
                <div class="folder-separator">
                    <span>🏷️ Tags</span>
                </div>
            ` + autoFolders.map(folder => `
                <button class="filter-pill auto-folder-chip" data-auto-folder-id="${escapeHtml(folder.id)}">
                    <i class="bi bi-tag"></i>
                    ${escapeHtml(folder.name)}
                    <span style="opacity: 0.7; margin-left: 4px;">(${folder.snippetIds.length})</span>
                </button>
            `).join('');
            
            document.querySelectorAll('.auto-folder-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const folderId = chip.dataset.autoFolderId;
                    selectAutoFolder(folderId);
                });
            });
        }

        function selectAutoFolder(folderId) {
            const autoFolders = generateAutoFolders();
            const folder = autoFolders.find(f => f.id === folderId);
            
            if (!folder) return;
            
            currentFolder = folder;
            
            const navContainer = document.getElementById('folderNavContainer');
            const folderNameEl = document.getElementById('currentFolderName');
            
            if (navContainer && folderNameEl) {
                navContainer.style.display = 'block';
                folderNameEl.innerHTML = `<i class="bi bi-tag" style="margin-right: 6px;"></i>${folder.name}`;
            }
            
            document.querySelectorAll('.folder-chip, .auto-folder-chip').forEach(chip => {
                chip.classList.remove('active');
            });
            
            const activeChip = document.querySelector(`[data-auto-folder-id="${folderId}"]`);
            if (activeChip) activeChip.classList.add('active');
            
            renderSnippetList();
        }

        function toggleAutoFolders() {
            showAutoFolders = !showAutoFolders;
            localStorage.setItem('showAutoFolders', showAutoFolders.toString());
            
            const toggleBtn = document.getElementById('toggleAutoFoldersBtn');
            
            if (showAutoFolders) {
                renderAutoFolderChips();
                if (toggleBtn) {
                    toggleBtn.innerHTML = '<i class="bi bi-eye-slash"></i> Hide Tag Folders';
                }
                showToast('Tag folders shown');
            } else {
                const container = document.getElementById('autoFolderChips');
                if (container) container.innerHTML = '';
                if (toggleBtn) {
                    toggleBtn.innerHTML = '<i class="bi bi-eye"></i> Show Tag Folders';
                }
                
                if (currentFolder && currentFolder.isAuto) {
                    clearFolderFilter();
                }
                showToast('Tag folders hidden');
            }
        }

        function toggleCustomFolders() {
            showCustomFolders = !showCustomFolders;
            localStorage.setItem('showCustomFolders', showCustomFolders.toString());
            
            const toggleBtn = document.getElementById('toggleCustomFoldersBtn');
            
            if (showCustomFolders) {
                renderFolderChips();
                if (toggleBtn) {
                    toggleBtn.innerHTML = '<i class="bi bi-eye-slash"></i> Hide Folders';
                }
                showToast('Custom folders shown');
            } else {
                const container = document.getElementById('folderChips');
                if (container) container.innerHTML = '';
                if (toggleBtn) {
                    toggleBtn.innerHTML = '<i class="bi bi-eye"></i> Show Folders';
                }
                
                if (currentFolder && !currentFolder.isAuto) {
                    clearFolderFilter();
                }
                showToast('Custom folders hidden');
            }
        }

        function sortSnippets(snippetArray) {
            let sorted = [...snippetArray];
            
            switch(sortMode) {
                case 'alphabetical':
                    sorted.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                    
                case 'tags':
                    sorted.sort((a, b) => {
                        const aHasTags = a.tags && a.tags.length > 0;
                        const bHasTags = b.tags && b.tags.length > 0;
                        
                        if (!aHasTags && !bHasTags) return 0;
                        if (!aHasTags) return -1;
                        if (!bHasTags) return 1;
                        
                        return a.tags[0].localeCompare(b.tags[0]);
                    });
                    break;
                    
                case 'manual':
                default:
                    break;
            }
            
            return sorted;
        }

        function handleDragStart(e) {
            draggedElement = e.currentTarget;
            draggedSnippetId = parseInt(e.currentTarget.dataset.id);
            e.currentTarget.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragEnd(e) {
            e.currentTarget.classList.remove('dragging');
            document.querySelectorAll('.snippet-card').forEach(card => {
                card.classList.remove('drag-over');
            });
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            
            const target = e.currentTarget;
            if (target !== draggedElement) {
                target.classList.add('drag-over');
            }
            
            return false;
        }

        function handleDragLeave(e) {
            e.currentTarget.classList.remove('drag-over');
        }

        function handleDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            e.currentTarget.classList.remove('drag-over');
            
            if (draggedElement !== e.currentTarget) {
                const draggedId = draggedSnippetId;
                const targetId = parseInt(e.currentTarget.dataset.id);
                
                const langSnippets = snippets[currentLang];
                const draggedIndex = langSnippets.findIndex(s => s.id === draggedId);
                const targetIndex = langSnippets.findIndex(s => s.id === targetId);
                
                const [removed] = langSnippets.splice(draggedIndex, 1);
                langSnippets.splice(targetIndex, 0, removed);
                
                saveSnippets();
                renderSnippetList();
                showToast('Order updated!');
            }
            
            return false;
        }

        function setSortMode(mode) {
            sortMode = mode;
            localStorage.setItem('sortMode', mode);
            
            const modeText = {
                'manual': 'Manual Order',
                'alphabetical': 'Alphabetical (A-Z)',
                'tags': 'By Tags'
            };
            
            document.getElementById('currentSortMode').textContent = modeText[mode];
            renderSnippetList();
            showToast(`Sorted by: ${modeText[mode]}`);
        }
        
        function createFolder() {
            const folderName = prompt('Enter folder name:');
            if (!folderName || !folderName.trim()) return;
            
            const newFolder = {
                id: Date.now(),
                name: folderName.trim(),
                snippetIds: []
            };
            
            if (!folders[currentLang]) folders[currentLang] = [];
            folders[currentLang].push(newFolder);
            saveFolders();
            renderFolderList();
            if (showCustomFolders) renderFolderChips();
            showToast(`Folder "${folderName}" created!`);
        }

        function deleteFolder(folderId) {
            if (!confirm('Delete this folder? Snippets will not be deleted.')) return;
            
            folders[currentLang] = folders[currentLang].filter(f => f.id !== folderId);
            if (currentFolder && currentFolder.id === folderId) {
                currentFolder = null;
            }
            saveFolders();
            renderFolderList();
            if (showCustomFolders) renderFolderChips();
            renderSnippetList();
            showToast('Folder deleted');
        }

        function addSnippetToFolder(snippetId, folderId) {
            const folder = folders[currentLang].find(f => f.id === folderId);
            if (!folder) return;
            
            if (!folder.snippetIds.includes(snippetId)) {
                folder.snippetIds.push(snippetId);
                saveFolders();
                if (showCustomFolders) renderFolderChips();
                showToast('Added to folder!');
            }
        }

        function removeSnippetFromFolder(snippetId, folderId) {
            const folder = folders[currentLang].find(f => f.id === folderId);
            if (!folder) return;
            
            folder.snippetIds = folder.snippetIds.filter(id => id !== snippetId);
            saveFolders();
            if (showCustomFolders) renderFolderChips();
            renderSnippetList();
            showToast('Removed from folder');
        }

        function renderFolderList() {
            const container = document.getElementById('folderList');
            if (!container) return;
            
            const langFolders = folders[currentLang] || [];
            
            if (langFolders.length === 0) {
                container.innerHTML = '<p style="color: var(--text-tertiary); font-size: 0.85rem; padding: 10px;">No folders yet</p>';
                return;
            }
            
            container.innerHTML = langFolders.map(folder => `
                <div class="folder-item ${currentFolder && currentFolder.id === folder.id ? 'active' : ''}" 
                     onclick="selectFolder(${folder.id})">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="bi bi-folder${currentFolder && currentFolder.id === folder.id ? '-fill' : ''}"></i>
                        <span>${escapeHtml(folder.name)}</span>
                        <span style="color: var(--text-tertiary); font-size: 0.75rem;">(${folder.snippetIds.length})</span>
                    </div>
                    <button class="icon-btn" onclick="event.stopPropagation(); deleteFolder(${folder.id})" 
                            style="width: 30px; height: 30px; font-size: 0.9rem;">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        function selectFolder(folderId) {
            const folder = folders[currentLang].find(f => f.id === folderId);
            currentFolder = folder || null;
            
            const navContainer = document.getElementById('folderNavContainer');
            const folderNameEl = document.getElementById('currentFolderName');
            
            if (currentFolder) {
                if (navContainer) navContainer.style.display = 'block';
                if (folderNameEl) folderNameEl.textContent = currentFolder.name;
                
                document.querySelectorAll('.folder-chip').forEach(chip => {
                    chip.classList.remove('active');
                    if (parseInt(chip.dataset.folderId) === folderId) {
                        chip.classList.add('active');
                    }
                });
            } else {
                if (navContainer) navContainer.style.display = 'none';
                document.querySelectorAll('.folder-chip').forEach(chip => {
                    chip.classList.remove('active');
                });
            }
            
            renderFolderList();
            renderSnippetList();
        }

        function clearFolderFilter() {
            currentFolder = null;
            
            const navContainer = document.getElementById('folderNavContainer');
            if (navContainer) {
                navContainer.style.display = 'none';
            }
            
            document.querySelectorAll('.folder-chip, .auto-folder-chip').forEach(chip => {
                chip.classList.remove('active');
            });
            
            renderFolderList();
            renderSnippetList();
            showToast('Showing all snippets');
        }

        function renderSnippetList() {
            const container = document.getElementById('snippetList');
            if (!container) return;
            
            let langSnippets = snippets[currentLang] || [];
            
            if (currentFolder) {
                langSnippets = langSnippets.filter(s => currentFolder.snippetIds.includes(s.id));
            }
            
            if (searchQuery) {
                langSnippets = langSnippets.filter(s => 
                    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (s.tags && s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
                );
            }
            
            if (currentFilter === 'favorites') {
                langSnippets = langSnippets.filter(s => s.favorite);
            } else if (currentFilter !== 'all') {
                langSnippets = langSnippets.filter(s => s.difficulty && s.difficulty.toLowerCase() === currentFilter);
            }

            langSnippets = sortSnippets(langSnippets);

            if (langSnippets.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <div class="empty-title">${searchQuery || currentFilter !== 'all' || currentFolder ? 'No snippets found' : 'No snippets yet'}</div>
                        <div class="empty-desc">${searchQuery || currentFilter !== 'all' || currentFolder ? 'Try a different search or filter' : 'Create your first code snippet to get started.'}</div>
                        ${!searchQuery && currentFilter === 'all' && !currentFolder ? '<button class="empty-cta" onclick="openModal()">Create First Snippet</button>' : ''}
                    </div>
                `;
                return;
            }

            const categories = {};
            langSnippets.forEach(snippet => {
                if (!categories[snippet.category]) categories[snippet.category] = [];
                categories[snippet.category].push(snippet);
            });

            container.innerHTML = Object.keys(categories).map(cat => `
                <div class="category-section">
                    <div class="category-header">${cat}</div>
                    ${categories[cat].map((snippet, index) => `
                        <div class="snippet-card ${currentSnippet && currentSnippet.id === snippet.id ? 'active' : ''}" 
                             data-id="${snippet.id}"
                             data-index="${index}"
                             draggable="${sortMode === 'manual'}"
                             >
                            <button class="favorite-btn ${snippet.favorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${snippet.id})">
                                <i class="bi bi-bookmark${snippet.favorite ? '-fill' : ''}"></i>
                            </button>
                            <div class="snippet-card-header">
                                <div>
                                    ${snippet.difficulty ? `<span class="difficulty-badge difficulty-${snippet.difficulty.toLowerCase()}">${snippet.difficulty}</span>` : ''}
                                    <div class="snippet-card-title">${escapeHtml(snippet.title)}</div>
                                    <div class="snippet-card-desc">${escapeHtml(snippet.explanation.substring(0, 80))}...</div>
                                </div>
                                <div class="chevron-icon">›</div>
                            </div>
                            ${snippet.tags ? `
                                <div class="snippet-tags">
                                    ${snippet.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `).join('');

            document.querySelectorAll('.snippet-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = parseInt(card.dataset.id);
                    const snippet = snippets[currentLang].find(s => s.id === id);
                    if (snippet) showDetail(snippet);
                });

                if (sortMode === 'manual') {
                    card.addEventListener('dragstart', handleDragStart);
                    card.addEventListener('dragend', handleDragEnd);
                    card.addEventListener('dragover', handleDragOver);
                    card.addEventListener('drop', handleDrop);
                    card.addEventListener('dragleave', handleDragLeave);
                }
            });
        }

        function showDetail(snippet) {
            const langFolders = folders[currentLang] || [];
            currentSnippet = snippet;
            document.getElementById('detailTitle').textContent = snippet.title;
            
            let codeDisplay = '';
            try {
                if (typeof hljs !== 'undefined') {
                    const langKey = languageMap[currentLang] || 'plaintext';
                    const highlightedCode = hljs.highlight(snippet.code, { language: langKey }).value;
                    codeDisplay = `<pre><code class="hljs">${highlightedCode}</code></pre>`;
                } else {
                    codeDisplay = `<pre>${escapeHtml(snippet.code)}</pre>`;
                }
            } catch (e) {
                codeDisplay = `<pre>${escapeHtml(snippet.code)}</pre>`;
            }
            
            document.getElementById('detailContent').innerHTML = `
                <div class="detail-section">
                    ${snippet.difficulty ? `<span class="difficulty-badge difficulty-${snippet.difficulty.toLowerCase()}">${snippet.difficulty}</span>` : ''}
                    ${snippet.tags ? `
                        <div class="snippet-tags" style="margin-top: 12px;">
                            ${snippet.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${langFolders && langFolders.length > 0 ? `
                        <div style="margin-top: 12px;">
                            <button class="btn btn-primary" onclick="showFolderSelector()" style="padding: 8px 16px; font-size: 0.85rem;">
                                <i class="bi bi-folder-plus"></i> Add to Folder
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="detail-section">
                    <div class="detail-section-title">Code</div>
                    <div class="code-block">${codeDisplay}</div>
                </div>
                <div class="detail-section">
                    <div class="detail-section-title">Explanation</div>
                    <div class="explanation-text">${escapeHtml(snippet.explanation)}</div>
                </div>
            `;
            document.getElementById('detailView').classList.add('active');
        }
        
        function showFolderSelector() {
            if (!currentSnippet) return;
            
            const langFolders = folders[currentLang] || [];
            if (langFolders.length === 0) {
                if (confirm('No folders yet. Create one now?')) {
                    createFolder();
                }
                return;
            }
            
            document.getElementById('folderSelectorModal').classList.add('active');
            renderFolderSelectorList();
        }

        function renderFolderSelectorList() {
            const container = document.getElementById('folderSelectorList');
            const langFolders = folders[currentLang] || [];
            
            container.innerHTML = langFolders.map(folder => {
                const isInFolder = folder.snippetIds.includes(currentSnippet.id);
                return `
                    <div class="folder-selector-item ${isInFolder ? 'selected' : ''}" 
                         onclick="toggleSnippetInFolder(${folder.id})">
                        <i class="bi bi-folder${isInFolder ? '-check' : ''}"></i>
                        <span>${escapeHtml(folder.name)}</span>
                        <span style="color: var(--text-tertiary); font-size: 0.75rem;">(${folder.snippetIds.length})</span>
                        ${isInFolder ? '<i class="bi bi-check-circle-fill" style="color: var(--success-green); margin-left: auto;"></i>' : ''}
                    </div>
                `;
            }).join('');
        }

        function toggleSnippetInFolder(folderId) {
            const folder = folders[currentLang].find(f => f.id === folderId);
            if (!folder) return;
            
            if (folder.snippetIds.includes(currentSnippet.id)) {
                removeSnippetFromFolder(currentSnippet.id, folderId);
            } else {
                addSnippetToFolder(currentSnippet.id, folderId);
            }
            
            renderFolderSelectorList();
        }

        function hideDetail() {
            document.getElementById('detailView').classList.remove('active');
            currentSnippet = null;
            renderSnippetList();
        }

        function openModal(editing = false) {
            isEditing = editing;
            if (editing && currentSnippet) {
                editingId = currentSnippet.id;
                document.getElementById('modalTitle').textContent = 'Edit Snippet';
                document.getElementById('titleInput').value = currentSnippet.title;
                document.getElementById('categoryInput').value = currentSnippet.category;
                document.getElementById('codeInput').value = currentSnippet.code;
                document.getElementById('explanationInput').value = currentSnippet.explanation;
                document.getElementById('difficultyInput').value = currentSnippet.difficulty || '';
                document.getElementById('tagsInput').value = currentSnippet.tags ? currentSnippet.tags.join(', ') : '';
                document.getElementById('saveBtn').textContent = 'Update';
            } else {
                editingId = null;
                document.getElementById('modalTitle').textContent = 'Add Snippet';
                document.getElementById('titleInput').value = '';
                document.getElementById('categoryInput').value = 'Data Structures';
                document.getElementById('codeInput').value = '';
                document.getElementById('explanationInput').value = '';
                document.getElementById('difficultyInput').value = '';
                document.getElementById('tagsInput').value = '';
                document.getElementById('saveBtn').textContent = 'Save';
            }
            document.getElementById('modal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('modal').classList.remove('active');
        }

        function saveSnippet() {
            const title = document.getElementById('titleInput').value.trim();
            const category = document.getElementById('categoryInput').value;
            const code = document.getElementById('codeInput').value.trim();
            const explanation = document.getElementById('explanationInput').value.trim();
            const difficulty = document.getElementById('difficultyInput').value;
            const tagsInput = document.getElementById('tagsInput').value.trim();
            const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

            if (!title || !code || !explanation) {
                showToast('Please fill in all required fields');
                return;
            }

            if (isEditing && editingId) {
                const idx = snippets[currentLang].findIndex(s => s.id === editingId);
                if (idx !== -1) {
                    snippets[currentLang][idx] = {
                        ...snippets[currentLang][idx],
                        title,
                        category,
                        code,
                        explanation,
                        difficulty,
                        tags
                    };
                    showToast('Snippet updated!');
                }
            } else {
                snippets[currentLang].push({
                    id: Date.now(),
                    title,
                    category,
                    code,
                    explanation,
                    difficulty,
                    tags,
                    favorite: false
                });
                showToast('Snippet added!');
            }

            saveSnippets();
            closeModal();
            if (showAutoFolders) renderAutoFolderChips();
            renderSnippetList();
            if (isEditing) hideDetail();
        }

        function deleteSnippet() {
            if (!currentSnippet) return;
            if (confirm(`Delete "${currentSnippet.title}"?`)) {
                snippets[currentLang] = snippets[currentLang].filter(s => s.id !== currentSnippet.id);
                saveSnippets();
                hideDetail();
                if (showAutoFolders) renderAutoFolderChips();
                showToast('Snippet deleted');
            }
        }

        function copyCode() {
            if (!currentSnippet) return;
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(currentSnippet.code)
                    .then(() => showToast('Code copied!'))
                    .catch(() => fallbackCopy(currentSnippet.code));
            } else {
                fallbackCopy(currentSnippet.code);
            }
        }

        function fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast('Code copied!');
            } catch (err) {
                showToast('Copy failed');
            }
            document.body.removeChild(textarea);
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function toggleFavorite(id) {
            const snippet = snippets[currentLang].find(s => s.id === id);
            if (snippet) {
                snippet.favorite = !snippet.favorite;
                saveSnippets();
                renderSnippetList();
                showToast(snippet.favorite ? 'Added to favorites!' : 'Removed from favorites');
            }
        }

        function generateCodeScreenshot() {
            if (!currentSnippet) return;

            const theme = themeStyles[selectedTheme];
            const canvas = document.getElementById('screenshotCanvas');
            const ctx = canvas.getContext('2d');

            const width = 800;
            const padding = 40;
            const lineHeight = 24;
            const titleHeight = 80;
            const categoryHeight = 40;
            const codeLines = currentSnippet.code.split('\n');
            const explanationLines = wrapText(ctx, currentSnippet.explanation, width - padding * 2, 16);
            
            const codeHeight = codeLines.length * lineHeight + 60;
            const explanationHeight = explanationLines.length * 20 + 60;
            const height = titleHeight + categoryHeight + codeHeight + explanationHeight + padding * 2;

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = theme.bg;
            ctx.fillRect(0, 0, width, height);

            let y = padding;

            ctx.fillStyle = theme.titleBg;
            ctx.fillRect(0, 0, width, titleHeight);
            
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 28px -apple-system, sans-serif';
            ctx.fillText(currentSnippet.title, padding, y + 45);

            y += titleHeight;

            ctx.fillStyle = theme.accent;
            ctx.font = '14px -apple-system, sans-serif';
            ctx.fillText(currentSnippet.category.toUpperCase(), padding, y + 25);
            
            if (currentSnippet.difficulty) {
                const diffX = padding + ctx.measureText(currentSnippet.category.toUpperCase()).width + 20;
                ctx.fillStyle = theme.string;
                ctx.fillText('• ' + currentSnippet.difficulty, diffX, y + 25);
            }

            y += categoryHeight + 20;

            ctx.fillStyle = theme.text;
            ctx.font = '12px Consolas, Monaco, monospace';
            ctx.fillText('CODE', padding, y);
            y += 30;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(padding, y, width - padding * 2, codeHeight - 40);

            ctx.fillStyle = theme.code;
            ctx.font = '16px Consolas, Monaco, monospace';
            
            codeLines.forEach((line, i) => {
                ctx.fillText(line, padding + 20, y + (i + 1) * lineHeight);
            });

            y += codeHeight;

            ctx.fillStyle = theme.text;
            ctx.font = '12px -apple-system, sans-serif';
            ctx.fillText('EXPLANATION', padding, y);
            y += 30;

            ctx.fillStyle = theme.text;
            ctx.font = '16px -apple-system, sans-serif';
            ctx.globalAlpha = 0.9;
            
            explanationLines.forEach((line, i) => {
                ctx.fillText(line, padding, y + i * 20);
            });

            ctx.globalAlpha = 1;

            const dataUrl = canvas.toDataURL('image/png');
            
            const screenshot = {
                id: Date.now(),
                snippetId: currentSnippet.id,
                snippetTitle: currentSnippet.title,
                theme: selectedTheme,
                dataUrl: dataUrl,
                timestamp: new Date().toISOString()
            };

            screenshots.unshift(screenshot);
            saveScreenshots();

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `${currentSnippet.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`;
            a.click();

            document.getElementById('screenshotModal').classList.remove('active');
            showToast('Screenshot saved to gallery & downloaded!');
        }

        function wrapText(ctx, text, maxWidth, fontSize) {
            ctx.font = `${fontSize}px -apple-system, sans-serif`;
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = ctx.measureText(currentLine + ' ' + word).width;
                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        }

        function openGallery() {
            renderGallery();
            document.getElementById('galleryView').classList.add('active');
        }

        function closeGallery() {
            document.getElementById('galleryView').classList.remove('active');
        }

        function renderGallery() {
            const content = document.getElementById('galleryContent');
            const storageUsed = document.getElementById('storageUsed');
            const storageLimit = document.getElementById('storageLimit');
            const storageBarFill = document.getElementById('storageBarFill');

            const limit = 30;
            storageUsed.textContent = screenshots.length;
            storageLimit.textContent = limit;
            storageBarFill.style.width = `${(screenshots.length / limit) * 100}%`;

            if (screenshots.length === 0) {
                content.innerHTML = `
                    <div class="gallery-empty">
                        <div class="empty-icon">📸</div>
                        <div class="empty-title">No screenshots yet</div>
                        <div class="empty-desc">Take beautiful code screenshots from any snippet</div>
                    </div>
                `;
                return;
            }

            content.innerHTML = `
                <div class="gallery-grid">
                    ${screenshots.map((shot, index) => `
                        <div class="gallery-item" onclick="openPreview(${index})">
                            <img src="${shot.dataUrl}" class="gallery-thumbnail" alt="${escapeHtml(shot.snippetTitle)}">
                            <div class="gallery-item-info">
                                <div class="gallery-item-title">${escapeHtml(shot.snippetTitle)}</div>
                                <div class="gallery-item-date">${new Date(shot.timestamp).toLocaleDateString()}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        function openPreview(index) {
            currentPreviewIndex = index;
            const shot = screenshots[index];
            document.getElementById('previewTitle').textContent = shot.snippetTitle;
            document.getElementById('previewImage').src = shot.dataUrl;
            document.getElementById('galleryPreview').classList.add('active');
        }

        function closePreview() {
            document.getElementById('galleryPreview').classList.remove('active');
            currentPreviewIndex = -1;
        }

        function redownloadScreenshot() {
            if (currentPreviewIndex === -1) return;
            const shot = screenshots[currentPreviewIndex];
            const a = document.createElement('a');
            a.href = shot.dataUrl;
            a.download = `${shot.snippetTitle.replace(/[^a-z0-9]/gi, '_')}_${shot.id}.png`;
            a.click();
            showToast('Screenshot downloaded!');
        }

        function shareScreenshot() {
            if (currentPreviewIndex === -1) return;
            const shot = screenshots[currentPreviewIndex];

            fetch(shot.dataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `${shot.snippetTitle}.png`, { type: 'image/png' });
                    
                    if (navigator.share) {
                        navigator.share({
                            title: shot.snippetTitle,
                            text: `Code snippet: ${shot.snippetTitle}`,
                            files: [file]
                        }).catch(() => {
                            showToast('Share cancelled');
                        });
                    } else {
                        showToast('Share not supported on this device');
                    }
                });
        }

        function deleteScreenshot() {
            if (currentPreviewIndex === -1) return;
            if (confirm('Delete this screenshot?')) {
                screenshots.splice(currentPreviewIndex, 1);
                saveScreenshots();
                closePreview();
                renderGallery();
                showToast('Screenshot deleted');
            }
        }

        window.openPreview = openPreview;

        function exportData() {
            const data = {
                snippets: snippets,
                screenshots: screenshots.map(s => ({...s, dataUrl: ''})),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `code-library-backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Snippets exported successfully!');
        }

        function importData() {
            document.getElementById('importFile').click();
        }

        function handleImportFile(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.snippets) {
                        showToast('Invalid backup file');
                        return;
                    }

                    if (confirm('Import snippets? This will merge with your current snippets.')) {
                        Object.keys(data.snippets).forEach(lang => {
                            if (!snippets[lang]) snippets[lang] = [];
                            
                            data.snippets[lang].forEach(snippet => {
                                if (!snippets[lang].find(s => s.id === snippet.id)) {
                                    snippets[lang].push(snippet);
                                }
                            });
                        });

                        saveSnippets();
                        renderSnippetList();
                        showToast(`Imported successfully!`);
                        document.getElementById('settingsModal').classList.remove('active');
                    }
                } catch (err) {
                    showToast('Error reading backup file');
                    console.error(err);
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        function clearAllData() {
            if (confirm('⚠️ Delete ALL snippets and screenshots? This cannot be undone!')) {
                if (confirm('Are you absolutely sure? This will delete everything!')) {
                    localStorage.removeItem('codeSnippets');
                    localStorage.removeItem('codeScreenshots');
                    snippets = {};
                    screenshots = [];
                    languages.forEach(lang => snippets[lang] = []);
                    renderSnippetList();
                    updateGalleryBadge();
                    showToast('All data cleared');
                    document.getElementById('settingsModal').classList.remove('active');
                }
            }
        }

        function searchYouTube() {
            if (!currentSnippet) return;
            
            const searchQuery = `${currentSnippet.title} ${currentLang} tutorial`;
            const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
            
            window.open(youtubeUrl, '_blank');
            showToast('Opening YouTube...');
        }

        // Event Listeners
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            const icon = document.querySelector('#themeToggle i');
            icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderSnippetList();
        });

        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilter = pill.dataset.filter;
                renderSnippetList();
            });
        });

        document.getElementById('backBtn').addEventListener('click', hideDetail);
        document.getElementById('addFab').addEventListener('click', () => openModal(false));
        document.getElementById('cancelBtn').addEventListener('click', closeModal);
        document.getElementById('saveBtn').addEventListener('click', saveSnippet);
        document.getElementById('copyBtnDetail').addEventListener('click', copyCode);
        document.getElementById('youtubeSearchBtn').addEventListener('click', searchYouTube);
        document.getElementById('screenshotBtn').addEventListener('click', () => {
            document.getElementById('screenshotModal').classList.add('active');
        });
        document.getElementById('editBtnDetail').addEventListener('click', () => openModal(true));
        document.getElementById('deleteBtnDetail').addEventListener('click', deleteSnippet);

        document.getElementById('galleryBtn').addEventListener('click', openGallery);
        document.getElementById('closeGalleryBtn').addEventListener('click', closeGallery);
        document.getElementById('closePreviewBtn').addEventListener('click', closePreview);
        document.getElementById('redownloadBtn').addEventListener('click', redownloadScreenshot);
        document.getElementById('shareBtn').addEventListener('click', shareScreenshot);
        document.getElementById('deleteGalleryBtn').addEventListener('click', deleteScreenshot);

        document.getElementById('organizeBtn').addEventListener('click', () => {
            renderFolderList();
            document.getElementById('organizeModal').classList.add('active');
            
            const autoToggleBtn = document.getElementById('toggleAutoFoldersBtn');
            if (autoToggleBtn) {
                autoToggleBtn.replaceWith(autoToggleBtn.cloneNode(true));
                document.getElementById('toggleAutoFoldersBtn').addEventListener('click', toggleAutoFolders);
            }
            
            const customToggleBtn = document.getElementById('toggleCustomFoldersBtn');
            if (customToggleBtn) {
                customToggleBtn.replaceWith(customToggleBtn.cloneNode(true));
                document.getElementById('toggleCustomFoldersBtn').addEventListener('click', toggleCustomFolders);
            }
        });

        document.getElementById('closeOrganizeBtn').addEventListener('click', () => {
            document.getElementById('organizeModal').classList.remove('active');
        });

        document.getElementById('sortManualBtn').addEventListener('click', () => {
            setSortMode('manual');
        });

        document.getElementById('sortAlphabeticalBtn').addEventListener('click', () => {
            setSortMode('alphabetical');
        });

        document.getElementById('sortByTagsBtn').addEventListener('click', () => {
            setSortMode('tags');
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('active');
        });

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('active');
        });

        document.getElementById('aboutBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('active');
            document.getElementById('aboutModal').classList.add('active');
        });
        
        document.getElementById('backToSettingsBtn').addEventListener('click', () => {
            document.getElementById('aboutModal').classList.remove('active');
            document.getElementById('settingsModal').classList.add('active');
        });

        document.getElementById('closeAboutBtn').addEventListener('click', () => {
            document.getElementById('aboutModal').classList.remove('active');
        });

        document.getElementById('exportBtn').addEventListener('click', exportData);
        document.getElementById('importBtn').addEventListener('click', importData);
        document.getElementById('importFile').addEventListener('change', handleImportFile);
        document.getElementById('clearAllBtn').addEventListener('click', clearAllData);

        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                selectedTheme = option.dataset.theme;
            });
        });

        document.getElementById('cancelScreenshot').addEventListener('click', () => {
            document.getElementById('screenshotModal').classList.remove('active');
        });

        document.getElementById('generateScreenshot').addEventListener('click', generateCodeScreenshot);

        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') closeModal();
        });

        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                document.getElementById('settingsModal').classList.remove('active');
            }
        });

        document.getElementById('aboutModal').addEventListener('click', (e) => {
            if (e.target.id === 'aboutModal') {
                document.getElementById('aboutModal').classList.remove('active');
            }
        });

        document.getElementById('organizeModal').addEventListener('click', (e) => {
            if (e.target.id === 'organizeModal') {
                document.getElementById('organizeModal').classList.remove('active');
            }
        });

        document.getElementById('screenshotModal').addEventListener('click', (e) => {
            if (e.target.id === 'screenshotModal') {
                document.getElementById('screenshotModal').classList.remove('active');
            }
        });
        
        document.getElementById('createFolderBtn').addEventListener('click', createFolder);

        document.getElementById('closeFolderSelectorBtn').addEventListener('click', () => {
            document.getElementById('folderSelectorModal').classList.remove('active');
        });

        document.getElementById('folderSelectorModal').addEventListener('click', (e) => {
            if (e.target.id === 'folderSelectorModal') {
                document.getElementById('folderSelectorModal').classList.remove('active');
            }
        });

        document.getElementById('backToAllSnippets').addEventListener('click', clearFolderFilter);

        // Initialize app
        loadSnippets();
        loadFolders();
        loadScreenshots();
        loadTheme();
        renderLanguageTabs();
        
        const autoToggleBtn = document.getElementById('toggleAutoFoldersBtn');
        if (autoToggleBtn) {
            autoToggleBtn.innerHTML = showAutoFolders 
                ? '<i class="bi bi-eye-slash"></i> Hide Tag Folders'
                : '<i class="bi bi-eye"></i> Show Tag Folders';
        }

        const customToggleBtn = document.getElementById('toggleCustomFoldersBtn');
        if (customToggleBtn) {
            customToggleBtn.innerHTML = showCustomFolders 
                ? '<i class="bi bi-eye-slash"></i> Hide Folders'
                : '<i class="bi bi-eye"></i> Show Folders';
        }

        if (showCustomFolders) renderFolderChips();
        if (showAutoFolders) renderAutoFolderChips();
        
        renderSnippetList();

        //Service Worker 
        if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./js/service-worker.js')
      .then(reg => {
        console.log('SW registered:', reg.scope);
      })
      .catch(err => {
        console.error('SW registration failed:', err);
      });
  });
        }
