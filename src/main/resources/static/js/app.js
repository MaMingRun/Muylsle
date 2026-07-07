document.addEventListener('DOMContentLoaded', function() {
    initDynamicClock();
    initBeijingTime();
    initTodoList();
    initMusicPlayer();
    initThemeSwitch();
    initUserMenu();
});

function initUserMenu() {
    const userMenu = document.getElementById('user-menu');
    const userText = document.getElementById('user-text');
    const userAvatar = document.getElementById('user-avatar');

    // 加载用户信息
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        if (user.nickname) {
            userText.textContent = user.nickname;
        }
        if (user.avatar) {
            userAvatar.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
        }
    }

    userMenu.addEventListener('click', () => {
        if (user) {
            window.location.href = '/profile';
        } else {
            window.location.href = '/login';
        }
    });
}

function initDynamicClock() {
    const countdownDisplay = document.getElementById('countdown-display');
    const studyTotalEl = document.getElementById('study-total');
    const startBtn = document.getElementById('countdown-start');
    const resetBtn = document.getElementById('countdown-reset');
    const hoursInput = document.getElementById('set-hours');
    const minutesInput = document.getElementById('set-minutes');
    const secondsInput = document.getElementById('set-seconds');

    let totalSeconds = 25 * 60;
    let remainingSeconds = totalSeconds;
    let countdownInterval = null;
    let isRunning = false;
    let studyStartTime = null;
    let studyElapsed = 0;
    let studyInterval = null;

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return h + ':' + m + ':' + s;
    }

    function updateDisplay() {
        countdownDisplay.textContent = formatTime(remainingSeconds);
    }

    function updateStudyTotal() {
        if (studyStartTime) {
            const now = Math.floor(Date.now() / 1000);
            studyTotalEl.textContent = formatTime(studyElapsed + (now - studyStartTime));
        } else {
            studyTotalEl.textContent = formatTime(studyElapsed);
        }
    }

    function getInputSeconds() {
        const h = parseInt(hoursInput.value) || 0;
        const m = parseInt(minutesInput.value) || 0;
        const s = parseInt(secondsInput.value) || 0;
        return h * 3600 + m * 60 + s;
    }

    function startCountdown() {
        if (isRunning) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            isRunning = false;
            startBtn.textContent = 'Start';
            startBtn.classList.remove('paused');
            
            if (studyStartTime) {
                const now = Math.floor(Date.now() / 1000);
                studyElapsed += now - studyStartTime;
                studyStartTime = null;
                clearInterval(studyInterval);
            }
            return;
        }

        const inputSec = getInputSeconds();
        if (inputSec <= 0) {
            alert('请设置有效的倒计时时间');
            return;
        }

        if (remainingSeconds === 0) {
            totalSeconds = inputSec;
            remainingSeconds = totalSeconds;
        }

        isRunning = true;
        startBtn.textContent = 'Pause';
        startBtn.classList.add('paused');

        hoursInput.disabled = true;
        minutesInput.disabled = true;
        secondsInput.disabled = true;

        if (!studyStartTime) {
            studyStartTime = Math.floor(Date.now() / 1000);
            studyInterval = setInterval(updateStudyTotal, 1000);
        }

        updateDisplay();

        countdownInterval = setInterval(function() {
            remainingSeconds--;
            updateDisplay();
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                isRunning = false;
                startBtn.textContent = 'Start';
                startBtn.classList.remove('paused');
                hoursInput.disabled = false;
                minutesInput.disabled = false;
                secondsInput.disabled = false;
                remainingSeconds = 0;
                updateDisplay();
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('倒计时结束', { body: '休息一下吧！' });
                }
            }
        }, 1000);
    }

    function resetCountdown() {
        clearInterval(countdownInterval);
        countdownInterval = null;
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('paused');
        hoursInput.disabled = false;
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        
        const inputSec = getInputSeconds();
        totalSeconds = inputSec > 0 ? inputSec : 25 * 60;
        remainingSeconds = totalSeconds;
        updateDisplay();
    }

    if (startBtn) startBtn.addEventListener('click', startCountdown);
    if (resetBtn) resetBtn.addEventListener('click', resetCountdown);

    updateDisplay();
    updateStudyTotal();

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function initBeijingTime() {
    const beijingTime = document.getElementById('beijing-time');
    const beijingDate = document.getElementById('beijing-date');

    function updateTime() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Shanghai',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const dateOptions = {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        if (beijingTime) beijingTime.textContent = now.toLocaleTimeString('zh-CN', options);
        if (beijingDate) beijingDate.textContent = now.toLocaleDateString('zh-CN', dateOptions);
    }

    setInterval(updateTime, 1000);
    updateTime();
}

