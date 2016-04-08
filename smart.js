/**
 * SVG SMART - A Node.js module that generates all your svg, png, icon and svg sprites needs using a
 *             data-driven svg template system.
 *    ______    __________           ____  __  ___  ___     ___    ______
 *   / ____ |  /  _  ____/   ____   / __/ /  |/  / / _ |   / _ \  /_  __/
 *   \ \  | | / / / / __    /___/  _\ \  / /|_/ / / __ |  / , _/   / /
 *  __\ \ | |/ / / (_/ /          /___/ /_/  /_/ /_/ |_| /_/|_|   /_/
 * /____/ |___/  \____/ Automate & optomize your graphic assets, v 0.1.7
 *
 * This Module was designed to be used with a build system, i.e. http://gulpjs.com/, http://gruntjs.com/ etc.
 * For Gulp projects, use [Gulp SVG Smart](https://github.com/websemantics/gulp-svg-smart)
 *
 * @link      http://websemantics.ca
 * @author    Web Semantics, Inc. Dev Team <team@websemantics.ca>
 * @author    Adnan M.Sagar, PhD. <adnan@websemantics.ca>
 */

var readfile = require("require-dot-file");
var mustache = require("mustache");

(() => {
    'use strict';
    /**
     * Resources, builds a list of resources to generate svg, png, icon and svg sprites
     *
     * To achive that, we go through all templates provided in the svg-smart json file, and for each
     * template we will visit the target node (inside 'data' property).  Each target will result
     * into a tree where the leaves are target the resources (svg files),
     * From the generated svg files we create png and sprite files, then from one png file we create
     * the entrire project icon files, .. lovely!
     *
     * @param {templates} array, a list of svg templates configurations
     * @param {data} object, list of flat data nodes with parent-child releashipships (tree) .. keep it simple,
     * @param {concat} string, string connector, i.e. '-' or '.' etc for constructing filenames
     * @param {dist} string, dist folder
     * @return {array} list of resources,
     */
    function resources(templates, data, concat, dist) {
        var resources = {
            svg: [],
            png: [],
            sprite: [],
            icon: []
        };

        for (var id in templates) {
            var template = templates[id];
            template.dest = template.dest || '.';
            var targets = template.data || [];
            for (var i in targets) {
                tree(targets[i], null);
                /**
                 * Tree, .. local tree builder to achive data inheritance between data
                 *          nodes (css style), in a recursive manner, .. killin it ..
                 *
                 *          The result tree is never used however, but we collect all the tree
                 *          leaves during the build process and store into  the 'resources' object
                 *
                 * @param {id} string, the id of the target data node
                 * @param {object} the parent tree node, parent value overrides children's
                 */
                function tree(id, parent) {
                    var target = data[id];
                    var name = (target.name != undefined) ? target.name : id;
                    var node = {
                        name: (parent ? parent.name + ((name > '') ? concat : '') : '') + name,
                        value: merge(target.value || [], parent ? parent.value || [] : []),
                        children: []
                    };

                    for (var i in target.children || []) { /* build the tree please ... quick, I'm busy */
                        node.children.push(tree(target.children[i], node, data));
                    }

                    /* catch the leaves, .. and create the resources, svg, png */
                    if (node.children.length == 0) {

                        /* calculate zoom factor, use viewbox to apply */
                        var diff_x = (Number(node.value['zoom']) / 100) * Number(node.value['width']);
                        var diff_y = (Number(node.value['zoom']) / 100) * Number(node.value['height']);

                        node.value['viewbox_x']      = (Number(node.value['viewbox_x']) || 0) - diff_x;
                        node.value['viewbox_y']      = (Number(node.value['viewbox_y']) || 0) - diff_y;
                        node.value['viewbox_width']  =  Number(node.value['viewbox_width'] || node.value['width']) + diff_x * 2;
                        node.value['viewbox_height'] =  Number(node.value['viewbox_height'] || node.value['height']) + diff_y * 2;

                        /* 1- create the svg files */
                        var resource = {
                            "filename": node.name,
                            "dest": template.dest + "/" + (template.svg ? template.svg.dest || '.' : '.'),
                            "template": template.source,
                            "extension": template.extension || "svg",
                            "data": node.value
                        };

                        /* 2- create png file(s) per an svg file, for each provided scale (based on height or width) */
                        if (template.png) {
                            if (template.png.scale) { /* scale the image as specified by the user */
                                resources.png = merge(resources.png, wh('height', 'h'));
                                resources.png = merge(resources.png, wh('width', 'w'));
                            } else {
                                resources.png = merge(resources.png, wh()); /* if scale isn't defined, create a matching png 1:1 */
                            }
                            function wh(property, prefix){
                                // Summery: png helper function, generate lists for scale (width / height)
                                var list                 = [];
                                var /* array */ array_wh = (typeof property === 'string') ? template.png.scale[property] || [] : [1];
                                var /* real */  r_wh     = (typeof property === 'string') ? resource.data[property] || 1 : 1;
                                prefix = prefix || '';

                                for (var i in array_wh) {
                                    var scale = array_wh[i] / r_wh;
                                    list.push(png(resource.filename, scale, ((prefix > '') ? prefix + array_wh[i] : '')));
                                    if (template.png.retina || false) {
                                        list.push(png(resource.filename, scale * 2, ((prefix > '') ? prefix + array_wh[i] : '') + '@2x'));
                                    }
                                }
                                function png(filename, scale, suffex) {
                                    // Summery: compose of the png resource object
                                    return {
                                        "filename": resource.filename + (suffex ? concat + suffex : ''),
                                        "source": dist + "/" + resource.dest + "/" + resource.filename + '.' + resource.extension,
                                        "extension": "png",
                                        "scale": scale,
                                        "dest": template.dest + "/" + template.png.dest || '.'
                                    };
                                }
                                return list;
                            }
                        }
                        resources.svg.push(resource);
                    }
                    return node;
                }
            }
            /* 3- create the sprite files per template */
            if (template.sprite) {
                var sconfig = {
                    "mode": {
                        "view": {
                            "bust": false,
                            "render": {
                                "css": true
                            }
                        },
                        "symbol": true
                    }
                };
                resources.sprite.push({
                    "source": dist + "/" + (template.sprite ? template.sprite.source || '.' : '.'),
                    "config": template.sprite ? template.sprite.config || sconfig : sconfig,
                    "dest": template.dest + "/" + (template.sprite ? template.sprite.dest || '.' : '.')
                });
            }
            /* 4- create the icon files set per template */
            if (template.icon) {
                var iconfig = {
                    "appName": "",
                    "developerName": "",
                    "developerURL": "",
                    "background": "#fff",
                    "path": '.',
                    "url": "",
                    "display": "",
                    "orientation": "portrait",
                    "version": 1,
                    "logging": false,
                    "online": false,
                    "replace": true
                };
                resources.icon.push({
                    "source": dist + "/" + (template.icon ? template.icon.source || '.' : '.'),
                    "config": template.icon ? template.icon.config || iconfig : iconfig,
                    "dest": template.dest + "/" + (template.icon ? template.icon.dest || '.' : '.')
                });
            }
        }
        return resources;
    }

    /**
     * Hydrate:  Let's do the recursive thing, ...
     *
     *           Traverse the object properties to replace any occurances of
     *           the global variables references with thier values, .. mustache style!
     *
     *           i.e "name" : "{{ variable_reference }}"
     *
     * @param {object} object to be processed
     * @param {global} global variables
     */
    function hydrate(obj, global) {
        if (typeof obj === 'object') {
            for (var i in obj) {
                obj[i] = hydrate(obj[i], global);
            }
        } else if (typeof obj === 'string') {
            return mustache.render(obj, global);
        }
        return obj;
    }

    /**
     * Merge:  fuse object/array 'b' into 'a' and return
     *
     * @param {object/array} a, bottom item
     * @param {object/array} b, top item
     * @return {object/array} fuse(a <- b)
     */
    function merge(a, b) {
        var obj = JSON.parse(JSON.stringify(a));
        if (typeof a === 'object' && typeof b === 'object') {
            if (Array.isArray(a) && Array.isArray(b)) {
                for (var i in b) {
                    obj.push(b[i]);
                }
            } else {
                for (var i in b) {
                    obj[i] = b[i];
                }
            }
        }
        return obj;
    }

    /**
     * Read a dot file, .. simple, huh ..
     *
     * @param {filename} string, json file
     * @return object
     */
    function read(filename) {
        var data = null;
        try {
            data = readfile(filename);
        } catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                console.error('File ' + filename + ' is not found');
            }
        }
        return data;
    }

    module.exports = {
        /**
         * Load and process the svg-smart json file
         * @param {smart_filename} string, the svg-smart json file
         * @param {package_filename} string, node.js package filename (reuse of information)
         * @return object, a list of resources to be generated (svg, png, ico, sprite)
         */
        load: function(smart_filename, package_filename) {

            var smart = read(smart_filename);
            var data = {
                global: smart.global,
                package: read(package_filename)
            };
            var dist = data.global.files.dist || 'dist';
            var res  = resources(hydrate(smart.template, data),
                hydrate(smart.data, data), data.global.files.concatenator, dist);

            return {
                svg: res.svg,
                png: res.png,
                icon: res.icon,
                sprite: res.sprite,
                dist: dist,
                html: hydrate(smart.html, data)
            };
        }
    }
})();
