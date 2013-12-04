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

var playplay = {};

console.log('PlayPlay Initialized.');
ws = new WebSocket(playplay.ws_url = 'ws://localhost:6589');
ws.onmessage = playplay.ws_onmessage = function (event) {
    var vol, action = event.data, remove = false;
    console.log('PlayPlay Recieved message: ' + event.data);

    if (action == "playPause") {
        cmd_player.play_pause();
    } else if (action == "prevTrack") {
        playlist.back();
    } else if (action == "nextTrack") {
        playlist.next();
    } else if (action == "volUp") {
        vol = cmd_player.volume;
        cmd_player.set_volume(Math.min(100, vol + 5));
    } else if (action == "volDown") {
        vol = R.Services.Player.volume();
        cmd_player.set_volume(Math.max(0, vol - 5));
    } else {
        console.log("unknown event " + action);
    }
};

var _clone = function(source) {
    var obj = {};
    for(var prop in source){obj[prop]=source[prop]}
    return obj;
}

if (window.playplay === undefined) {
    window.playplay = _clone(playplay);
}


});
