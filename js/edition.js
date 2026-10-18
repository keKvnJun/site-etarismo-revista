/*
 * Estrutura da edição — extraída da Page 3 do Figma (sumário 196:1744,
 * cards da home 194:17090, glossário 194:18266, equipe 194:18335).
 *
 * `teaser`: frase de abertura exibida no card. Só é preenchida quando o texto
 * completo foi obtido do Figma; nas páginas 12–17 o metadata vinha truncado.
 * `photo`: chave da fotografia ilustrativa usada no card (ver PHOTOS).
 */
window.EDITION = {
  order: [
    { id: "editorial",              page: "02", kicker: "Editorial",                                   title: "Quando a idade substitui a competência" },
    { id: "curriculo-elogiado",     page: "04", kicker: "Reportagem · Trabalho e longevidade",          title: "Um currículo elogiado, uma porta fechada",           theme: "Trabalho",  tag: "Trabalho e longevidade",       photo: "franco",  teaser: "Sibele Monice continuava aprendendo e trabalhando." },
    { id: "mercado-muda",           page: "05", kicker: "Reportagem · um país que envelhece",           title: "O mercado muda com o país?",                          theme: "Sociedade", tag: "Um país que envelhece",        photo: "patel",   teaser: "A procura de Sibele acontece em um Brasil que já mudou de idade." },
    { id: "experiencia-custo",      page: "06", kicker: "Reportagem · seleção e negociação",            title: "Quando a experiência vira custo",                     theme: "Trabalho",  tag: "Seleção e negociação",         photo: "gariev",  teaser: "Sibele relatou ouvir que era qualificada demais e que não poderiam pagar o que ela valia." },
    { id: "trabalhar-vaga",         page: "07", kicker: "Reportagem · inserção profissional",           title: "Trabalhar não é o mesmo que ter uma vaga",            theme: "Trabalho",  tag: "Inserção profissional",        photo: "gariev",  teaser: "Em 2024, cerca de um quarto da população brasileira com 60 anos ou mais estava ocupado." },
    { id: "idade-decide",           page: "08", kicker: "Reportagem · antes da entrevista",             title: "A idade pode decidir antes da conversa",              theme: "Trabalho",  tag: "Antes da entrevista",          photo: "franco",  teaser: "A dificuldade narrada por Sibele não se resume a uma impressão sem paralelo na pesquisa." },
    { id: "curriculo-impressiona",  page: "09", kicker: "Reportagem · experiência e reconhecimento",    title: "O currículo impressiona. Por que não abre portas?",   theme: "Trabalho",  tag: "Experiência e reconhecimento", photo: "franco",  teaser: "Sibele dizia nunca ter parado de aprender." },
    { id: "mesma-idade",            page: "10", kicker: "Reportagem · trajetórias desiguais",           title: "A mesma idade, recursos diferentes",                  theme: "Sociedade", tag: "Trajetórias desiguais",        photo: "gariev",  teaser: "O ano de nascimento não conta tudo o que chegou antes dele." },
    { id: "distancia-carreira",     page: "11", kicker: "Reportagem · gênero e oportunidade",           title: "Uma distância que atravessa a carreira",              theme: "Sociedade", tag: "Gênero e oportunidade",        photo: "gariev",  teaser: "Entre 60 e 69 anos, a distância de ocupação entre homens e mulheres era de 21,8 pontos percentuais." },
    { id: "renda-geracoes",         page: "12", kicker: "Reportagem · economia prateada",               title: "A renda que atravessa gerações",                      theme: "Economia",  tag: "Economia prateada",            photo: "patel" },
    { id: "dinheiro-nao-para",      page: "13", kicker: "Reportagem · orçamento compartilhado",         title: "O dinheiro não para em quem o recebe",                theme: "Economia",  tag: "Orçamento compartilhado",      photo: "patel" },
    { id: "dados-permitem",         page: "14", kicker: "Reportagem · participação no consumo",         title: "O que os dados permitem responder",                   theme: "Economia",  tag: "Participação no consumo",      photo: "patel" },
    { id: "aposentadoria",          page: "15", kicker: "Reportagem · proteção de renda",               title: "Aposentadoria não é um detalhe",                      theme: "Economia",  tag: "Proteção de renda",            photo: "gariev" },
    { id: "alternativas-encolhem",  page: "16", kicker: "Reportagem · trabalho, renda e autonomia",     title: "Quando as alternativas encolhem",                     theme: "Direitos",  tag: "Trabalho, renda e autonomia",  photo: "gariev" },
    { id: "mudanca-contrata",       page: "17", kicker: "Reportagem · quem pode mudar a seleção",       title: "A mudança começa em quem contrata",                   theme: "Direitos",  tag: "Quem pode mudar a seleção",    photo: "gariev" },
    { id: "referencias",            page: "18", kicker: "Fontes · autores e evidências",                title: "Referências e notas de apuração" },
    { id: "fontes-legislacao",      page: "19", kicker: "Fontes · dados e direitos",                    title: "Fontes de dados e legislação" },
    { id: "reflexao-final",         page: "20", kicker: "Encerramento · glossário · expediente",        title: "Continuar não pode ser um privilégio" }
  ],

  themes: ["Trabalho", "Sociedade", "Economia", "Direitos"],

  // Arquivos esperados em assets/img/. Enquanto não existirem, o site mostra
  // um bloco neutro com a descrição da imagem (alt original do Figma).
  PHOTOS: {
    franco: { src: "assets/img/retrato-danie-franco.jpg", alt: "Retrato em preto e branco de uma mulher idosa. Fotografia ilustrativa de Danie Franco, Unsplash." },
    patel:  { src: "assets/img/retrato-ravi-patel.jpg",   alt: "Retrato ilustrativo de uma mulher sorrindo, por Ravi Patel." },
    gariev: { src: "assets/img/profissional-vitaly-gariev.jpg", alt: "Fotografia ilustrativa de um profissional maduro usando um computador, por Vitaly Gariev." }
  },

  quickNumbers: [
    { value: "32,1", unit: " milhões", label: "de brasileiros têm 60 anos ou mais", source: "IBGE · Censo 2022", opens: "experiencia-custo" },
    { value: "24,4", unit: "%",        label: "das pessoas 60+ estavam ocupadas", source: "IBGE · PNAD Contínua 2024", opens: "trabalhar-vaga" },
    { value: "43,3", unit: "%",        label: "dos ocupados 60+ eram conta própria", source: "IBGE · PNAD Contínua 2024", opens: "trabalhar-vaga" }
  ],

  population60: [
    { year: "2000", value: 8.7,  kind: "Estimativa" },
    { year: "2023", value: 15.6, kind: "Estimativa" },
    { year: "2070", value: 37.8, kind: "Projeção" }
  ],

  // Somente o termo 01 tem definição visível no Figma; os demais estavam
  // recolhidos e o texto completo não pôde ser extraído.
  glossary: [
    { term: "Etarismo", def: "estereótipos, preconceitos e discriminação relacionados à idade; pode atingir diferentes faixas etárias." },
    { term: "Nível de ocupação", def: null },
    { term: "Trabalho por conta própria", def: null },
    { term: "Economia prateada", def: null },
    { term: "Violência patrimonial", def: null },
    { term: "Autonomia", def: null }
  ],

  team: [
    { name: "Giovanna Medeiros Veloso", initials: "GM", photo: "assets/img/equipe-giovanna.jpg" },
    { name: "Arthur do Vale Silva",     initials: "AV", photo: "assets/img/equipe-arthur.jpg" },
    { name: "Murilo Rosa Fonseca",      initials: "MR", photo: "assets/img/equipe-murilo.jpg" },
    { name: "Kevin Jun",                initials: "KJ", photo: "assets/img/equipe-kevin.jpg" },
    { name: "Davi Dias",                initials: "DD", photo: "assets/img/equipe-davi-dias.jpg" },
    { name: "Davi Alcanfor",            initials: "DA", photo: "assets/img/equipe-davi-alcanfor.jpg" }
  ]
};
