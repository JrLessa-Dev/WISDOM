// Constants
// FORM_CONFIG: Objeto de configuração para a validação dos campos do formulário.
// Define regras como obrigatoriedade, comprimento mínimo/máximo, padrões (regex) e mensagens de erro.
const FORM_CONFIG = {
    fields: {
        name: {
            required: true,
            minLength: 2,
            // Mensagem de erro para o campo nome.
            error: 'Por favor, insira seu nome completo (mínimo 2 caracteres).',
            // Validação: verifica se o valor tem pelo menos duas palavras e um comprimento mínimo de 2 caracteres.
            validate: value => value.trim().split(' ').length >= 2 && value.trim().length >= 2
        },
        company: {
            required: false, // Campo opcional
            minLength: 2,
            error: 'Por favor, insira o nome da empresa (mínimo 2 caracteres).',
            // Validação: o campo é válido se estiver vazio ou se o valor tiver pelo menos 2 caracteres.
            validate: value => !value || value.trim().length >= 2
        },
        email: {
            required: true,
            // Padrão regex para validação de e-mail.
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            error: 'Por favor, insira um e-mail válido.',
            // Validação: testa o valor contra o padrão regex e verifica o comprimento máximo.
            validate: value => FORM_CONFIG.fields.email.pattern.test(value) && value.length <= 100
        },
        phone: {
            required: false, // Campo opcional, sua obrigatoriedade pode mudar dinamicamente.
            // O padrão regex é atualizado para refletir o que a validação *limpa* aceita (10 ou 11 dígitos numéricos).
            // Se este padrão for usado no HTML, ele deve corresponder ao valor limpo.
            pattern: /^\d{10,11}$/, 
            error: 'Por favor, insira um telefone válido com 10 ou 11 dígitos (ex: 21998408406 ou (21) 99840-8406).', // Mensagem de erro mais clara
            validate: value => {
                if (!value) return true; // Se o campo não é obrigatório e está vazio, é válido.
                const cleanedValue = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos.
                // Valida se o valor limpo (apenas números) tem 10 ou 11 dígitos (padrão brasileiro).
                return cleanedValue.length === 10 || cleanedValue.length === 11;
            }
        },
        contactMethod: {
            required: true,
            error: 'Por favor, selecione um método de contato.',
            // Validação: verifica se o valor selecionado é uma das opções permitidas.
            validate: value => ['email', 'phone', 'both'].includes(value)
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500,
            error: 'Por favor, insira uma mensagem entre 10 e 500 caracteres.',
            // Validação: verifica se o comprimento do valor está dentro dos limites.
            validate: value => value.trim().length >= 10 && value.trim().length <= 500
        },
        captcha: {
            required: true,
            value: 'WISDOM', // O valor correto do CAPTCHA.
            error: 'Por favor, insira o código correto ("WISDOM").',
            // Validação: verifica se o valor inserido (após remover espaços e converter para maiúsculas) corresponde ao valor esperado.
            validate: value => value.trim().toUpperCase() === 'WISDOM'
        }
    },
    debounceDelay: 300 // Atraso em milissegundos para a função debounce.
};

