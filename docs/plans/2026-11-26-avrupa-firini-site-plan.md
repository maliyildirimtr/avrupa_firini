# Avrupa Fırını Web Sitesi — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Avrupa Fırını için ürünleri, haftalık çizelgeyi ("Bugün fırında"), harita/iletişimi ve gizli Instagram akışı altyapısını içeren, tek veri dosyasından beslenen statik site.

**Architecture:** Derleme adımı olmayan saf HTML + CSS + ES modülleri. Tüm içerik `data/site.js` içinde tek bir nesnedir. Saf mantık (`js/takvim.js`, `js/render.js`, `js/instagram.js`, `js/seo.js`) DOM'a dokunmaz, HTML metni döndürür ve Node'un yerleşik test koşucusuyla test edilir. Sayfa betikleri (`js/sayfa-*.js`) yalnızca bu fonksiyonların çıktısını DOM'a yerleştirir.

**Tech Stack:** HTML5, CSS (özel değişkenler), vanilla JS (ES modules), `node --test` (Node ≥ 18, bağımlılık yok), Playwright (yalnızca görsel kontrol, Claude'un çalışma ortamında), Cloudflare Pages (yayın).

**Spec:** `docs/2026-11-26-avrupa-firini-site-tasarimi.md`

## Global Constraints

- Proje kökü: `/Users/maliy_00/Documents/WEB DEVELOPMENT/8)Avrrupa_Fırını` (kullanıcının bilgisayarı; komutlar orada çalışır). Git deposu yok: ilk görevde `git init`. Git kilit dosyalarını silebilmesi için önce bu klasörde silme izni istenir.
- Çalışma zamanında npm bağımlılığı yok. `package.json` yalnızca `"type": "module"` ve `"test": "node --test tests/"` içerir.
- Site dili yalnızca Türkçe, `<html lang="tr">`.
- Gün anahtarları yalnızca şunlardır: `pazartesi, sali, carsamba, persembe, cuma, cumartesi, pazar` (ASCII). Ürün `id`'leri ASCII kebab-case olur (`hamsili-ekmek`).
- Saat hesabı her zaman `Europe/Istanbul` dilimine göre yapılır, ziyaretçinin cihaz saat dilimi kullanılmaz.
- Pazar kapalıdır (`saatler.pazar = null`). Cumartesi kapanışı hafta içinden erkendir.
- Sağlık dili: ürün metinlerinde şu kökler **yasak**: `tedavi`, `iyileştir`, `şifa`, `hastalığa iyi`, `önler`. "Glütensiz" kelimesi hiçbir üründe geçmez (`glutenIcerir` hiçbir üründe `false` değil). Sağlık bilgisi gösterilen her yerde şu sabit not yer alır: **"Bu bilgiler genel bilgilendirme amaçlıdır. Sağlık durumunuza uygun beslenme için doktorunuza veya diyetisyeninize danışın."**
- Doğrulanmamış içerik: her ürünün `dogrulandi: false` alanı vardır. Taslaklarda tarif, oran ya da gram uydurulmaz.
- Bilinen içerik (birebir): telefon `0541 322 13 16` ve `0462 322 13 16`. Adres `Kemerkaya Mahallesi, Halkevi Sokak No: 22 B, Ortahisar/Trabzon`. Instagram `https://www.instagram.com/avrupafirini/`. Slogan: "1977'den beri" ve "Mamüllerimiz doğal unlardan yapılıp taş fırında pişmektedir."
- Renk belirteçleri (logodan türetilmiş başlangıç değerleri; orijinal logo gelince yalnızca `css/tema.css` değişir): `--lacivert:#1F3A6E; --lacivert-koyu:#142749; --bugday:#E3B55B; --kabuk:#8B5A2B; --krem:#FBF5EA; --kirmizi:#B3322B; --metin:#2A2420`.
- Fotoğraflar `img/urunler/<id>.jpg` yolunda durur. Instagram'dan otomatik indirme ya da kazıma yapılmaz, fotoğrafları kullanıcı koyar. Fotoğraf yoksa `img/yer-tutucu.svg` gösterilir.
- Yazı tipleri yalnızca Google Fonts'tan ve `latin-ext` alt kümesiyle yüklenir (Türkçe karakterler için). Tasarım yönü için frontend-design becerisi kullanılır.

## Review Focus

1. **Farklı saat dilimindeki ziyaretçi** (yurtdışındaki biri, ya da cihaz saati UTC): "Bugün fırında" İstanbul gününü göstermeli. Bu, Görev 2'de `UTC 21:30 Cumartesi = İstanbul 00:30 Pazar` testiyle sabitlenir.
2. **Açılıştan önce / kapanıştan sonra / Pazar / Cumartesi erken kapanış**: Her durumda doğru gün ve doğru mesaj gösterilmeli. Bu, Görev 2'deki dört testle sabitlenir.
3. **Gelecek yıl veri girerken yazım hatası** (`"Salı"`, `"sali "`, yinelenen id, unutulan alan): Hata yayına çıkmadan testte yakalanmalı. Bu, Görev 1'deki veri doğrulama testleriyle sabitlenir.
4. **Instagram ayarı açık ama `feedId` boş ya da betik yüklenemiyor**: Boş kutu yerine Instagram bağlantısı görünmeli. Bu, Görev 6'daki testle ve hata yolunda yedek bağlantıyla sabitlenir.
5. **Eksik fotoğraf ve özel karakterli metin** (`&`, `<`, `"`): Kırık görsel ya da bozuk HTML olmamalı. Bu, Görev 3'teki kaçış (escape) ve yer tutucu testleriyle sabitlenir.

---

### Task 1: İskelet, veri modeli ve veri doğrulama

**Files:**
- Create: `package.json`, `.gitignore`, `data/site.js`, `js/veri-dogrula.js`, `tests/veri.test.js`, `img/yer-tutucu.svg`

**Interfaces:**
- Produces: `export const site` (`data/site.js`), şu biçimde:
  ```js
  {
    firma: { ad, kurulus: 1977, slogan, adres, telefonlar: [str], whatsapp: str|null, instagram: url, alanAdi: 'avrupafirini.com' },
    saatler: { pazartesi:{acilis:'HH:MM',kapanis:'HH:MM'}, ..., cumartesi:{...}, pazar:null },
    instagramAkisi: { acik:false, hizmet:'behold', feedId:'' },
    urunler: [ { id, ad, kategori:'ekmek'|'kete'|'lezzet', gunler:'hergun'|[gunAnahtari],
                 kisa, aciklama, icerik:[str], lezzet, saglik:[str], glutenIcerir:true|null,
                 onecikan:bool, dogrulandi:false, foto:'img/urunler/<id>.jpg' } ],
    eksikler: [str]   // yayın öncesi tamamlanacak içerik listesi (README'de gösterilir, sitede değil)
  }
  ```
- Produces: `export const GUNLER = ['pazartesi','sali','carsamba','persembe','cuma','cumartesi','pazar']` ve `export function veriyiDogrula(site) -> string[]` (hata mesajları; boşsa geçerli) — `js/veri-dogrula.js`.

- [ ] **Step 1: Delete izni iste, `git init`, `package.json` (`"type":"module"`, `"scripts":{"test":"node --test tests/"}`), `.gitignore` (`node_modules/`, `.DS_Store`). `node --version` ≥ 18 doğrula.**
- [ ] **Step 2: Failing test yaz** — `tests/veri.test.js`:
  - `veriyiDogrula(site)` gerçek veride `[]` döner.
  - Yinelenen id → hata mesajı `'yinelenen id'` içerir.
  - `gunler: ['Salı']` → hata `'geçersiz gün'` içerir.
  - Zorunlu alan eksik (`ad`) → hata `'ad'` içerir.
  - Herhangi bir üründe yasak kök (`tedavi` vb.) ya da `glütensiz` → hata.
  - `glutenIcerir === false` → hata.
  - `saatler.pazar !== null` → hata; `saatler.cumartesi.kapanis >= saatler.cuma.kapanis` → hata.
  - Gerçek veride her ürün `dogrulandi === false` ve `saatler`'deki her açık gün `acilis < kapanis`.
- [ ] **Step 3: `npm test` → FAIL (modül yok).**
- [ ] **Step 4: `js/veri-dogrula.js` uygula; `data/site.js`'i doldur.** Ürünler (tasarımdaki liste): ekmek — `hamsili-ekmek` (hamsili sebzeli mısır ekmeği), `tam-bugday`, `cavdar`, `misir`, `gumushane`, `siyez`, `tahilli`, `grecka`; kete — `kete-hashasli`, `kete-pazili`, `kete-sade` (çeşit adı taslak); lezzet — `meyveli-kurabiye`, `acibadem`, `beypazari-urunleri`, `peksimet`, `kurutulmus-cavdar`, `pazili-borek`. Öne çıkanlar: hamsili-ekmek, kete-hashasli, siyez, gumushane. `gunler`: hepsi `'hergun'`, yalnızca `hamsili-ekmek` ve `grecka` örnek olarak `['sali','cuma']` (gerçek günler gelene kadar; `eksikler`'e yazılır). Saatler yer tutucu: hafta içi `07:00–20:00`, cumartesi `07:00–17:00` (`eksikler`'e yazılır). Metinler taslak, genel ve doğru bilgiler: "tam tahıllı olduğu için lif oranı yüksektir" gibi. Glüten bilgisi buğday/çavdar/siyez için `true`, emin olunmayanlar için `null`. `eksikler`: saatler, gerçek üretim günleri, WhatsApp numarası, logo dosyası, ürün fotoğrafları, ürün içerikleri (fırından).
- [ ] **Step 5: `npm test` → PASS.**
- [ ] **Step 6: Commit** `feat: veri modeli ve veri doğrulama`

### Task 2: "Bugün fırında" takvim mantığı

**Files:** Create `js/takvim.js`, `tests/takvim.test.js`

**Interfaces:**
- Consumes: `site`, `GUNLER`.
- Produces: `istanbulZamani(date: Date) -> { gun: GunAnahtari, saat: 'HH:MM' }` and
  `bugunFirinda(site, date: Date) -> { durum: 'acik'|'acilacak'|'kapandi'|'kapali', gun: GunAnahtari, saatler:{acilis,kapanis}, herGun: Urun[], ozel: Urun[] }`
  - `acik`: acilis ≤ saat < kapanis → bugünün ürünleri.
  - `acilacak`: saat < acilis → bugünün ürünleri.
  - `kapandi`: saat ≥ kapanis → **bir sonraki açık günün** ürünleri, `gun` o gündür.
  - `kapali`: bugün Pazar → Pazartesinin ürünleri, `gun: 'pazartesi'`.
  - `herGun` = `gunler === 'hergun'` olanlar. `ozel` = `gunler` dizisi o günü içerenler.

- [ ] **Step 1: Failing testler** (tarihler UTC ile verilir; İstanbul = UTC+3):
  - `istanbulZamani(new Date('2026-11-28T21:30:00Z'))` → `{gun:'pazar', saat:'00:30'}`.
  - Salı 10:00 İst. (`2026-12-01T07:00:00Z`) → `durum 'acik'`, `gun 'sali'`, `ozel` `hamsili-ekmek` ve `grecka`'yı içerir.
  - Çarşamba 06:00 İst. → `'acilacak'`, `ozel` boş.
  - Pazartesi 21:00 İst. → `'kapandi'`, `gun 'sali'`.
  - Cumartesi 18:00 İst. → `'kapandi'`, `gun 'pazartesi'` (Pazar atlanır).
  - Pazar 12:00 İst. → `'kapali'`, `gun 'pazartesi'`.
  - Test verisi `site`'tan bağımsız bir fixture ile yazılır (gerçek veri değişince testler kırılmasın).
- [ ] **Step 2: `npm test` → FAIL.**
- [ ] **Step 3: Uygula.** `Intl.DateTimeFormat('en-US',{timeZone:'Europe/Istanbul', weekday:'long', hour:'2-digit', minute:'2-digit', hourCycle:'h23'})` + `formatToParts`. Saat karşılaştırması `'HH:MM'` metniyle yapılır.
- [ ] **Step 4: `npm test` → PASS.**
- [ ] **Step 5: Commit** `feat: bugün fırında takvim mantığı`

### Task 3: HTML parçaları (render)

**Files:** Create `js/render.js`, `tests/render.test.js`

**Interfaces:**
- Consumes: `Urun`, `bugunFirinda` sonucu, `GUNLER`.
- Produces (hepsi `string` döndürür):
  - `kacis(metin)` — `& < > " '` kaçışı.
  - `GUN_ADLARI` — `{pazartesi:'Pazartesi', sali:'Salı', …}`.
  - `SAGLIK_NOTU` — Global Constraints'teki sabit not.
  - `urunKarti(urun)` → `<article class="urun-karti" id="<id>">` içinde fotoğraf (`onerror` ile `img/yer-tutucu.svg`), ad, kısa metin. Belirli günlerde çıkan ürün için "Salı, Cuma" rozeti.
  - `urunDetay(urun)` → açıklama, içerik listesi, lezzet, günler, glüten satırı (`true` → "Glüten içerir", `null` → "Glüten bilgisi için fırınımıza danışın"), `saglik` boş değilse liste + `SAGLIK_NOTU`.
  - `bugunFirindaHTML(sonuc, site)` → başlık + durum mesajı: `acik` "Şu an açığız · 20:00'ye kadar". `acilacak` "Bugün 07:00'de açıyoruz". `kapandi` "Bugün kapandık · {Gün} 07:00'de görüşmek üzere". `kapali` "Bugün (Pazar) kapalıyız · Pazartesi 07:00'de görüşmek üzere". Ardından `ozel` "Bugüne özel" vurgusuyla, `herGun` listesiyle gelir.
  - `cizelgeTablosu(site)` → `<table>` satır = ürün (sadece belirli günlü ürünler + "Diğer tüm ürünlerimiz her gün" notu), sütun = Pazartesi–Cumartesi; Pazar sütunu "Kapalı".
  - `saatlerListesi(site)` → gün gün saatler, Pazar "Kapalı".
- [ ] **Step 1: Failing testler:** `kacis('A & <b>')` → `'A &amp; &lt;b&gt;'`; adı `Çavdar & "Siyez"` olan ürünün kartında ham `<`/`"` yok; `foto` eksik ürün kartı `yer-tutucu.svg` içerir; `saglik` dolu ürünün detayı `SAGLIK_NOTU`'nu birebir içerir, boş olanda içermez; `glutenIcerir:null` → "fırınımıza danışın"; dört durumun her biri için beklenen mesaj metni; `cizelgeTablosu` "Kapalı" ve "Salı" içerir.
- [ ] **Step 2: FAIL → Step 3: uygula → Step 4: PASS.**
- [ ] **Step 5: Commit** `feat: html parçaları`

### Task 4: Tema, ortak düzen ve ana sayfa

**Files:** Create `css/tema.css`, `css/site.css`, `js/ortak.js`, `js/sayfa-anasayfa.js`, `index.html`; Test: görsel kontrol

**Interfaces:**
- Consumes: `site`, `bugunFirinda`, `bugunFirindaHTML`, `urunKarti`.
- Produces: `ortakDuzeniKur()` (`js/ortak.js`) — `<header data-ortak>` ve `<footer data-ortak>` doldurur. Menü: Ana Sayfa, Ekmeklerimiz, Keteler, Lezzetler, Çizelge, İletişim. Mobilde açılır menü. Footer'da telefonlar (`tel:` bağlantı), adres, Instagram bağlantısı, "1977'den beri". Diğer sayfalar bunu kullanır.

- [ ] **Step 1:** frontend-design becerisini yükle; renk belirteçlerini (Global Constraints) `css/tema.css`'e `:root` olarak yaz. Sıcak, fırın hissi veren bir yön seç: krem zemin, lacivert başlıklar, buğday vurgular. Bunu bir satırla commit mesajında belirt.
- [ ] **Step 2:** `index.html` bölümleri sırasıyla: Hero (slogan, "1977'den beri taş fırında", "Ara" ve "Yol tarifi" düğmeleri), `#bugun-firinda`, Öne çıkanlar (`onecikan` ürünler), Ekmeklerimiz önizleme (ilk 6 kart + "Tümü" bağlantısı), Hikâyemiz (kısa: 1977, taş fırın, doğal un), `#instagram` (boş, Görev 6 doldurur), Harita + saatler özeti.
- [ ] **Step 3: Görsel kontrol:** `npx serve .` ile yayınla, sayfayı container'a aktar ve Playwright ile 375×812 ile 1280×800 boyutlarında ekran görüntüsü al. Yatay kaydırma olmamalı, "Bugün fırında" dolu olmalı, konsolda hata olmamalı.
- [ ] **Step 4: `npm test` → PASS. Commit** `feat: tema ve ana sayfa`

### Task 5: Ürün sayfaları, çizelge ve iletişim

**Files:** Create `ekmeklerimiz.html`, `keteler.html`, `lezzetler.html`, `cizelge.html`, `iletisim.html`, `js/sayfa-urunler.js`, `js/sayfa-cizelge.js`, `js/sayfa-iletisim.js`, `js/harita.js`, `tests/harita.test.js`

**Interfaces:**
- Consumes: `urunKarti`, `urunDetay`, `cizelgeTablosu`, `saatlerListesi`, `ortakDuzeniKur`.
- Produces: `haritaEmbedUrl(adres) -> 'https://www.google.com/maps?q=<encodeURIComponent(adres)>&output=embed'`, `yolTarifiUrl(adres) -> 'https://www.google.com/maps/dir/?api=1&destination=<encodeURIComponent(adres)>'` (`js/harita.js`). `urunSayfasiKur(kategori)` (`js/sayfa-urunler.js`) — sayfalar `data-kategori` ile çağırır.

- [ ] **Step 1: Failing test:** `haritaEmbedUrl` / `yolTarifiUrl` Türkçe karakterli adresi doğru kodlar (`Halkevi%20Sokak`, `%C3%87`… içerir).
- [ ] **Step 2: FAIL → uygula → PASS.**
- [ ] **Step 3:** Ürün sayfalarında üstte kart ızgarası, altta her ürün için `urunDetay` gelir. Karttan `#<id>` çapasıyla detaya inilir. Ekmeklerimiz sayfasında sayfa başında `SAGLIK_NOTU` bir kez görünür. İletişim sayfasında `loading="lazy"` iframe harita, "Yol tarifi al" düğmesi, `tel:` bağlantılı telefonlar, `saatlerListesi` ve Instagram bağlantısı bulunur. WhatsApp düğmesi yalnızca `firma.whatsapp` doluysa görünür (`https://wa.me/90…`).
- [ ] **Step 4: Görsel kontrol** (Görev 4'teki gibi, 5 sayfa × 2 boyut). Ayrıca bir ürünün fotoğrafı silinince yer tutucu görünmeli.
- [ ] **Step 5: Commit** `feat: ürün, çizelge ve iletişim sayfaları`

### Task 6: Gizli Instagram akışı altyapısı

**Files:** Create `js/instagram.js`, `tests/instagram.test.js`; Modify `js/sayfa-anasayfa.js`

**Interfaces:**
- Consumes: `site.instagramAkisi`, `site.firma.instagram`.
- Produces: `instagramModu(ayar) -> 'gizli'|'akis'` (`acik && feedId.trim()` → `'akis'`, aksi halde `'gizli'`). `instagramHTML(mod, ayar, instagramUrl) -> string` (`'gizli'` → `''`; `'akis'` → Behold kabı `<behold-widget feed-id="…">` + `<noscript>`/yedek bağlantı). `instagramYukle(kap, ayar, instagramUrl)` betiği (`https://w.behold.so/widget.js`, `type="module"`) ekler. `onerror` ya da 8 sn içinde içerik gelmezse kabı "Instagram'da bizi takip edin" bağlantısıyla değiştirir.
- [ ] **Step 1: Failing testler:** `{acik:false}` → `'gizli'` ve HTML `''`; `{acik:true, feedId:''}` → `'gizli'`; `{acik:true, feedId:'  '}` → `'gizli'`; `{acik:true, feedId:'abc'}` → `'akis'` ve HTML `feed-id="abc"` ile Instagram URL'sini içerir.
- [ ] **Step 2: FAIL → uygula → PASS.**
- [ ] **Step 3:** Ana sayfada `'gizli'` modda `#instagram` bölümü DOM'dan tamamen kaldırılır (boşluk kalmaz). Footer'daki Instagram bağlantısı her zaman durur.
- [ ] **Step 4:** Görsel kontrol: varsayılan ayarla bölüm görünmüyor olmalı. Geçici olarak `acik:true, feedId:'test'` yapılınca 8 sn sonra yedek bağlantı görünmeli. Ayarı geri al.
- [ ] **Step 5: Commit** `feat: gizli instagram akışı altyapısı`

### Task 7: SEO, son rötuşlar, güncelleme rehberi ve yayın hazırlığı

**Files:** Create `js/seo.js`, `tests/seo.test.js`, `404.html`, `robots.txt`, `sitemap.xml`, `README.md`; Modify tüm `*.html` (`<title>`, `<meta name="description">`, Open Graph)

**Interfaces:**
- Produces: `yapilandirilmisVeri(site) -> object` — `@type:'Bakery'`, `name`, `foundingDate:'1977'`, `address` (PostalAddress, `addressLocality:'Ortahisar'`, `addressRegion:'Trabzon'`, `addressCountry:'TR'`), `telephone` (ilk numara `+90 541 322 13 16`), `openingHoursSpecification` (Pazar yok), `sameAs:[instagram]`, `url:'https://avrupafirini.com'`.
- [ ] **Step 1: Failing test:** Pazar `openingHoursSpecification`'da yok, Cumartesi kapanışı veriyle aynı, `telephone` `+90` ile başlıyor.
- [ ] **Step 2: FAIL → uygula → PASS.** `index.html` sayfası bunu `<script type="application/ld+json">` ile ekler.
- [ ] **Step 2b: Arama görünürlüğü (kullanıcı isteği: "fırın", "kete" aramalarında öne çıkma).** Her sayfanın `<title>` ve `<h1>`'i yerel anahtar kelime taşır, ama doğal okunur: ana sayfa "Avrupa Fırını · Trabzon Ortahisar'da 1977'den beri taş fırın", ketelerde "Trabzon Kete · Ev yapımı haşhaşlı ve pazılı kete | Avrupa Fırını", ekmeklerde "Trabzon'da Tam Buğday, Çavdar, Siyez ve Hamsili Ekmek | Avrupa Fırını". Her ürün detayında `Product` JSON-LD (`name`, `description`, `image`, `brand:'Avrupa Fırını'`, fiyat yok) olur, `yapilandirilmisVeri` ile aynı modülde `urunVerisi(urun)` üretilir ve test edilir (`brand.name === 'Avrupa Fırını'`, `offers` yok). `hasMap` için yol tarifi URL'si kullanılır. Her görselin Türkçe `alt` metni ürün adı + "Avrupa Fırını Trabzon" içerir. `sitemap.xml` 6 sayfayı listeler. Anahtar kelime doldurma ya da gizli metin yapılmaz.
- [ ] **Step 3: `README.md`** (Türkçe): **Google İşletme Profili** kurulum ve doğrulama adımları (yerel "fırın" aramalarında haritada çıkmanın en etkili yolu; site adresi profile eklenir), Google Search Console'a site ve sitemap ekleme, yerel çalıştırma (`npx serve .`), testler (`npm test`), **yıllık güncelleme rehberi** (ürün ekleme/çıkarma, gün ve saat değiştirme, fotoğraf koyma, `dogrulandi:true` yapma, Instagram akışını açma: Behold'da hesap bağla → `feedId` yaz → `acik:true`), `eksikler` listesinin kopyası, Cloudflare Pages ile yayın ve `avrupafirini.com`'u bağlama adımları.
- [ ] **Step 4: Son kontrol:** `npm test` tamamen geçmeli. Tüm sayfalar mobil ve masaüstünde ekran görüntüsüyle kontrol edilmeli. Konsol hatası, kırık bağlantı ya da yatay kaydırma olmamalı.
- [ ] **Step 5: Commit** `feat: seo, rehber ve yayın hazırlığı`
