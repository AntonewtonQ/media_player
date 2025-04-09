class MediaPlayer {
    constructor() {
      this.audio = document.getElementById('audio');
      this.videoPlayer = document.getElementById('videoPlayer');
      this.mediaTitle = document.getElementById('mediaTitle');
      this.coverImage = document.getElementById('coverImage');
      this.progressBar = document.getElementById('progressBar');
      this.currentTime = document.getElementById('currentTime');
      this.duration = document.getElementById('duration');
      this.playBtn = document.getElementById('playBtn');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.volumeBtn = document.getElementById('volumeBtn');
      this.volumeControl = document.getElementById('volumeControl');
      
      this.mediaList = [
        { 
          type: 'audio', 
          title: "Minha Música", 
          file: "musica1.mp3", 
          cover: "musica1.jpg",
          duration: "3:45"
        },
        { 
          type: 'audio', 
          title: "Outra Música", 
          file: "musica2.mp3", 
          cover: "musica2.jpg",
          duration: "4:12"
        },
        { 
          type: 'video', 
          title: "Meu Vídeo", 
          file: "video1.mp4", 
          cover: "video1.jpg",
          duration: "5:30"
        }
      ];
      
      this.radioStations = [
        {
          freq: '99.1',
          title: "Radio Mais",
          src: 'https://radios.justweb.pt/8050/stream/?1685627470876',
          cover: "radio.jpg"
        },  
        {
          freq: '81.4',
          title: "Radio Escola",
          src: 'https://radios.vpn.sapo.pt/AO/radio1.mp3',
          cover: "radio.jpg"
        },
        {
          freq: '89.9',
          title: "Radio Lac",
          src: 'https://radios.vpn.sapo.pt/AO/radio14.mp3?1685629053605',
          cover: "radio.jpg"
        }
      ];
      
      this.currentMediaIndex = 0;
      this.currentRadioIndex = 0;
      this.isPlaying = false;
      this.currentMediaType = null; // 'audio', 'video', 'radio'
      
      this.init();
    }
    
    init() {
      // Preenche as listas
      this.populateMediaLists();
      
      // Event listeners
      this.playBtn.addEventListener('click', () => this.togglePlay());
      this.prevBtn.addEventListener('click', () => this.prev());
      this.nextBtn.addEventListener('click', () => this.next());
      
      this.progressBar.addEventListener('input', () => this.seek());
      this.volumeControl.addEventListener('input', () => this.setVolume());
      
      this.audio.addEventListener('timeupdate', () => this.updateProgress());
      this.audio.addEventListener('ended', () => this.next());
      
      this.videoPlayer.addEventListener('timeupdate', () => this.updateProgress());
      this.videoPlayer.addEventListener('ended', () => this.pause());
      
      // Volume inicial
      this.audio.volume = 0.7;
      this.videoPlayer.volume = 0.7;
      
      // Carrega a primeira mídia
      this.loadMedia(0, 'audio');
    }
    
    populateMediaLists() {
      const musicList = document.getElementById('musicList');
      const videoList = document.getElementById('videoList');
      const radioList = document.getElementById('radioList');
      
      // Músicas
      this.mediaList.filter(item => item.type === 'audio').forEach((item, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.innerHTML = `
          <img src="./media/${item.cover}" alt="Capa" class="media-thumbnail">
          <span>${item.title} <small>(${item.duration})</small></span>
        `;
        li.addEventListener('click', () => this.loadMedia(index, 'audio'));
        musicList.appendChild(li);
      });
      
      // Vídeos
      this.mediaList.filter(item => item.type === 'video').forEach((item, index) => {
        // Ajusta o índice para a lista completa
        const fullIndex = this.mediaList.findIndex(m => m.title === item.title);
        const li = document.createElement('li');
        li.dataset.index = fullIndex;
        li.innerHTML = `
          <img src="./media/${item.cover}" alt="Capa" class="media-thumbnail">
          <span>${item.title} <small>(${item.duration})</small></span>
        `;
        li.addEventListener('click', () => this.loadMedia(fullIndex, 'video'));
        videoList.appendChild(li);
      });
      
      // Rádios
      this.radioStations.forEach((station, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.innerHTML = `
          <img src="./media/${station.cover}" alt="Rádio" class="radio-thumbnail">
          <span class="radio-frequency">${station.freq}</span>
          <span>${station.title}</span>
        `;
        li.addEventListener('click', () => this.loadRadio(index));
        radioList.appendChild(li);
      });
    }
    
    loadMedia(index, type) {
      if (index < 0 || index >= this.mediaList.length) return;
      
      const media = this.mediaList[index];
      if (media.type !== type) return;
      
      this.currentMediaIndex = index;
      this.currentMediaType = type;
      
      // Para qualquer reprodução atual
      this.audio.pause();
      this.videoPlayer.pause();
      
      // Atualiza a UI
      this.mediaTitle.textContent = `${media.title} (${media.duration})`;
      
      // Configura o player apropriado
      if (type === 'audio') {
        this.audio.src = `./media/${media.file}`;
        this.coverImage.src = `./media/${media.cover}`;
        this.coverImage.style.display = 'block';
        this.videoPlayer.style.display = 'none';
      } else {
        this.videoPlayer.src = `./media/${media.file}`;
        this.videoPlayer.style.display = 'block';
        this.coverImage.style.display = 'none';
      }
      
      // Atualiza o estado do botão play
      this.isPlaying = false;
      this.playBtn.textContent = '▶';
      
      // Atualiza a classe ativa nas listas
      this.updateActiveItems();
    }
    
    loadRadio(index) {
      if (index < 0 || index >= this.radioStations.length) return;
      
      this.currentRadioIndex = index;
      this.currentMediaType = 'radio';
      const station = this.radioStations[index];
      
      // Para qualquer reprodução atual
      this.audio.pause();
      this.videoPlayer.pause();
      
      // Configura o player de áudio
      this.audio.src = station.src;
      this.coverImage.src = `./media/${station.cover}`;
      this.coverImage.style.display = 'block';
      this.videoPlayer.style.display = 'none';
      
      // Atualiza a UI
      this.mediaTitle.textContent = `📻 ${station.freq} - ${station.title}`;
      this.playBtn.textContent = '▶';
      
      // Atualiza a classe ativa nas listas
      this.updateActiveItems();
    }
    
    play() {
      if (this.currentMediaType === 'radio') {
        this.audio.play()
          .then(() => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
          })
          .catch(error => {
            console.error("Erro ao reproduzir rádio:", error);
          });
      } else if (this.currentMediaType === 'audio') {
        this.audio.play()
          .then(() => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
          })
          .catch(error => {
            console.error("Erro ao reproduzir áudio:", error);
          });
      } else if (this.currentMediaType === 'video') {
        this.videoPlayer.play()
          .then(() => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
          })
          .catch(error => {
            console.error("Erro ao reproduzir vídeo:", error);
          });
      }
    }
    
    pause() {
      if (this.currentMediaType === 'radio' || this.currentMediaType === 'audio') {
        this.audio.pause();
      } else {
        this.videoPlayer.pause();
      }
      this.isPlaying = false;
      this.playBtn.textContent = '▶';
    }
    
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
    
    next() {
      if (this.currentMediaType === 'radio') {
        this.currentRadioIndex = (this.currentRadioIndex + 1) % this.radioStations.length;
        this.loadRadio(this.currentRadioIndex);
        this.play();
      } else {
        this.currentMediaIndex = (this.currentMediaIndex + 1) % this.mediaList.length;
        const nextMedia = this.mediaList[this.currentMediaIndex];
        this.loadMedia(this.currentMediaIndex, nextMedia.type);
        this.play();
      }
    }
    
    prev() {
      if (this.currentMediaType === 'radio') {
        this.currentRadioIndex = (this.currentRadioIndex - 1 + this.radioStations.length) % this.radioStations.length;
        this.loadRadio(this.currentRadioIndex);
        this.play();
      } else {
        this.currentMediaIndex = (this.currentMediaIndex - 1 + this.mediaList.length) % this.mediaList.length;
        const prevMedia = this.mediaList[this.currentMediaIndex];
        this.loadMedia(this.currentMediaIndex, prevMedia.type);
        this.play();
      }
    }
    
    seek() {
      if (this.currentMediaType === 'radio') return;
      
      const seekTime = (this.progressBar.value / 100) * 
        (this.currentMediaType === 'audio' ? this.audio.duration : this.videoPlayer.duration);
      
      if (this.currentMediaType === 'audio') {
        this.audio.currentTime = seekTime;
      } else {
        this.videoPlayer.currentTime = seekTime;
      }
    }
    
    updateProgress() {
      if (this.currentMediaType === 'radio') {
        this.progressBar.value = 0;
        this.currentTime.textContent = '0:00';
        this.duration.textContent = '∞';
        return;
      }
      
      let current, duration;
      
      if (this.currentMediaType === 'audio') {
        current = this.audio.currentTime;
        duration = this.audio.duration;
      } else {
        current = this.videoPlayer.currentTime;
        duration = this.videoPlayer.duration;
      }
      
      if (!isNaN(duration)) {
        this.progressBar.value = (current / duration) * 100 || 0;
        this.currentTime.textContent = this.formatTime(current);
        this.duration.textContent = this.formatTime(duration);
      }
    }
    
    setVolume() {
      const volume = this.volumeControl.value;
      this.audio.volume = volume;
      this.videoPlayer.volume = volume;
      
      // Atualiza o ícone do volume
      if (volume == 0) {
        this.volumeBtn.textContent = '🔇';
      } else if (volume < 0.5) {
        this.volumeBtn.textContent = '🔈';
      } else {
        this.volumeBtn.textContent = '🔊';
      }
    }
    
    formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    updateActiveItems() {
      // Remove a classe 'active' de todos os itens
      document.querySelectorAll('.media-list li, .radio-list li').forEach(item => {
        item.classList.remove('active');
      });
      
      // Adiciona a classe 'active' ao item atual
      if (this.currentMediaType === 'radio') {
        const radioItems = document.querySelectorAll('.radio-list li');
        if (radioItems[this.currentRadioIndex]) {
          radioItems[this.currentRadioIndex].classList.add('active');
        }
      } else {
        const mediaItems = document.querySelectorAll('.media-list li');
        if (mediaItems[this.currentMediaIndex]) {
          mediaItems[this.currentMediaIndex].classList.add('active');
        }
      }
    }
  }
  
  // Inicia o player quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', () => {
    const player = new MediaPlayer();
  });