// KNOWLEDGE_BASE: Base de conhecimento para o chatbot, organizada por categorias.
// Cada categoria contém perguntas (chaves) e respostas possíveis (arrays de strings).
const KNOWLEDGE_BASE = {
    industria_geral: {
        'o que é uma indústria': ['É uma atividade econômica que transforma matéria-prima em produtos acabados ou semielaborados.'],
        'quais são os três setores da indústria': ['Indústria de base, de bens de consumo duráveis e de bens de consumo não duráveis.'],
        'o que é a revolução industrial': ['Um período de grandes mudanças tecnológicas e sociais iniciado no século XVIII, marcando o uso de máquinas nas fábricas.'],
        'qual foi a principal inovação da primeira revolução industrial': ['A máquina a vapor.'],
        'qual é o principal objetivo da indústria': ['Produzir bens ou serviços com eficiência para atender às necessidades do mercado.'],
        'o que é matéria-prima': ['Substância natural que será transformada em um produto.'],
        'o que é produção em massa': ['É a fabricação em grande escala de produtos padronizados.'],
        'qual é a diferença entre indústria pesada e leve': ['A pesada transforma matérias-primas em grandes volumes; a leve fabrica bens de consumo.'],
        'quais são os setores industriais': ['Primário, secundário e terciário.'],
        'o que é indústria de transformação': ['É o setor que transforma matérias-primas em produtos acabados.']
    },
    industria_4_0: {
        'o que é indústria 4.0': ['É a automação e troca de dados nas tecnologias de manufatura com uso de IoT, IA e robótica.'],
        'quais são os pilares da indústria 4.0': ['IoT, Big Data, Inteligência Artificial, Computação em Nuvem, Robótica e Impressão 3D.'],
        'o que é iot na indústria': ['Internet das Coisas: conexão entre máquinas, sensores e sistemas.'],
        'qual é o papel da inteligência artificial na indústria 4.0': ['Otimizar processos e tomar decisões com base em dados.'],
        'o que é manutenção preditiva': ['Monitoramento de máquinas para prever falhas antes que ocorram.'],
        'o que significa fábrica inteligente': ['Uma planta industrial automatizada, conectada e autônoma.'],
        'como a realidade aumentada é usada na indústria': ['Para manutenção, treinamento e visualização de processos.'],
        'o que é digital twin': ['Réplica digital de um processo ou produto físico para simulações.'],
        'como a indústria 4.0 impacta o trabalhador': ['Requer novas competências e habilidades digitais.'],
        'qual a diferença entre indústria 3.0 e 4.0': ['A 3.0 trouxe automação; a 4.0 traz integração inteligente entre máquinas e dados.']
    },
    processos_industriais: {
        'o que é linha de produção': ['Sistema de produção onde o produto passa por várias etapas sequenciais.'],
        'o que é just-in-time': ['Sistema que produz conforme a demanda, sem excesso de estoque.'],
        'o que é célula de produção': ['Grupo de máquinas organizadas para fabricar produtos com mais flexibilidade.'],
        'qual o objetivo do controle de qualidade': ['Garantir que o produto final atenda aos padrões estabelecidos.'],
        'o que é automação industrial': ['Uso de sistemas e equipamentos automáticos para executar processos.'],
        'qual a importância da logística industrial': ['Organizar o transporte e armazenamento de matérias-primas e produtos.'],
        'o que é layout industrial': ['Organização física dos setores e máquinas de uma fábrica.'],
        'o que é eficiência produtiva': ['Capacidade de produzir com menor desperdício e maior rendimento.'],
        'o que é desperdício na produção': ['Tudo que não agrega valor ao produto final.'],
        'o que são sistemas integrados de gestão': ['Softwares que unem todas as áreas da empresa em um só sistema.']
    },
    sustentabilidade_industrial: {
        'o que é sustentabilidade na indústria': ['Produção que respeita o meio ambiente e os recursos naturais.'],
        'o que é economia circular': ['Modelo que reaproveita resíduos e prolonga o ciclo de vida dos produtos.'],
        'como a indústria pode reduzir impactos ambientais': ['Investindo em tecnologias limpas e reciclagem.'],
        'o que é pegada de carbono': ['Quantidade de CO₂ emitida em uma atividade ou produto.'],
        'qual a importância da iso 14001': ['Norma que orienta sobre gestão ambiental nas empresas.'],
        'o que são resíduos industriais': ['Subprodutos ou sobras do processo de fabricação.'],
        'como a água é usada na indústria': ['Para resfriamento, limpeza e em processos químicos.'],
        'o que é produção mais limpa': ['Estratégia para reduzir o uso de recursos e resíduos.'],
        'como a indústria contribui para o desenvolvimento sustentável': ['Criando produtos mais duráveis e com menor impacto ambiental.'],
        'o que é responsabilidade socioambiental': ['Ações da empresa em prol do meio ambiente e da sociedade.']
    },
    seguranca_e_qualidade: {
        'o que é epi': ['Equipamento de Proteção Individual.'],
        'o que é epc': ['Equipamento de Proteção Coletiva.'],
        'qual é o objetivo da cipa': ['Prevenir acidentes e doenças do trabalho.'],
        'o que é nr-12': ['Norma sobre segurança no trabalho em máquinas e equipamentos.'],
        'o que é ergonomia industrial': ['Adaptação do trabalho às características do trabalhador.'],
        'o que é um acidente de trabalho': ['Evento que ocorre durante a jornada e causa dano ao trabalhador.'],
        'o que é gestão da qualidade': ['Conjunto de práticas para manter e melhorar padrões de qualidade.'],
        'o que significa iso 9001': ['Norma internacional sobre gestão da qualidade.'],
        'o que é auditoria de qualidade': ['Avaliação dos processos para garantir que atendem aos requisitos.'],
        'o que é uma não conformidade': ['Quando algo não atende aos padrões ou normas estabelecidas.']
    },
    tipos_de_industria: {
        'o que produz a indústria têxtil': ['Tecidos e vestuário.'],
        'qual é o foco da indústria automobilística': ['Fabricação de veículos e seus componentes.'],
        'o que faz a indústria petroquímica': ['Derivados do petróleo, como plásticos e solventes.'],
        'o que é indústria farmacêutica': ['Produz medicamentos e produtos de saúde.'],
        'o que é indústria alimentícia': ['Processa e embala alimentos e bebidas.'],
        'o que é indústria metalúrgica': ['Transforma metais em produtos e peças.'],
        'o que é indústria de base': ['Fornece insumos para outras indústrias, como aço e cimento.'],
        'o que é indústria de bens duráveis': ['Produz itens com longa vida útil, como eletrodomésticos.'],
        'o que é indústria de bens não duráveis': ['Produz itens de consumo rápido, como alimentos e cosméticos.'],
        'o que é indústria de alta tecnologia': ['Empresas que usam ciência avançada, como microchips e robótica.']
    },
    logistica_e_suprimentos: {
        'o que é cadeia de suprimentos': ['Conjunto de etapas que leva o produto do fornecedor ao consumidor.'],
        'o que é logística reversa': ['Processo de devolução e reaproveitamento de produtos.'],
        'o que é lead time': ['Tempo total entre o pedido e a entrega de um produto.'],
        'o que é estoque mínimo': ['Quantidade mínima que deve ser mantida para evitar rupturas.'],
        'o que é kanban': ['Sistema visual para controlar o fluxo de produção e estoque.'],
        'o que é mrp': ['Planejamento de necessidades de materiais.'],
        'o que é fornecedor': ['Empresa ou pessoa que fornece matéria-prima ou insumos.'],
        'o que é transporte intermodal': ['Uso de diferentes modais (rodoviário, ferroviário, marítimo) para transportar carga.'],
        'o que é armazenagem': ['Atividade de guardar e conservar produtos ou materiais.'],
        'o que é roteirização': ['Definição do melhor caminho para entrega de produtos.']
    },
    inovacao_e_tendencias: {
        'o que é impressão 3d': ['Técnica de fabricar objetos camada por camada a partir de um modelo digital.'],
        'o que é manufatura aditiva': ['Outro nome para impressão 3D.'],
        'o que é big data industrial': ['Análise de grandes volumes de dados para otimizar processos.'],
        'o que é blockchain na indústria': ['Tecnologia usada para garantir rastreabilidade e segurança de dados.'],
        'o que é computação em nuvem': ['Armazenamento e processamento de dados pela internet.'],
        'o que é cibersegurança industrial': ['Proteção dos sistemas industriais contra ataques digitais.'],
        'o que é robótica colaborativa': ['Robôs que trabalham lado a lado com humanos.'],
        'o que é customização em massa': ['Produzir em larga escala com variações conforme desejo do cliente.'],
        'o que é fábrica modular': ['Unidade produtiva que pode ser adaptada e movida com facilidade.'],
        'o que é produtividade industrial': ['Relação entre o que se produz e os recursos utilizados.']
    },
    curiosidades_e_cultura_industrial: {
        'qual é o maior parque industrial do brasil': ['O de São Paulo.'],
        'qual foi a primeira indústria do brasil': ['A de tecidos, no século XIX.'],
        'o que é parque fabril': ['Conjunto de indústrias de uma região ou país.'],
        'qual país é líder mundial em produção industrial': ['A China.'],
        'qual é a importância da indústria para a economia': ['Gera empregos, riqueza e inovação.'],
        'o que é reindustrialização': ['Processo de recuperação ou modernização do setor industrial.'],
        'qual é a função de um engenheiro industrial': ['Planejar, supervisor e otimizar processos produtivos.'],
        'o que é manufatura enxuta': ['Filosofia de produção que busca eliminar desperdícios.'],
        'o que é o conceito de chão de fábrica': ['Área onde ocorre a produção efetiva da indústria.']
    },
    questoes_finais: {
        'o que é benchmarking industrial': ['Comparação de práticas com empresas líderes para melhorar o desempenho.'],
        'o que é análise de custos industriais': ['Estudo dos gastos de produção para melhorar a rentabilidade.'],
        'o que é produtividade por trabalhador': ['Produção média gerada por cada colaborador.'],
        'o que é engenharia de produção': ['Área que integra conhecimento técnico e gerencial para otimizar processos.'],
        'o que é layout funcional': ['Organização por função ou tipo de máquina.'],
        'o que é qualidade total': ['Filosofia de excelência contínua em todas as áreas da empresa.'],
        'o que é tempo de ciclo': ['Tempo necessário para concluir uma operação ou produção.'],
        'o que é rastreabilidade industrial': ['Capacidade de seguir o histórico de um produto desde a origem.'],
        'o que é integração vertical': ['Quando a empresa controla todas as etapas do processo produtivo.'],
        'o que é terceirização na indústria': ['Contratação de serviços de outras empresas para executar certas atividades.']
    },
    default: ['Que pergunta interessante! Reflita: quais impactos? Que ângulos novos?', 'Fascinante! Explore efeitos ou alternativas. Mais detalhes?']
};