function initTodoList() {
    const todoList = document.getElementById('todo-list');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const addTodoForm = document.getElementById('add-todo-form');
    const submitTodoBtn = document.getElementById('submit-todo-btn');
    const todoContent = document.getElementById('todo-content');
    const todoDeadline = document.getElementById('todo-deadline');

    function createTodoItem(id, content, deadline) {
        const item = document.createElement('div');
        item.className = 'todo-item';
        item.dataset.id = id;
        item.innerHTML = `
            <div class="todo-header">
                <span class="todo-content">${content}</span>
                <button class="todo-delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <span class="todo-deadline">${deadline}</span>
        `;
        item.querySelector('.todo-delete').addEventListener('click', () => {
            deleteTodo(id, item);
        });
        return item;
    }

    function deleteTodo(id, element) {
        fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                element.remove();
            } else {
                alert(data.message || '删除失败');
            }
        })
        .catch(error => {
            console.error('删除失败:', error);
            element.remove();
        });
    }

    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', () => {
            addTodoForm.classList.toggle('hidden');
        });
    }

    if (submitTodoBtn) {
        submitTodoBtn.addEventListener('click', () => {
            const content = todoContent.value.trim();
            const deadline = todoDeadline.value;
            
            if (content) {
                fetch('/api/todos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: content,
                        deadline: deadline || null
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const deadlineFormatted = deadline ? new Date(deadline).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : '';
                        todoList.appendChild(createTodoItem(data.todo.id, content, deadlineFormatted));
                        todoContent.value = '';
                        todoDeadline.value = '';
                        addTodoForm.classList.add('hidden');
                    } else {
                        alert(data.message || '添加失败');
                    }
                })
                .catch(error => {
                    console.error('添加失败:', error);
                    alert('添加失败，请稍后重试');
                });
            } else {
                alert('请填写任务内容');
            }
        });
    }

    if (todoList) {
        todoList.querySelectorAll('.todo-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.todo-item');
                const id = item.dataset.id;
                deleteTodo(id, item);
            });
        });
    }
}

