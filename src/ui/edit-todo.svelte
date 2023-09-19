<script lang="ts">
	import {onMount} from 'svelte';
	import {moment} from "obsidian";
	import {DATE_FORMAT} from "../date";

	export let onSubmit: (description: string, list: string, date: Date) => void | Promise<void>;

	export let task;

	let descriptionInput: HTMLInputElement;
	let todo: {
		description: string;
		list: string;
		targetDate: string
	} = {
		description: task,
		list: 'inbox',
		targetDate: moment().format(DATE_FORMAT)
	};

	onMount(() => {
		setTimeout(() => {
			descriptionInput.focus();
		}, 10);
	});

	const _onSubmit = () => {
		onSubmit(todo.description.trim(), todo.list, moment(todo.targetDate).toDate());
	};
</script>

<form on:submit|preventDefault={_onSubmit}>
	<div>
		<label for="description" class="label" style="display:inline-block; width: 100px;">Description</label>
		<input
			bind:value={todo.description}
			bind:this={descriptionInput}
			id="description"
			type="text"
			style="width: 70%"
			required
			placeholder="Short description of your task"
		/>
		<hr/>
		<div>
			<label for="target-list" style="display:inline-block; width: 100px;">Target List</label>
			<select id="target-list" bind:value={todo.list}>
				<option value="inbox">Inbox</option>
				<option value="target-date">Specific date</option>
			</select>
		</div>
		<hr/>
		<div>
			<label style="display:inline-block; width: 100px;" for="target-date">Target Date</label>
			<input type="date" id="target-date"
				   name="target-date"
				   bind:value={todo.targetDate}
			>
			<small style="margin-left: 8px">Only considered for target list 'Specific date'</small>
		</div>
	</div>
	<hr/>
	<div>
		<button type="submit" class="mod-cta">Create</button>
	</div>
</form>