// REFLECTIVE_QUESTIONS: Perguntas reflexivas para estimular a interação do usuário.
// São usadas em conjunto com as respostas da base de conhecimento.
const REFLECTIVE_QUESTIONS = {
    industria_geral: [
        'Como esse conceito impacta a eficiência da sua operação industrial?',
        'De que forma você pode aplicar isso na sua indústria?'
    ],
    industria_4_0: [
        'Como a adoção dessas tecnologias pode transformar sua produção?',
        'Quais desafios você prevê ao implementar essas inovações?'
    ],
    processos_industriais: [
        'Como esse processo pode ser otimizado na sua operação atual?',
        'Que benefícios você espera ao adotar essa prática?'
    ],
    sustentabilidade_industrial: [
        'Como essa prática pode contribuir para a sustentabilidade da sua empresa?',
        'Que medidas você já toma para alinhar sua operação a esses princípios?'
    ],
    seguranca_e_qualidade: [
        'Como você garante que esses padrões sejam aplicados na sua organização?',
        'Que impactos a segurança e qualidade têm na sua operação?'
    ],
    tipos_de_industria: [
        'Como esse setor pode se alinhar aos objetivos da sua empresa?',
        'Quais inovações nesse tipo de indústria você considera mais promissoras?'
    ],
    logistica_e_suprimentos: [
        'Como otimizar essa área pode melhorar sua cadeia de suprimentos?',
        'Que desafios você enfrenta na logística da sua operação?'
    ],
    inovacao_e_tendencias: [
        'Como essa tendência pode ser integrada à sua estratégia de inovação?',
        'Que oportunidades essa tecnologia oferece para seu negócio?'
    ],
    curiosidades_e_cultura_industrial: [
        'Como essa informação pode inspirar melhorias na sua indústria?',
        'De que forma o contexto histórico influencia sua visão sobre a indústria?'
    ],
    questoes_finais: [
        'Como essa prática pode elevar a competitividade da sua empresa?',
        'Que estratégias você usa para implementar esses conceitos?'
    ],
    default: [
        'Quais implicações isso pode ter para sua operação?',
        'Como você pode explorar esse tema para melhorar seus processos?'
    ]
};

