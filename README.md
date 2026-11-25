# Avrupa Fırını — web sitesi

Trabzon Ortahisar'daki Avrupa Fırını'nın (1977'den beri) sitesi. Statik bir sitedir: tüm içerik **`data/site.js`** dosyasındadır; sayfalar `npm run build` ile `dist/` klasörüne üretilir.

## Klasörler

| Yol | Ne var |
|---|---|
| `data/site.js` | **Tüm içerik**: firma bilgisi, saatler, ürünler, Instagram ayarı |
| `sayfalar/*.html` | Sayfa şablonları (`{{...}}` işaretleri veriyle doldurulur) |
| `css/tema.css` | Renkler ve yazı tipleri (logo gelince yalnızca burası değişir) |
| `css/site.css` | Sayfa düzeni |
| `js/` | Takvim ("Bugün fırında"), HTML parçaları, harita, SEO, Instagram |
| `img/urunler/` | Ürün fotoğrafları — `<ürün-id>.jpg` |
| `scripts/olustur.js` | Şablonları doldurup `dist/` üreten betik |
| `tests/` | Otomatik testler |

## Çalıştırma

Node.js 18 veya üstü gerekir; başka bir şey kurmanıza gerek yok.

```bash
npm test          # veriyi ve kodu kontrol eder — her değişiklikten sonra çalıştırın
npm run build     # dist/ klasörünü üretir
npx serve dist    # http://localhost:3000 adresinde önizleme
```

`npm run build` veri hatası bulursa (yanlış yazılmış gün adı, yinelenen ürün, yasak sağlık ifadesi…) **durur ve hatayı listeler**; hatalı site yayına çıkmaz.

## Yıllık güncelleme rehberi

Hepsi `data/site.js` içinde yapılır. Bitince `npm test`, sonra yayınlayın.

### Ürün eklemek / çıkarmak
`urunler` listesine yeni bir `urun({...})` bloğu ekleyin (var olan birini kopyalayın) ya da bloğu silin.
- `id`: yalnızca küçük harf, rakam ve tire — `kete-cevizli` gibi (Türkçe karakter yok).
- `kategori`: `'ekmek'`, `'kete'` ya da `'lezzet'`.
- `onecikan: true` → ana sayfadaki "öne çıkanlar"da görünür.
- `glutenIcerir`: `true` (içerir) ya da `null` (emin değilsek). Her ürün sayfasında "glütensiz ürünümüz yoktur" çölyak notu bulunur; ürün metinlerinde **glütensiz** yazmak kasıtlı olarak engellenmiştir.
- `dogrulandi`: **`false` iken ürünün "İçindekiler" ve "Beslenme notları" sitede yayınlanmaz** (yalnızca ad, açıklama, lezzet ve günler görünür). Bilgiyi fırınla kontrol edince `true` yapın.
- Taslakları görmek için önizleme: `TASLAK=1 npm run build` → doğrulanmamış bilgiler "Taslak" etiketiyle görünür. **Bu çıktıyı yayınlamayın**; yayın için normal `npm run build` kullanılır.
- Alan adını yanlış yazarsanız (`günler`, `gunlr` gibi) test ve derleme "bilinmeyen alan" hatası verir.
- İçindekilerde buğday, çavdar, siyez, arpa ya da yulaf geçiyorsa `glutenIcerir: true` zorunludur.

### Hangi gün çıktığını değiştirmek
- Her gün çıkan ürün: `gunler: 'hergun'` (varsayılan; yazmasanız da olur).
- Belirli günler: `gunler: ['sali', 'cuma']`. Gün adları: `pazartesi, sali, carsamba, persembe, cuma, cumartesi`.
Çizelge sayfası ve "Bugün fırında" kendiliğinden güncellenir.

### Adres değiştirmek
`firma.sokakAdresi`, `firma.ilce`, `firma.il` alanlarını düzeltin; sayfalar, harita ve Google'ın okuduğu işletme bilgisi birlikte güncellenir.

### Saatleri değiştirmek
`saatler` içinde `acilis` / `kapanis` değerlerini `'07:30'` biçiminde yazın. Pazar `null` (kapalı) kalmalı.

### Fotoğraf koymak
Fotoğrafı `img/urunler/<ürün-id>.jpg` adıyla kaydedin (ör. `img/urunler/siyez.jpg`). Yatay, yaklaşık 1200×1000 piksel, 300 KB altı olsun. Ana sayfadaki fırın kemerinde görünmesini istediğiniz fotoğrafı `img/hero.jpg` olarak koyun. Fotoğraf yoksa site "Fotoğraf yakında" gösterir.

### Sağlık bilgisi yazarken
Siteye yalnızca genel ve doğru bilgiler yazılır: "lifi yüksektir", "omega-3 bakımından zengindir" gibi. "Tedavi eder", "iyileştirir", "şifa", "hastalığa iyi gelir", "önler", "glütensiz" ifadeleri **testte hata verir** — hem yasal risk hem de yanlış yönlendirme olmaması için. Sağlık bilgisinin yanına doktor/diyetisyen notu otomatik eklenir.

### Instagram akışını açmak
1. Instagram hesabını **İşletme** ya da **İçerik Üreticisi** hesabına çevirin (Instagram → Ayarlar → Hesap türü).
2. [behold.so](https://behold.so) adresinde ücretsiz hesap açıp Instagram'ı bağlayın, bir "feed" oluşturun ve **Feed ID**'yi kopyalayın.
3. `data/site.js` içinde: `instagramAkisi: { acik: true, hizmet: 'behold', feedId: 'KOPYALADIĞINIZ-ID' }`
4. Akış yüklenemezse site otomatik olarak "Instagram'da bizi takip edin" düğmesi gösterir.

> Not: Akış hizmetleri yalnızca **gönderileri** gösterir, hikâyeleri değil. Hesaptaki son gönderi 2023 tarihliyse sitede eski fotoğraflar görünür; akışı açmadan önce düzenli gönderi paylaşılmaya başlanmalı.

## Yayına alma (Cloudflare Pages, ücretsiz)

1. Bu klasörü GitHub'a bir depo olarak yükleyin.
2. Cloudflare → Workers & Pages → Create → Pages → GitHub deposunu bağlayın.
3. Ayarlar: **Build command:** `npm run build` · **Build output directory:** `dist`
4. Site `avrupa-firini.pages.dev` gibi bir adreste yayına girer; her `git push`'ta kendiliğinden yenilenir.
5. **avrupafirini.com** alındığında: Pages projesi → Custom domains → `avrupafirini.com` ekleyin ve yönergeleri izleyin.

## Arama motorunda öne çıkma

Sitede yapılanlar: her sayfanın başlığı ve açıklaması "Trabzon", "kete", "fırın", "ekmek" gibi aranan sözcükleri doğal biçimde içerir; Google'ın okuduğu işletme (`Bakery`) ve ürün verileri, `sitemap.xml` ve `robots.txt` hazırdır; içerik düz HTML olarak üretildiği için arama motorları doğrudan okur.

Yayından sonra yapılması gerekenler (en etkiliden başlayarak):
1. **Google İşletme Profili** — "Trabzon fırın", "yakınımdaki fırın" aramalarında haritada çıkmanın en etkili yolu budur. [business.google.com](https://business.google.com) → işletmeyi ekleyin (kategori: *Fırın*), adresi doğrulayın (posta kartı ya da telefon), web sitesi olarak `https://avrupafirini.com` yazın, saatleri ve fotoğrafları ekleyin. Müşterilerden yorum istemek sıralamayı çok etkiler.
2. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console) → siteyi ekleyin, doğrulayın, `sitemap.xml` gönderin.
3. Instagram profilindeki bağlantıya site adresini yazın.
4. Ürün fotoğraflarını ekleyin — görsel aramalarda da çıkılır.

## Yayın öncesi eksikler

- Gerçek çalışma saatleri (hafta içi ve cumartesi)
- Hangi ürünün hangi günler çıktığı (hamsili ekmek ve greçka için yazılan salı/cuma örnektir)
- WhatsApp numarası (`firma.whatsapp`)
- Logonun orijinal dosyası ve kesin renk kodları (`css/tema.css`)
- Ürün fotoğrafları (`img/urunler/<id>.jpg`) ve `img/hero.jpg`
- Her ürünün içerik ve sağlık bilgisinin fırından doğrulanması
- Kete çeşitlerinin tam listesi
