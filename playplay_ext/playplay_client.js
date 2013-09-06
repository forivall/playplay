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

playplay.vote = function(key) {
    R.Api.request({
        method:"voteForTrackOnStation",
        content: {
            station_key: R.player.playingSource().get('key'),
            track_key: R.player.playingTrack().get('key'),
            vote: key
        }
    });
}

playplay.voteDownRemove = function(track) {
    _.defer(function() {
        R.player.next();

        if (R.isStation(R.player.playingSource())) {
            R.player.removeTrackFromCurrentSource(track.get("key"));
        }
    });
}

console.log('PlayPlay Initialized.');
ws = new WebSocket(playplay.ws_url = 'ws://localhost:6589');
ws.onmessage = playplay.ws_onmessage = function (event) {
    var vol, action = event.data, remove = false;
    console.log('PlayPlay Recieved message: ' + event.data);
    /* cribbed from
    http://bazaar.launchpad.net/~fenryxo/nuvola-player/trunk/view/head:/data/nuvolaplayer/services/rdio/integration.js*/
    if (action == "skip") {
        action = R.isStation(R.player.playingSource()) ? 'voteDown' : 'nextTrack';
        remove = true;
    }

    if (action == "playPause") {
        R.Services.Player.playPause();
    } else if (action == "prevTrack") {
        R.Services.Player.previous();
    } else if (action == "nextTrack") {
        R.Services.Player.next();
    } else if (action == "voteUp") {
        playplay.vote('favorite');
    } else if (action == "voteDown") {
        var playingTrack = R.player.playingTrack();
        playplay.vote('skip');
        if (remove) { playplay.voteDownRemove(playingTrack); }
    } else if (action == "volUp") {
        vol = R.Services.Player.volume();
        R.Services.Player.volume(Math.min(1.0, vol + 0.05));
    } else if (action == "volDown") {
        vol = R.Services.Player.volume();
        R.Services.Player.volume(Math.max(0.0, vol - 0.05));
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
