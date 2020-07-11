/* 
 YouTube Audio Embed 
 --------------------
 
 Author: Amit Agarwal
 Web: http://www.labnol.org/?p=26740 
*/

/* eslint-disable */

function onYouTubeIframeAPIReady() {
	const e = document.getElementById('youtube-audio'),
		t = document.createElement('img');
	t.setAttribute('id', 'youtube-icon'), (t.style.cssText = 'cursor:pointer;cursor:hand'), e.appendChild(t);
	const a = document.createElement('div');
	a.setAttribute('id', 'youtube-player'), e.appendChild(a);
	const o = function(e) {
		const a = e ? 'IDzX9gL.png' : 'quyUPXN.png';
		t.setAttribute('src', 'https://i.imgur.com/' + a);
	};
	e.onclick = function() {
		r.getPlayerState() === YT.PlayerState.PLAYING || r.getPlayerState() === YT.PlayerState.BUFFERING
			? (r.pauseVideo(), o(!1))
			: (r.playVideo(), o(!0));
	};
	var r = new YT.Player('youtube-player', {
		height: '0',
		width: '0',
		videoId: e.dataset.video,
		playerVars: { autoplay: e.dataset.autoplay, loop: e.dataset.loop },
		events: {
			onReady: function(e) {
				r.setPlaybackQuality('small'), o(r.getPlayerState() !== YT.PlayerState.CUED);
			},
			onStateChange: function(e) {
				e.data === YT.PlayerState.ENDED && o(!1);
			}
		}
	});
}
