# 🔍 Diff Checker

A beautiful, modern diff checker application for comparing text and code differences side-by-side or line-by-line.

## ✨ Features

- **Side-by-Side & Line-by-Line Views** - Toggle between different comparison modes
- **Syntax Highlighting** - Automatic syntax highlighting for various programming languages
- **File Upload Support** - Upload files directly instead of copy-pasting
- **Beautiful UI** - Modern, responsive design with gradient themes
- **Keyboard Shortcuts** - Quick actions with keyboard shortcuts
- **Multiple File Types** - Supports .txt, .js, .jsx, .ts, .tsx, .html, .css, .json, .md, .py, .java, .c, .cpp, .xml, .sql and more

## 🚀 Getting Started

1. Simply open `index.html` in your web browser
2. No build process or installation required!

## 💡 How to Use

1. **Paste or Upload Text**
   - Paste your original text in the left panel
   - Paste your changed text in the right panel
   - Or click "📁 Upload File" to upload files

2. **Choose View Mode**
   - Select "Side-by-Side" for a split view comparison
   - Select "Line-by-Line" for a unified view

3. **Compare**
   - Click the "Compare" button
   - View the highlighted differences

4. **Clear**
   - Click "Clear" to reset both panels

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Compare texts
- `Ctrl/Cmd + K` - Clear all inputs

## 🛠️ Technologies Used

- **HTML5/CSS3/JavaScript** - Core technologies
- **Diff2Html** - Beautiful diff rendering with syntax highlighting
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📁 Project Structure

```
Diff-Checker/
├── index.html      # Main HTML file
├── styles.css      # Styling and layout
├── app.js          # JavaScript logic
└── README.md       # Documentation
```

## 🎨 Customization

You can easily customize the app by:
- Editing colors in `styles.css` (look for gradient values)
- Adding more file types in the file input accept attribute
- Modifying the diff algorithm in `app.js`

## 🌟 Future Enhancements

Potential features to add:
- Dark mode toggle
- Export diff as PDF or image
- Share results via URL
- Character-level diff
- Ignore whitespace option
- Save comparison history

## 📝 License

Free to use and modify for personal and commercial projects.

## 🤝 Contributing

Feel free to fork and enhance this project!

---

Built with ❤️ using [Diff2Html](https://github.com/rtfpessoa/diff2html)
