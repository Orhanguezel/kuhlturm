function showImages(sector) {
  // Kapsayıcıyı bul
  const container = document.getElementById("imageContainer");
  // Önceki içeriği temizle
  container.innerHTML = '';

  // İlgili sektör için resimleri alın
  const images = sectorImages[sector];

  if (images && images.length > 0) {
      // Yeni bir div oluştur
      const gallery = document.createElement("div");
      gallery.className = "gallery";

      // Resimleri galeride hücreler olarak eklemek için döngü
      images.forEach((image) => {
          // Yeni hücre oluştur
          const cell = document.createElement("div");
          cell.className = "gallery-cell";
          // Hücreye ortalanmış bir img öğesi ekle
          cell.innerHTML = `<img class="img-fluid" src="${image.url}" alt="${image.alt}">`;
          gallery.appendChild(cell); // Hücreyi galeriye ekle
      });

      // Galeriyi kapsayıcıya ekle
      container.appendChild(gallery);
  } else {
      // Resim yoksa bir mesaj göster
      container.innerHTML = '<p>Sektör için resim bulunamadı.</p>';
  }
}
