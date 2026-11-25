# Avrupa Fırını Web Sitesi — Tasarım

Tarih: 2026-11-26 · Hazırlayan: Mehmet Ali Yıldırım (Claude ile)

## 1. Amaç ve neden

Avrupa Fırını (Trabzon/Ortahisar, 1977'den beri, doğal un + taş fırın) şu an yalnızca Instagram'da (@avrupafirini) var. Site, fırına gelecek ya da ürünleri merak eden birinin:

- ekmek çeşitlerini ve öne çıkan/dikkat çekici ürünleri (keteler, hamsili ekmek, Gümüşhane ekmeği vb.) görmesi,
- her ekmeği ayrıntılı tanıması (içerik, un, lezzet, hangi sağlık durumlarında tercih edildiği),
- hangi ekmeğin hangi gün çıktığını öğrenmesi,
- fırını haritada bulup arayabilmesi

için var. Günlük güncel fotoğraflar Instagram'da her gün paylaşılıyor; site bunları canlı akışla gösterir.

## 2. Hedefler

1. Ana sayfada fırının kimliği (1977, taş fırın, doğal un) ve öne çıkan ürünler ilk bakışta görünür.
2. "Ekmeklerimiz" sayfası: her ekmek için ayrıntılı tanıtım + sağlık bilgisi.
3. "Keteler" bölümü/sayfası: kete çeşitlerinin tanıtımı.
4. Haftalık "Hangi gün hangi ekmek" çizelgesi; site bugünün gününe göre "Bugün fırında" alanını otomatik doldurur. Gerçek düzen: çoğu ürün her gün; bir-iki ürün yalnızca belirli günlerde; üretim günleri haftadan haftaya değişmez (standart). Pazar kapalı, cumartesi erken kapanır.
5. Canlı Instagram akışı altyapısı (son paylaşımlar) — kurulur ama hesap bağlanana kadar gizli kalır.
6. Harita temalı iletişim bölümü: gömülü harita, yol tarifi, telefon (tıkla-ara), WhatsApp.
7. Mobilde kusursuz (ziyaretçilerin çoğu telefondan gelecek).

## 3. Hedef olmayanlar

- Online sipariş/ödeme, sepet, üyelik yok.
- Yönetim paneli / CMS yok — fırın çalışanları siteyi düzenlemeyecek.
- Fiyat listesi yok (karar verilmedi; ileride eklenebilir).
- Çok dilli içerik yok (yalnızca Türkçe).

## 4. Anti-hedefler (çalışsa bile başarısızlık sayılacaklar)

- Bir ekmeğin bir hastalığı **tedavi ettiğini/iyileştirdiğini** iddia eden ifadeler. (Gıda mevzuatı açısından risk + yanlış karara yol açabilir.)
- Glütensiz olmayan bir ürünü glütensiz gibi gösteren ya da çölyak hastası için belirsiz bırakan bilgi.
- Sitenin, Instagram akışı bozulduğunda boş/kırık görünmesi.
- Yavaş açılan, ağır bir site.
- Hazır şablon görünümü — site fırının kendi kimliğini taşımalı.

## 5. Kısıtlar

- Siteyi Mehmet Ali yılda bir ya da fırın istediğinde güncelleyecek; içerik güncellemesi tek bir veri dosyasını düzenlemekle yapılabilmeli.
- Barındırma ücretsiz olmalı.
- Ürün yelpazesi stabil; ürünler yılda birkaç kez değişir.
- Fotoğraf kaynağı: mevcut Instagram paylaşımları (izinli, fırının kendi içeriği).
- Renkler logodan türetilir (lacivert yazı/çember, beyaz zemin, kırmızı ve buğday tonları) ve ekmeğin sıcaklığını vermeli.

## 6. Yaklaşımlar

| Yaklaşım | Artı | Eksi |
|---|---|---|
| 1. Statik site, Instagram'a bağlantı | Ücretsiz, çok hızlı, sıfır bakım | Site kendiliğinden tazelenmiyor |
| **2. Statik site + canlı Instagram akışı (SEÇİLDİ)** | 1'in tüm artıları + her gün güncel görünür | Dış hizmete bağımlı; ücretsiz paket sınırlı; Meta değişirse akış bozulabilir |
| 3. WordPress / CMS | Fırın kendisi düzenleyebilir | Ücretli barındırma, bakım, güvenlik yükü; güncellemeyi zaten Mehmet Ali yapacağı için gereksiz |

**Seçim: 2.** Mehmet Ali seçti; sitenin her gün güncel görünmesi önemli. Akış bozulma riski, akış alanının bozulunca zarifçe "Instagram'da gör" bağlantısına düşmesiyle karşılanır.

## 7. Kararlaştırılan "nasıl"

- **Statik site**, tek bir veri dosyası (ör. `data/urunler.json` veya benzeri) ürünleri, ketelerin listesini, haftalık çizelgeyi, iletişim bilgilerini tutar. Sayfalar bu dosyadan beslenir.
- **"Bugün fırında"**: tarayıcıda o günün haftanın hangi günü olduğuna (Türkiye saati, Europe/Istanbul) bakılarak çizelgeden ilgili ekmekler gösterilir. Her gün çıkan ürünler bir listede, yalnızca belirli günlerde çıkanlar "Bugüne özel" diye vurgulanır. Pazar günü "Bugün kapalıyız — yarın görüşmek üzere" mesajı ve pazartesinin ürünleri. Kapanış saati geçtiyse yarının ürünleri gösterilir (yapıcının kararı, saatler gelince ayarlanır).
- **Canlı Instagram akışı** bir dış hizmetle (Behold, Elfsight benzeri) gelir. Altyapı (bölüm, bileşen, veri dosyasında aç/kapa ayarı ve hizmet kimliği alanı) şimdiden kurulur, ama ayar kapalı olduğu için sitede görünmez. Mehmet Ali hesabı sonra bağlayıp ayarı açar. Akış yüklenemezse yerine "Instagram'da bizi takip edin" bağlantısı görünür.
- **Alan adı**: avrupafirini.com (büyük olasılıkla; alınmadan önce ücretsiz alt alan adında yayınlanabilir).
- **Ürün içerikleri**: Mehmet Ali ürünleri yapanlardan ayrıntılı içerik bilgisini toplayıp aktaracak. O zamana kadar Claude mevcut ürünler için **taslak** metinler yazar; her taslak veri dosyasında "doğrulanmadı" olarak işaretlenir. Taslaklarda tarif/oran uydurulmaz, glütensiz iddiası yapılmaz.
- **Harita**: gömülü Google Haritalar (API anahtarsız embed) + "Yol tarifi al" düğmesi.
- **Renk yönü**: logodaki lacivert ana renk; buğday sarısı, kabuk kahvesi, krem gibi sıcak fırın tonlarıyla dengelenir. Kesin kodlar logonun orijinal dosyasından alınır.
- **Sağlık bilgisi dili**: "lifi yüksek", "beyaz una göre kan şekerini daha yavaş yükseltir", "glüten içerir" gibi gerçek, genel bilgiler; her sağlık bilgisinin yanında "Sağlık durumunuz için doktorunuza/diyetisyeninize danışın" notu. Glütensiz ürün yoksa bu açıkça yazılır.
- Barındırma: ücretsiz statik barındırma (Cloudflare Pages veya GitHub Pages).

### Sayfa yapısı (taslak)

```
Ana sayfa
  Hero: büyük fotoğraf · "1977'den beri taş fırında" · Ara / Yol tarifi
  Bugün fırında (otomatik, çizelgeden)
  Öne çıkanlar: Hamsili Ekmek · Keteler · Siyez / Gümüşhane
  Ekmeklerimiz (kart ızgarası → ayrıntı)
  Hikâyemiz (kısa: 1977, taş fırın, doğal un)
  Instagram'dan son paylaşımlar (canlı akış)
  Harita + çalışma saatleri + iletişim
Kurabiye & Diğer Lezzetler — meyveli kurabiye, acıbadem, Beypazarı ürünleri, peksimet, kurutulmuş çavdar, pazılı börek
Ekmeklerimiz — her ekmek: fotoğraf, un/içerik, lezzet, hangi günler,
  "kimler tercih ediyor" sağlık bilgisi + uyarı notu
Keteler — haşhaşlı, pazılı ve diğer çeşitler
Haftalık çizelge — gün × ekmek tablosu
İletişim — harita, adres, telefonlar, WhatsApp, saatler
```

### Bilinen içerik (Instagram'dan)

- Telefon: 0541 322 13 16 / 0462 322 13 16
- Adres: Kemerkaya Mahallesi, Halkevi Sokak No: 22 B, Ortahisar/Trabzon
- Ekmekler: Hamsili Ekmek (hamsili sebzeli mısır ekmeği), Tam Buğday, Çavdar, Mısır, Gümüşhane, Siyez Buğdaylı, Tahıllı, Greçka
- Keteler: haşhaşlı, pazılı ve diğerleri
- Kurabiye & diğer: Meyveli Kurabiye, Acıbadem, Beypazarı ürünleri, Peksimet, Kurutulmuş Çavdar, Pazılı Börek
- Hangi ürünün hangi günler çıktığı, çalışma saatleri, WhatsApp numarası, logonun orijinal dosyası: Mehmet Ali'den gelecek.
- Instagram'daki son gönderi Mart 2023 tarihli; günlük paylaşımlar büyük olasılıkla hikâyelerde. Akış hizmetleri genelde yalnızca gönderileri gösterir (bkz. Açık riskler).

## 8. Yapıcıya bırakılanlar

- Statik site aracı (saf HTML/CSS/JS ya da Astro benzeri bir üretici) — tek veri dosyasından beslenme şartıyla.
- Yazı tipleri, tipografi, animasyonlar, bileşen ayrıntıları.
- Instagram akış hizmetinin seçimi (ücretsiz paketin yeterliliğine göre).
- Sayfaların tek sayfa + bölümler mi yoksa ayrı sayfalar mı olacağı (mobilde kolay gezinti şartıyla).
- SEO temelleri (başlıklar, açıklamalar, yerel işletme yapılandırılmış verisi).

## 9. Açık riskler

- **Instagram akışı eski görünebilir.** Hesaptaki son gönderi Mart 2023. Günlük paylaşımlar hikâyelerdeyse akış hizmeti bunları göstermez ve sitede 2023 fotoğrafları "son paylaşımlar" diye çıkar. Akışı açmadan önce ya düzenli gönderi paylaşılmaya başlanmalı ya da bölüm "Instagram'da bizi takip edin" bağlantısıyla sınırlı kalmalı. Altyapı her iki durumu da destekler.
- **Sağlık bilgileri** fırından gelen içerik bilgisiyle doğrulanmadan yayına girmez.
