// RELÓGIO - HORA DO BRASIL (UTC-3)
(function() {
	var clockEl = document.getElementById('winClock');
	if (!clockEl) return;

	function updateClock() {
		var now = new Date();
		var brTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
		var hours = brTime.getHours();
		var minutes = brTime.getMinutes();
		var seconds = brTime.getSeconds();
		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		if (seconds < 10) seconds = "0" + seconds;
		clockEl.textContent = hours + ":" + minutes + ":" + seconds;
	}

	updateClock();
	setInterval(updateClock, 1000);
})();

// SISTEMA DE JANELAS (abrir, fechar, minimizar, arrastar, foco)
(function() {
	var taskbarItems = document.getElementById('taskbarOpenWindows');
	var windows = Array.prototype.slice.call(document.querySelectorAll('.win-window'));
	var openWindows = {}; // id -> {window, taskItem, minimized}

	function getTitle(win) {
		var t = win.querySelector('.win-titlebar-left span:last-child');
		return t ? t.textContent : win.id;
	}

	function isVisible(win) {
		if (win.classList.contains('window-closed')) return false;
		if (win.classList.contains('minimized')) return true;
		return window.getComputedStyle(win).display !== 'none' && win.style.display !== 'none';
	}

	function refreshTaskbar() {
		taskbarItems.innerHTML = '';
		windows.forEach(function(win) {
			if (isVisible(win)) {
				var btn = document.createElement('div');
				btn.className = 'win-taskbar-item';
				btn.textContent = getTitle(win);
				btn.title = 'Clicar para restaurar/minimizar';
				btn.addEventListener('click', function(e) {
					e.stopPropagation();
					toggleFromTaskbar(win);
				});
				win.taskBtn = btn;
				taskbarItems.appendChild(btn);
			}
		});
	}

	function setActive(win) {
		windows.forEach(function(w) { w.classList.remove('active-window'); });
		win.classList.add('active-window');
		windows.forEach(function(w) {
			if (w.taskBtn) w.taskBtn.classList.remove('active');
		});
		if (win.taskBtn) win.taskBtn.classList.add('active');
	}

	function openWindow(id) {
		var win = document.getElementById(id);
		if (!win) return;
		win.classList.remove('window-closed', 'minimized');
		win.style.display = 'block';
		setActive(win);
		refreshTaskbar();
	}

	// Expõe globalmente para outros scripts abrirem janelas
	window.openAppWindow = openWindow;

	function closeWindow(win) {
		win.style.display = 'none';
		win.classList.add('window-closed');
		refreshTaskbar();
	}

	function minimizeWindow(win) {
		win.classList.add('minimized');
		refreshTaskbar();
	}

	function toggleFromTaskbar(win) {
		if (win.classList.contains('minimized')) {
			win.classList.remove('minimized');
			win.style.display = 'block';
			setActive(win);
		} else {
			minimizeWindow(win);
		}
		refreshTaskbar();
	}

	// Abrir via ícones do desktop e menu iniciar
	document.querySelectorAll('.desktop-shortcut, .start-menu-item[data-open]').forEach(function(el) {
		el.addEventListener('click', function() {
			var id = this.getAttribute('data-open');
			if (!id) return;
			var win = document.getElementById(id);
			if (win && win.classList.contains('minimized')) {
				win.classList.remove('minimized');
				win.style.display = 'block';
				setActive(win);
			} else {
				openWindow(id);
			}
			var sm = document.getElementById('startMenu');
			if (sm) sm.classList.remove('open');
		});
	});

	// Atalhos externos (ex.: abrir portfólio)
	document.querySelectorAll('.desktop-shortcut[data-external]').forEach(function(el) {
		el.addEventListener('click', function() {
			var url = this.getAttribute('data-external');
			if (url) {
				window.open(url, '_blank');
			}
		});
	});

	// Botões fechar/minimizar
	windows.forEach(function(win) {
		var closeBtn = win.querySelector('.btn-close');
		var minBtn = win.querySelector('.btn-min');
		if (closeBtn) closeBtn.addEventListener('click', function() {
			closeWindow(win);
		});
		if (minBtn) minBtn.addEventListener('click', function() {
			minimizeWindow(win);
		});
		// Clicar na janela traz ao foco
		win.addEventListener('mousedown', function() {
			setActive(win);
		});
		// Arrastar janela
		var titlebar = win.querySelector('.win-titlebar');
		if (titlebar) {
			var isDragging = false, offsetX = 0, offsetY = 0;
			titlebar.addEventListener('mousedown', function(e) {
				if (e.target.closest('.win-btn')) return;
				isDragging = true;
				var rect = win.getBoundingClientRect();
				offsetX = e.clientX - rect.left;
				offsetY = e.clientY - rect.top;
				e.preventDefault();
			});
			document.addEventListener('mousemove', function(e) {
				if (!isDragging) return;
				win.style.left = (e.clientX - offsetX) + 'px';
				win.style.top = (e.clientY - offsetY) + 'px';
			});
			document.addEventListener('mouseup', function() {
				isDragging = false;
			});
		}
	});

	// Seleção de ícones do desktop
	document.querySelectorAll('.desktop-shortcut').forEach(function(sh) {
		sh.addEventListener('click', function() {
			document.querySelectorAll('.desktop-shortcut').forEach(function(x) { x.classList.remove('selected'); });
			this.classList.add('selected');
		});
	});

	refreshTaskbar();
})();

