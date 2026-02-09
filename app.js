// Get DOM elements
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const file1 = document.getElementById('file1');
const file2 = document.getElementById('file2');
const compareBtn = document.getElementById('compareBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsDiv = document.getElementById('results');
const viewModeRadios = document.querySelectorAll('input[name="viewMode"]');
const loadingSpinner = document.getElementById('loadingSpinner');
const ignoreWhitespaceCheckbox = document.getElementById('ignoreWhitespace');

/**
 * Safely create and display a status message in the results div
 * @param {string} message - The message text to display
 * @param {string} type - Message type: 'warning', 'success', 'error', 'info'
 * @param {string} icon - Emoji icon to display
 */
function showResultsMessage(message, type, icon) {
    // Clear existing content safely
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'text-align: center; padding: 40px; font-size: 1.1em;';

    // Set color based on type
    const colors = {
        warning: '#dc3545',
        success: '#28a745',
        error: '#dc3545',
        info: '#6c757d'
    };
    messageDiv.style.color = colors[type] || colors.info;

    // Add icon and message safely
    messageDiv.textContent = `${icon} ${message}`;

    resultsDiv.appendChild(messageDiv);
}

// File upload handlers
file1.addEventListener('change', (e) => handleFileUpload(e, text1));
file2.addEventListener('change', (e) => handleFileUpload(e, text2));

// Handle file upload
function handleFileUpload(event, targetTextarea) {
    const file = event.target.files[0];
    if (!file) return;

    // File size validation (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #dc3545; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3); z-index: 1000; font-weight: 500;';
        errorDiv.textContent = `File too large! Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`;

        document.body.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);

        // Reset file input
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        targetTextarea.value = e.target.result;
    };
    reader.onerror = () => {
        alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
}

// Compare button click handler
compareBtn.addEventListener('click', compareDiff);

// Clear button click handler
clearBtn.addEventListener('click', () => {
    text1.value = '';
    text2.value = '';
    file1.value = '';
    file2.value = '';
    // Clear results safely
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
});

// View mode change handler
viewModeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (text1.value || text2.value) {
            compareDiff();
        }
    });
});

// Whitespace checkbox change handler
ignoreWhitespaceCheckbox.addEventListener('change', () => {
    if (text1.value || text2.value) {
        compareDiff();
    }
});

// Main comparison function
function compareDiff() {
    const originalText = text1.value;
    const changedText = text2.value;

    // Check if both inputs are empty
    if (!originalText && !changedText) {
        showResultsMessage('Please enter text in both fields to compare', 'warning', '⚠️');
        return;
    }

    // Check if texts are identical
    if (originalText === changedText) {
        showResultsMessage('The texts are identical - no differences found!', 'success', '✅');
        return;
    }

    // Show loading spinner
    loadingSpinner.style.display = 'flex';

    // Use setTimeout to allow spinner to render before heavy computation
    setTimeout(() => {
        try {
            // Get selected view mode
            const viewMode = document.querySelector('input[name="viewMode"]:checked').value;
            const outputFormat = viewMode === 'side-by-side' ? 'side-by-side' : 'line-by-line';

            // Create unified diff format
            const diff = createUnifiedDiff(originalText, changedText);

            // Configure Diff2Html
            const configuration = {
                drawFileList: true,
                fileListToggle: false,
                fileListStartVisible: false,
                fileContentToggle: false,
                matching: 'lines',
                outputFormat: outputFormat,
                synchronisedScroll: true,
                highlight: true,
                renderNothingWhenEmpty: false,
            };

            // Generate and display diff
            const diff2htmlUi = new Diff2HtmlUI(resultsDiv, diff, configuration);
            diff2htmlUi.draw();
            diff2htmlUi.highlightCode();

            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            console.error('Error generating diff:', error);
            // Hide spinner on error too
            loadingSpinner.style.display = 'none';
            showResultsMessage('Error generating diff. Please try again.', 'error', '❌');
        }
    }, 100); // 100ms delay allows spinner to render
}

// Create unified diff format from two texts
function createUnifiedDiff(oldText, newText) {
    // Check if whitespace should be ignored
    const ignoreWhitespace = ignoreWhitespaceCheckbox.checked;

    // Helper function to normalize whitespace
    const normalizeLine = (line) => {
        if (!ignoreWhitespace) return line;
        // Trim leading/trailing whitespace and collapse internal whitespace
        return line.trim().replace(/\s+/g, ' ');
    };

    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    // Build unified diff manually in Git diff format
    let diff = 'diff --git a/original.txt b/changed.txt\n';
    diff += 'index 0000000..1111111 100644\n';
    diff += '--- a/original.txt\n';
    diff += '+++ b/changed.txt\n';

    // Simple line-by-line comparison
    let i = 0, j = 0;
    const chunks = [];
    let currentChunk = {
        oldStart: 1,
        oldLines: 0,
        newStart: 1,
        newLines: 0,
        lines: []
    };

    while (i < oldLines.length || j < newLines.length) {
        if (i >= oldLines.length) {
            // Only new lines remaining
            currentChunk.lines.push('+' + newLines[j]);
            currentChunk.newLines++;
            j++;
        } else if (j >= newLines.length) {
            // Only old lines remaining
            currentChunk.lines.push('-' + oldLines[i]);
            currentChunk.oldLines++;
            i++;
        } else if (normalizeLine(oldLines[i]) === normalizeLine(newLines[j])) {
            // Lines match (with normalization if enabled)
            if (currentChunk.lines.length > 0) {
                chunks.push({...currentChunk});
                currentChunk = {
                    oldStart: i + 1,
                    oldLines: 0,
                    newStart: j + 1,
                    newLines: 0,
                    lines: []
                };
            }
            i++;
            j++;
        } else {
            // Lines differ
            currentChunk.lines.push('-' + oldLines[i]);
            currentChunk.lines.push('+' + newLines[j]);
            currentChunk.oldLines++;
            currentChunk.newLines++;
            i++;
            j++;
        }
    }

    if (currentChunk.lines.length > 0) {
        chunks.push(currentChunk);
    }

    // Build the diff output
    chunks.forEach(chunk => {
        diff += `@@ -${chunk.oldStart},${chunk.oldLines} +${chunk.newStart},${chunk.newLines} @@\n`;
        diff += chunk.lines.join('\n') + '\n';
    });

    return diff;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to compare
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        compareDiff();
    }
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearBtn.click();
    }
});
