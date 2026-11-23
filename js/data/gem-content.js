/* PHY-SIM — Konten Materi 2: Gelombang Elektromagnetik */

export const TEMA = "Gelombang Elektromagnetik";

export const sections = [
  {
    id: "a",
    title: "A. Perambatan Gelombang Elektromagnetik",
    short: "Perambatan GEM",
    html: `
    <div class="mat">
      <h4 class="signature">Hipotesis Maxwell</h4>
      <p><strong>James Clerk Maxwell</strong> menyatukan teori kelistrikan dan kemagnetan melalui empat
      persamaan fundamental dan mengajukan gagasan kunci:</p>
      <ol>
        <li>Perubahan medan magnetik menimbulkan medan listrik induksi (<strong>Hukum Faraday</strong>).</li>
        <li>Perubahan medan listrik (<em>arus pergeseran Maxwell</em>) menimbulkan medan magnetik induksi (<strong>Hukum Ampere–Maxwell</strong>).</li>
      </ol>
      <p>Ketika muatan listrik dipercepat atau berosilasi, perubahan medan listrik $\\vec{E}$ dan medan magnet
      $\\vec{B}$ saling membangkitkan secara terus-menerus dan merambat di ruang hampa sebagai
      <strong>gelombang elektromagnetik</strong>.</p>

      <h4 class="signature">Pembuktian Eksperimen Heinrich Hertz</h4>
      <p><strong>Heinrich Hertz</strong> membuktikan hipotesis Maxwell secara eksperimental menggunakan rangkaian
      osilator celah bola logam pemancar (<em>transmitter</em>) dan kumparan cincin penerima
      (<em>receiver</em>). Percikan bunga api pada pemancar memicu loncatan bunga api pada penerima tanpa kontak
      kabel, sekaligus membuktikan bahwa gelombang tersebut merambat dengan kecepatan cahaya dan mengalami
      pemantulan, pembiasan, interferensi, serta polarisasi.</p>

      <h4 class="signature">Sifat-Sifat Gelombang Elektromagnetik</h4>
      <ol>
        <li>Merupakan <strong>gelombang transversal</strong>, dengan arah getar medan listrik $\\vec{E}$, arah getar medan magnet $\\vec{B}$, dan arah rambat gelombang $\\vec{v}$ saling tegak lurus satu sama lain ($\\vec{E}\\perp\\vec{B}\\perp\\vec{v}$). Arah rambat ditentukan kaidah tangan kanan perkalian vektor $\\vec{E}\\times\\vec{B}$.</li>
        <li>Dapat merambat di <strong>ruang hampa</strong> tanpa memerlukan medium zat perantara.</li>
        <li>Tidak memiliki muatan listrik sehingga <strong>tidak dibelokkan</strong> oleh medan listrik maupun medan magnet luar.</li>
        <li>Mengalami peristiwa pemantulan (<em>refleksi</em>), pembiasan (<em>refraksi</em>), perpaduan (<em>interferensi</em>), pelenturan (<em>difraksi</em>), dan pengutuban (<em>polarisasi</em>).</li>
      </ol>

      <h4 class="signature">Persamaan Cepat Rambat &amp; Gelombang Sinusoidal GEM</h4>
      <p>Cepat rambat gelombang elektromagnetik di ruang hampa:</p>
      <div class="eq-banner">$$c = \\frac{1}{\\sqrt{\\mu_0\\,\\varepsilon_0}} \\approx 3\\times10^{8}\\ \\text{m/s}$$</div>
      <p>dengan permeabilitas ruang hampa $\\mu_0 = 4\\pi\\times10^{-7}\\ \\text{Wb/A·m}$ dan permitivitas ruang
      hampa $\\varepsilon_0 = 8{,}85\\times10^{-12}\\ \\text{C}^{2}\\!\\!/\\text{N·m}^{2}$. Pada medium dengan
      permeabilitas $\\mu$ dan permitivitas $\\varepsilon$, cepat rambatnya menjadi
      $v = \\dfrac{1}{\\sqrt{\\mu\\,\\varepsilon}} = \\dfrac{c}{n}$, dengan $n$ = indeks bias medium.</p>
      <p>Hubungan panjang gelombang, frekuensi, serta perbandingan amplitudo kedua medan:</p>
      <div class="eq-banner">$$c = \\lambda f, \\qquad \\frac{E_{\\max}}{B_{\\max}} = c$$</div>
      <p>Medan listrik berosilasi pada sumbu-$y$, medan magnet pada sumbu-$z$, keduanya merambat searah sumbu-$x$
      positif:</p>
      <div class="eq-banner">$$E(x,t) = E_{\\max}\\sin(kx-\\omega t), \\qquad B(x,t) = B_{\\max}\\sin(kx-\\omega t)$$</div>
      <ul>
        <li>Bilangan gelombang $k = \\dfrac{2\\pi}{\\lambda}$ &nbsp;•&nbsp; frekuensi sudut $\\omega = 2\\pi f$.</li>
      </ul>
    </div>

    <div class="panel panel-cyan mt-2">
      <span class="panel-label">Simulasi 4 — Visualisasi Gelombang Elektromagnetik 3D</span>
      <div data-sim="gem3d" data-h="420"></div>
      <p class="sim-caption">Proyeksi isometrik 3D: panah vektor $\\vec{E}$ berosilasi vertikal, panah $\\vec{B}$ horizontal, keduanya sefase dan merambat maju sepanjang sumbu-$x$. Panel kanan menghitung $B_{\\max} = E_{\\max}/c$ dan $\\lambda = c/f$.</p>
    </div>
    `,
  },
  {
    id: "b",
    title: "B. Spektrum Gelombang Elektromagnetik",
    short: "Spektrum GEM",
    html: `
    <div class="mat">
      <h4 class="signature">Prinsip Pengurutan Spektrum</h4>
      <p>Spektrum gelombang elektromagnetik mencakup rentang radiasi yang sangat luas. Seluruh jenis gelombang
      merambat di ruang hampa dengan kecepatan sama ($c = 3\\times10^{8}\\ \\text{m/s}$), tetapi berbeda dalam
      <strong>panjang gelombang ($\\lambda$)</strong>, <strong>frekuensi ($f$)</strong>, dan
      <strong>energi foton ($E$)</strong> menurut persamaan kuantum Planck:</p>
      <div class="eq-banner">$$E = h f = \\frac{h c}{\\lambda}$$</div>
      <p>dengan konstanta Planck $h = 6{,}63\\times10^{-34}\\ \\text{J·s}$.</p>

      <h4 class="signature">Karakteristik 7 Zona Spektrum (Frekuensi Rendah → Tinggi)</h4>
      <ol>
        <li><strong>Gelombang Radio</strong> ($\\lambda &gt; 1$ m | $f &lt; 3\\times10^{8}$ Hz): dihasilkan rangkaian osilator LC; dipantulkan lapisan ionosfer (AM) atau merambat lurus (FM/TV).</li>
        <li><strong>Gelombang Mikro</strong> ($10^{-3}\\le\\lambda\\le1$ m | $3\\times10^{8}\\le f\\le 3\\times10^{11}$ Hz): dihasilkan tabung <em>magnetron</em> dan <em>klystron</em>; menembus awan/kabut, diserap molekul air.</li>
        <li><strong>Inframerah</strong> ($7\\times10^{-7}\\le\\lambda\\le10^{-3}$ m | $3\\times10^{11}\\le f\\le 4{,}3\\times10^{14}$ Hz): dipancarkan getaran termal semua benda bersuhu di atas $0$ K; membawa efek panas.</li>
        <li><strong>Cahaya Tampak</strong> ($400\\le\\lambda\\le700$ nm | $4{,}3\\times10^{14}\\le f\\le 7{,}5\\times10^{14}$ Hz): satu-satunya spektrum yang merangsang sel kerucut &amp; sel batang retina; terurai menjadi <strong>Me-Ji-Ku-Hi-Bi-Ni-U</strong> (Merah, Jingga, Kuning, Hijau, Biru, Nila, Ungu).</li>
        <li><strong>Sinar Ultraviolet (UV)</strong> ($10^{-8}\\le\\lambda\\le4\\times10^{-7}$ m | $7{,}5\\times10^{14}\\le f\\le 3\\times10^{16}$ Hz): dari radiasi matahari &amp; lampu lucutan merkuri; sebagian besar diserap lapisan ozon ($O_3$).</li>
        <li><strong>Sinar-X</strong> ($10^{-11}\\le\\lambda\\le10^{-8}$ m | $3\\times10^{16}\\le f\\le 3\\times10^{19}$ Hz): dari tumbukan elektron cepat pada target logam berat dalam tabung vakum Rontgen.</li>
        <li><strong>Sinar Gamma</strong> ($\\lambda &lt; 10^{-11}$ m | $f &gt; 3\\times10^{19}$ Hz): dipancarkan inti atom radioaktif tidak stabil dan reaksi nuklir; daya tembus &amp; energi ionisasi terbesar.</li>
      </ol>
    </div>

    <div class="panel panel-cyan mt-2">
      <span class="panel-label">Simulasi 5 — Eksplorator Spektrum Elektromagnetik</span>
      <div data-sim="spektrum" data-h="470"></div>
      <p class="sim-caption">Klik blok spektrum atau geser slider frekuensi logaritmik. Ilustrasi perbandingan ukuran panjang gelombang tersaji pada setiap zona.</p>
    </div>
    `,
  },
  {
    id: "c",
    title: "C. Energi Gelombang Elektromagnetik",
    short: "Energi GEM",
    html: `
    <div class="mat">
      <h4 class="signature">Rapat Energi Listrik $u_E$ dan Rapat Energi Magnetik $u_B$</h4>
      <p>Gelombang elektromagnetik mengangkut energi yang terbagi <strong>sama besar</strong> antara komponen
      medan listrik dan medan magnetnya:</p>
      <div class="eq-banner">$$u_E = \\tfrac{1}{2}\\,\\varepsilon_0 E^{2}, \\qquad u_B = \\frac{B^{2}}{2\\mu_0}$$</div>
      <p>Dengan mensubstitusi $E = cB$ dan $c^{2} = \\dfrac{1}{\\mu_0\\varepsilon_0}$ diperoleh $u_E = u_B$.
      Maka <strong>rapat energi total sesaat ($u$)</strong> dan <strong>rapat energi rata-rata
      ($\\bar{u}$)</strong> dalam satuan $\\text{J/m}^{3}$:</p>
      <div class="eq-banner">$$u = u_E + u_B = \\varepsilon_0 E^{2} = \\frac{B^{2}}{\\mu_0}, \\qquad
      \\bar{u} = \\tfrac{1}{2}\\varepsilon_0 E_{\\max}^{2} = \\frac{B_{\\max}^{2}}{2\\mu_0}$$</div>

      <h4 class="signature">Vektor Poynting $\\vec{S}$ dan Intensitas Gelombang $I$</h4>
      <p>Laju aliran energi per satuan waktu per satuan luas bidang yang tegak lurus arah rambat dinyatakan
      oleh <strong>vektor Poynting</strong>:</p>
      <div class="eq-banner">$$\\vec{S} = \\frac{1}{\\mu_0}\\left(\\vec{E}\\times\\vec{B}\\right) \\quad (\\text{W/m}^{2})$$</div>
      <p><strong>Intensitas gelombang</strong> $I$ adalah nilai rata-rata besar vektor Poynting selama satu periode:</p>
      <div class="eq-banner">$$I = \\bar{S} = \\frac{E_{\\max}B_{\\max}}{2\\mu_0}
      = \\frac{E_{\\max}^{2}}{2\\mu_0 c} = \\frac{c\\,B_{\\max}^{2}}{2\\mu_0} = c\\,\\bar{u}$$</div>

      <h4 class="signature">Hukum Kuadrat Terbalik untuk Sumber Isotropis</h4>
      <p>Jika pemancar berdaya radiasi $P$ ($\\text{Watt}$) memancarkan gelombang seragam ke segala arah membentuk
      muka gelombang bola berjari-jari $r$, intensitas radiasi yang diterima pada jarak $r$ memenuhi:</p>
      <div class="eq-banner">$$I = \\frac{P}{4\\pi r^{2}}$$</div>
    </div>

    <div class="panel panel-cyan mt-2">
      <span class="panel-label">Simulasi 6 — Kalkulator &amp; Visualisasi Intensitas Energi GEM</span>
      <div data-sim="intensitas" data-h="420"></div>
      <p class="sim-caption">Geser daya pemancar $P$ dan jarak sensor $r$. Mesir fluks energi pada muka gelombang bola merenggang saat $r$ membesar (hukum kuadrat terbalik), sementara $\\bar{u}$, $I$, $E_{\\max}$, dan $B_{\\max}$ dihitung otomatis.</p>
    </div>
    `,
  },
  {
    id: "d",
    title: "D. Pemanfaatan Gelombang Elektromagnetik",
    short: "Pemanfaatan GEM",
    html: `
    <div class="mat"><p>Enam kartu eksplorasi berurutan mengikuti susunan materi dari energi tertinggi hingga
    terendah. Klik tiap kartu untuk membuka rincian pemanfaatannya.</p></div>

    <div class="acc open" data-acc>
      <button class="acc-head">1. Sinar Gamma dan Sinar X <span class="arrow">▶</span></button>
      <div class="acc-body mat">
        <p><strong>Pemanfaatan Sinar Gamma:</strong></p>
        <ul>
          <li><em>Bidang Medis:</em> terapi radiasi (<em>radioterapi</em> dan <em>Gamma Knife</em>) untuk menghancurkan jaringan sel kanker tanpa pembedahan terbuka, serta sterilisasi peralatan bedah dan obat-obatan yang tidak tahan panas.</li>
          <li><em>Bidang Industri &amp; Pertanian:</em> mendeteksi keretakan pada sambungan las logam berat (<em>industrial radiography</em>), mengukur ketebalan pelat baja otomatis, dan teknik pemuliaan tanaman melalui mutasi terkendali.</li>
        </ul>
        <p><strong>Pemanfaatan Sinar X:</strong></p>
        <ul>
          <li><em>Bidang Medis:</em> pencitraan struktur tulang, pemeriksaan gigi, pendeteksian kelainan paru-paru (radiografi konvensional), serta pemindaian organ dalam tiga dimensi melalui <strong>CT-Scan</strong> (<em>Computed Tomography</em>).</li>
          <li><em>Bidang Keamanan &amp; Sains:</em> pemindai isi koper di bandara/pelabuhan tanpa membuka kemasan, dan analisis struktur kisi kristal material (<em>X-Ray Diffraction</em> / XRD).</li>
        </ul>
        <div class="info-box warn-box"><span class="box-tag">Proteksi Radiasi</span>
          <p style="margin:0">Karena bersifat mengionisasi jaringan sel hidup, penggunaan sinar gamma dan sinar X
          memerlukan pelindung timbal ($\\text{Pb}$) atau dinding beton tebal serta pembatasan dosis paparan.</p>
        </div>
      </div>
    </div>

    <div class="acc" data-acc>
      <button class="acc-head">2. Sinar Ultraviolet (UV) <span class="arrow">▶</span></button>
      <div class="acc-body mat"><ul>
        <li><em>Kesehatan &amp; Biologi:</em> membantu sintesis provitamin D menjadi vitamin D pada kulit dalam dosis sinar matahari pagi yang aman, serta terapi fototerapi penyakit kulit tertentu.</li>
        <li><em>Sterilisasi &amp; Sanitasi:</em> lampu UV-C mensterilkan ruang operasi rumah sakit, peralatan laboratorium, dan sistem pemurnian air minum karena mampu merusak DNA bakteri dan virus.</li>
        <li><em>Keamanan &amp; Perbankan:</em> mendeteksi tanda air (<em>watermark</em>) dan benang pengaman berpendar (<em>fluoresensi</em>) pada uang kertas, paspor, dan dokumen resmi.</li>
      </ul></div>
    </div>

    <div class="acc" data-acc>
      <button class="acc-head">3. Cahaya Tampak <span class="arrow">▶</span></button>
      <div class="acc-body mat"><ul>
        <li><em>Penglihatan &amp; Pencahayaan:</em> memungkinkan indra penglihatan mengamati bentuk dan warna benda, serta menjadi sumber energi utama fotosintesis tumbuhan hijau.</li>
        <li><em>Teknologi Laser</em> (<em>Light Amplification by Stimulated Emission of Radiation</em>): pembacaan cakram optik (CD/DVD/Blu-ray), pemotongan dan pengelasan logam presisi, pembedahan mata (LASIK), pemindai <em>barcode</em> di kasir.</li>
        <li><em>Komunikasi Serat Optik</em> (<em>Fiber Optic</em>): pengiriman sinyal data internet berkecepatan tinggi melalui pulsa cahaya di dalam inti kaca dengan prinsip pemantulan sempurna.</li>
      </ul></div>
    </div>

    <div class="acc" data-acc>
      <button class="acc-head">4. Inframerah <span class="arrow">▶</span></button>
      <div class="acc-body mat"><ul>
        <li><em>Elektronik &amp; Kontrol Jarak Jauh:</em> remote control televisi, pendingin ruangan (AC), sensor jarak dan garis pada robotika.</li>
        <li><em>Pencitraan Termal</em> (<em>Thermal Imaging</em>): kamera inframerah (<em>night vision</em>) mendeteksi pancaran panas tubuh dalam kegelapan total — dipakai pemantauan keamanan, pencarian korban bencana, dan deteksi titik panas pada instalasi listrik industri.</li>
        <li><em>Kesehatan &amp; Spektroskopi:</em> lampu inframerah untuk fisioterapi melancarkan peredaran darah dan meredakan nyeri otot; spektroskopi inframerah mengidentifikasi gugus fungsi senyawa kimia.</li>
      </ul></div>
    </div>

    <div class="acc" data-acc>
      <button class="acc-head">5. Gelombang Mikro <span class="arrow">▶</span></button>
      <div class="acc-body mat"><ul>
        <li><em>Pemanas Microwave Oven:</em> gelombang mikro pada frekuensi sekitar $2{,}45\\ \\text{GHz}$ menggetarkan molekul dipol air di dalam makanan sehingga panas dihasilkan merata dari bagian dalam.</li>
        <li><em>Sistem RADAR</em> (<em>Radio Detection and Ranging</em>): memancarkan pulsa gelombang mikro untuk mendeteksi posisi, jarak, arah, dan kecepatan pesawat, kapal, serta prakiraan cuaca. Penentuan jarak dihitung dengan $s = \\dfrac{c\\,\\Delta t}{2}$.</li>
        <li><em>Komunikasi Satelit &amp; Nirkabel:</em> menghubungkan stasiun bumi dengan satelit geostasioner (gelombang mikro menembus ionosfer tanpa dipantulkan), serta menjadi tulang punggung jaringan Wi-Fi dan seluler 4G/5G.</li>
      </ul></div>
    </div>

    <div class="acc" data-acc>
      <button class="acc-head">6. Gelombang Radio <span class="arrow">▶</span></button>
      <div class="acc-body mat"><ul>
        <li><em>Penyiaran Radio AM</em> (<em>Amplitude Modulation</em>): frekuensi menengah ($530\\text{--}1600$ kHz) dipantulkan lapisan ionosfer sehingga menjangkau ribuan kilometer melewati lengkungan bumi.</li>
        <li><em>Penyiaran Radio FM</em> (<em>Frequency Modulation</em>) &amp; Televisi: frekuensi tinggi ($88\\text{--}108$ MHz untuk FM) menghasilkan audio jernih dan tahan gangguan cuaca, namun berjangkauan terbatas pada garis pandang (<em>line of sight</em>).</li>
        <li><em>Komunikasi Darurat &amp; Navigasi:</em> <em>walkie-talkie</em>, radio penerbangan dan maritim, serta sistem pelacakan RFID (<em>Radio Frequency Identification</em>).</li>
      </ul></div>
    </div>
    `,
  },
  {
    id: "rangkuman",
    title: "Rangkuman",
    short: "Rangkuman",
    html: `
    <div class="mat"><p>Ringkasan persamaan utama materi <strong>Gelombang Elektromagnetik</strong>:</p></div>
    <div class="table-wrap mb-2">
      <table class="brutal">
        <thead><tr><th>Persamaan</th><th>Keterangan</th><th>Satuan SI</th></tr></thead>
        <tbody>
          <tr><td>$c=\\dfrac{1}{\\sqrt{\\mu_0\\varepsilon_0}}\\approx3\\times10^{8}\\ \\text{m/s}$</td><td>Cepat rambat GEM di ruang hampa</td><td>$\\text{m/s}$</td></tr>
          <tr><td>$c=\\lambda f$</td><td>Hubungan cepat rambat, panjang gelombang, frekuensi</td><td>$\\text{m/s}$</td></tr>
          <tr><td>$\\dfrac{E_{\\max}}{B_{\\max}}=c$</td><td>Perbandingan amplitudo medan listrik &amp; magnet</td><td>$\\text{V/m}$ per $\\text{T}$</td></tr>
          <tr><td>$E=hf=\\dfrac{hc}{\\lambda}$</td><td>Energi foton; $h=6{,}63\\times10^{-34}\\ \\text{J·s}$</td><td>$\\text{J}$</td></tr>
          <tr><td>$u=\\varepsilon_0E^{2}=\\dfrac{B^{2}}{\\mu_0}$</td><td>Rapat energi total sesaat ($u_E=u_B$)</td><td>$\\text{J/m}^{3}$</td></tr>
          <tr><td>$\\bar{u}=\\tfrac12\\varepsilon_0E_{\\max}^{2}=\\dfrac{B_{\\max}^{2}}{2\\mu_0}$</td><td>Rapat energi total rata-rata</td><td>$\\text{J/m}^{3}$</td></tr>
          <tr><td>$\\vec{S}=\\tfrac{1}{\\mu_0}(\\vec{E}\\times\\vec{B})$</td><td>Vektor Poynting (laju aliran energi)</td><td>$\\text{W/m}^{2}$</td></tr>
          <tr><td>$I=\\dfrac{E_{\\max}B_{\\max}}{2\\mu_0}=\\dfrac{E_{\\max}^{2}}{2\\mu_0c}=c\\,\\bar{u}$</td><td>Intensitas gelombang</td><td>$\\text{W/m}^{2}$</td></tr>
          <tr><td>$I=\\dfrac{P}{4\\pi r^{2}}$</td><td>Hukum kuadrat terbalik untuk sumber isotropis</td><td>$\\text{W/m}^{2}$</td></tr>
          <tr><td>$s=\\dfrac{c\\,\\Delta t}{2}$</td><td>Jarak objek pada RADAR (Δt = selang pantul)</td><td>$\\text{m}$</td></tr>
        </tbody>
      </table>
    </div>
    <div class="mat"><p>Matriks ringkasan tujuh zona spektrum (frekuensi rendah → tinggi):</p></div>
    <div class="table-wrap">
      <table class="brutal">
        <thead><tr><th>Zona Spektrum</th><th>Rentang $\\lambda$</th><th>Rentang $f$</th><th>Sumber / Pembangkit</th><th>Pemanfaatan Khas</th></tr></thead>
        <tbody>
          <tr><td><b>Gelombang Radio</b></td><td>$\\lambda &gt; 1$ m</td><td>$f &lt; 3\\times10^{8}$ Hz</td><td>Osilator LC</td><td>Radio AM/FM, TV, RFID</td></tr>
          <tr><td><b>Gelombang Mikro</b></td><td>$10^{-3}$–$1$ m</td><td>$3\\times10^{8}$–$3\\times10^{11}$ Hz</td><td>Magnetron, klystron</td><td>Microwave oven, RADAR, satelit, Wi-Fi</td></tr>
          <tr><td><b>Inframerah</b></td><td>$7\\times10^{-7}$–$10^{-3}$ m</td><td>$3\\times10^{11}$–$4{,}3\\times10^{14}$ Hz</td><td>Getaran termal molekul (semua benda $T &gt; 0$ K)</td><td>Remote TV, kamera termal, fisioterapi</td></tr>
          <tr><td><b>Cahaya Tampak</b></td><td>$400$–$700$ nm</td><td>$4{,}3\\times10^{14}$–$7{,}5\\times10^{14}$ Hz</td><td>Kaum elektron dalam atom / transisi tingkat energi</td><td>Penglihatan, fotosintesis, laser, serat optik</td></tr>
          <tr><td><b>Sinar UV</b></td><td>$10^{-8}$–$4\\times10^{-7}$ m</td><td>$7{,}5\\times10^{14}$–$3\\times10^{16}$ Hz</td><td>Radiasi matahari, lampu lucutan merkuri</td><td>Vitamin D, sterilisasi UV-C, cek uang</td></tr>
          <tr><td><b>Sinar-X</b></td><td>$10^{-11}$–$10^{-8}$ m</td><td>$3\\times10^{16}$–$3\\times10^{19}$ Hz</td><td>Tumbukan elektron cepat pada logam berat (tabung Rontgen)</td><td>Radiografi, CT-Scan, XRD</td></tr>
          <tr><td><b>Sinar Gamma</b></td><td>$\\lambda &lt; 10^{-11}$ m</td><td>$f &gt; 3\\times10^{19}$ Hz</td><td>Inti atom radioaktif, reaksi nuklir</td><td>Radioterapi, Gamma Knife, sterilisasi medis</td></tr>
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
    <div class="mat"><p>Dua studi kasus lanjutan yang menghubungkan konsep GEM dengan sains dan lingkungan.</p></div>
    <div class="acc open" data-acc>
      <button class="acc-head">1. Pencitraan Medis: Rontgen &amp; CT-Scan vs MRI <span class="arrow">▶</span></button>
      <div class="acc-body mat">
        <ul>
          <li><strong>Radiografi Sinar-X:</strong> berkas sinar-X tembus dilewatkan pada tubuh; jaringan padat
          (tulang) menyerap lebih banyak foton dibanding jaringan lunak, sehingga bayangan tulang terekam pada
          detektor. Prinsip: penyerapan/daya tembus intensitas $I = I_0\\,e^{-\\mu x}$.</li>
          <li><strong>CT-Scan:</strong> tabung sinar-X berputar mengelilingi tubuh dari banyak sudut; komputer
          merekonstruksi <em>irisan</em> penampang organ dalam tiga dimensi dari ratusan proyeksi daya tembus.</li>
          <li><strong>MRI</strong> (<em>Magnetic Resonance Imaging</em>): <strong>bukan</strong> radiasi pengion.
          Medan magnet kuat menyelaraskan spin inti hidrogen; pulsa <strong>gelombang radio</strong> menggetarkan
          inti; lalu saat pulsa berhenti, inti memancarkan kembali sinyal radio yang terekam sebagai citra jaringan</li>
          <li>Kesimpulan: modalitas berbasis sinar-X unggul untuk struktur padat; MRI unggul untuk jaringan lunak
          (otak, sendi, organ dalam) tetapi lebih mahal dan lama.</li>
        </ul>
      </div>
    </div>
    <div class="acc" data-acc>
      <button class="acc-head">2. Fisika Efek Rumah Kaca (Penyerapan Inframerah) <span class="arrow">▶</span></button>
      <div class="acc-body mat">
        <ul>
          <li>Kestabilan iklim bumi bergantung pada neraca radiasi: permukaan menerima radiasi matahari terutama pada cahaya
          tampak dan inframerah dekat, lalu memancarkan ulang sebagai <strong>inframerah jauh</strong>
          (benda $\\sim288$ K memancarkan $\\lambda \\approx 10\\,\\mu$m).</li>
          <li>Gas atmosfer seperti $\\text{CO}_2$, $\\text{CH}_4$, dan uap air memiliki frekuensi vibrasi
          molekul yang <strong>menyerap radiasi inframerah</strong> keluaran bumi dan memancarkannya kembali
          sebagian ke bumi — inilah efek rumah kaca alami.</li>
          <li>Emisi gas rumah kaca antropogenik menambah kapasitas penyerapan infra merah sehingga suhu rata-rata
          planet naik (pemanasan global).</li>
          <li>Intensitas yang terserap berbanding lurus dengan rapat energi: $I = c\\,\\bar{u}$ — memahami besaran
          intensitas membantu menghitung energi yang terperangkap per satuan luas permukaan.</li>
        </ul>
      </div>
    </div>
    `,
  },
];
