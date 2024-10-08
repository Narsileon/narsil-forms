import { cn } from "@narsil-ui/Components";
import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import * as React from "react";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import InputPlaceholders, { InputPlaceholderType } from "@narsil-forms/Components/Input/InputPlaceholders";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import TipTapToolbar from "@narsil-tiptap/Components/TipTapToolbar";
import Underline from "@tiptap/extension-underline";

type RichTextEditorProps = Partial<EditorOptions> & {
	className?: string;
	id?: string;
	placeholder?: string;
	placeholders?: InputPlaceholderType[];
	toolbar?: boolean;
	value: string;
	onChange?: (value: any) => void;
};

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
	({ className, id, placeholder, placeholders, toolbar = true, value, onChange, ...props }, ref) => {
		const extensions = [
			Color,
			Highlight.configure({
				multicolor: true,
			}),
			Placeholder.configure({
				emptyEditorClass:
					"before:pointer-events-none before:float-left before:h-0 before:text-muted-foreground before:content-[attr(data-placeholder)]",
				placeholder: placeholder,
			}),
			StarterKit,
			Subscript,
			Superscript,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			TextStyle,
			Underline,
		];

		const editor = useEditor({
			extensions: extensions,
			content: value,
			editorProps: {
				attributes: {
					class: cn(
						"prose max-w-none text-foreground !whitespace-normal",
						"rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
						"disabled:cursor-not-allowed disabled:opacity-50",
						className
					),
				},
			},
			onUpdate: ({ editor }) => {
				onChange?.(editor.getHTML());
			},
			...props,
		});

		React.useEffect(() => {
			if (editor && editor?.getHTML() !== value) {
				editor?.commands.setContent(value);
			}
		}, [value]);

		return (
			<div
				ref={ref}
				className='flex flex-col gap-y-4'
			>
				{toolbar && editor?.isEditable ? <TipTapToolbar editor={editor} /> : null}

				<EditorContent
					id={id}
					editor={editor}
				/>

				{placeholders ? (
					<InputPlaceholders
						placeholders={placeholders}
						onInsert={(value) => editor?.commands.insertContentAt(editor.state.selection, value)}
					/>
				) : null}
			</div>
		);
	}
);

export default RichTextEditor;
