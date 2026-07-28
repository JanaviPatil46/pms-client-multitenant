
// import React, { useEffect, useState } from 'react';
// import { Box } from '@mui/material';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
// import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
// import Quill from 'quill';
// import 'quill-emoji';

// Quill.register('modules/emoji', require('quill-emoji'));
// export default function Editor({ initialContent, onChange,value }) {
//   const [editorContent, setEditorContent] = useState(initialContent);

  
//   // Toolbar configuration similar to what you had in mui-tiptap
//   const modules = {
//     toolbar: [
//       [{ 'font': [] }, {  'size': [] }], // Font family and size
//       [{ 'header': '1' }, { 'header': '2' }, { 'align': [] }],
//       ['bold', 'italic', 'underline', 'strike'], // Formatting options
//       [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript/Superscript
//       [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
//       [{ 'color': [] }, { 'background': [] }], // Text color and highlight
//       ['blockquote', 'code-block'], // Blockquote and code
//       ['link'], // Links and images
//         [{ 'emoji': true }],
//       [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent/unindent
//       ['clean'], // Remove formatting
//       ['undo', 'redo'], // Undo/Redo
    
//     ],
//     'emoji-toolbar': true,
//     'emoji-textarea': false,
//     'emoji-shortname': true,
//     history: {
//       delay: 1000,
//       maxStack: 50,
//       userOnly: true,
//     },
//   };

//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike',
//     'script', 'list', 'bullet', 'indent',
//     'color', 'background', 'align',
//     'blockquote', 'code-block', 'link', 'image',
//     'undo', 'redo','emoji'
//   ];

//   useEffect(() => {
//     if (initialContent) {
//       setEditorContent(initialContent);
//     }
//   }, [initialContent]);

//   const handleChange = (content) => {
//     setEditorContent(content);
//     onChange(content); // Call the onChange prop with the current content
//   };

//   return (
   
//       <ReactQuill
//         // value={editorContent}
//         value={value}
//         onChange={handleChange}
//         modules={modules}
//         formats={formats}
//         theme="snow"
//         style={{ height: '150px' }}
//       />
    
//   );
// }


import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import Quill from 'quill';
import 'quill-emoji';

Quill.register('modules/emoji', require('quill-emoji'));

export default function Editor({ initialContent, onChange, value }) {
  const [editorContent, setEditorContent] = useState(initialContent);

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: '1' }, { header: '2' }, { align: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
      ['link','image'],
      [{ emoji: true }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['clean'],
      ['undo', 'redo'],
    ],
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'script', 'list', 'bullet', 'indent',
    'color', 'background', 'align',
    'blockquote', 'code-block', 'link', 'image',
    'undo', 'redo', 'emoji',
  ];

  useEffect(() => {
    if (initialContent) {
      setEditorContent(initialContent);
    }
  }, [initialContent]);

  const handleChange = (content) => {
    setEditorContent(content);
    onChange(content);
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <ReactQuill
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className="
          [&_.ql-toolbar]:rounded-t-xl
          [&_.ql-toolbar]:border-0
          [&_.ql-toolbar]:border-b
          [&_.ql-toolbar]:border-slate-200
          [&_.ql-toolbar]:bg-slate-50
          [&_.ql-toolbar]:px-3
          [&_.ql-toolbar]:py-2

          [&_.ql-container]:rounded-b-xl
          [&_.ql-container]:border-0
          [&_.ql-container]:font-sans

          [&_.ql-editor]:min-h-[150px]
          [&_.ql-editor]:px-4
          [&_.ql-editor]:py-3
          [&_.ql-editor]:text-sm
          [&_.ql-editor]:leading-6
          [&_.ql-editor]:text-slate-800

          [&_.ql-editor.ql-blank::before]:text-slate-400
          [&_.ql-editor.ql-blank::before]:not-italic

          [&_.ql-picker-label]:text-slate-700
          [&_.ql-stroke]:stroke-slate-600
          [&_.ql-fill]:fill-slate-600
          [&_.ql-active_.ql-stroke]:stroke-blue-600
          [&_.ql-active_.ql-fill]:fill-blue-600
        "
      />
    </div>
  );
}