// SENSITIVE_KEYWORDS: Palavras-chave sensíveis que ativam respostas específicas do chatbot.
// Inclui perguntas reflexivas e uma resposta padrão para cada tópico sensível.
const SENSITIVE_KEYWORDS = {
    'religião': {
        questions: [
            'Como diferentes crenças podem influenciar práticas éticas na sua organização?',
            'De que forma a diversidade religiosa pode enriquecer a cultura da sua empresa?',
            'Como você equilibra o respeito às crenças com as políticas organizacionais?'
        ],
        defaultResponse: 'A religião é um tema delicado que envolve crenças pessoais e culturais. É importante promover um ambiente de respeito e inclusão.'
    },
    'ética': {
        questions: [
            'Como você assegura que decisões éticas sejam priorizadas na sua organização?',
            'De que forma os valores éticos impactam a confiança dos seus stakeholders?',
            'Quais dilemas éticos você enfrenta ao implementar práticas industriais?'
        ],
        defaultResponse: 'A ética guia decisões responsáveis, promovendo confiança e sustentabilidade nas operações.'
    },
    'moral': {
        questions: [
            'Como os princípios morais moldam as políticas da sua empresa?',
            'De que forma você promove um ambiente de trabalho baseado em valores morais?',
            'Quais conflitos morais você observa no contexto industrial?'
        ],
        defaultResponse: 'A moral reflete valores que orientam ações justas e respeitosas no ambiente industrial.'
    },
    'sexualidade': {
        questions: [
            'Como sua organização promove um ambiente inclusivo para todas as identidades sexuais?',
            'De que forma políticas de inclusão impactam a cultura da sua empresa?',
            'Como você lida com questões de diversidade sexual no ambiente de trabalho?'
        ],
        defaultResponse: 'A sexualidade é uma dimensão da diversidade humana, e promover inclusão é essencial para um ambiente de trabalho respeitoso.'
    },
    'raça': {
        questions: [
            'Como sua empresa promove a equidade racial em suas práticas e políticas?',
            'De que forma a diversidade racial pode fortalecer a inovação na sua organização?',
            'Quais ações você toma para combater preconceitos raciais no ambiente de trabalho?'
        ],
        defaultResponse: 'A diversidade racial é um pilar para construir equipes mais criativas e inclusivas.'
    },
    'meio ambiente': {
        questions: [
            'Como sua empresa pode liderar iniciativas para proteger o meio ambiente?',
            'Quais impactos ambientais suas operações geram, e como podem ser mitigados?',
            'De que forma você alinha sustentabilidade ambiental com os objetivos da sua empresa?'
        ],
        defaultResponse: 'A proteção ao meio ambiente é essencial para o futuro das indústrias e do planeta.'
    },
    'xenofobia': {
        questions: [
            'Como sua organização promove a inclusão de pessoas de diferentes origens culturais?',
            'De que forma você combate atitudes xenofóbicas no ambiente de trabalho?',
            'Quais benefícios a diversidade cultural traz para sua empresa?'
        ],
        defaultResponse: 'Combater a xenofobia é fundamental para criar um ambiente de trabalho inclusivo e colaborativo.'
    },
    'gênero': {
        questions: [
            'Como sua empresa promove a igualdade de gênero em cargos de liderança?',
            'De que forma a diversidade de gênero impacta a inovação na sua organização?',
            'Quais políticas você adota para garantir um ambiente inclusivo para todos os gêneros?'
        ],
        defaultResponse: 'A igualdade de gênero é essencial para construir equipes equilibradas e inovadoras.'
    }
};

// --- Funções Utilitárias ---

// debounce: Cria uma versão "debounced" de uma função, que só é executada após um certo atraso
// desde a última vez que foi chamada. Útil para eventos como 'input' para evitar execuções excessivas.
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId); // Limpa qualquer timeout anterior.
        timeoutId = setTimeout(() => func.apply(this, args), delay); // Define um novo timeout.
    };
};

