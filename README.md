# Obsidian Week Planner Plugin

This plugin reflects my personal working process that is organized around three central ideas:

- Inbox: single, unordered lists of todos
- Week: goals for the current week
- Today: ordered lists of today's todos

Each if these three containers is presented by a single Obsidean document organized within the following folder
structure:

```
Week Planner
  Days
    2022-09-05-Monday
    2022-09-06-Tuesday
    ...
  Weeks
  	Calweek-2022-35
  	Calweek-2022-36
  	...
  Inbox
```

The plugin provides a set of commands to mangage this document types:

- `Show Inbox` Creates and / or shows the inbox note
- `Show Week` Creates and / or shows the note of the current calendar week
- `Show Today` Creates and / or shows the todo list for today
- `Show Tomorrow` Creates and / or shows the todo list for tomorrow
- `Show Yesterday` Creates and / or shows the todo list for tomorrow

The `Show Yesterday` and `Show Tomorrow` commands are relevant in order to move uncompleted tasks from yesterday's to
today's or from today's to tomorrow's todo list.
