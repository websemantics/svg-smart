```
   ______      __________            ____  __  ___  ___     ___    ______
  / _____ |   /  _  ____/           / __/ /  |/  / / _ |   / _ \  /_  __/
  \ \   | |  / / / / __    ____    _\ \  / /|_/ / / __ |  / , _/   / /
   \ \  | | / / / / / /   /___/   /___/ /_/  /_/ /_/ |_| /_/|_|   /_/
  __\ \ | |/ / / (_/ /          
/____/  |___/  \____/  Automate & optimize your graphic assets.

```
> Updated : April 8, 2016

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM version](https://badge.fury.io/js/svg-smart.svg)](http://badge.fury.io/js/svg-smart)


A Node.js module that generates all your svg, png, icon and svg sprites needs using a data─driven svg template system.

This Module was designed to be used with a build system, i.e. http://gulpjs.com/, http://gruntjs.com/ etc.

For Gulp projects, use [Gulp SVG Smart](https://github.com/websemantics/gulp─svg─smart)


## Workflow

```<small>
          (1) SVG /    (2) PNG                   (3) ICON              (4) HTML
              SPRITE
DATA ═════╦════════════╦═════════════════════════╦════════════════════════════╗
          │            │                         │                            │
┌─────────v────┐       │                         │                 ┌──────────v────┐
│ SVG TEMPLATE │       │                         │                 | HTML TEMPLATE │
└───┬──────────┘       v                         v                 └──────────┬────┘
    │                                                                         │
    ├─ logo.svg ───────┬─ logo─w164.png  ────────┬─ favicon.ico               │
    │                  ├─ logo─w164@2x.png       ├─ favicon─32x32.png         │
    │                  ├─ logo─h32.png           ├─ android─chrome─36x36.png  │
    │                  └─ logo─h32@2x.png        ├─ apple─touch─icon.png      │
    │                  ┆                         ┆                            │
    │                                                                         │
    ├─ logo─text.svg ──┬─ logo─text+w125.png                                  │
    │                  ├─ logo─text+w125@2x.png                               │
    ┆                  ├─ logo─text+h32.png                                   │
                       └─ logo─text+h32@2x.png   ┆                            │
    │                  ┆                         │                            │
    ├─ sprite.svg                                │                            │
    ├─ sprite.css      ┆                         │                            │
    │                  │                         │                            │
┌───v──────────────────v─────────────────────────v────────────────────────────v─┐
│ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒     index.html    ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ │
└───────────────────────────────────────────────────────────────────────────────┘
```

The `smart.json` file contains the data used to drive the media generation process.

#### Data

List of values that can be referenced in the media list.

#### Development

1- Install Release-it

```
npm install release-it -g
```

2- Run it, to git commit and publish to npm

```
release-it
```
