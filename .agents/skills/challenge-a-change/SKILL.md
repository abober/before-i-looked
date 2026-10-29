---
name: challenge-a-change
description: Analyze a planned change in this repo, challenge it against the plan and the code, and leave one final proposal. Ask the human to confirm a direction only when a real doubt remains or a gap in the materials blocks one reading. Use when splitting a plan, drafting issues, or choosing how to implement a change.
---

# challenge-a-change

The proposal you leave is the one to carry out. A second option is a gap you have not closed.

## Steps

1. Read the planned change and the materials it names: the plan section, `docs/vision.md`, `docs/styleguide.md`, the ADRs, and the code and fixtures the change would touch.
2. Challenge it. Look for a done-when that cannot be checked, a dependency copied from a start sentence, an acceptance line that is not in the source, a measure with two readings, and work the text places outside the repo.
3. Decide every cut the materials already decide. Cite the file for each cut. Do not offer a second option for those.
4. Leave one proposal.
5. Ask the human only when a doubt remains that you cannot close, or a gap in the materials blocks one reading of the problem. Name the gap, the readings, and what each reading changes. One gap at a time. A direction the materials already fix does not get a confirmation question.
6. A step outside the repository still waits for a yes: a new public repo, a public upload, an account, or spending money. That wait is not a gap in the problem. Say what it is, why, where, who can see it, and how to undo it.

## Don'ts

- Don't ask the human to pick between cuts you can already defend from the files.
- Don't leave two proposals standing.
- Don't invent a section, a field, or a done-when the materials do not have.
