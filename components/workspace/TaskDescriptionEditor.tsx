// @ts-nocheck
import React, { useState, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Undo from 'editorjs-undo';

// EditorJS tools
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
// import Image from '@editorjs/image';
import Raw from '@editorjs/raw';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import SimpleImage from '@editorjs/simple-image';

interface EditorProps {
  value?: string;
  readOnly?: boolean;
  onChange?: (newValue: any) => void;
}

const tools = {
  embed: Embed,
  table: { class: Table, inlineToolbar: true, shortcut: 'CMD+ALT+T' },
  marker: { class: Marker, shortcut: 'CMD+SHIFT+M' },
  list: { class: List, inlineToolbar: true, shortcut: 'CMD+SHIFT+L' },
  code: { class: Code, shortcut: 'CMD+SHIFT+C' },
  linkTool: LinkTool,
  // image: Image,
  raw: Raw,
  header: {
    class: Header,
    inlineToolbar: ['marker', 'link'],
    config: {
      placeholder: 'Header',
    },
    shortcut: 'CMD+SHIFT+H',
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: "Quote's author",
    },
    shortcut: 'CMD+SHIFT+O',
  },
  checklist: { class: CheckList, inlineToolbar: true },
  delimiter: Delimiter,
  inlineCode: { class: InlineCode, shortcut: 'CMD+SHIFT+C' },
  simpleImage: SimpleImage,
  warning: Warning,
};

const TaskDescriptionEditor: React.FC<EditorProps> = ({
  onChange,
  value,
  readOnly = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function saveEditorBlocks(editor) {
    if (!readOnly) {
      const result = await editor?.save();
      if (onChange) onChange(result.blocks);
    }
  }

  useEffect(() => {
    if (isMounted) {
      const editor = new EditorJS({
        readOnly,
        holder: 'tasksheet-task-editor',
        inlineToolbar: true,
        tools: {
          ...tools,
        },
        defaultBlock: 'paragraph',
        placeholder: 'Describe this task...',
        data: {
          blocks: value ? JSON.parse(value) : undefined,
        },

        async onReady() {
          // eslint-disable-next-line no-new
          new Undo({ editor });
          await saveEditorBlocks(editor);
        },

        async onChange() {
          await saveEditorBlocks(editor);
        },
      });

      setEditorInstance(editor);
    }
  }, [isMounted]);

  return editorInstance ? (
    <div id="tasksheet-task-editor" className="prose max-w-full" />
  ) : (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-600">Loading editor...</p>
    </div>
  );
};

export default TaskDescriptionEditor;
