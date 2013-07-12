/*
 * Copyright (C) 2013 Jeff Sharkey
 * http://jsharkey.org/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global R, console*/

;(function(source) {
    var script = document.createElement('script');
    script.textContent = ';(' + source + ')();';
    document.documentElement.appendChild(script);
    script.parentNode.removeChild(script);
})(
function() {

console.log('PlayPlay Initialized.');
var ws = new WebSocket('ws://localhost:6589');
ws.onmessage = function (event) {
    var vol;
    /* cribbed from
    http://bazaar.launchpad.net/~fenryxo/nuvola-player/trunk/view/head:/data/nuvolaplayer/services/rdio/integration.js*/
    if (event.data == "playPause") {
        R.Services.Player.playPause();
    } else if (event.data == "prevTrack") {
        R.Services.Player.previous();
    } else if (event.data == "nextTrack") {
        R.Services.Player.next();
    } else if (event.data == "volUp") {
        vol = R.Services.Player.volume();
        R.Services.Player.volume(Math.min(1.0, vol + 0.05));
    } else if (event.data == "volDown") {
        vol = R.Services.Player.volume();
        R.Services.Player.volume(Math.max(0.0, vol - 0.05));
    } else {
        console.log("unknown event " + event.data);
    }
};

});
