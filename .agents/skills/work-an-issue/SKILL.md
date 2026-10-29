---
name: work-an-issue
description: Implement one GitHub issue in this repo and close it only when its Done when holds. Use when a worker picks up an issue, writes code for a plan section, or is about to commit or close an issue.
---

# work-an-issue

One issue per worker. The issue is the only scope.

## Steps

1. Read `docs/vision.md`, `docs/styleguide.md`, and the ADR the change touches. Read the issue.
2. Work on its own branch or worktree. Change only what the issue's scope names. A behavior that is not in the issue and not in the plan section it cites: stop and ask.
3. Prove the issue's Done when with `pnpm test` and `pnpm typecheck`. Leave the issue open when the check cannot pass yet, and say what it waits on.
4. Commit small. The message names the issue: `closes #n`. Never commit `.env`, tokens, or previews. Do not modify `runs/`.
5. Close with `gh issue close`. The comment is exactly the shape in `AGENTS.md`:

```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```

Take the issue number and the sha from the tool output, not from memory.

## Don'ts

- Don't add a database, client JS, notifications, auth, or history across nights.
- Don't invent a field, a route, or a section the plan does not have.
