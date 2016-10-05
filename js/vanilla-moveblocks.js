/*
 * Plugin Name: Vanilla-JS Move Blocks
 * Version: 0.1.0
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

var vanillaMoveBlocks = function(el) {
    'use strict';
    var self = this;
    var currentPos = 10000;
    var wrapper = false;
    var winWidth = 0;
    var positions = [];

    /* APP */
    self.init = function() {
        /* Add an initial wrapper around el */
        self.wrapEl(el);
        /* Get all positions */
        self.extractPositions();
        /* Change positions at init and resize */
        self.resizeEvent();
        window.addEventListener('resize', self.resizeEvent, 1);
    };

    /* Wrap an item */
    self.wrapEl = function(item) {
        wrapper = document.createElement('div');
        wrapper.className = 'vmb-wrapper';
        item.parentNode.insertBefore(wrapper, item);
        wrapper.appendChild(item);
    };

    /* Extract positions */
    self.extractPositions = function() {
        var tmpPos = JSON.parse(el.getAttribute('data-vmbtargets'));
        /* Extract positions */
        for (var pos in tmpPos) {
            positions.push({
                breakpoint: parseInt(pos, 10),
                target: document.querySelector(tmpPos[pos]),
            });
        }
        /* Add main position */
        positions.push({
            breakpoint: 10000,
            target: wrapper,
        });
        /* Sort positions */
        positions.sort(function sort_positions(a, b) {
            return b.breakpoint - a.breakpoint;
        });
    };

    /* Event at resize */
    self.resizeEvent = function() {
        // Get window width
        winWidth = window.innerWidth;

        // Find adapted view
        var tmpTarget = false,
            tmpPos = currentPos;
        for (var i = 0, len = positions.length; i < len; i++) {
            // keep that position if window width is higher than breakpoint
            if (winWidth > positions[i].breakpoint) {
                continue;
            }
            tmpTarget = positions[i].target;
            tmpPos = positions[i].breakpoint;
        }

        // If found position is different than current view
        if (tmpPos != currentPos) {
            // Move el to target
            tmpTarget.appendChild(el);
            // Save position
            currentPos = tmpPos;
        }
    };

    /* INIT */
    self.init();
    return self;
};
