import { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Paintbrush } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import DOMPurify from "dompurify";

interface EmailContentEditorProps {
	content: string;
	onChange: (value: string) => void;
	wordWrap: boolean;
	onToggleWordWrap: () => void;
}

export function EmailContentEditor({
	content,
	onChange,
	wordWrap,
	onToggleWordWrap,
}: EmailContentEditorProps) {
	const previewRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (previewRef.current) {
			const sampleFirstName = "Alex";
			const previewHtml = (content || "").replace(
				/\{\{firstName\}\}/g,
				sampleFirstName,
			);
			previewRef.current.innerHTML = DOMPurify.sanitize(
				previewHtml ||
					'<div class="text-muted-foreground">Preview will appear here...</div>',
			);
		}
	}, [content]);

	return (
		<div className="space-y-2">
			<div className="flex items-center mb-2">
				<Label htmlFor="content">
					Email Content{" "}
					<span className="text-xs text-muted-foreground">
						(HTML supported)
					</span>
				</Label>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								size="icon"
								variant="outline"
								onClick={onToggleWordWrap}
							>
								<Paintbrush
									className="w-4 h-4"
									style={{ opacity: wordWrap ? 1 : 0.4 }}
								/>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" align="center">
							{wordWrap ? "Disable word wrap" : "Enable word wrap"}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="border rounded-lg h-[600px] bg-white flex flex-col overflow-hidden">
					<div className="flex-1 overflow-auto">
						<CodeMirror
							value={content}
							height="100%"
							minHeight="100%"
							maxHeight="100%"
							extensions={
								wordWrap ? [html(), EditorView.lineWrapping] : [html()]
							}
							theme="light"
							onChange={onChange}
							basicSetup={{
								lineNumbers: true,
								autocompletion: true,
							}}
							style={{ height: "100%" }}
						/>
					</div>
				</div>
				<div className="border rounded-lg bg-white h-[600px] flex flex-col overflow-hidden">
					<div className="text-sm font-medium p-4 border-b">Preview</div>
					<div
						ref={previewRef}
						className="prose prose-sm max-w-none flex-1 overflow-auto p-4"
					/>
				</div>
			</div>
		</div>
	);
}