// sanitizeHTML: Limpa uma string para evitar ataques de Cross-Site Scripting (XSS).
// Cria um elemento div temporário, define seu textContent (escapando HTML) e retorna seu innerHTML.
const sanitizeHTML = str => {
    const div = document.createElement('div');
    div.textContent = str; // Define o texto, escapando quaisquer tags HTML.
    return div.innerHTML; // Retorna o HTML seguro.
};

// --- Funcionalidades de Navegação ---

// setupNavigation: Configura o comportamento de rolagem suave para links de navegação.
function setupNavigation() {
    // Seleciona todos os links na navegação que apontam para âncoras na mesma página.
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault(); // Previne o comportamento padrão do link (salto instantâneo).
            const targetId = anchor.getAttribute('href').substring(1); // Obtém o ID do elemento alvo (ex: "home" de "#home").
            // Rola suavemente até o elemento alvo.
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Fecha o menu mobile se estiver aberto e a tela for pequena.
            const navLinks = document.getElementById('navLinks');
            if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navLinks.setAttribute('aria-expanded', 'false'); // Atualiza o atributo ARIA para acessibilidade.
            }
        });
    });
}

// setupHeaderScroll: Adiciona/remove uma classe ao cabeçalho com base na posição da rolagem.
// Usado para aplicar estilos diferentes ao cabeçalho quando o usuário rola a página.
function setupHeaderScroll() {
    const header = document.getElementById('header');
    if (header) { // Verifica se o cabeçalho existe.
        window.addEventListener('scroll', () => {
            // Adiciona a classe 'scrolled' se a rolagem vertical for maior que 50px, caso contrário, remove.
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
}

// setupScrollAnimations: Configura animações de elementos quando eles entram na viewport.
// Utiliza Intersection Observer API para detectar quando elementos com a classe 'animate-on-scroll' estão visíveis.
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Adiciona a classe 'visible' para ativar a animação.
            } else {
                // Opcional: remover a classe 'visible' quando o elemento sai da viewport.
                // entry.target.classList.remove('visible'); 
            }
        });
    }, { threshold: 0.1 }); // O callback será executado quando 10% do elemento estiver visível.
    // Observa todos os elementos com a classe 'animate-on-scroll'.
    document.querySelectorAll('.animate-on-scroll').forEach(element => observer.observe(element));
}

// setupMobileMenu: Configura o botão de alternância do menu para dispositivos móveis.
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) { // Verifica se ambos os elementos existem.
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active'); // Alterna a classe 'active' para mostrar/esconder o menu.
            navLinks.setAttribute('aria-expanded', navLinks.classList.contains('active')); // Atualiza ARIA.
        });
    }
}

// setupThemeToggle: Configura o botão para alternar entre temas claro e escuro.
// Salva a preferência do usuário no localStorage.
function setupThemeToggle() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) { // Verifica se o botão de alternância de tema existe.
        themeToggle.addEventListener('click', () => {
            // Determina o novo tema com base no tema atual.
            const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme); // Aplica o novo tema ao body.
            localStorage.setItem('theme', newTheme); // Salva a preferência no localStorage.
        });
        // Aplica o tema salvo no localStorage ao carregar a página.
        if (localStorage.getItem('theme')) {
            body.setAttribute('data-theme', localStorage.getItem('theme'));
        }
    }
}

// setupAccessibilityToggle: Configura o botão de acessibilidade.
// Por enquanto, apenas alterna uma classe no body para indicar o estado de acessibilidade.
function setupAccessibilityToggle() {
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const body = document.body;
    if (accessibilityToggle && body) {
        accessibilityToggle.addEventListener('click', () => {
            // Alterna uma classe no body para que o CSS possa aplicar estilos de acessibilidade.
            body.classList.toggle('accessibility-active');
            // Você pode adicionar mais lógica aqui para:
            // - Abrir um modal com opções de acessibilidade (alto contraste, tamanho da fonte, etc.)
            // - Ativar/desativar funcionalidades de acessibilidade diretamente
            console.log('Botão de acessibilidade clicado! Estado de acessibilidade:', body.classList.contains('accessibility-active'));
            // Exemplo: Salvar preferência de acessibilidade no localStorage
            localStorage.setItem('accessibilityActive', body.classList.contains('accessibility-active'));
        });

        // Carrega o estado de acessibilidade salvo no localStorage ao carregar a página.
        if (localStorage.getItem('accessibilityActive') === 'true') {
            body.classList.add('accessibility-active');
        }
    }
}

// --- Funcionalidade do Chatbot (Wisdom AI) ---

