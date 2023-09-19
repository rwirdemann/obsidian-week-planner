# Obsidian Week Planner Plugin

This plugin reflects my personal working process that is organized around three central ideas:

- Inbox: single, unordered lists of todos
- Week: goals for the current week
- Today: ordered lists of today's todos

Each if these three todo containers is presented by a single Obsidean document type organized within
the following folder structure:

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

The plugin provides a set of commands to create, open these document types and moves tasks between
these documents based on the current date:

- `Show Inbox` Creates and / or shows the inbox note
- `Show Week` Creates and / or shows the note of the current calendar week
- `Show Today` Creates and / or shows the todo list for today
- `Show Tomorrow` Creates and / or shows the todo list for tomorrow
- `Show Yesterday` Creates and / or shows the todo list for tomorrow
- `Move Task` Moves tasks under cursor to the next work day

The `Move Task`-command supports a fluent planning process by moving tasks of the currently open
document to the next working day. For instance, if your current document *inbox* `Move Task` will
move the task to *today*, if today is a work day. If today is a Sunday `Move Task` would move the
task to the next Monday. Shifting tasks from *inbox* to *today* comes in handy for your daily
planning process, when you plan the tasks for today based on the contents of your *inbox*.

If your current document is *today* `Move Task` would move a task to the next working day. This
becomes useful when you call it a day and have unfinished tasks left that you would like to work on
tomorrow. 

And finally, if your current document is *yesterday* `Move Task` would move a task to today. This is
helpful when you didn't finish some of yesterdays tasks and forgot to move them to the next day.

The `Show Yesterday` and `Show Tomorrow` commands are relevant in order to move uncompleted tasks
from yesterday's to today's or from today's to tomorrow's todo list.

The `Show Tomorrow` and `Show Yesterday`-commands consider workdays, thus if you trigger `Show
Tomorrow` on a Friday a note for the next Monday is created and opened. Weekdays will be
configurable in one of the upcoming releases.

The plugin also creates the underlying folder structure if not yet there.
