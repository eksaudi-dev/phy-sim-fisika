/* PHY-SIM — Konten Materi 1: Arus Bolak-Balik
   Setiap entri = satu seksi navigasi. HTML memakai $...$ (inline) dan $$...$$ (display)
   yang dirender oleh KaTeX. Kontainer <div data-sim="..."> dirender sebagai simulasi canvas. */

export const TEMA = "Arus Bolak-Balik";

export const sections = [
  {
    id: "a",
    title: "A. Persamaan Arus Bolak Balik",
    short: "Persamaan AC",
    html: `
    <div class="mat">
      <h4 class="signature">Prinsip Pembangkitan Arus Bolak-Balik</h4>
      <p><strong>Arus bolak-balik</strong> <em>(Alternating Current / AC)</em> merupakan arus dan tegangan
      listrik yang besar serta arahnya berubah secara periodik terhadap waktu mengikuti fungsi harmonik
      (sinusoidal). Sumber AC bekerja berdasarkan <strong>hukum induksi elektromagnetik Faraday</strong>:
      ketika sebuah kumparan diputar dengan kecepatan sudut tetap $\\omega$ di dalam medan magnet homogen $B$,
      fluks magnetik yang menembus kumparan berubah secara periodik sehingga timbul gaya gerak listrik (GGL)
      induksi sinusoidal.</p>

      <h4 class="signature">Persamaan Tegangan dan Arus Sesaat</h4>
      <p>Tegangan sesaat $V(t)$ dan arus sesaat $I(t)$ pada selang waktu $t$ dirumuskan sebagai:</p>
      <div class="eq-banner">$$V(t) = V_{\\max}\\sin(\\omega t) \\qquad I(t) = I_{\\max}\\sin(\\omega t + \\varphi)$$</div>
      <ul>
        <li>$V_{\\max}$ dan $I_{\\max}$ = tegangan maksimum ($\\text{V}$) dan arus maksimum ($\\text{A}$) atau amplitudo gelombang,</li>
        <li>$\\omega = 2\\pi f = \\dfrac{2\\pi}{T}$ = frekuensi sudut ($\\text{rad/s}$),</li>
        <li>$f$ = frekuensi sumber AC ($\\text{Hz}$), &nbsp; $T$ = periode gelombang ($\\text{s}$),</li>
        <li>$\\varphi$ = sudut fase awal atau beda fase antara arus dan tegangan ($\\text{rad}$ atau derajat).</li>
      </ul>

      <h4 class="signature">Nilai Efektif (Root Mean Square / RMS)</h4>
      <p>Alat ukur listrik AC (voltmeter AC dan amperemeter AC) tidak membaca nilai sesaat maupun nilai
      maksimum, melainkan <strong>nilai efektif</strong>. Nilai efektif didefinisikan sebagai nilai arus atau
      tegangan searah (DC) yang menghasilkan jumlah energi kalor yang sama pada suatu penghantar dalam selang
      waktu yang sama:</p>
      <div class="eq-banner">$$V_{\\text{ef}} = \\frac{V_{\\max}}{\\sqrt{2}} \\approx 0{,}707\\,V_{\\max} \\qquad I_{\\text{ef}} = \\frac{I_{\\max}}{\\sqrt{2}} \\approx 0{,}707\\,I_{\\max}$$</div>

      <h4 class="signature">Nilai Rata-Rata</h4>
      <p>Karena rata-rata fungsi sinus dalam satu periode penuh bernilai nol, nilai rata-rata dihitung untuk
      <strong>setengah periode</strong> gelombang:</p>
      <div class="eq-banner">$$V_{\\text{rata-rata}} = \\frac{2\\,V_{\\max}}{\\pi} \\approx 0{,}637\\,V_{\\max}, \\qquad I_{\\text{rata-rata}} = \\frac{2\\,I_{\\max}}{\\pi} \\approx 0{,}637\\,I_{\\max}$$</div>

      <h4 class="signature">Pembacaan Osiloskop</h4>
      <div class="info-box"><span class="box-tag">Osiloskop</span>
        <p style="margin:0">Osiloskop menampilkan bentuk gelombang tegangan terhadap waktu.
        Nilai tegangan puncak-ke-puncak $V_{\\text{pp}} = 2V_{\\max}$ diperoleh dari perkalian
        <em>jumlah skala kotak vertikal</em> dengan tombol <strong>Volt/div</strong>, sedangkan periode $T$
        diperoleh dari perkalian <em>jumlah kotak horizontal untuk satu gelombang penuh</em> dengan tombol
        <strong>Time/div</strong>.</p>
      </div>
    </div>

    <div class="panel panel-cyan mt-2">
      <span class="panel-label">Simulasi 1 — Osiloskop Virtual AC</span>
      <div data-sim="osiloskop" data-h="380"></div>
      <p class="sim-caption">Geser slider $V_{\\max}$ dan $f$, tekan <b>Play/Pause</b>, lalu baca panel perhitungan real-time: $V_{\\text{ef}}$, $V_{\\text{pp}}$, $V_{\\text{rata-rata}}$, $\\omega$, dan $T$.</p>
    </div>
    `,
  },
  {
    id: "b",
    title: "B. Karakteristik Rangkaian RLC",
    short: "Karakteristik RLC",
    html: `
    <div class="mat">
      <p>Pada sub-bab ini keempat rangkaian dasar AC dipelajari berurutan. Gunakan navigasi tab di bawah
      untuk berpindah antar-komponen, lalu eksplorasi <strong>Lab Fasor Simulasi&nbsp;2</strong> di bagian
      akhir sensi ini.</p>
    </div>

    <div class="subtabs" data-subtabs="arl-rlc">
      <button class="subtab active" data-sub="r">1. Resistor</button>
      <button class="subtab" data-sub="l">2. Induktor</button>
      <button class="subtab" data-sub="c">3. Kapasitor</button>
      <button class="subtab" data-sub="rlc">4. Rangkaian R&nbsp;L&nbsp;C</button>
    </div>

    <div data-subpanel="arl-rlc">
      <!-- ============ RESISTOR ============ -->
      <div class="mat" data-subid="r">
        <h4 class="signature">Resistor — Rangkaian Resistif Murni</h4>
        <p>Ketika resistor murni dengan hambatan $R$ dihubungkan ke sumber tegangan bolak-balik
        $V(t) = V_{\\max}\\sin(\\omega t)$, tidak terjadi penyimpanan energi dalam bentuk medan magnet maupun
        medan listrik. Berdasarkan <strong>hukum Ohm</strong>, arus sesaat yang mengalir adalah:</p>
        <div class="eq-banner">$$I(t) = \\frac{V(t)}{R} = \\frac{V_{\\max}}{R}\\sin(\\omega t) = I_{\\max}\\sin(\\omega t)$$</div>
        <div class="info-box"><span class="box-tag">Hubungan Fase</span>
          <p style="margin:0">Tegangan dan arus pada resistor berada dalam keadaan <strong>sefase</strong>
          (beda sudut fase $\\varphi = 0^{\\circ}$). Kedua gelombang mencapai titik puncak, titik nol, dan
          titik lembah pada saat yang bersamaan.</p>
        </div>
        <p><strong>Daya disipasi:</strong> seluruh energi listrik diubah menjadi kalor sebesar
        $P = I_{\\text{ef}}^{2}\\,R = V_{\\text{ef}}\\,I_{\\text{ef}}$.</p>
      </div>

      <!-- ============ INDUKTOR ============ -->
      <div class="mat hidden" data-subid="l">
        <h4 class="signature">Induktor — Rangkaian Induktif Murni</h4>
        <p>Induktor ideal berupa kumparan kawat dengan induktansi diri $L$ ($\\text{Henry}$) dan hambatan kawat
        diabaikan ($R \\approx 0$). Ketika dialiri arus AC, perubahan fluks magnetik membangkitkan GGL induksi
        diri $\\varepsilon_L = -L\\dfrac{dI}{dt}$ yang melawan perubahan arus. Jika arus yang mengalir berbentuk
        $I(t) = I_{\\max}\\sin(\\omega t)$, maka tegangan pada ujung-ujung induktor memenuhi:</p>
        <div class="eq-banner">$$V_L(t) = L\\frac{dI}{dt} = \\omega L\\,I_{\\max}\\cos(\\omega t) = V_{\\max}\\sin(\\omega t + 90^{\\circ})$$</div>
        <div class="info-box"><span class="box-tag">Hubungan Fase</span>
          <p style="margin:0">Pada rangkaian induktif murni, <strong>tegangan mendahului arus sebesar
          $90^{\\circ}$ ($\\tfrac{\\pi}{2}$ rad)</strong>, atau arus tertinggal $90^{\\circ}$ terhadap tegangan.</p>
        </div>
        <h4 class="signature">Reaktansi Induktif $X_L$</h4>
        <div class="eq-banner">$$X_L = \\omega L = 2\\pi f L \\quad (\\Omega)$$</div>
        <p>Nilai $X_L$ <strong>berbanding lurus</strong> dengan frekuensi $f$, sehingga induktor sangat menghambat
        arus berfrekuensi tinggi tetapi mudah melewatkan arus DC
        ($f = 0 \\implies X_L = 0$).</p>
      </div>

      <!-- ============ KAPASITOR ============ -->
      <div class="mat hidden" data-subid="c">
        <h4 class="signature">Kapasitor — Rangkaian Kapasitif Murni</h4>
        <p>Kapasitor berkapasitas $C$ ($\\text{Farad}$) yang dihubungkan ke sumber AC
        $V_C(t) = V_{\\max}\\sin(\\omega t)$ akan mengalami proses pengisian dan pengosongan muatan secara
        bergantian. Laju aliran muatan (arus listrik) bernilai paling besar justru ketika tegangan sedang
        melewati titik nol (saat kemiringan kurva tegangan paling curam):</p>
        <div class="eq-banner">$$I(t) = \\frac{dq}{dt} = C\\frac{dV_C}{dt} = \\omega C\\,V_{\\max}\\cos(\\omega t) = I_{\\max}\\sin(\\omega t + 90^{\\circ})$$</div>
        <div class="info-box"><span class="box-tag">Hubungan Fase</span>
          <p style="margin:0">Pada rangkaian kapasitif murni, <strong>arus mendahului tegangan sebesar
          $90^{\\circ}$ ($\\tfrac{\\pi}{2}$ rad)</strong>, atau tegangan tertinggal $90^{\\circ}$ terhadap arus.</p>
        </div>
        <h4 class="signature">Reaktansi Kapasitif $X_C$</h4>
        <div class="eq-banner">$$X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C} \\quad (\\Omega)$$</div>
        <p>Nilai $X_C$ <strong>berbanding terbalik</strong> dengan frekuensi $f$, sehingga kapasitor memblokir
        arus searah DC ($f = 0 \\implies X_C \\rightarrow \\infty$) tetapi mudah melewatkan arus AC
        berfrekuensi tinggi.</p>
      </div>

      <!-- ============ RLC SERI ============ -->
      <div class="mat hidden" data-subid="rlc">
        <h4 class="signature">Rangkaian Seri R-L-C</h4>
        <p>Apabila resistor $R$, induktor $L$, dan kapasitor $C$ dirangkai seri dan dihubungkan ke sumber AC,
        arus pada ketiga komponen memiliki besar dan fase yang sama ($I$), sedangkan tegangan masing-masing
        komponen berbeda fase:</p>
        <ul>
          <li>$V_R = I R$ &mdash; <strong>sefase</strong> dengan arus $I$,</li>
          <li>$V_L = I X_L$ &mdash; <strong>mendahului</strong> arus $I$ sebesar $90^{\\circ}$,</li>
          <li>$V_C = I X_C$ &mdash; <strong>tertinggal</strong> dari arus $I$ sebesar $90^{\\circ}$.</li>
        </ul>
        <p>Karena fasor $V_L$ dan $V_C$ berlawanan arah ($180^{\\circ}$) dan keduanya tegak lurus terhadap $V_R$,
        resultan tegangan total dihitung secara vektor:</p>
        <div class="eq-banner">$$V_{\\text{total}} = \\sqrt{V_R^{2} + (V_L - V_C)^{2}}$$</div>
        <h4 class="signature">Impedansi $Z$</h4>
        <div class="eq-banner">$$Z = \\sqrt{R^{2} + (X_L - X_C)^{2}} \\quad (\\Omega)$$</div>
        <p>dengan $I_{\\text{ef}} = \\dfrac{V_{\\text{ef}}}{Z}$ dan $I_{\\max} = \\dfrac{V_{\\max}}{Z}$.</p>
        <h4 class="signature">Sudut Fase $\\varphi$, Faktor Daya $\\cos\\varphi$, dan Daya Rata-rata</h4>
        <div class="eq-banner">$$\\tan\\varphi = \\frac{V_L - V_C}{V_R} = \\frac{X_L - X_C}{R}, \\qquad
        \\cos\\varphi = \\frac{R}{Z}, \\qquad P = V_{\\text{ef}}\\,I_{\\text{ef}}\\cos\\varphi = I_{\\text{ef}}^{2}R$$</div>
        <div class="info-box tip-box"><span class="box-tag">Tiga Sifat Rangkaian Seri R-L-C</span>
          <ol style="margin:12px 0 4px 20px">
            <li><strong>Bersifat induktif</strong> ($X_L > X_C$): tegangan total mendahului arus ($\\varphi > 0^{\\circ}$).</li>
            <li><strong>Bersifat kapasitif</strong> ($X_C > X_L$): arus mendahului tegangan total ($\\varphi < 0^{\\circ}$).</li>
            <li><strong>Bersifat resistif</strong> ($X_L = X_C$): tegangan dan arus sefase ($\\varphi = 0^{\\circ}$).</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="panel panel-cyan mt-2">
      <span class="panel-label">Simulasi 2 — Lab Fasor &amp; Rangkaian RLC</span>
      <div class="subtabs" data-simtabs="fasor">
        <button class="subtab active" data-stab="r">1. Resistor</button>
        <button class="subtab" data-stab="l">2. Induktor</button>
        <button class="subtab" data-stab="c">3. Kapasitor</button>
        <button class="subtab" data-stab="rlc">4. Rangkaian R L C</button>
      </div>
      <div data-sim="fasor" data-h="420"></div>
      <p class="sim-caption">Panel kiri: diagram fasor berputar (arah lengan = fase). Panel kanan: proyeksi titik ujung fasor menjadi gelombang sinusoidal real-time.</p>
    </div>
    `,
  },
  {
    id: "c",
    title: "C. Resonansi Rangkaian",
    short: "Resonansi",
    html: `
    <div class="mat">
      <h4 class="signature">Pengertian &amp; Syarat Resonansi</h4>
      <p><strong>Resonansi listrik</strong> pada rangkaian seri RLC terjadi ketika frekuensi sumber AC
      menyebabkan nilai reaktansi induktif tepat sama dengan reaktansi kapasitif:</p>
      <div class="eq-banner">$$X_L = X_C$$</div>

      <h4 class="signature">Penurunan Rumus Frekuensi Resonansi $f_r$</h4>
      <div class="eq-banner">$$2\\pi f_r L = \\frac{1}{2\\pi f_r C} \\implies f_r^{2} = \\frac{1}{4\\pi^{2}LC}
      \\quad\\Longrightarrow\\quad f_r = \\frac{1}{2\\pi\\sqrt{LC}}$$</div>
      <h4 class="signature">Dampak Kondisi Resonansi terhadap Rangkaian</h4>
      <ol>
        <li>Impedansi mencapai nilai minimum sama dengan hambatan murni resistor: $Z_{\\min} = \\sqrt{R^{2} + 0^{2}} = R$.</li>
        <li>Arus yang mengalir mencapai nilai <strong>maksimum</strong>: $I_{\\max} = \\dfrac{V}{R}$.</li>
        <li>Rangkaian bersifat murni <strong>resistif</strong> dengan $\\varphi = 0^{\\circ}$ dan faktor daya maksimum $\\cos\\varphi = 1$.</li>
        <li>Ketajaman kurva resonansi (faktor kualitas $Q$) bergantung pada nilai $R$: semakin <strong>kecil</strong> $R$, semakin <strong>tinggi dan runcing</strong> puncak arus resonansinya.</li>
      </ol>
    </div>

    <div class="panel panel-cyan mt-2">
      <span class="panel-label">Simulasi 3 — Kurva Resonansi Seri RLC</span>
      <div data-sim="resonansi" data-h="420"></div>
      <p class="sim-caption">Atur $L$, $C$, dan $R$, lalu geser slider frekuensi $f$ hingga titik indikator bergerak tepat ke puncak kurva ($X_L = X_C$). Saat tercapai, puncak kurva menyala hijau dan panel ringkasan sifat resonansi muncul.</p>
    </div>
    `,
  },
  {
    id: "rangkuman",
    title: "Rangkuman",
    short: "Rangkuman",
    html: `
    <div class="mat">
      <p>Tabel berikut merangkum seluruh persamaan penting materi <strong>Arus Bolak-Balik</strong>
      beserta keterangan simbol dan satuan SI-nya.</p>
    </div>
    <div class="table-wrap">
      <table class="brutal">
        <thead><tr><th>Persamaan</th><th>Keterangan Simbol</th><th>Satuan SI</th></tr></thead>
        <tbody>
          <tr><td>$V(t)=V_{\\max}\\sin(\\omega t)$</td><td>Tegangan sesaat; $V_{\\max}$ = amplitudo tegangan</td><td>$\\text{V}$</td></tr>
          <tr><td>$I(t)=I_{\\max}\\sin(\\omega t+\\varphi)$</td><td>Arus sesaat; $\\varphi$ = beda fase arus–tegangan</td><td>$\\text{A}$</td></tr>
          <tr><td>$\\omega = 2\\pi f = \\dfrac{2\\pi}{T}$</td><td>Frekuensi sudut; $f$ = frekuensi, $T$ = periode</td><td>$\\text{rad/s}$</td></tr>
          <tr><td>$V_{\\text{ef}}=\\dfrac{V_{\\max}}{\\sqrt2}\\approx0{,}707\\,V_{\\max}$</td><td>Nilai efektif tegangan (dibaca voltmeter AC)</td><td>$\\text{V}$</td></tr>
          <tr><td>$I_{\\text{ef}}=\\dfrac{I_{\\max}}{\\sqrt2}\\approx0{,}707\\,I_{\\max}$</td><td>Nilai efektif arus (dibaca amperemeter AC)</td><td>$\\text{A}$</td></tr>
          <tr><td>$V_{\\text{rr}}=\\dfrac{2\\,V_{\\max}}{\\pi}\\approx0{,}637\\,V_{\\max}$</td><td>Nilai rata-rata tegangan (setengah periode)</td><td>$\\text{V}$</td></tr>
          <tr><td>$X_L=\\omega L=2\\pi f L$</td><td>Reaktansi induktif; berbanding lurus dengan $f$</td><td>$\\Omega$</td></tr>
          <tr><td>$X_C=\\dfrac{1}{\\omega C}=\\dfrac{1}{2\\pi f C}$</td><td>Reaktansi kapasitif; berbanding terbalik dengan $f$</td><td>$\\Omega$</td></tr>
          <tr><td>$Z=\\sqrt{R^{2}+(X_L-X_C)^{2}}$</td><td>Impedansi total rangkaian seri RLC</td><td>$\\Omega$</td></tr>
          <tr><td>$\\tan\\varphi=\\dfrac{X_L-X_C}{R}$</td><td>Sudut fase rangkaian; $\\varphi&gt;0$ induktif, $\\varphi&lt;0$ kapasitif</td><td>$^{\\circ}$ atau rad</td></tr>
          <tr><td>$\\cos\\varphi=\\dfrac{R}{Z}$</td><td>Faktor daya rangkaian</td><td>tanpa satuan</td></tr>
          <tr><td>$P=V_{\\text{ef}}I_{\\text{ef}}\\cos\\varphi=I_{\\text{ef}}^{2}R$</td><td>Daya rata-rata sesungguhnya rangkaian RLC</td><td>$\\text{Watt}$</td></tr>
          <tr><td>$f_r=\\dfrac{1}{2\\pi\\sqrt{LC}}$</td><td>Frekuensi resonansi; syarat $X_L = X_C$</td><td>$\\text{Hz}$</td></tr>
        </tbody>
      </table>
    </div>
    `,
  },
  {
    id: "pengayaan",
    title: "Pengayaan",
    short: "Pengayaan",
    html: `
    <div class="mat"><p>Dua studi kasus interaktif di bawah ini menunjukkan penerapan langsung konsep
    reaktansi, impedansi, dan resonansi pada teknologi sehari-hari.</p></div>

    <div class="acc open" data-acc>
      <button class="acc-head">1. Rangkaian Penala Frekuensi Radio (Radio Tuner LC) <span class="arrow">▶</span></button>
      <div class="acc-body mat">
        <p>Antena radio menerima <em>seluruh</em> gelombang stasiun yang ada di udara sekaligus. Agar hanya satu
        stasiun yang tersalur ke penguat sinyal, rangkaian <strong>LC paralel</strong> dipakai sebagai penyaring
        frekuensi (<em>tuner</em>):</p>
        <ul>
          <li>Kumparan $L$ tetap, sedangkan kapasitor variabel $C$ diputar untuk mengubah kapasitansi.</li>
          <li>Rangkaian dipilih agar beresonansi pada frekuensi stasiun: $f_r = \\dfrac{1}{2\\pi\\sqrt{LC}}$.</li>
          <li>Pada frekuensi resonansi, rangkaian paralel menawarkan impedansi <strong>maksimum</strong> sehingga hanya sinyal pada $f_r$ yang menerima tegangan terbesar; stasiun lain diredam.</li>
          <li>Contoh: menala stasiun FM 100 MHz pada $L = 1\\,\\mu\\text{H}$ membutuhkan $C \\approx 2{,}5\\,\\text{pF}$.</li>
        </ul>
        <p>Ketika kamu memutar kenop radio analog, kamu sesungguhnya sedang menggeser frekuensi resonansi
        $f_r$ melintasi deretan frekuensi stasiun yang diterima antena.</p>
      </div>
    </div>

    <div class="acc" data-acc>
      <button class="acc-head">2. Prinsip Kerja Detektor Logam (Metal Detector) <span class="arrow">▶</span></button>
      <div class="acc-body mat">
        <p><em>Metal detector</em> (pengeras suara pintu gerbang, alat pencari harta karun, pemeriksa bagasi)
        terdiri dari kumparan besar yang merupakan bagian dari rangkaian osilator LC:</p>
        <ul>
          <li>Kumparan pemancar menimbulkan <strong>medan magnet bolak-balik</strong> berfrekuensi tetap (umumnya puluhan kHz).</li>
          <li>Logam di dekat kumparan bekerja seperti induktor pendek yang menangkap fluks berubah-ubah tersebut; menurut <strong>hukum Faraday</strong>, timbul arus eddy (arus pusar) di dalam logam.</li>
          <li>Arus eddy ini membangkitkan medan magnet <strong>balasan</strong> yang mengubah induktansi efektif kumparan penerima, sehingga frekuensi resonansi dan impedansi rangkaian berubah.</li>
          <li>Perubahan itu terdeteksi elektronik, dikuatkan, lalu diubah menjadi nada sirine — logam diketahui ada tanpa kontak langsung.</li>
          <li>Ukuran dan jenis logam menentukan kuat-lemahnya gangguan: logam feromagnetik (besi) memberi respons paling besar.</li>
        </ul>
      </div>
    </div>
    `,
  },
];