// generateResponse: Gera uma resposta do chatbot com base na mensagem do usuário.
// Prioriza palavras-chave sensíveis e, em seguida, a base de conhecimento.
function generateResponse(message) {
    message = message.toLowerCase().trim(); // Converte a mensagem para minúsculas e remove espaços.

    // 1. Verifica primeiro por palavras-chave sensíveis.
    for (let keyword in SENSITIVE_KEYWORDS) {
        if (message.includes(keyword)) {
            const { questions, defaultResponse } = SENSITIVE_KEYWORDS[keyword];
            // Seleciona uma pergunta reflexiva aleatória do tópico sensível.
            const reflectiveQuestion = questions[Math.floor(Math.random() * questions.length)];

            // Tenta encontrar uma resposta correspondente na KNOWLEDGE_BASE que também contenha a palavra-chave sensível.
            for (let category in KNOWLEDGE_BASE) {
                if (category === 'default') continue; // Ignora a categoria 'default'.
                for (let key in KNOWLEDGE_BASE[category]) {
                    if (message.includes(key)) {
                        const responses = KNOWLEDGE_BASE[category][key];
                        // Seleciona uma resposta aleatória da base de conhecimento.
                        const answer = responses[Math.floor(Math.random() * responses.length)];
                        // Retorna a pergunta reflexiva do tópico sensível combinada com a resposta da base de conhecimento.
                        return `${reflectiveQuestion} ${answer}`;
                    }
                }
            }

            // Se nenhuma correspondência na KNOWLEDGE_BASE for encontrada para a palavra-chave sensível,
            // usa a resposta padrão definida para a palavra-chave sensível.
            return `${reflectiveQuestion} ${defaultResponse}`;
        }
    }

    // 2. Se nenhuma palavra-chave sensível for encontrada, procede com a busca na KNOWLEDGE_BASE.
    for (let category in KNOWLEDGE_BASE) {
        if (category === 'default') continue; // Ignora a categoria 'default'.
        for (let key in KNOWLEDGE_BASE[category]) {
            if (message.includes(key)) {
                const responses = KNOWLEDGE_BASE[category][key];
                // Seleciona uma resposta aleatória.
                const answer = responses[Math.floor(Math.random() * responses.length)];
                // Seleciona uma pergunta reflexiva aleatória da categoria correspondente ou da categoria 'default'.
                const reflectiveQuestions = REFLECTIVE_QUESTIONS[category] || REFLECTIVE_QUESTIONS.default;
                const reflectiveQuestion = reflectiveQuestions[Math.floor(Math.random() * reflectiveQuestions.length)];
                // Retorna a pergunta reflexiva combinada com a resposta da base de conhecimento.
                return `${reflectiveQuestion} ${answer}`;
            }
        }
    }

    // 3. Fallback: Se nenhuma correspondência for encontrada (nem sensível, nem na base de conhecimento),
    // retorna uma resposta padrão e uma pergunta reflexiva da categoria 'default'.
    const defaultResponses = KNOWLEDGE_BASE['default'];
    const defaultQuestions = REFLECTIVE_QUESTIONS['default'];
    return `${defaultQuestions[Math.floor(Math.random() * defaultQuestions.length)]} ${defaultResponses[Math.floor(Math.random() * defaultResponses.length)]}`;
}

