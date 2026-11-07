# Portfolio yönetim paneli

Sanity Studio bu klasördeki bağımsız yönetim uygulamasıdır. Site Express + EJS olarak çalışmaya devam eder; yönetim paneli ana web uygulamasından ayrı yayınlanır.

## Yerel geliştirme

```bash
cd studio
npm install
SANITY_STUDIO_PROJECT_ID=YOUR_PROJECT_ID SANITY_STUDIO_DATASET=production npm run dev
```

Sanity hesabıyla giriş yapılır. Studio erişimi Sanity proje üyeliği ve rol izinleriyle korunur; web sitesine herkese açık bir yönetim rotası eklenmez.

## Yayınlama

```bash
SANITY_STUDIO_PROJECT_ID=YOUR_PROJECT_ID SANITY_STUDIO_DATASET=production npm run build
SANITY_STUDIO_PROJECT_ID=YOUR_PROJECT_ID SANITY_STUDIO_DATASET=production npm run deploy
```

Sanity CLI bir `*.sanity.studio` adresi verir. Özel alan adı için Sanity projesinin hosting/domain ayarlarında `studio.yunusemretom.me` adresini tanımlayıp sağlayıcının verdiği DNS CNAME kaydını domain firmasına ekleyin. DNS hedefini tahmin ederek yazmayın; panelin verdiği hedefi kullanın.

## Taslak ve yayın

Sanity Studio'nun yerleşik taslak/yayın iş akışı kullanılır. Yeni belgeler taslak başlar; içerik editörde incelenip hazır olduğunda **Publish / Yayınla** seçilir. Taslaklar genel sitedeki mevcut sorgulara dahil edilmez. Yayındaki içerik, web uygulamasının Sanity okuma ayarları yapılandırılmışsa sitede görünür.

Not: Bu ilk sürümde Studio içinden sitenin üzerinde birebir görsel önizleme (Presentation Tool / preview mode) henüz bağlı değildir. Yayınlamadan önce içerik alanları editörde kontrol edilebilir; canlı sitede görsel önizleme için sonraki geliştirmede güvenli draft-preview uç noktası kurulmalıdır.
