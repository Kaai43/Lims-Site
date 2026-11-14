import { pathToFileURL } from 'node:url';

import { criarPrisma, type Db } from '../codigo-fonte/banco.js';

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

  // Remove eventos fictícios anteriores, caso ainda existam em bancos locais.
  await db.evento.deleteMany({
    where: { slug: { in: ['mostra-projetos-lims-2026', 'lancamento-your-student-space'] } },
  });

  const eventos = [
    {
      slug: 'seminova-2026-teresina-info',
      titulo: 'SEMINOVA 2026 — V Teresina Info, II FEPICE e I IdeiaLab',
      descricao:
        'Semana de Inovação promovida pelo IFPI — Campus Teresina Central, reunindo o V Teresina Info, a II Feira Piauiense de Ciências e Engenharia (FEPICE) e o I IdeiaLab em palestras, oficinas tecnológicas, mostras científicas e desafios de inovação.',
      data: new Date('2026-10-06T08:00:00-03:00'),
      local: 'IFPI — Campus Teresina Central · Teresina, PI',
      linkUrl: 'https://seminova2026.com.br/',
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

// Comparação via pathToFileURL: concatenar "file://" com process.argv[1] gera
// "file://C:/..." no Windows, enquanto import.meta.url é "file:///C:/...".
// A comparação antiga nunca era verdadeira e o seed saía em silêncio, deixando
// o banco com as tabelas criadas e nenhuma linha.
const executadoDireto =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (executadoDireto) {
  const url = process.env.DATABASE_URL ?? 'file:./banco-de-dados/dev.db';
  const db = criarPrisma(url);
  popularBanco(db)
    .then(() => db.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    });
}
