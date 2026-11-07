# Portfolio CMS & GitHub Entegrasyon Rehberi

Kamuya açık web sitesi Vercel üzerinde **Express + EJS** mimarisiyle çalışır. İçerik yönetim paneli ise `studio/` dizininde yer alan bağımsız bir **Sanity Studio** uygulamasıdır.

## 1. Sanity ve GitHub Ortam Değişkenleri (Vercel)

Web sitesinin bağlı olduğu Vercel projesine (`Settings -> Environment Variables`) şu değişkenleri ekleyin:

- `SANITY_PROJECT_ID=0j1jarsg` (Zorunlu)
- `SANITY_DATASET=production` (Zorunlu)
- `SANITY_API_VERSION=2025-01-01` (Opsiyonel, varsayılan: `2025-01-01`)
- `SANITY_API_READ_TOKEN` (Opsiyonel — yalnızca Sanity dataset gizli/private yapılırsa salt-okunur token gerekir)
- `GITHUB_USERNAME=yunusemretom` (Opsiyonel, varsayılan: `yunusemretom`)
- `GITHUB_TOKEN` (Opsiyonel — herkese açık depolar için zorunlu değildir; yalnızca GitHub API saatlik istek limitini 60'tan 5000'e çıkarmak isterseniz yalnızca backend ortam değişkeni olarak ekleyin)
- `GITHUB_CACHE_TTL_SECONDS=900` (Opsiyonel — GitHub API önbellek süresi, varsayılan 900 sn / 15 dk)

> **Güvenlik Notu:** Hiçbir yazma tokenı (`write token`) veya `GITHUB_TOKEN` değeri frontend tarafına gönderilmez; tamamı yalnızca sunucu tarafında okunur.

## 2. Yönetim Panelini (Sanity Studio) Çalıştırma ve Yayınlama

Yerel ortamda çalıştırmak için:

```bash
cd studio
npm install
SANITY_STUDIO_PROJECT_ID=0j1jarsg SANITY_STUDIO_DATASET=production npm run dev
```

Sanity Studio'yu derlemek ve yayınlamak için:

```bash
cd studio
npm install
SANITY_STUDIO_PROJECT_ID=0j1jarsg SANITY_STUDIO_DATASET=production npm run build
SANITY_STUDIO_PROJECT_ID=0j1jarsg SANITY_STUDIO_DATASET=production npm run deploy
```

## 3. Profil Fotoğrafı Nasıl Değiştirilir?

1. Sanity Studio sol menüsünden **"Profil ve Fotoğraf Yönetimi"** bölümüne tıklayın.
2. **"2. Profil Fotoğrafı ve Özgeçmiş (CV)"** sekmesine geçin.
3. **"Profil Fotoğrafı (Hakkımda Sayfası)"** alanından yeni fotoğrafınızı yükleyin (Önerilen boyut: **1200 × 1500 px**, dikey **4:5** oran, JPG/PNG/WebP).
4. Görsel üzerindeki **"Crop / Hotspot"** simgesine tıklayarak yuvarlak odak noktasını yüz hizasına getirin.
5. Sağ alttaki **Publish** butonuna basın. Web sitesi fotoğrafı doğrudan Sanity üzerinden çeker; görsel yüklenemezse yerel yedek (`/imgs/profile.png`) ve monogram (`YT`) devreye girer.

## 4. GitHub ve Manuel Projelerin Yönetimi

- **GitHub & Proje Seçimi sekmesi:** Sanity Studio üst barındaki **"GitHub & Proje Seçimi"** aracından `yunusemretom` GitHub hesabınızdaki depoları listeleyebilir, istediğiniz depoyu tek tıkla portfolyoya ekleyebilir, gizleyebilir (`Gizle`), ana sayfada öne çıkarabilir (`★ Öne Çıkan`) ve sıra numarasını (`Sıra`) değiştirebilirsiniz.
- **Kişisel düzenlemelerin korunması:** Bir GitHub deposu için Sanity'de özel başlık, özel açıklama veya kapak görseli girdiğinizde web sitesinde sizin girdiğiniz bilgiler gösterilir; GitHub senkronizasyonu kişisel metinlerinizin üzerine yazmaz.
- **Manuel projeler:** GitHub'da olmayan projelerinizi (**NÖBETÇİ**, **Uçuş Kontrol Kartı**, **İHA Sistemleri** vb.) **"Projeler"** menüsünden `Proje kaynağı: Manuel Proje` seçerek ekleyebilirsiniz.