// MENU INICIAR
(function() {
	var startBtn = document.getElementById('startBtn');
	var startMenu = document.getElementById('startMenu');

	if (startBtn && startMenu) {
		startBtn.addEventListener('click', function(e) {
			e.stopPropagation();
			startMenu.classList.toggle('open');
		});
	}

	document.addEventListener('click', function(e) {
		if (startMenu && startMenu.classList.contains('open') && !startMenu.contains(e.target) && e.target !== startBtn) {
			startMenu.classList.remove('open');
		}
	});
})();

// PLAYER DE MÚSICA RETRO - AUDIO HTML5
(function() {
	var playlist = [
		{
			artist: "The Long Faces",
			title: "Jane!",
			cover: "https://i.scdn.co/image/ab67616d0000b2736685599bd4bafe725e532e2f",
			src: "musicas/jane.mp3"
		},
		{
			artist: "Laufey",
			title: "From the Start",
			cover: "https://i.scdn.co/image/ab6761610000e5ebc751deb23ed62e7cadfb669a",
			src: "musicas/from-the-start.mp3"
		},
		{
			artist: "Laufey",
			title: "Promise",
			cover: "https://images.genius.com/a4a62b88f0717a4eb2d7201eb05f4b33.300x300x1.png",
			src: "musicas/promise.mp3"
		},
		{
			artist: "Jão",
			title: "Idiota",
			cover: "https://i.scdn.co/image/ab67616d0000b27376086200d394250d6eef8adf",
			src: "musicas/idiota.mp3"
		},
		{
			artist: "Jão",
			title: "Aurora",
			cover: "https://akamai.sscdn.co/uploadfile/letras/albuns/3/b/7/4/5057081785149299.jpg",
			src: "musicas/aurora.mp3"
		},
		{
			artist: "2ZDinizz",
			title: "Pensando em Mim",
			cover: "https://i.scdn.co/image/ab67616d0000b273800ebc6f7b457f363809be8e",
			src: "musicas/pensando-em-mim.mp3"
		},
		{
			artist: "Cafuné",
			title: "Tek It",
			cover: "https://cdn-images.dzcdn.net/images/cover/6414570db8287addf610c8ab5aad638b/0x1900-000000-80-0-0.jpg",
			src: "musicas/tek-it.mp3"
		}
	];

	var currentIndex = 0;
	var audio = document.getElementById('html5AudioPlayer');
	var isPlaying = false;
	var isShuffle = false;
	var isRepeat = false;

	if (!audio) return;

	var imgCover = document.getElementById('playerCover');
	var cdIcon = document.getElementById('cdIcon');
	var btnPlay = document.getElementById('btnPlayPause');
	var btnPrev = document.getElementById('btnPrev');
	var btnNext = document.getElementById('btnNext');
	var btnPrevAll = document.getElementById('btnPrevAll');
	var btnNextAll = document.getElementById('btnNextAll');
	var btnShuffle = document.getElementById('btnShuffle');
	var btnRepeat = document.getElementById('btnRepeat');
	var btnHeart = document.getElementById('btnHeart');
	var artistSelect = document.getElementById('artistSelect');
	var songSelect = document.getElementById('songSelect');
	var currTime = document.getElementById('currTime');
	var totalTime = document.getElementById('totalTime');
	var progressBg = document.getElementById('progressBg');
	var progressFill = document.getElementById('progressFill');
	var volUp = document.getElementById('volUp');
	var volDown = document.getElementById('volDown');
	var volFill = document.getElementById('volFill');

	function populateSelects() {
		if (!artistSelect || !songSelect) return;
		var artists = [];
		playlist.forEach(function(item) {
			if (artists.indexOf(item.artist) === -1) artists.push(item.artist);
		});
		artistSelect.innerHTML = '';
		artists.forEach(function(art) {
			var opt = document.createElement('option');
			opt.value = art;
			opt.textContent = art;
			artistSelect.appendChild(opt);
		});
		updateSongOptions();
	}

	function updateSongOptions() {
		if (!artistSelect || !songSelect) return;
		var selectedArt = artistSelect.value;
		songSelect.innerHTML = '';
		playlist.forEach(function(item, idx) {
			if (item.artist === selectedArt) {
				var opt = document.createElement('option');
				opt.value = idx;
				opt.textContent = item.title;
				songSelect.appendChild(opt);
			}
		});
	}

	function loadTrack(index, shouldPlay) {
		currentIndex = index;
		var track = playlist[index];
		if (!track) return;
		audio.src = track.src;
		if (imgCover) imgCover.src = track.cover;
		if (artistSelect) artistSelect.value = track.artist;
		updateSongOptions();
		if (songSelect) songSelect.value = index;
		if (shouldPlay) playTrack();
	}

	function playTrack() {
		if (audio.pause) audio.pause();
		audio.play().then(function() {
			isPlaying = true;
			if (btnPlay) btnPlay.classList.add('active');
			if (cdIcon) cdIcon.classList.add('spinning');
		}).catch(function(err) {
			console.log("Erro ao tocar áudio:", err);
		});
	}

	function pauseTrack() {
		audio.pause();
		isPlaying = false;
		if (btnPlay) btnPlay.classList.remove('active');
		if (cdIcon) cdIcon.classList.remove('spinning');
	}

	if (btnPlay) btnPlay.addEventListener('click', function() {
		if (isPlaying) pauseTrack(); else playTrack();
	});

	if (btnNext) btnNext.addEventListener('click', function() {
		currentIndex = isShuffle ? Math.floor(Math.random() * playlist.length) : (currentIndex + 1) % playlist.length;
		loadTrack(currentIndex, true);
	});

	if (btnNextAll) btnNextAll.addEventListener('click', function() {
		currentIndex = playlist.length - 1;
		loadTrack(currentIndex, true);
	});

	if (btnPrev) btnPrev.addEventListener('click', function() {
		currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
		loadTrack(currentIndex, true);
	});

	if (btnPrevAll) btnPrevAll.addEventListener('click', function() {
		currentIndex = 0;
		loadTrack(currentIndex, true);
	});

	if (btnShuffle) btnShuffle.addEventListener('click', function() {
		isShuffle = !isShuffle;
		btnShuffle.classList.toggle('active', isShuffle);
	});

	if (btnRepeat) btnRepeat.addEventListener('click', function() {
		isRepeat = !isRepeat;
		btnRepeat.classList.toggle('active', isRepeat);
	});

	if (btnHeart) btnHeart.addEventListener('click', function() {
		btnHeart.classList.toggle('active');
	});

	if (artistSelect) artistSelect.addEventListener('change', function() {
		updateSongOptions();
		if (songSelect.options.length > 0) loadTrack(parseInt(songSelect.value), isPlaying);
	});

	if (songSelect) songSelect.addEventListener('change', function() {
		loadTrack(parseInt(this.value), isPlaying);
	});

	function formatTime(sec) {
		if (isNaN(sec)) return "0:00";
		var m = Math.floor(sec / 60);
		var s = Math.floor(sec % 60);
		if (s < 10) s = "0" + s;
		return m + ":" + s;
	}

	audio.addEventListener('timeupdate', function() {
		if (audio.duration) {
			if (progressFill) progressFill.style.width = ((audio.currentTime / audio.duration) * 100) + "%";
			if (currTime) currTime.textContent = formatTime(audio.currentTime);
			if (totalTime) totalTime.textContent = formatTime(audio.duration);
		}
	});

	audio.addEventListener('ended', function() {
		if (isRepeat) playTrack(); else if (btnNext) btnNext.click();
	});

	if (progressBg) progressBg.addEventListener('click', function(e) {
		var rect = progressBg.getBoundingClientRect();
		var pct = (e.clientX - rect.left) / rect.width;
		if (audio.duration) audio.currentTime = pct * audio.duration;
	});

	audio.volume = 0.7;
	if (volFill) volFill.style.height = "70%";

	if (volUp) volUp.addEventListener('click', function() {
		audio.volume = Math.min(1, audio.volume + 0.1);
		if (volFill) volFill.style.height = (audio.volume * 100) + "%";
	});

	if (volDown) volDown.addEventListener('click', function() {
		audio.volume = Math.max(0, audio.volume - 0.1);
		if (volFill) volFill.style.height = (audio.volume * 100) + "%";
	});

	populateSelects();
	loadTrack(0, false);
})();

