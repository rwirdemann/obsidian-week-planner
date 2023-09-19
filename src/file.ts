import {Vault} from 'obsidian';

export default class WeekPlannerFile {
	vault: Vault;
	fullFileName: string

	constructor(vault: Vault, fullFileName: string) {
		this.vault = vault;
		this.fullFileName = fullFileName
	}

	async insertAt(line: string, at: number) {
		let filecontent = await (await this.getFileContents())
		if (filecontent == undefined) {
			console.log('could not read file');
			return
		}

		let todos = filecontent.split('\n')
		todos.splice(at, 0, line)
		await this.updateFile(todos.join('\n'));
	}

	async getFileContents() {
		try {
			return await this.vault.adapter.read(this.fullFileName);
		} catch (error) {
			console.log(error)
		}
	}

	async updateFile(fileContents: string) {
		try {
			return await this.vault.adapter.write(this.fullFileName, fileContents);
		} catch (error) {
			console.log(error)
		}
	}
}
