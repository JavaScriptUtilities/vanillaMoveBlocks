/*
 * Plugin Name: Vanilla-JS Move Blocks
 * Version: 0.3.0
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

var vanillaMoveBlocks = function(el, settings) {
    'use strict';

    settings = typeof settings == 'object' ? settings : {};

    if (!el) {
        return false;
    }

    var self = this,
        currentPos = 10000,
        posLength = 0,
        _tmpClassname = settings.tmpClassname || 'vmb-wrapper',
        _targets = settings.targets || {},
        resizeTimeout = false,
        wrapper = false,
        winWidth = 0,
        positions = [];

    /* APP */
    var init = function() {
        /* Add an initial wrapper around el */
        wrapEl(el);
        /* Get all positions */
        self.extractPositions();
        /* Change positions at init and resize */
        self.setBlockPosition();
        window.addEventListener('resize', resizeEvent, 1);
    };

    /* Wrap an item */
    var wrapEl = function(item) {
        if (el.getAttribute('vmbwrapperclassname')) {
            tmpClassname = el.getAttribute('vmbwrapperclassname');
        }
        wrapper = document.createElement('div');
        wrapper.className = 'vmb-wrapper';
        item.parentNode.insertBefore(wrapper, item);
        wrapper.appendChild(item);
    };

    /* Extract positions */
    self.extractPositions = function() {
        if (el.getAttribute('data-vmbtargets')) {
            _targets = JSON.parse(el.getAttribute('data-vmbtargets'));
        }
        /* Extract positions */
        for (var pos in _targets) {
            positions.push({
                breakpoint: parseInt(pos, 10),
                target: document.querySelector(_targets[pos]),
            });
        }
        /* Add main position */
        positions.push({
            breakpoint: 10000,
            target: wrapper,
        });
        posLength = positions.length;
        /* Sort positions */
        positions.sort(function sort_positions(a, b) {
            return b.breakpoint - a.breakpoint;
        });
    };

    /* Event at resize */
    var resizeEvent = function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(self.setBlockPosition, 100);
    };

    /* Move block to correct position */
    self.setBlockPosition = function() {
        // Get window width
        winWidth = window.innerWidth;

        // Find adapted view
        var tmpTarget = false,
            tmpPos = currentPos;
        for (var i = 0; i < posLength; i++) {
            // keep that position if window width is higher than breakpoint
            if (winWidth > positions[i].breakpoint) {
                continue;
            }
            tmpTarget = positions[i].target;
            tmpPos = positions[i].breakpoint;
        }

        // If found position is different than current view
        if (tmpPos == currentPos) {
            return;
        }
        // Move el to target
        tmpTarget.appendChild(el);
        // Save position
        currentPos = tmpPos;
    };

    /* INIT */
    init();
    return self;
};