// PESQUISA DE CONVIDADOS
(function() {
	var searchInput = document.getElementById('guestSearch');
	var searchCount = document.getElementById('guestSearchCount');
	var rows = document.querySelectorAll('.table-wrapper tbody tr');

	if (!searchInput || !searchCount) return;

	function updateCount(count) {
		searchCount.textContent = count === 1 ? '1 convidado' : count + ' convidados';
	}

	updateCount(rows.length);

	searchInput.addEventListener('input', function() {
		var term = searchInput.value.toLowerCase().trim();
		var visible = 0;
		rows.forEach(function(row) {
			var text = row.textContent.toLowerCase();
			var match = text.indexOf(term) !== -1;
			row.style.display = match ? '' : 'none';
			if (match) visible++;
		});
		updateCount(visible);
	});
})();

// MS PAINT DA FESTA
(function() {
	var dc = document.getElementById('drawCanvas');
	if (!dc) return;
	var dctx = dc.getContext('2d');
	var drawing = false;
	var isEraser = false;
	var lastX = 0, lastY = 0;
	var history = [];

	function saveState() {
		if (history.length >= 20) history.shift();
		history.push(dctx.getImageData(0, 0, dc.width, dc.height));
	}

	saveState();

	function getPos(e) {
		var rect = dc.getBoundingClientRect();
		var scaleX = dc.width / rect.width;
		var scaleY = dc.height / rect.height;
		if (e.touches) {
			return {
				x: (e.touches[0].clientX - rect.left) * scaleX,
				y: (e.touches[0].clientY - rect.top) * scaleY
			};
		}
		return {
			x: (e.clientX - rect.left) * scaleX,
			y: (e.clientY - rect.top) * scaleY
		};
	}

	function startDraw(e) {
		e.preventDefault();
		drawing = true;
		var pos = getPos(e);
		lastX = pos.x;
		lastY = pos.y;
	}

	function draw(e) {
		if (!drawing) return;
		e.preventDefault();
		var pos = getPos(e);
		var bc = document.getElementById('brushColor');
		dctx.beginPath();
		dctx.moveTo(lastX, lastY);
		dctx.lineTo(pos.x, pos.y);
		dctx.strokeStyle = isEraser ? '#ffffff' : (bc ? bc.value : '#000000');
		var bs = document.getElementById('brushSize');
		dctx.lineWidth = bs ? bs.value : 3;
		dctx.lineCap = 'round';
		dctx.lineJoin = 'round';
		dctx.stroke();
		lastX = pos.x;
		lastY = pos.y;
	}

	function stopDraw() {
		if (drawing) {
			drawing = false;
			saveState();
		}
	}

	dc.addEventListener('mousedown', startDraw);
	dc.addEventListener('mousemove', draw);
	dc.addEventListener('mouseup', stopDraw);
	dc.addEventListener('mouseleave', stopDraw);
	dc.addEventListener('touchstart', startDraw, { passive: false });
	dc.addEventListener('touchmove', draw, { passive: false });
	dc.addEventListener('touchend', stopDraw);

	var toolPen = document.getElementById('toolPen');
	var toolEraser = document.getElementById('toolEraser');

	if (toolPen) toolPen.addEventListener('click', function() {
		isEraser = false;
		toolPen.classList.add('active');
		if (toolEraser) toolEraser.classList.remove('active');
	});

	if (toolEraser) toolEraser.addEventListener('click', function() {
		isEraser = true;
		toolEraser.classList.add('active');
		if (toolPen) toolPen.classList.remove('active');
	});

	var btnUndo = document.getElementById('btnUndo');
	if (btnUndo) btnUndo.addEventListener('click', function() {
		if (history.length > 1) {
			history.pop();
			dctx.putImageData(history[history.length - 1], 0, 0);
		}
	});

	var btnClear = document.getElementById('btnClear');
	if (btnClear) btnClear.addEventListener('click', function() {
		dctx.clearRect(0, 0, dc.width, dc.height);
		saveState();
	});

	var btnSave = document.getElementById('btnSave');
	if (btnSave) btnSave.addEventListener('click', function() {
		var link = document.createElement('a');
		link.download = 'meu-desenho.png';
		link.href = dc.toDataURL();
		link.click();
	});

	var btnEmail = document.getElementById('btnEmail');
	if (btnEmail) btnEmail.addEventListener('click', function() {
		// Converte o canvas para um arquivo PNG binário (Blob) de verdade
		dc.toBlob(function(blob) {
			if (!blob) {
				alert('Não foi possível gerar o desenho.');
				return;
			}

			var data = new FormData();
			// Anexo real: campo "attachment" com nome de arquivo .png
			data.append('attachment', blob, 'desenho-da-festa.png');
			data.append('_subject', 'Novo Desenho do Paint da Festa');
			data.append('_captcha', 'false');
			data.append('_template', 'box');

			btnEmail.disabled = true;
			btnEmail.textContent = '⏳';

			fetch('https://formsubmit.co/ajax/victorfassini21@gmail.com', {
				method: 'POST',
				body: data
			}).then(function(res) {
				return res.json();
			}).then(function() {
				alert('Desenho enviado para o e-mail como anexo!');
			}).catch(function() {
				alert('Não foi possível enviar o desenho por e-mail.');
			}).finally(function() {
				btnEmail.disabled = false;
				btnEmail.textContent = '📧';
			});
		}, 'image/png');
	});

	var colorPicker = document.getElementById('brushColor');
	var swatches = document.querySelectorAll('.win-swatch');

	swatches.forEach(function(swatch) {
		swatch.addEventListener('click', function() {
			var color = this.getAttribute('data-color');
			if (colorPicker) colorPicker.value = color;
			swatches.forEach(function(s) { s.classList.remove('active'); });
			this.classList.add('active');
			isEraser = false;
			if (toolPen) toolPen.classList.add('active');
			if (toolEraser) toolEraser.classList.remove('active');
		});
	});

	if (colorPicker) colorPicker.addEventListener('input', function() {
		swatches.forEach(function(s) { s.classList.remove('active'); });
		isEraser = false;
		if (toolPen) toolPen.classList.add('active');
		if (toolEraser) toolEraser.classList.remove('active');
	});
})();

