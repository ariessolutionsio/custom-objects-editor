import { FC, ReactNode, ReactElement } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

import ExampleTheme from "./themes/ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";

import './editor-styles.css'; // Import the new styles

// Simple Loading Component for RichTextPlugin ErrorBoundary
const LoadingComponent: FC = () => {
  return <div>Loading...</div>;
};

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}


type LexicalEditorFieldProps = {
  name: string;
  initialValue?: string;
  onChange: (fieldName: string, value: string) => void;
  onBlur?: (fieldName: string, touched: boolean) => void;
};

const LexicalEditorField: FC<LexicalEditorFieldProps> = ({ name, initialValue, onChange, onBlur }) => {
  const initialEditorConfig = {
    namespace: `LexicalEditor-${name}`,
    theme: ExampleTheme,
    onError: (error: Error) => {
      console.error("Lexical Error:", error);
      // Potentially delegate to a global error handler or display a user-facing message
      throw error;
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ],
    editorState: initialValue
      ? (editor: LexicalEditor) => {
          try {
            const parsedEditorState = editor.parseEditorState(initialValue);
            editor.setEditorState(parsedEditorState);
          } catch (e) {
            // If JSON is invalid or not an editor state, Lexical will start with an empty state.
            console.warn("Invalid initial value for editor", e)
          }
        }
      : undefined,
  };

  const handleLexicalChange = (editorState: EditorState) => {
    const jsonString = JSON.stringify(editorState.toJSON());
    onChange(name, jsonString);
  };

  const handleLexicalBlur = () => {
    if (onBlur) {
      onBlur(name, true);
    }
  };


  return (
    <LexicalComposer initialConfig={initialEditorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" onBlur={handleLexicalBlur} />}
            placeholder={<Placeholder />}
            ErrorBoundary={LoadingComponent}
          />
          {/* <HistoryPlugin />
          <TreeViewPlugin />  */}
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleLexicalChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditorField; 