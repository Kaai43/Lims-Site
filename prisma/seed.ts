import { criarPrisma, type Db } from '../src/db.js';

export async function popularBanco(db: Db): Promise<void> {
  const pesquisadores = [
    {
      slug: 'fabio-gomes',
      nome: 'Fabio de Jesus Lima Gomes',
      email: 'fabio@ifpi.edu.br',
      formacao: 'Doutorado em Informática na Educação (UFRGS)',
      area: 'Informática na Educação · Sistemas Multimídia',
      fotoUrl: '/imagens/pesquisadores/fabio-gomes.jpeg',
      ordem: 1,
    },
    {
      slug: 'fernando-santana',
      nome: 'Fernando Castelo Branco Gonçalves Santana',
      email: 'fernandosantana@ifpi.edu.br',
      formacao: 'Mestre em Ciência da Computação',
      area: 'Engenharia de Software · Sistemas Embarcados',
      fotoUrl: '/imagens/pesquisadores/fernando-santana.jpeg',
      ordem: 2,
    },
    {
      slug: 'ricardo-ramos',
      nome: 'Ricardo Martins Ramos',
      email: 'ricardo@ifpi.edu.br',
      formacao: 'Doutorado em Genética e Toxicologia Aplicada (ULBRA)',
      area: 'Bioinformática · Pesquisa Aplicada',
      fotoUrl: '/imagens/pesquisadores/ricardo-ramos.jpg',
      ordem: 3,
    },
  ];

  for (const p of pesquisadores) {
    await db.pesquisador.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  const projetos = [
    {
      slug: 'your-student-space',
      titulo: 'Your Student Space',
      resumo: 'Plataforma STEAM gratuita e acessível para estudantes da rede pública.',
      descricao:
        'Plataforma gratuita e acessível desenvolvida no IFPI para incentivar e ampliar a participação de estudantes de escolas públicas em atividades extracurriculares nas áreas STEAM (Ciência, Tecnologia, Engenharia, Artes e Matemática), reunindo as funções Explorar, Informar e Histórias Inspiradoras.',
      categoria: 'steam-educacao',
      status: 'em-andamento',
      anoInicio: 2024,
      instagramUrl: 'https://www.instagram.com/your_student_space/',
      pdfUrl: '/pdf/your-student-space.pdf',
      ordem: 1,
    },
    {
      slug: 'prototipagem-robotica-educacional',
      titulo: 'Prototipagem em Robótica Educacional e Sistemas Embarcados',
      resumo: 'Desenvolvimento de kits abertos e oficinas práticas de robótica e automação no IFPI.',
      descricao:
        'Frente permanente do LIMS voltada à integração entre sensores, atuadores, microcontroladores e interfaces multimídia para ensino de programação, robótica móvel e automação em escolas e campi do IFPI.',
      categoria: 'robotica',
      status: 'em-andamento',
      anoInicio: 2025,
      ordem: 2,
    },
  ];

  for (const pr of projetos) {
    await db.projeto.upsert({
      where: { slug: pr.slug },
      update: pr,
      create: pr,
    });
  }

  const eventos = [
    {
      slug: 'mostra-projetos-lims-2026',
      titulo: 'Mostra de Projetos e Protótipos do LIMS',
      descricao:
        'Apresentação aberta dos projetos de pesquisa em sistemas multimídia, robótica educacional e plataformas STEAM desenvolvidos no laboratório.',
      data: new Date('2026-12-10T14:00:00-03:00'),
      local: 'IFPI — Campus Teresina Central · Laboratório LIMS',
    },
    {
      slug: 'lancamento-your-student-space',
      titulo: 'Apresentação do Projeto Your Student Space',
      descricao:
        'Divulgação institucional da plataforma STEAM voltada a estudantes de escolas públicas.',
      data: new Date('2025-10-15T14:00:00-03:00'),
      local: 'IFPI — Teresina, PI',
      linkUrl: 'https://www.instagram.com/your_student_space/',
    },
  ];

  for (const ev of eventos) {
    await db.evento.upsert({
      where: { slug: ev.slug },
      update: ev,
      create: ev,
    });
  }
}

const executadoDireto = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;
if (executadoDireto) {
  const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
  const db = criarPrisma(url);
  popularBanco(db)
    .then(() => db.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    });
}
