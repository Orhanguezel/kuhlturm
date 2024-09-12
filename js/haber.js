// Mevcut gösterilen haberlerin indeksini tutar
let appCurrentIndex = 0;

// Haberleri ekrana yansıtan fonksiyon
function displayNews() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';

    // Haberleri tarihe göre sırala (en yeni en başta olacak şekilde)
    const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));

    const endIndex = Math.min(appCurrentIndex + 3, sortedNews.length);

    for (let i = appCurrentIndex; i < endIndex; i++) {
        const n = sortedNews[i];
        const newsItem = createNewsItem(n);
        newsList.appendChild(newsItem);
    }
}

// Haber öğesi oluşturma fonksiyonu
function createNewsItem(n) {
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
    newsItem.setAttribute('id', `news-${n.id}`); // ID ekleniyor
    newsItem.innerHTML = `
        <h2 class="news-title">${n.title}</h2>
        <p class="blog-post-meta">Tarih: ${n.date}</p>
        <p class="lead my-3">${n.summary}</p>
        <img src="${n.image}" alt="${n.title}" style="display:block;">
        <a href="#${n.id}" onclick="toggleContent(${n.id}, this)">Weiterlesen</a>
        <div id="full-content-${n.id}" class="full-content" style="display:none;">
            <p class="lead my-3">${n.content}</p>
        </div>
    `;
    return newsItem;
}

// Haber detaylarını açıp kapatan fonksiyon
function toggleContent(id, linkElement) {
    const fullContent = document.getElementById(`full-content-${id}`);
    const image = document.querySelector(`#news-list img[alt='${news.find(n => n.id === id).title}']`);
    if (fullContent.style.display === 'none') {
        fullContent.style.display = 'block';
        image.style.display = 'block';
        linkElement.style.display = 'none';
    } else {
        fullContent.style.display = 'none';
        linkElement.style.display = 'inline';
    }
}

// Yan sütunu güncelle
function updateSidebar() {
    const latestNewsList = document.getElementById('latest-news-list');
    const archiveList = document.getElementById('archive-list');
    latestNewsList.innerHTML = '';
    archiveList.innerHTML = '';

    // Haberleri tarihe göre sırala (en yeni en başta olacak şekilde)
    const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Son haberler için link ve resim
    sortedNews.slice(0, 3).forEach(n => {
        const item = document.createElement('li');
        item.innerHTML = `
            <a href="#${n.id}" onclick="displayFullNewsInMain(${n.id})">
                <img src="${n.image}" alt="Thumbnail" style="width: 150px; height: 100px;">
                <span>${n.title}</span>
            </a>
        `;
        latestNewsList.appendChild(item);
    });

    // Arşiv için sadece link
    sortedNews.slice(3).forEach(n => {
        const item = document.createElement('li');
        item.innerHTML = `<a href="#${n.id}" onclick="displayFullNewsInMain(${n.id})">${n.title}</a>`;
        archiveList.appendChild(item);
    });
}

function displayFullNewsInMain(id) {
    const selectedNews = news.find(n => n.id === id);
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    const newsItem = createNewsItem(selectedNews);
    newsList.appendChild(newsItem);

    // Haberin tam içeriğini göster
    const fullContent = document.getElementById(`full-content-${id}`);
    fullContent.style.display = 'block';
    const image = document.querySelector(`#news-list img[alt='${selectedNews.title}']`);
    image.style.display = 'block';
    const link = document.querySelector(`#news-list a[href='#${id}']`);
    link.style.display = 'none';  // Devamını Oku bağlantısını gizle

    // Sayfayı ilgili habere kaydır
    const newsItemElement = document.getElementById(`news-${id}`);
    if (newsItemElement) {
        newsItemElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    displayNews();
    updateSidebar();
});
