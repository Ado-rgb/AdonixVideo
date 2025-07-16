
document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const themeToggle = document.getElementById('themeToggle');
    
    let currentType = 'video';

    searchBtn.addEventListener('click', search);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') search();
    });

    function search() {
        const query = searchInput.value.trim();
        if (!query) {
            alert('Ingresa una URL de YouTube o el name del video');
            return;
        }

        loadingDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';

        const apiUrl = `https://hanstz-hansapi.hf.space/yt?query=${encodeURIComponent(query)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success && data.result) {
                    displayResult(data.result);
                } else {
                    throw new Error('Invalid response format');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                loadingDiv.style.display = 'none';
                resultsDiv.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #e74c3c;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <p>Failed to fetch results. Please try again later.</p>
                        <p style="font-size: 0.8rem;">${error.message}</p>
                    </div>
                `;
                resultsDiv.style.display = 'block';
            });
    }

    function displayResult(video) {
        loadingDiv.style.display = 'none';
        const thumbnailUrl = video.thumbnail || video.image || '';
        const duration = video.timestamp || video.duration?.timestamp || 'N/A';
        const views = video.views ? video.views.toLocaleString() + ' views' : '';
        const uploadDate = video.ago || '';
        const url = video.url || '';

        const html = `
            <div class="result-item">
                <div class="thumbnail-container">
                    ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="Thumbnail" class="thumbnail">` : ''}
                    <span class="content-type">RESULT</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title || 'Untitled Video'}</h3>
                    <div class="video-meta">
                        <span><i class="fas fa-clock"></i> ${duration}</span>
                        ${views ? `<span><i class="fas fa-eye"></i> ${views}</span>` : ''}
                        ${uploadDate ? `<span><i class="fas fa-calendar-alt"></i> ${uploadDate}</span>` : ''}
                        ${video.author?.name ? `<span><i class="fas fa-user"></i> ${video.author.name}</span>` : ''}
                    </div>
                    <button class="download-btn" data-url="https://api.sylphy.xyz/download/ytmp4?url=${url}&apikey=Sylphiette's">
                        <i class="fas fa-video"></i> Download Video
                    </button>
                    <button class="download-btn" data-url="https://api.sylphy.xyz/download/ytmp3?url=${url}&apikey=Sylphiette's">
                        <i class="fas fa-music"></i> Download MP3
                    </button>
                </div>
            </div>
        `;

        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';

        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const downloadUrl = this.dataset.url;
                if (downloadUrl) {
                    window.open(downloadUrl, '_blank');
                } else {
                    alert('Download URL not available');
                }
            });
        });
    }

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            document.documentElement.style.setProperty('--light', '#2c3e50');
            document.documentElement.style.setProperty('--dark', '#ecf0f1');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            document.documentElement.style.setProperty('--light', '#ecf0f1');
            document.documentElement.style.setProperty('--dark', '#2c3e50');
        }
    });
});
