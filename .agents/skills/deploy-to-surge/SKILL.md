---
name: deploy-to-surge
description: Publish this repo's digest preview as one HTML file to Surge, only on a domain the human named. Use when putting the morning-digest preview on the web or replacing that same address without the lane marker. Do not use for any other project.
---

# deploy-to-surge

This project only. The commands and their safety rules are at https://surge.sh/docs/agents. Run the CLI as `npx surge@latest`.

The page is one self-contained HTML file, saved by a command from `GET /digest/2026-10-28`. There is no build step. Surge publishes that file as `index.html`.

## This project

- Publish only the digest preview for this repo. No other site, repo, or account.
- The file is written in a directory outside the git repo. Never commit it, never attach it to an issue or a chat (ADR 0003). Surge writes a `CNAME` into the published directory; that directory stays outside the repo.
- The address sent to the reviewer is the domain the human named, for example `https://my-app.surge.sh`. A `--preview` revision keeps that revision. Do not send a revision address as the reviewer link.
- The first publish to that domain, and the later publish with `LANE_MARKER` unset, each wait for their own yes. Say what the file is, why, the address, who can see it, and how to undo it (a later publish over the same domain, or `teardown` after a separate yes).

## Rules

- Use `SURGE_TOKEN` from the environment. Never run `surge login`. Never type an email or password. Never print the token, and never run `surge token`.
- Publish only to the domain the human named. If none was named, ask. Do not invent one.
- Ask before `teardown`, `discard`, `rem`, `nuke`, `dns`, `ssl`, `invite`, `revoke`, or `plan`.
- Do not retry a rate-limited publish.

## Steps

1. `npx surge@latest whoami`. A non-zero exit means stop and ask for a token. The human creates it with `surge tokens add --domain <domain> -m "agent"`. Do not create the account.
2. When the human has asked to publish this change to the named domain:

```sh
npx surge@latest <file.html> <domain>
```

Success ends with `Success! - Published to <domain>`. Check the exit code.

3. Verify with `npx surge@latest <domain> status` and `curl -sI https://<domain>`. `ready` means the account email is not verified yet: tell the human. A `*.surge.sh` domain is HTTPS as soon as the publish returns.
4. To take the marker off, save the page again with `LANE_MARKER` unset and publish that file to the same domain, after a new yes.

`npx surge@latest <domain> rollback` only when the human asks, or when a publish you just made is broken.