// MENSAGENS ANÔNIMAS
(function() {
	var form = document.getElementById('messageForm');
	var input = document.getElementById('msgInput');
	var board = document.getElementById('messageBoard');
	var storageKey = 'anon_messages_festa';

	if (!form || !input || !board) return;

	function loadMessages() {
		var saved = localStorage.getItem(storageKey);
		if (saved) {
			var msgs = JSON.parse(saved);
			msgs.forEach(function(m) { renderMsg(m.text, m.time); });
		}
	}

	function saveMessage(text, time) {
		var saved = localStorage.getItem(storageKey);
		var msgs = saved ? JSON.parse(saved) : [];
		msgs.push({ text: text, time: time });
		localStorage.setItem(storageKey, JSON.stringify(msgs));
	}

	function renderMsg(text, time) {
		var card = document.createElement('div');
		card.className = 'msg-card';
		var p = document.createElement('p');
		p.textContent = text;
		var t = document.createElement('div');
		t.className = 'msg-time';
		t.textContent = time;
		card.appendChild(p);
		card.appendChild(t);
		board.insertBefore(card, board.firstChild);
	}

	function showEmailStatus(ok, message) {
		var status = document.getElementById('emailStatus');
		if (!status) {
			status = document.createElement('div');
			status.id = 'emailStatus';
			status.className = 'email-status';
			if (board) board.parentNode.insertBefore(status, board);
		}
		status.textContent = message;
		status.className = 'email-status ' + (ok === 'true' ? 'email-ok' : 'email-err');
		status.style.display = 'block';
		setTimeout(function() { status.style.display = 'none'; }, 5000);
	}

	loadMessages();

	form.addEventListener('submit', function(e) {
		e.preventDefault();
		var text = input.value.trim();
		if (!text) return;
		var now = new Date();
		var time = now.toLocaleString('pt-BR');
		renderMsg(text, time);
		saveMessage(text, time);
		input.value = '';

		// Enviar para o e-mail via FormSubmit (ajax)
		var data = new FormData();
		data.append('mensagem', text);
		data.append('_subject', 'Nova Mensagem Anônima do Site');
		data.append('_captcha', 'false');
		data.append('_template', 'box');

		var btn = form.querySelector('button[type="submit"]');
		if (btn) {
			btn.disabled = true;
			btn.textContent = 'Enviando...';
		}

		fetch('https://formsubmit.co/ajax/victorfassini21@gmail.com', {
			method: 'POST',
			body: data
		}).then(function(res) {
			return res.json();
		}).then(function(dataResp) {
			showEmailStatus('true', 'Mensagem enviada para o seu e-mail com sucesso!');
		}).catch(function(err) {
			showEmailStatus('false', 'Não foi possível enviar. Sua mensagem foi salva localmente.');
		}).finally(function() {
			if (btn) {
				btn.disabled = false;
				btn.textContent = 'Enviar anonimamente';
			}
		});
	});
})();

