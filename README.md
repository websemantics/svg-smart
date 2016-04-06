```
   ______      __________            ____  __  ___  ___     ___    ______
  / _____ |   /  _  ____/           / __/ /  |/  / / _ |   / _ \  /_  __/
  \ \   | |  / / / / __    ____    _\ \  / /|_/ / / __ |  / , _/   / /
   \ \  | | / / / / / /   /___/   /___/ /_/  /_/ /_/ |_| /_/|_|   /_/
  __\ \ | |/ / / (_/ /          
/____/  |___/  \____/  Automate & optimize your graphic assets, v 0.1.6

```
> Updated : April 6, 2016

A Node.js module that generates all your svg, png, icon and svg sprites needs using a data─driven svg template system.

This Module was designed to be used with a build system, i.e. http://gulpjs.com/, http://gruntjs.com/ etc.

For Gulp projects, use [Gulp SVG Smart](https://github.com/websemantics/gulp─svg─smart)

This folder contains template files for generating media files. SVG templates contains the graphics blueprint for the required `SVG`, `PNG`, `ICO` and `SVG` sprite files. The html template is used to generate the `index.html` file for media preview.

## Workflow

```
           (1) SVG / SPRITE      (2) PNG                      (3) ICON                 (4) HTML
DATA ═══════╦═════════════════════╦════════════════════════════╦═══════════════════════════════╗
            │                     │                            │                               │
  ┌─────────v────┐                │                            │                               │
  │ SVG TEMPLATE │                │                            │                               │
  └───┬──────────┘                v                            v                               │
      │                                                                                        │
      ├── logo.svg ────────────────── logo─w164.png  ──────────┬── favicon.ico                 │
      │                           ├── logo─w164@2x.png         ├── favicon─32x32.png           │
      │                           ├── logo─h32.png             ├── android─chrome─36x36.png    │
      │                           └── logo─h32@2x.png          ├── apple─touch─icon.png        │
      │                           ┆                            ┆                               │
      │                                                                                        │
      ├── logo─text.svg ──────────┬── logo─text+w125.png                                       │
      │                           ├── logo─text+w125@2x.png                                    │
      │                           ├── logo─text+h32.png                                        │
(2) [SPRITE]                      └── logo─text+h32@2x.png     ┆                               │
      │                           ┆                            │                               │
      ├── sprite.svg                                           │                               │
      │                                                        │                               │
      ├── sprite.css              ┆                            │                               │
      │                           │                            │                               │
 ┌────v───────────────────────────v────────────────────────────v───────────────────────────────v───┐
 │  ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒   HTML TEMPLATE  - index.html   ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒  │
 └─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

The `smart.json` file contains the data used to drive the media generation process.

#### Data

List of values that can be referenced in the media list.

#### Media

List of the media to be generated. Each entry of this list represent a different variation of the media being generated.

The `key` part of each media entry represent the `prefix` of the media filename generated. for example, `logo` will generate `logo.svg` and `logo.png` in one the the many variations created.

The `value` part of an entry has two sections, `svg` which contains template data to drive the template generation of the `SVG` media, and `png` which specify the dimensions aspects of the generated `PNG` images.