// sendMessage: Envia uma mensagem do usuário para o chatbot e exibe a resposta.
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const loading = document.getElementById('loading');
    const messageText = chatInput?.value.trim(); // Optional chaining for safety.

    // Verifica se os elementos essenciais do chat existem.
    if (!chatInput || !chatMessages || !loading) {
        console.error('Elementos do chat não encontrados.');
        return;
    }

    // Validação básica: se a mensagem estiver vazia, marca o input como inválido e sai.
    if (!messageText) {
        chatInput.setAttribute('aria-invalid', 'true');
        return;
    }

    chatInput.setAttribute('aria-invalid', 'false'); // Remove o estado de inválido.

    // Cria e exibe a mensagem do usuário.
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-header"><i class="fas fa-user"></i> Você</div>
        <div class="message-content">${sanitizeHTML(messageText)}</div>
        <div class="message-timestamp">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${new Date().toLocaleDateString('pt-BR')}</div>
    `;
    chatMessages.appendChild(userMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para o final das mensagens.

    loading.style.display = 'block'; // Exibe o indicador de carregamento.

    // Simula uma chamada de API com um atraso de 1 segundo.
    setTimeout(() => {
        loading.style.display = 'none'; // Esconde o indicador de carregamento.
        const response = generateResponse(messageText); // Gera a resposta da IA.

        // Cria e exibe a mensagem da IA.
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message';
        aiMessage.innerHTML = `
            <div class="message-header"><i class="fas fa-robot"></i> Wisdom AI</div>
            <div class="message-content">${sanitizeHTML(response)}</div>
            <div class="message-timestamp">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${new Date().toLocaleDateString('pt-BR')}</div>
        `;
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para o final das mensagens.
        chatInput.value = ''; // Limpa o campo de entrada após o envio.
    }, 1000);
}

// --- Funcionalidades de Validação e Envio de Formulário ---

// validateField: Valida um campo individual do formulário.
// showErrors (parâmetro opcional): Booleano que indica se as mensagens de erro devem ser exibidas.
function validateField(fieldId, value, showErrors = true) {
    const fieldConfig = FORM_CONFIG.fields[fieldId];
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    const confirmationMessageElement = document.getElementById(`${fieldId}ConfirmationMessage`); // Novo elemento para a mensagem de confirmação
    const group = field?.closest('.form-group'); // Usa optional chaining para segurança.

    // Verifica se todos os elementos necessários para a validação do campo foram encontrados.
    if (!field || !errorElement || !group) {
        console.error(`Elementos para o campo ${fieldId} não encontrados.`);
        return false; // Não é possível validar se os elementos estão faltando.
    }

    // Oculta a mensagem de confirmação antes de validar
    if (confirmationMessageElement) {
        confirmationMessageElement.classList.remove('show');
    }

    // Define o texto da mensagem de erro com base na configuração.
    errorElement.textContent = fieldConfig.error;

    let fieldIsValid = true;

    // 1. Validação de campo obrigatório e vazio.
    if (fieldConfig.required && !value.trim()) {
        fieldIsValid = false;
    } 
    // 2. Validação contra a regra específica do campo (pattern, minLength, etc.).
    else if (!fieldConfig.validate(value)) {
        fieldIsValid = false;
    }

    if (!fieldIsValid) {
        if (showErrors) { // Só adiciona a classe 'invalid' e exibe o erro se showErrors for true.
            group.classList.add('invalid');
            errorElement.style.display = 'block';
        } else {
            // Se não for para mostrar erros, apenas garante que não esteja em estado inválido.
            group.classList.remove('invalid');
            errorElement.style.display = 'none';
        }
    } else {
        // Se o campo for válido, remove o estado de inválido e esconde a mensagem de erro.
        group.classList.remove('invalid');
        errorElement.style.display = 'none';
        // Exibe a mensagem de confirmação se o campo for válido e houver um elemento para ela
        if (confirmationMessageElement) {
            confirmationMessageElement.classList.add('show');
        }
    }
    return fieldIsValid;
}

// validateForm: Valida todos os campos do formulário.
// showErrors (parâmetro opcional): Booleano que indica se as mensagens de erro devem ser exibidas.
function validateForm(showErrors = true) {
    let isValid = true;
    const contactMethodSelect = document.getElementById('contactMethod');
    const submitButton = document.getElementById('submitButton');

    // Verifica se os elementos essenciais do formulário foram encontrados.
    if (!contactMethodSelect || !submitButton) {
        console.error('Elementos de formulário essenciais não encontrados.');
        return false;
    }

    const contactMethod = contactMethodSelect.value;

    // Itera sobre todos os campos definidos em FORM_CONFIG.
    for (const fieldId in FORM_CONFIG.fields) {
        // Tratamento especial para o campo de telefone com base no método de contato preferido.
        if (fieldId === 'phone') {
            FORM_CONFIG.fields.phone.required = (contactMethod === 'phone' || contactMethod === 'both');
        }
        
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            // Valida o campo apenas se for obrigatório ou se tiver um valor (para evitar validar campos opcionais vazios).
            // Ou se for um campo opcional que já foi preenchido e agora está sendo modificado.
            const isFieldRequired = FORM_CONFIG.fields[fieldId].required;
            const isFieldFilled = fieldElement.value.trim() !== '';

            if (isFieldRequired || isFieldFilled) {
                 // Chama validateField passando o parâmetro showErrors.
                 if (!validateField(fieldId, fieldElement.value, showErrors)) {
                    isValid = false;
                }
            } else {
                // Para campos opcionais que estão vazios, garante que nenhum estado de inválido seja mostrado.
                const group = fieldElement.closest('.form-group');
                const errorElement = document.getElementById(`${fieldId}Error`);
                const confirmationMessageElement = document.getElementById(`${fieldId}ConfirmationMessage`);
                if (group) group.classList.remove('invalid');
                if (errorElement) errorElement.style.display = 'none';
                if (confirmationMessageElement) confirmationMessageElement.classList.remove('show');
            }
        } else {
            console.warn(`Campo do formulário com ID "${fieldId}" não encontrado.`);
            // Se um elemento de campo obrigatório estiver faltando, o formulário não é válido.
            if (FORM_CONFIG.fields[fieldId].required) {
                isValid = false;
            }
        }
    }
    // Habilita ou desabilita o botão de envio com base na validade geral do formulário.
    submitButton.disabled = !isValid;
    return isValid;
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('contactForm');
    const spinner = document.getElementById('spinner');
    const successModal = document.getElementById('successModal');
    const backButton = document.getElementById('backButton');
    const submissionTime = document.getElementById('submissionTime');
    const submitButton = document.getElementById('submitButton');

    // Verifica se todos os elementos essenciais para o envio do formulário foram encontrados.
    if (!form || !spinner || !successModal || !backButton || !submissionTime || !submitButton) {
        console.error('Elementos de submissão do formulário não encontrados.');
        return;
    }

    form.addEventListener('submit', async e => { // Adicionado 'async' para futuras chamadas de API.
        e.preventDefault(); // Previne o envio padrão do formulário.
        // Re-valida o formulário antes de enviar para capturar quaisquer problemas de última hora.
        if (!validateForm()) {
            console.log('Formulário inválido. Verifique os campos.');
            return;
        }

        // Coleta os dados do formulário.
        const formData = {
            name: document.getElementById('name')?.value.trim(),
            company: document.getElementById('company')?.value.trim(),
            email: document.getElementById('email')?.value.trim(),
            // Limpa o número de telefone antes de enviar (remove caracteres não numéricos).
            phone: document.getElementById('phone')?.value.replace(/\D/g, ''), 
            contactMethod: document.getElementById('contactMethod')?.value,
            message: document.getElementById('message')?.value.trim()
        };

        spinner.style.display = 'block'; // Exibe o spinner de carregamento.
        submitButton.disabled = true; // Desabilita o botão de envio durante o processo.

        try {
            // Simula uma chamada de API com um atraso de 1 segundo.
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            spinner.style.display = 'none'; // Esconde o spinner.
            // Define a hora da submissão no modal de sucesso.
            const time = new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
            submissionTime.textContent = time;
            successModal.classList.add('show'); // Adiciona a classe 'show' para exibir o modal com transição CSS.
            form.reset(); // Limpa todos os campos do formulário.
            // Chama validateForm(false) para limpar os estados de erro sem exibir as mensagens vermelhas.
            validateForm(false); 
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            spinner.style.display = 'none'; // Esconde o spinner em caso de erro.
            submitButton.disabled = false; // Reabilita o botão em caso de erro.
            // Exibe uma mensagem de erro ao usuário (pode ser substituído por um modal customizado).
            alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.'); 
        }
    });

    // Event listener para o botão "Voltar ao Formulário" no modal de sucesso.
    backButton.addEventListener('click', () => {
        successModal.classList.remove('show'); // Remove a classe 'show' para esconder o modal com transição CSS.
        submitButton.disabled = true; // Mantém o botão de envio desabilitado até nova entrada válida.
    });

    // Event listener para o botão "Limpar" do formulário.
    document.getElementById('resetButton')?.addEventListener('click', () => { // Optional chaining para segurança.
        form.reset(); // Reseta os campos do formulário.
        // Chama validateForm(false) para limpar os estados de erro e mensagens de confirmação.
        validateForm(false); 
    });
}

// setupFormInput: Configura o tratamento de entrada para os campos do formulário,
// incluindo validação debounced e formatação específica para o telefone.
function setupFormInput() {
    // Cria uma versão debounced da função validateForm.
    const debouncedValidate = debounce(() => validateForm(true), FORM_CONFIG.debounceDelay); // Passa true para showErrors no debounce.
    for (const fieldId in FORM_CONFIG.fields) {
        const field = document.getElementById(fieldId);
        // Garante que o campo existe antes de adicionar o event listener.
        if (field) {
            // Adiciona o event listener 'input' para validação em tempo real (debounced).
            field.addEventListener('input', debouncedValidate);
            // Adiciona um listener 'blur' para validar imediatamente ao sair do campo.
            field.addEventListener('blur', () => validateField(fieldId, field.value, true));

            // Formatação específica para o campo de telefone.
            if (fieldId === 'phone') {
                field.addEventListener('input', () => {
                    let value = field.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos.

                    // Limita o número total de dígitos para 11 (DDD + 9 dígitos para celular).
                    if (value.length > 11) {
                        value = value.substring(0, 11);
                    }

                    let formattedValue = '';
                    if (value.length > 0) {
                        if (value.length <= 2) { // Ex: 21
                            formattedValue = `(${value}`;
                        } else if (value.length <= 7) { // Ex: (21) 99840 ou (21) 3456
                            formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, value.length)}`;
                        } else if (value.length <= 10) { // Ex: (21) 3456-7890 (telefone fixo)
                            formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6, 10)}`;
                        } else { // Ex: (21) 99840-8406 (celular 9 dígitos)
                            formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
                        }
                    }
                    field.value = formattedValue; // Atualiza o campo de entrada com o valor formatado.
                });
            }
        }
    }
}

// --- Eventos de Teclado ---

// setupKeyEvents: Configura eventos de teclado, como enviar mensagem do chat ao pressionar Enter.
function setupKeyEvents() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton'); // Obtém o botão de envio

    if (chatInput) { // Verifica se chatInput existe antes de adicionar o listener.
        chatInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') sendMessage(); // Envia a mensagem se a tecla Enter for pressionada.
        });
    }
    
    // Adiciona event listener para o botão de envio do chat.
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
}

// --- Inicialização da Aplicação ---

// init: Função de inicialização que chama todas as funções de configuração.
// É executada quando o DOM está completamente carregado.
function init() {
    setupNavigation();
    setupHeaderScroll();
    setupScrollAnimations();
    setupMobileMenu();
    setupThemeToggle();
    setupAccessibilityToggle(); // Nova função de acessibilidade
    setupKeyEvents();
    setupFormInput();
    setupFormSubmission();
    // Validação inicial para definir o estado do botão de envio ao carregar a página.
    // O parâmetro 'false' garante que as mensagens de erro não sejam exibidas no carregamento.
    validateForm(false); 
}

// Adiciona um event listener para garantir que 'init' seja chamada somente quando o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', init);
