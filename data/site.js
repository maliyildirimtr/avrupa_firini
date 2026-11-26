// Avrupa Fırını — sitenin tüm içeriği bu dosyadadır.
// Güncelleme rehberi için README.md'ye bakın. Değişiklikten sonra `npm test` çalıştırın.
// Gün anahtarları: pazartesi, sali, carsamba, persembe, cuma, cumartesi (pazar kapalı).
// dogrulandi:false = metin taslaktır, fırından gelen bilgiyle henüz kontrol edilmedi.

const urun = (o) => ({
  icerik: [],
  saglik: [],
  glutenIcerir: null,
  onecikan: false,
  dogrulandi: false,
  gunler: 'hergun',
  foto: `img/urunler/${o.id}.jpg`,
  ...o,
});

export const site = {
  firma: {
    ad: 'Avrupa Fırını',
    kurulus: 1977,
    slogan: "1977'den beri",
    aciklama: 'Mamüllerimiz doğal unlardan yapılıp taş fırında pişmektedir.',
    sokakAdresi: 'Kemerkaya Mahallesi, Halkevi Sokak No: 22 B',
    ilce: 'Ortahisar',
    il: 'Trabzon',
    telefonlar: ['0541 322 13 16', '0462 322 13 16'],
    whatsapp: null, // ör. '0541 322 13 16' — numara netleşince yazın
    instagram: 'https://www.instagram.com/avrupafirini/',
    alanAdi: 'avrupafirini.com',
  },

  // GEÇİCİ saatler — fırından gerçek saatler gelince güncelleyin.
  saatler: {
    pazartesi: { acilis: '07:00', kapanis: '20:00' },
    sali: { acilis: '07:00', kapanis: '20:00' },
    carsamba: { acilis: '07:00', kapanis: '20:00' },
    persembe: { acilis: '07:00', kapanis: '20:00' },
    cuma: { acilis: '07:00', kapanis: '20:00' },
    cumartesi: { acilis: '07:00', kapanis: '17:00' },
    pazar: null,
  },

  // Instagram akışı: Behold'da hesabı bağlayın, feedId'yi yazın, acik:true yapın.
  instagramAkisi: { acik: false, hizmet: 'behold', feedId: '' },

  urunler: [
    // ——— EKMEKLER ———
    urun({
      id: 'hamsili-ekmek', ad: 'Hamsili Ekmek', kategori: 'ekmek', onecikan: true,
      kisa: 'Karadeniz’in vazgeçilmezi: hamsili, sebzeli mısır ekmeği.',
      aciklama: 'Mısır unu, taze hamsi ve yeşilliklerle hazırlanan, Karadeniz mutfağının en sevilen lezzetlerinden. Taş fırında pişerek kenarları çıtır, içi yumuşak olur.',
      icerik: ['Mısır unu', 'Hamsi', 'Mevsim yeşillikleri', 'Soğan'],
      lezzet: 'Doyurucu, hafif tuzlu, yeşilliklerin aromasıyla dengeli.',
      saglik: ['Hamsi, omega-3 yağ asitleri bakımından zengin bir balıktır.'],
      glutenIcerir: null,
    }),
    urun({
      id: 'tam-bugday', ad: 'Tam Buğday Ekmeği', kategori: 'ekmek',
      kisa: 'Katkısız, tam buğday unundan.',
      aciklama: 'Buğday tanesinin kepeği ve özüyle birlikte öğütüldüğü tam buğday unundan yapılır. Taş fırında yavaşça pişer.',
      icerik: ['Tam buğday unu', 'Su', 'Tuz', 'Maya'],
      lezzet: 'Hafif kepekli, tok ve aromalı.',
      saglik: ['Tam tahıllı olduğu için beyaz ekmeğe göre lif oranı daha yüksektir.', 'Lif, uzun süre tok kalmaya yardımcı olur.'],
      glutenIcerir: true,
    }),
    urun({
      id: 'cavdar', ad: 'Çavdar Ekmeği', kategori: 'ekmek',
      kisa: 'Koyu renkli, yoğun dokulu çavdar ekmeği.',
      aciklama: 'Çavdar unuyla hazırlanan, koyu renkli ve yoğun dokulu bir ekmektir. Uzun süre taze kalır.',
      icerik: ['Çavdar unu', 'Buğday unu', 'Su', 'Tuz', 'Maya'],
      lezzet: 'Hafif ekşimsi, yoğun ve doyurucu.',
      saglik: ['Çavdar, lif bakımından zengin bir tahıldır.'],
      glutenIcerir: true,
    }),
    urun({
      id: 'misir', ad: 'Mısır Ekmeği', kategori: 'ekmek',
      kisa: 'Karadeniz usulü, sarı mısır unundan.',
      aciklama: 'Karadeniz sofralarının klasiği; doğal, yerli mısır unuyla taş fırında pişirilir.',
      icerik: ['Mısır unu', 'Su', 'Tuz'],
      lezzet: 'Hafif tatlımsı, kendine has mısır aromalı.',
      saglik: [],
      glutenIcerir: null,
    }),
    urun({
      id: 'gumushane', ad: 'Gümüşhane Ekmeği', kategori: 'ekmek', onecikan: true,
      kisa: 'Ekşi mayalı köy ekmeği.',
      aciklama: 'Gümüşhane usulü, ekşi mayayla hazırlanan iri ve kalın kabuklu köy ekmeği. Uzun süre taze kalır.',
      icerik: ['Buğday unu', 'Ekşi maya', 'Su', 'Tuz'],
      lezzet: 'Çıtır kabuklu, içi yumuşak ve aromalı.',
      saglik: [],
      glutenIcerir: true,
    }),
    urun({
      id: 'siyez', ad: 'Siyez Buğdaylı Ekmek', kategori: 'ekmek', onecikan: true,
      kisa: 'Anadolu’nun kadim buğdayı siyezle.',
      aciklama: 'Binlerce yıllık bir buğday türü olan siyezin unuyla hazırlanır.',
      icerik: ['Siyez unu', 'Su', 'Tuz', 'Maya'],
      lezzet: 'Hafif cevizimsi, aromalı ve tok.',
      saglik: ['Siyez, kepeğiyle öğütüldüğünde lif bakımından zengin bir undur.', 'Siyez de bir buğday türüdür ve glüten içerir.'],
      glutenIcerir: true,
    }),
    urun({
      id: 'tahilli', ad: 'Çok Tahıllı Ekmek', kategori: 'ekmek',
      kisa: 'Tahıl ve tohumlarla bezenmiş tam tahıllı ekmek.',
      aciklama: 'Farklı tahıl ve tohumların bir araya geldiği, dokulu bir ekmek.',
      icerik: ['Buğday unu', 'Tahıl ve tohum karışımı', 'Su', 'Tuz', 'Maya'],
      lezzet: 'Çıtır tohumlu, zengin aromalı.',
      saglik: ['Tohum ve tahıllar ekmeğin lif içeriğini artırır.'],
      glutenIcerir: true,
    }),
    urun({
      id: 'grecka', ad: 'Greçka Ekmeği', kategori: 'ekmek',
      kisa: 'Karabuğday (greçka) unuyla.',
      aciklama: 'Karabuğday, yani greçka unuyla hazırlanan, kendine özgü renkte ve tatta bir ekmek.',
      icerik: ['Karabuğday (greçka) unu', 'Buğday unu', 'Su', 'Tuz', 'Maya'],
      lezzet: 'Topraksı, hafif fındıksı bir aroma.',
      saglik: ['Karabuğday lif bakımından zengindir.'],
      glutenIcerir: true, // buğday unu da içerir
    }),
    urun({
      id: 'karakilcik', ad: 'Karakılçık Buğday Ekmeği', kategori: 'ekmek', onecikan: true,
      gunler: ['sali'], // Instagram: "Salı gününe özel"
      kisa: 'Salı gününe özel, karakılçık buğdayından.',
      aciklama: 'Anadolu’nun yerel buğday çeşitlerinden karakılçıkla hazırlanan, haftada yalnızca salı günü çıkan ekmeğimiz.',
      icerik: ['Karakılçık buğday unu'],
      lezzet: 'Koyu renkli, aromalı ve tok.',
      glutenIcerir: true,
    }),
    urun({
      id: 'kabakli-misir', ad: 'Kabaklı Mısır Ekmeği', kategori: 'ekmek',
      kisa: 'Kabakla hazırlanan mısır ekmeği.',
      aciklama: 'Mısır unu ve kabakla hazırlanan, taş fırında pişen yöresel mısır ekmeği.',
      icerik: ['Mısır unu', 'Kabak'],
      lezzet: 'Hafif tatlımsı, nemli ve yumuşak.',
      glutenIcerir: null,
    }),

    // ——— KETELER ———
    urun({
      id: 'kete-hashasli', ad: 'Haşhaşlı Kete', kategori: 'kete', onecikan: true,
      kisa: 'Ev yapımı, kat kat haşhaşlı kete.',
      aciklama: 'Ev usulü açılan hamurun arasına haşhaş ezmesi sürülerek hazırlanır, taş fırında kızarana kadar pişer.',
      icerik: ['Buğday unu', 'Haşhaş', 'Tereyağı'],
      lezzet: 'Hafif tatlı, haşhaş aromalı, kat kat.',
      glutenIcerir: true,
    }),
    urun({
      id: 'kete-pazili', ad: 'Pazılı Kete', kategori: 'kete',
      kisa: 'Karadeniz pazısıyla, ev yapımı.',
      aciklama: 'Karadeniz’in pazısıyla hazırlanan iç harcı, ev usulü hamurla buluşur.',
      icerik: ['Buğday unu', 'Pazı', 'Soğan'],
      lezzet: 'Tuzlu, yeşillik aromalı, doyurucu.',
      glutenIcerir: true,
    }),
    urun({
      id: 'kete-tahinli', ad: 'Tahinli Kete', kategori: 'kete', onecikan: true,
      kisa: 'Tahinli, susamlı ev ketesi.',
      aciklama: 'Ev usulü açılan hamura tahin sürülüp sarılır, üzerine susam serpilerek taş fırında pişirilir.',
      icerik: ['Buğday unu', 'Tahin', 'Susam'],
      lezzet: 'Tahin aromalı, hafif tatlı, kat kat.',
      glutenIcerir: true,
    }),
    urun({
      id: 'kete-cevizli', ad: 'Cevizli / Fındıklı Kete', kategori: 'kete',
      kisa: 'Ceviz ya da fındıkla, ev yapımı.',
      aciklama: 'Ev usulü hamur, ceviz ya da Karadeniz fındığıyla zenginleştirilerek taş fırında pişirilir.',
      icerik: ['Buğday unu', 'Ceviz veya fındık'],
      lezzet: 'Kıtır, kuruyemiş aromalı.',
      glutenIcerir: true,
    }),
    urun({
      id: 'kete-tereyagli', ad: 'Tereyağlı Unlu Kete', kategori: 'kete',
      kisa: 'Klasik Karadeniz ketesi.',
      aciklama: 'Tereyağı ve unla hazırlanan iç harcıyla, kat kat açılan klasik Karadeniz ketesi.',
      icerik: ['Buğday unu', 'Tereyağı'],
      lezzet: 'Yumuşak, tereyağı kokulu, hafif tuzlu.',
      glutenIcerir: true,
    }),

    // ——— KURABİYE & DİĞER LEZZETLER ———
    urun({
      id: 'meyveli-kurabiye', ad: 'Meyveli Kurabiye', kategori: 'lezzet',
      kisa: 'Yoğurtlu, üzümlü ve fındıklı ev kurabiyesi.',
      aciklama: 'Yoğurtlu hamuruna üzüm ve fındık katılarak hazırlanan, ev usulü meyveli kurabiye.',
      icerik: ['Buğday unu', 'Yoğurt', 'Üzüm', 'Fındık'],
      lezzet: 'Tatlı, meyveli, ağızda dağılan.',
      glutenIcerir: true,
    }),
    urun({
      id: 'acibadem', ad: 'Acıbadem Kurabiyesi', kategori: 'lezzet',
      kisa: 'Klasik acıbadem kurabiyesi.',
      aciklama: 'Badem ve yumurta akıyla hazırlanan, dışı çıtır içi yumuşak klasik kurabiye.',
      icerik: ['Badem', 'Şeker', 'Yumurta akı'],
      lezzet: 'Bademli, tatlı, hafif acımsı.',
      glutenIcerir: null,
    }),
    urun({
      id: 'beypazari-urunleri', ad: 'Beypazarı Ürünleri', kategori: 'lezzet',
      kisa: 'Ev yapımı erişte, makarna ve kuru çeşitleri.',
      aciklama: 'Beypazarı’nın ev yapımı erişte, makarna ve kurularından seçtiğimiz paketli ürünler.',
      icerik: [],
      lezzet: 'Ev yapımı tadında.',
      glutenIcerir: null,
    }),
    urun({
      id: 'peksimet', ad: 'Peksimet', kategori: 'lezzet',
      kisa: 'Tuzsuz, iki kez pişirilmiş peksimet.',
      aciklama: 'Fırında iki kez pişirilerek kurutulan, tuz eklenmeden hazırlanan, uzun süre saklanabilen çıtır ekmek.',
      icerik: ['Buğday unu'],
      lezzet: 'Çıtır, hafif.',
      glutenIcerir: true,
    }),
    urun({
      id: 'kurutulmus-cavdar', ad: 'Kurutulmuş Çavdar', kategori: 'lezzet',
      kisa: 'Fırında kurutulmuş çavdar ekmeği.',
      aciklama: 'Çavdar ekmeğinin fırında kurutulmuş, çıtır hali.',
      icerik: ['Çavdar unu'],
      lezzet: 'Çıtır, yoğun çavdar aromalı.',
      saglik: ['Çavdar, lif bakımından zengin bir tahıldır.'],
      glutenIcerir: true,
    }),
    urun({
      id: 'pazili-borek', ad: 'Pazılı Börek', kategori: 'lezzet',
      kisa: 'Pazı iç harçlı börek.',
      aciklama: 'Karadeniz pazısıyla hazırlanan, taş fırında pişen börek.',
      icerik: ['Buğday unu', 'Pazı', 'Soğan'],
      lezzet: 'Tuzlu, yeşillik aromalı.',
      glutenIcerir: true,
    }),
  ],

  // Yayın öncesi tamamlanacaklar (README'de de listelidir; sitede görünmez).
  eksikler: [
    'Gerçek çalışma saatleri (hafta içi ve cumartesi)',
    'Hangi ürünün hangi günler çıktığı (şimdilik yalnızca karakılçık salı olarak işli; diğerleri her gün)',
    'WhatsApp numarası',
    'Eksik ürün fotoğrafları: kurutulmuş çavdar, pazılı börek, cevizli ve tereyağlı kete',
    'Her ürünün içerik ve sağlık bilgisinin fırından doğrulanması',
    'Köy, yulaf ve arpa ekmeği hâlâ yapılıyor mu? (logoda geçiyor)',
  ],
};
