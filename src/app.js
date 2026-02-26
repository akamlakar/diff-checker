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

// Security: Input size limits
const MAX_INPUT_SIZE = 1024 * 1024; // 1MB per input
const MAX_LINES = 50000; // Maximum lines per input

/**
 * Sanitize text input to prevent XSS attacks
 * @param {string} text - Raw text input
 * @returns {string} - Sanitized text
 */
function sanitizeInput(text) {
    if (typeof text !== 'string') return '';
    
    // Check size limit
    if (text.length > MAX_INPUT_SIZE) {
        throw new Error(`Input too large. Maximum size is ${MAX_INPUT_SIZE / 1024}KB`);
    }
    
    // Check line count
    const lineCount = text.split('\n').length;
    if (lineCount > MAX_LINES) {
        throw new Error(`Too many lines. Maximum is ${MAX_LINES} lines`);
    }
    
    return text;
}

/**
 * Escape HTML to prevent XSS in error messages
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

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

    // File size validation (1MB limit for security)
    const MAX_FILE_SIZE = MAX_INPUT_SIZE; // 1MB
    if (file.size > MAX_FILE_SIZE) {
        showToast(`File too large! Maximum size is ${MAX_FILE_SIZE / 1024}KB. Your file is ${(file.size / 1024).toFixed(2)}KB.`, 'error');
        event.target.value = '';
        return;
    }

    // Validate file type
    const allowedExtensions = ['.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.py', '.java', '.c', '.cpp', '.xml', '.sql'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        showToast('Invalid file type. Please upload a supported text or code file.', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            sanitizeInput(content); // Validate before setting
            targetTextarea.value = content;
            
            // Track file upload
            if (window.trackEvent) {
                window.trackEvent('file_upload', {
                    file_size: file.size,
                    file_type: fileExtension
                });
            }
        } catch (error) {
            showToast(escapeHtml(error.message), 'error');
            event.target.value = '';
            
            if (window.trackError) {
                window.trackError(error, { context: 'file_upload' });
            }
        }
    };
    reader.onerror = () => {
        showToast('Error reading file. Please try again.', 'error');
        event.target.value = '';
    };
    reader.readAsText(file);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'error', 'success', 'info'
 */
function showToast(message, type = 'info') {
    const colors = {
        error: '#dc3545',
        success: '#28a745',
        info: '#17a2b8'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: ${colors[type]}; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 10000; font-weight: 500; max-width: 90%; text-align: center;`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
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
    
    // Track clear action
    if (window.trackEvent) {
        window.trackEvent('clear_inputs');
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
    try {
        // Start performance tracking
        if (window.performanceMonitor) {
            window.performanceMonitor.start('diff_comparison');
        }

        const originalText = text1.value;
        const changedText = text2.value;

        // Check if both inputs are empty
        if (!originalText && !changedText) {
            showResultsMessage('Please enter text in both fields to compare', 'warning', '⚠️');
            return;
        }

        // Validate inputs
        sanitizeInput(originalText);
        sanitizeInput(changedText);

        // Track comparison event
        if (window.trackEvent) {
            window.trackEvent('compare_diff', {
                original_length: originalText.length,
                changed_length: changedText.length,
                view_mode: document.querySelector('input[name="viewMode"]:checked').value
            });
        }

        // Check if texts are identical
        if (originalText === changedText) {
            showResultsMessage('The texts are identical - no differences found!', 'success', '✅');
            if (window.performanceMonitor) {
                window.performanceMonitor.end('diff_comparison');
            }
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

            // End performance tracking
            if (window.performanceMonitor) {
                window.performanceMonitor.end('diff_comparison');
            }

            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            console.error('Error generating diff:', error);
            
            // Track error
            if (window.trackError) {
                window.trackError(error, { context: 'diff_generation' });
            }
            
            // Hide spinner on error too
            loadingSpinner.style.display = 'none';
            showResultsMessage('Error generating diff. Please try again.', 'error', '❌');
        }
    }, 100); // 100ms delay allows spinner to render
    } catch (error) {
        console.error('Validation error:', error);
        
        // Track validation error
        if (window.trackError) {
            window.trackError(error, { context: 'input_validation' });
        }
        
        showToast(escapeHtml(error.message), 'error');
    }
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
