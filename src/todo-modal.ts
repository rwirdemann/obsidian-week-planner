import { App, Modal } from 'obsidian';
// @ts-ignore
import EditTodo from './ui/edit-todo.svelte'

export class TodoModal extends Modal {
	public readonly task: string;
	public readonly title: string;
	public readonly buttonLabel: string;
	public readonly onSubmit: (description: string, list: string, date: Date) => void;

	constructor(app: App, title: string, buttonLabel: string, task: string, onSubmit: (task: string, list: string, date: Date) => void) {
		super(app);
		this.task = task;
		this.title = title;
		this.buttonLabel = buttonLabel
		this.onSubmit = (description: string, list: string, date: Date) => {
			onSubmit(description, list, date);
			this.close();
		};
	}

	public onOpen(): void {
		this.titleEl.setText(this.title);
		const { contentEl } = this;
		new EditTodo({
			target: contentEl,
			props: { task: this.task, buttonLabel: this.buttonLabel, onSubmit: this.onSubmit },
		});
	}

	public onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}
}