function initMusicPlayer() {
    const searchInput = document.getElementById('music-search-input');
    const searchBtn = document.getElementById('music-search-btn');
    const songList = document.getElementById('song-list');
    const musicTitle = document.getElementById('music-title');
    const musicArtist = document.getElementById('music-artist');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    const audioPlayer = document.getElementById('audio-player');
    const progressSlider = document.getElementById('progress-slider');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const musicCover = document.getElementById('music-cover');

    let songs = [];
    let currentIndex = -1;
    let isPlaying = false;
    let isDraggingProgress = false;

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // 播放URL：网易云外链
    function getPlayUrl(songId) {
        return `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
    }

    function searchSongs() {
        const keyword = searchInput.value.trim();
        if (!keyword) {
            alert('请输入搜索关键词');
            return;
        }
        songList.innerHTML = '<div class="song-item-loading">搜索中...</div>';

        fetch(`/api/music/search?keyword=${encodeURIComponent(keyword)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.songs && data.songs.length > 0) {
                    songs = data.songs;
                    renderSongList();
                } else {
                    songList.innerHTML = '<div class="song-item-empty">未找到相关歌曲</div>';
                    songs = [];
                }
            })
            .catch(error => {
                console.error('搜索失败:', error);
                songList.innerHTML = '<div class="song-item-empty">搜索失败，请重试</div>';
            });
    }

    function renderSongList() {
        songList.innerHTML = '';
        songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'song-item';
            if (index === currentIndex) {
                item.classList.add('active');
            }
            item.innerHTML = `
                <div class="song-info">
                    <div class="song-name">${song.title}</div>
                    <div class="song-meta">${song.artist} · ${song.duration}</div>
                </div>
                <span class="song-index">${index + 1}</span>
            `;
            item.addEventListener('click', () => playSong(index));
            songList.appendChild(item);
        });
    }

    function playSong(index) {
        if (index < 0 || index >= songs.length) return;
        currentIndex = index;
        const song = songs[index];
        audioPlayer.src = getPlayUrl(song.id);
        audioPlayer.play().catch(err => {
            console.error('播放失败:', err);
            musicTitle.textContent = '播放失败';
            musicArtist.textContent = '该歌曲可能需要VIP或无版权';
        });
        musicTitle.textContent = song.title;
        musicArtist.textContent = song.artist;
        // 更新封面
        if (song.coverUrl) {
            musicCover.innerHTML = `<img src="${song.coverUrl}" alt="${song.title}" onerror="this.style.display='none';this.parentElement.classList.add('cover-fallback')">`;
        } else {
            musicCover.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 0-10 10M22 12a10 10 0 0 0-10-10"/></svg>`;
        }
        isPlaying = true;
        updatePlayIcon();
        renderSongList();
    }

    function togglePlay() {
        if (currentIndex < 0) {
            if (songs.length > 0) {
                playSong(0);
            } else {
                alert('请先搜索歌曲');
            }
            return;
        }
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
        } else {
            audioPlayer.play();
            isPlaying = true;
        }
        updatePlayIcon();
    }

    function updatePlayIcon() {
        const iconPlay = playBtn.querySelector('.icon-play');
        const iconPause = playBtn.querySelector('.icon-pause');
        if (isPlaying) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    }

    function playPrev() {
        if (songs.length === 0) return;
        const newIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
        playSong(newIndex);
    }

    function playNext() {
        if (songs.length === 0) return;
        const newIndex = currentIndex >= songs.length - 1 ? 0 : currentIndex + 1;
        playSong(newIndex);
    }

    if (searchBtn) searchBtn.addEventListener('click', searchSongs);
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchSongs();
        });
    }
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', playPrev);
    if (nextBtn) nextBtn.addEventListener('click', playNext);

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            audioPlayer.volume = volume / 100;
            if (volumeValue) volumeValue.textContent = `${volume}%`;
        });
        audioPlayer.volume = 0.5;
    }

    if (progressSlider) {
        progressSlider.addEventListener('input', (e) => {
            isDraggingProgress = true;
            if (audioPlayer.duration) {
                const percent = e.target.value;
                currentTimeEl.textContent = formatTime(audioPlayer.duration * percent / 100);
            }
        });
        progressSlider.addEventListener('change', (e) => {
            if (audioPlayer.duration) {
                const percent = e.target.value;
                audioPlayer.currentTime = audioPlayer.duration * percent / 100;
            }
            isDraggingProgress = false;
        });
    }

    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            if (!isDraggingProgress && audioPlayer.duration) {
                const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressSlider.value = percent;
                currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            }
        });
        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });
        audioPlayer.addEventListener('ended', playNext);
        audioPlayer.addEventListener('error', () => {
            musicTitle.textContent = '播放失败';
            musicArtist.textContent = '该歌曲可能无法播放';
            isPlaying = false;
            updatePlayIcon();
        });
    }
}

function initThemeSwitch() {
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');
    const themeUpload = document.getElementById('theme-upload');
    const bgUpload = document.getElementById('bg-upload');

    function calculateBrightness(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(image, 0, 0, 100, 100);
        
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const data = imageData.data;
        let brightness = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            brightness += (0.299 * r + 0.587 * g + 0.114 * b);
        }
        
        return brightness / (data.length / 4);
    }

    function setTheme(theme) {
        document.body.classList.remove('light', 'dark', 'custom-bg', 'custom-dark-text', 'custom-light-text');
        document.body.style.backgroundImage = '';
        
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else if (theme === 'custom') {
            document.body.classList.add('custom-bg');
        } else {
            document.body.classList.add('light');
        }
        
        localStorage.setItem('theme', theme);
    }

    function applyCustomBackground(imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const brightness = calculateBrightness(img);
            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.classList.remove('light', 'dark');
            document.body.classList.add('custom-bg');
            
            if (brightness > 128) {
                document.body.classList.add('custom-dark-text');
            } else {
                document.body.classList.add('custom-light-text');
            }
            
            localStorage.setItem('theme', 'custom');
            localStorage.setItem('customBg', imageUrl);
        };
        img.onerror = () => {
            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.classList.remove('light', 'dark');
            document.body.classList.add('custom-bg', 'custom-dark-text');
            localStorage.setItem('theme', 'custom');
            localStorage.setItem('customBg', imageUrl);
        };
        img.src = imageUrl;
    }

    if (themeLight) {
        themeLight.addEventListener('click', () => setTheme('light'));
    }

    if (themeDark) {
        themeDark.addEventListener('click', () => setTheme('dark'));
    }

    if (themeUpload && bgUpload) {
        themeUpload.addEventListener('click', () => {
            bgUpload.click();
        });

        bgUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    applyCustomBackground(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const savedTheme = localStorage.getItem('theme');
    const savedBg = localStorage.getItem('customBg');
    
    if (savedTheme === 'custom' && savedBg) {
        applyCustomBackground(savedBg);
    } else if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.add('light');
    }
}