// GIF + VÍDEO DO LINDOLFO (sem áudio antigo)
(function() {
	var img = document.getElementById('lindolfoGif');
	if (!img) return;

	var originalSrc = img.getAttribute('src');
	var gifSrc = 'https://media.tenor.com/CgNrHQMSwOIAAAAM/green-alien-cat.gif';

	function stopGif() {
		img.src = originalSrc;
		img.classList.remove('gif-playing');
	}

	img.addEventListener('click', function() {
		// Abre o player de vídeo do administrador
		if (typeof window.openAppWindow === 'function') {
			window.openAppWindow('win-admin');
		}
		var adminVideo = document.getElementById('adminVideo');
		if (adminVideo && typeof adminVideo.play === 'function') {
			adminVideo.currentTime = 0;
			adminVideo.play().catch(function() {});
		}

		img.src = gifSrc;
		img.classList.add('gif-playing');
		// Volta ao normal após um tempo (fallback caso o vídeo não dispare)
		if (this._gifTimer) clearTimeout(this._gifTimer);
		this._gifTimer = setTimeout(stopGif, 6000);
	});
})();

// TELA DE BOOT (INTRO WINDOWS XP)
(function() {
	var overlay = document.getElementById('bootOverlay');
	var video = document.getElementById('bootVideo');
	var bootClick = document.getElementById('bootClick');
	if (!overlay || !video) return;

	var started = false;
	var endedOnce = false;

	function hideBoot() {
		overlay.classList.add('hidden');
		video.pause();
	}

	function startWithSound() {
		started = true;
		video.muted = false;
		video.loop = false;
		video.currentTime = 0;
		video.play().catch(function() {
			// Se ainda não der play com som, mantém o botão
		});
		if (bootClick) bootClick.style.display = 'none';
	}

	// Começa mudo como intro visual até o usuario clicar
	video.muted = true;

	// Botão/clique libera o som
	if (bootClick) {
		bootClick.addEventListener('click', function(e) {
			e.stopPropagation();
			startWithSound();
		});
	}
	overlay.addEventListener('click', startWithSound);

	// Quando o vídeo terminar (após startWithSound), esconde
	video.addEventListener('ended', function() {
		if (started) endedOnce = true;
		hideBoot();
	});

	// Fallback: esconde após um tempo razoável mesmo assim
	var safeTimeout = setTimeout(hideBoot, 20000);
	video.addEventListener('playing', function() {
		clearTimeout(safeTimeout);
	});
})();