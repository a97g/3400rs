# 3400rs

OldSchool RuneScape Pet Listing Generation tool.

By querying https://templeosrs.com/ API the table will display your pets below.
Use the sidebar options to customize the chart's visual appearance.

More or less created for Streamers who hunt pets and do not have any artisic skill / anyone to create !pets commands for them.

## Features

- Create a **highly customizable** Pet Listing for your OldSchool Runescape account
- View your dry streaks OR _how lucky you were_
- Import / Export your Kc's & Pets for ease of updating
- Manual mode rather than pulling your data from an API
- View your clans ranking leaderboard

## Created with

TypeScript, React, Axios, & Material UI

## Preview

![3400rs Pet List Preview](https://i.imgur.com/CmOwT7g.png)
![3400rs Clan Leaderboard Preview](https://i.imgur.com/ys1To0X.png)
![3400rs Kc Mode / Likeness Tracker Preview](https://i.imgur.com/soVrlsT.png)

## Hosted @

https://3400rs.pages.dev/

## Cloudflare proxy (Pages Functions)

This project expects a CORS proxy in production to avoid 403s from public proxies.

1. Deploy the site on Cloudflare Pages with Functions enabled.
2. The proxy endpoint is provided by [functions/proxy.ts](functions/proxy.ts) and is available at `/proxy`.
3. Set the frontend env var to your deployed endpoint:

```
REACT_APP_CORS_PROXY_URL=https://<your-pages-domain>/proxy?url=
```

The proxy allowlists `templeosrs.com` (and subdomains) and only forwards https requests.
