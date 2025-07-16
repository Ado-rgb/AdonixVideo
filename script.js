document.addEventListener('DOMContentLoaded', function () {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  const themeToggle = document.getElementById('themeToggle');

  const API_KEY = "Sylphiette's";

  searchBtn.addEventListener('click', search);
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') search();
  });

  function search() {
    const query = searchInput.value.trim();
    if (!query) {
      alert('Ingresa una URL o nombre de video');
      return;
    }

    loadingDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    resultsDiv.innerHTML = '';

    const apiUrl = `https://hanstz-hansapi.hf.space/yt?query=${encodeURIComponent(query)}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (data.status && data.res) {
          displayResult(data.res);
        } else {
          throw new Error('Error en la respuesta de la API');
        }
      })
      .catch(error => {
        loadingDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
          <div style="text-align: center; padding: 20px; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>No se pudo obtener el resultado. Intenta más tarde.</p>
            <p style="font-size: 0.8rem;">${error.message}</p>
          </div>
        `;
      });
  }

  function displayResult(video) {
    loadingDiv.style.display = 'none';

    const ytUrl = video.url; // URL original YouTube o link válido para Sylphiette

    const html = `
      <div class="result-item">
        <div class="thumbnail-container">
          ${video.thumbnail ? `<img src="${video.thumbnail}" class="thumbnail" alt="Miniatura">` : ''}
          <span class="content-type">RESULTADO</span>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.title}</h3>
          <button class="download-btn" id="btnMp4">
            <i class="fas fa-video"></i> Descargar Video
          </button>
          <button class="download-btn" id="btnMp3">
            <i class="fas fa-music"></i> Descargar MP3
          </button>
        </div>
      </div>
    `;

    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';

    const safeTitle = video.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');

    document.getElementById('btnMp4').addEventListener('click', () => {
      const sylphUrl = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(ytUrl)}&apikey=${encodeURIComponent(API_KEY)}`;
      downloadFile(sylphUrl, safeTitle + '.mp4');
    });

    document.getElementById('btnMp3').addEventListener('click', () => {
      const sylphUrl = `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(ytUrl)}&apikey=${encodeURIComponent(API_KEY)}`;
      downloadFile(sylphUrl, safeTitle + '.mp3');
    });
  }

  function downloadFile(url, filename) {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo obtener el archivo');
        return res.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
      })
      .catch(() => alert('Error al descargar el archivo'));
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  });
});