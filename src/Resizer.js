/*
 * Author: Alef Miranda
 *
 * Description: The Resizer observes for resize events on a given element an calls a given callback.
 * Based on http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
 */

'use strict';

// Let Resizer be defined only once
if (!window.Resizer) {
    (function(){

        // Fixed timeout of 33 miliseconds (30 FPS)
        function getTimeout(callback) {
            return window.setTimeout(callback, 33);
        }

        // Select the correct Request Animation Frame function
        function requestFrame(callback, thisArg, args) {
            var raf =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                getTimeout;

            return raf(function () {
                callback.apply(thisArg, args);
            });
        }

        // Select the corrent Cancel Animation Frame function
        function cancelFrame(id) {
            var caf =
                window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.clearTimeout;

            return caf(id);
        }

        // Execute each callback function
        function exec(element, event) {
            var trigger = element.$resizeTrigger;
            var callbacks = trigger.$resizeListeners;


            for (
                var i = 0,
                    length = callbacks.length,
                    callback = callbacks[i];
                i < length;
                ++i,
                    callback = callbacks[i]
            ) {
                // Execute the callback asynchronously
                requestFrame(callback, trigger, [event]);
            }
        }

        // On resize event, call!
        function resizeListener(event) {
            var element = event.target || event.srcElement;

            if (element.$resizeRAF) cancelFrame(element.$resizeRAF);

            element.$resizeRAF = requestFrame(exec, null, [element, event]);
        }

        // Onload event reset on trap element
        function load() {
            this.contentDocument.defaultView.$resizeTrigger = this.$resizeElement;
            this.contentDocument.defaultView.addEventListener('resize', resizeListener);
        }

        // Creates a new HTMLObjectElement and assign the correct properties
        function trapElement(element) {
            var style, trap;

            style
                = "display: block; position: absolute; top: 0; left: 0; height: 100%;"
                +" width: 100%; overflow: hidden; pointer-events: none; z-index: -1;";

            trap = document.createElement("object");
            trap.setAttribute("style", style);
            trap.$resizeElement = element;
            trap.onload = load;
            trap.type = "text/html";
            trap.data = "about:blank";

            element.$resizeTrigger = trap;
            if (element.shadowRoot) {
                element.shadowRoot.appendChild(trap);
            } else {
                element.appendChild(trap);
            }
        }

        // Removes HTMLObjectElement
        function untrapElement(element) {
            element.$resizeTrigger.contentDocument.defaultView.removeEventListener('resize', resizeListener);

            if (element.shadowRoot) {
                element.shadowRoot.removeChild(element.$resizeTrigger);
            } else {
                element.removeChild(element.$resizeTrigger);
            }

            delete element.$resizeTrigger;
            delete element.$resizeListeners;
        }

        window.Resizer = {};

        // Registers resize event on element
        window.Resizer.add = function (element, callback) {
            var position;

            if (!element.$resizeListeners) {
                element.$resizeListeners = [];

                element.style.position = "relative";
                trapElement(element);
            }

            position = element.$resizeListeners.indexOf(callback);

            if (position == -1) {
                element.$resizeListeners.push(callback);
            }
        }

        // Erase resize event on element
        window.Resizer.rm = function (element, callback) {
            var position;

            if (element.$resizeListeners.length) {

                position = element.$resizeListeners.indexOf(callback);

                if (position >= 0) {
                    element.$resizeListeners.splice(position, 1);
                }
            }

            if (!element.$resizeListeners.length) {
                untrapElement(element);
            }
        }
    })();
}
