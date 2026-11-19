# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Qeiii87/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Qeiii87/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Legends — an offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, built for make.fun's "Build the best GTA 6 trophy guide" bounty ($250 in USDC).

Every trophy is shown with its official name, description and grade, a guide written for this entry in its own words, and the sources each guide draws on. The tracker saves progress in the browser (localStorage), exports and imports it, filters by kind (story, missable, collectibles, activities, online), and has a spoiler setting that hides story trophies until they are earned. A seven-stage roadmap leads to the platinum, and every missable trophy is flagged.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

The app is plain static files under `app/` with no build step and no network use: open `app/index.html` in a desktop browser with the network off and it works.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library.

## Sources

Trophy names, descriptions and grades are as PlayStation publishes them (Exophase and PSNProfiles agree on all 55). Each guide cites its sources beside it — the official trophy description, and the in-game menu or feature the guide draws on. Guide text is original to this entry; nothing is copied from other guides.

---

<sub>Entered on [make.fun](https://make.fun/?ref=6yb92059&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
