import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | DailyDiction - Gaming Culture Daily',
  description:
    'Mengenal latar belakang, pendiri, tim kreatif, dan ekosistem media digital DailyDiction yang mengulas budaya, kreativitas, dan komunitas di balik video game.',
};

const teamMembers = [
  {
    name: 'Bg Dito',
    role: 'Co-Founder',
    image: '/image/team/dito.png',
    instagram:
      'https://www.instagram.com/ditowangsa?utm_source=ig_web_button_share_sheet&gwpx=ZDNlZDc0MzIxNw==',
  },
  {
    name: 'Bg Rizki',
    role: 'Co-Founder',
    image: '/image/team/rizki.png',
    instagram:
      'https://www.instagram.com/rizki_abdallah?utm_source=ig_web_button_share_sheet&evlk=ZDNlZDc0MzIxNw==',
  },
  {
    name: 'Bg Lendi',
    role: 'Creative Manager',
    image: '/image/team/lendy.png',
    instagram:
      'https://www.instagram.com/letroo_?utm_source=ig_web_button_share_sheet&cnvx=ZDNlZDc0MzIxNw==',
  },
  {
    name: 'Om Albert',
    role: 'Adviser',
    image: '/image/team/albert.png',
    instagram:
      'https://www.instagram.com/albertisk007/?utm_source=ig_web_button_share_sheet',
  },
  {
    name: 'Yasfiro',
    role: 'Project Manager',
    image: '/image/team/firo.png',
    instagram:
      'https://www.instagram.com/yasfiro16?utm_source=ig_web_button_share_sheet&dmpr=ZDNlZDc0MzIxNw==',
  },
  {
    name: 'Omul',
    role: 'Editor',
    image: '/image/team/omul.png',
    instagram:
      'https://www.instagram.com/ooomull?utm_source=ig_web_button_share_sheet&hvrq=ZDNlZDc0MzIxNw==',
  },
];

const contentPillars = [
  {
    code: '01',
    title: 'Gaming Culture & Industry',
    desc: 'Game reviews mendalam, hands-on impressions, preview eksklusif, serta berita terkini industri game lokal maupun global.',
  },
  {
    code: '02',
    title: 'Pop Culture & Fandom',
    desc: 'Membahas budaya pop dan hiburan sebagai bagian dari gaya hidup serta ekosistem komunitas modern.',
  },
  {
    code: '03',
    title: 'Podcast & Developer Talks',
    desc: 'Bincang santai dan diskusi mendalam bersama game developer, publisher, kreator, dan pelaku industri di balik layar.',
  },
  {
    code: '04',
    title: 'Tech & Hardware Insights',
    desc: 'Informasi teknologi, pengujian performa hardware, serta perlengkapan pendukung bagi para gamer dan kreator.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#08080F] text-gray-200 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Bagian 1: Latar Belakang & Pendiri */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Gaming Culture Daily
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFD700] tracking-tight">
              About DailyDiction
            </h1>
          </div>

          <div className="space-y-5 text-base sm:text-[17px] leading-relaxed text-gray-300">
            <p>
              <strong className="text-white">DailyDiction</strong> adalah platform media digital yang berfokus pada dunia{' '}
              <em className="text-gray-200">gaming</em> dan <em className="text-gray-200">pop culture</em>. Mengusung semangat{' '}
              <span className="text-[#FFD700] font-medium">Gaming Culture Daily</span>, kami hadir tidak sekadar menyajikan berita atau ulasan game, tetapi juga mengangkat budaya, kreativitas, dan komunitas yang tumbuh di balik industri video game.
            </p>

            <p>
              Platform ini didirikan oleh <strong className="text-white">Rizki Abdallah</strong> dan{' '}
              <strong className="text-white">Dito Wangsa</strong> dengan memadukan pengalaman panjang di bidang penerbitan, editorial, dan kreasi konten digital. Rizki Abdallah memulai kiprahnya di dunia penulisan dan penerbitan sejak tahun 2003 lewat majalah tokusatsu{' '}
              <em className="text-gray-200">Henshin</em>, lalu membangun media digital <em className="text-gray-200">Republik Sultan</em> dan <em className="text-gray-200">WOR</em> pada tahun 2017. Sementara itu, Dito Wangsa aktif membangun diskusi media game sejak tahun 2018 melalui <em className="text-gray-200">Anaktua</em>, platform yang dikenal lewat <em className="text-gray-200">game reviews</em> dan <em className="text-gray-200">podcast</em> seputar industri game lokal maupun global.
            </p>

            <p>
              Berangkat dari visi bersama kedua pendirinya, DailyDiction berkembang menjadi ruang editorial lintas format yang menghubungkan pembaca dengan berita industri, ulasan mendalam, kurasi fitur, hingga wawancara langsung bersama para kreator dan pengembang game.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Bagian 2: Tim DailyDiction */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Orang-Orang di Balik DailyDiction
            </h2>
            <p className="text-sm text-gray-400">
              Tim kreatif dan editorial yang menggerakkan konten serta komunitas DailyDiction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl bg-[#0E0E1B] border border-white/10 p-7 flex flex-col items-center text-center hover:border-[#FFD700]/60 transition-all duration-300"
              >
                {/* Lingkaran Foto Profil */}
                <div className="w-28 h-28 rounded-full border-2 border-[#FFD700] bg-[#16162A] overflow-hidden flex items-end justify-center mb-4 pt-2 px-2 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Nama & Role */}
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-[#FFD700] mt-0.5 mb-4">
                  {member.role}
                </p>

                {/* Tombol Ikon Instagram */}
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${member.name}`}
                  className="w-8 h-8 rounded-full border border-[#FFD700]/50 flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Bagian 3: Pilar & Ekosistem Konten */}
        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Fokus Editorial &amp; Ekosistem Konten
            </h2>
            <p className="text-sm text-gray-400">
              Menyajikan beragam format cerita melalui situs web, YouTube, Instagram, dan TikTok.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contentPillars.map((item) => (
              <div
                key={item.code}
                className="rounded-xl bg-[#0E0E1B] border border-white/10 p-6 hover:border-[#FFD700]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FFD700]/15 text-[#FFD700]">
                    {item.code}
                  </span>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Bagian 4: Sorotan Komunitas & Event */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-2xl bg-[#0E0E1B] border border-white/10 p-6 sm:p-8">
          <div className="md:col-span-5 flex flex-col justify-center items-start p-6 rounded-xl bg-gradient-to-br from-[#16162A] to-[#0B0B14] border border-white/5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFD700] mb-2">
              Community &amp; Live Experience
            </span>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              IDEAS INTO EXPERIENCES.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Editorial Coverage &bull; Live Podcast &bull; Gaming Events
            </p>
          </div>

          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold text-[#FFD700]">
              Lebih dari Sekadar Media Digital
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Di luar produksi artikel dan video, DailyDiction turut menghadirkan berbagai pengalaman interaktif bersama komunitas. Mulai dari penyelenggaraan <em className="text-white">gaming events</em>, <em className="text-white">live podcast</em>, diskusi industri, hingga kolaborasi kreatif bersama pengembang dan penerbit game.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-sm">
              <a
                href="mailto:business@dailydiction.id"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#FFD700] text-black font-semibold hover:bg-[#e6c200] transition-colors"
              >
                Hubungi Redaksi &amp; Kolaborasi
              </a>
              <span className="text-gray-400">
                business@dailydiction.id
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}