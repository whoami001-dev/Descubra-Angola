import { Province, TouristSpot, BlogPost, Recipe, EventItem, TouristCategory } from "./types";

export const PROVINCES: Province[] = [
  {
    id: "luanda",
    name: "Luanda",
    capital: "Luanda",
    history: "Fundada em 1576 pelo explorador português Paulo Dias de Novais sob o nome de São Paulo de Assunção de Loanda. É a capital do país, centro político, económico e cultural, rica em história colonial e cultura vibrante.",
    location: "Costa Norte de Angola",
    population: "Cerca de 9 milhões de habitantes",
    climate: "Tropical semiárido, com temperatura média anual de 25°C a 28°C.",
    culture: "Berço do Semba e do Kuduro, famosa pelo Carnaval de Luanda e pelas festas da ilha. Rica em museus, galerias de arte e praças históricas.",
    gastronomy: "Mufete (peixe grelhado, feijão de óleo de palma, mandioca, banana-pão cozida e farofa) e Calulu de peixe.",
    mapCoord: { lat: -8.839, lng: 13.2894 },
    image: "/fotos/Luanda/Luanda.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "É uma das cidades mais antigas fundadas por europeus na África Austral.",
      "A Ilha de Luanda não é realmente uma ilha, mas sim uma península de 7 km de comprimento.",
      "O Carnaval de Luanda é o maior evento cultural da província, misturando ritmos tradicionais com sátira social."
    ],
    bestSeason: "Maio a Outubro (época do Cacimbo, com temperaturas mais frescas e sem chuva).",
    hotels: [
      { name: "Epic Sana Luanda", stars: 5, price: "212.500 Kz/noite" },
      { name: "Hotel Baía", stars: 4, price: "127.500 Kz/noite" },
      { name: "InterContinental Luanda Miramar", stars: 5, price: "238.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Lookal Mar", specialty: "Marisco e Peixe Grelhado", price: "34.000 - 68.000 Kz" },
      { name: "Restaurante O Quintal", specialty: "Comida Típica Angolana", price: "17.000 - 38.250 Kz" },
      { name: "Cervejaria Tigra", specialty: "Petiscos e Bifes", price: "12.750 - 25.500 Kz" }
    ],
    transport: ["Aeroporto Internacional 4 de Fevereiro", "Táxis Azuis e Brancos (Candongueiros)", "Serviços de Ride-Hailing (He抜, Yango)", "Comboio do CFL"],
    rating: 4.8
  },
  {
    id: "malanje",
    name: "Malanje",
    capital: "Malanje",
    history: "Historicamente ligada ao antigo Reino do Ndongo e à resistência da Rainha Ginga (Nzinga Mbandi). Teve grande desenvolvimento agrícola e comercial durante o século XIX e XX.",
    location: "Norte-Centro de Angola",
    population: "Aproximadamente 1.1 milhões de habitantes",
    climate: "Tropical húmido, com temperaturas suaves variando entre 20°C e 25°C.",
    culture: "Danças tradicionais do povo Jingola, rituais históricos e rica tradição oral associada à realeza de Ndongo.",
    gastronomy: "Funge de bombó acompanhado com carne de caça ou peixe do rio com molho de gergelim.",
    mapCoord: { lat: -9.54, lng: 16.34 },
    image: "/fotos/Malanje/Malanje1.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Abriga as espetaculares Quedas de Kalandula, as segundas maiores de África.",
      "As Pedras Negras de Pungo Andongo são formações rochosas gigantescas envoltas em lendas de gigantes.",
      "É o lar da mítica Palanca Negra Gigante no Parque Nacional de Cangandala."
    ],
    bestSeason: "Junho a Agosto (Cacimbo seco, ideal para ver as quedas com segurança).",
    hotels: [
      { name: "Pousada de Kalandula", stars: 4, price: "102.000 Kz/noite" },
      { name: "Hotel Palanca", stars: 3, price: "68.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Restaurante Palanca Gigante", specialty: "Funge de Gergelim", price: "12.750 - 25.500 Kz" },
      { name: "Kalandula Grill", specialty: "Peixe do Rio e Grelhados", price: "10.200 - 21.250 Kz" }
    ],
    transport: ["Estrada Nacional EN140", "Autocarros interprovinciais (Macon, AngoReal)", "Caminho de Ferro de Luanda (CFL)"],
    rating: 4.9
  },
  {
    id: "huila",
    name: "Huíla",
    capital: "Lubango",
    history: "Marcada pela imigração e colonização mista, incluindo colonos portugueses e bôeres no planalto da Huíla. A cidade do Lubango desenvolveu-se numa bacia montanhosa deslumbrante.",
    location: "Sul de Angola",
    population: "Cerca de 2.8 milhões de habitantes",
    climate: "Tropical de altitude, com noites frias e dias temperados, temperaturas médias de 18°C a 22°C.",
    culture: "Diversidade étnica fascinante (Muílas, Nhanecas-Humbes, Hereros), conhecidos pelos seus adornos corporais e missangas coloridas.",
    gastronomy: "Carne de sol grelhada, pirão de milho e múcua fresca.",
    mapCoord: { lat: -14.91, lng: 13.49 },
    image: "/fotos/Huila/Huila1.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "A famosa estrada da Serra da Leba desce mais de 1000 metros de altitude em curvas fechadas espectaculares.",
      "A fenda da Tundavala é um desfiladeiro abissal de onde se consegue ver as províncias vizinhas.",
      "A estátua do Cristo Rei no alto do Lubango é gémea das estátuas no Rio de Janeiro e Lisboa."
    ],
    bestSeason: "Maio a Setembro (ideal para desfrutar do clima alpino e vistas limpas da Tundavala).",
    hotels: [
      { name: "Hotel Serra da Chela", stars: 4, price: "93.500 Kz/noite" },
      { name: "Pululukwa Resort", stars: 4, price: "114.750 Kz/noite" }
    ],
    restaurants: [
      { name: "Espaço Pululukwa", specialty: "Churrasco e Pratos Nacionais", price: "21.250 - 42.500 Kz" },
      { name: "Ondjango Lubango", specialty: "Grelhados e Cozinha Portuguesa", price: "15.300 - 29.750 Kz" }
    ],
    transport: ["Aeroporto Internacional da Mukanka", "Estradas EN100/EN280", "Táxis Locais"],
    rating: 4.95
  },
  {
    id: "benguela",
    name: "Benguela",
    capital: "Benguela",
    history: "Fundada em 1617 por Manuel Cerveira Pereira. Foi um dos portos mais importantes do comércio atlântico e ponto de partida do histórico Caminho de Ferro de Benguela que liga o Atlântico ao Índico.",
    location: "Litoral Centro de Angola",
    population: "Cerca de 2.2 milhões de habitantes",
    climate: "Semiárido tropical, suavizado pela corrente fria de Benguela.",
    culture: "Grande centro literário e desportivo de Angola. Terra da 'Acácia Rubra' e berço de grandes intelectuais e músicos.",
    gastronomy: "Caldeirada de Cabrito, Mufete de peixe galo e banana frita com jindungo.",
    mapCoord: { lat: -12.58, lng: 13.41 },
    image: "/fotos/Benguela/Benguela1.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Famosa pelas praias de águas límpidas e calmas, como a Baía Azul, Baía Farta e Caotinha.",
      "O Caminho de Ferro de Benguela atravessa o continente africano até ao Catanga no Congo.",
      "As acácias rubras que cobrem a cidade florescem com pétalas vermelhas exuberantes na primavera."
    ],
    bestSeason: "Dezembro a Março (Época de calor, perfeita para praias e festivais).",
    hotels: [
      { name: "Hotel Praia Morena", stars: 4, price: "89.250 Kz/noite" },
      { name: "Aparthotel Mil Cidades", stars: 3, price: "63.750 Kz/noite" }
    ],
    restaurants: [
      { name: "Tudo na Brasa", specialty: "Mariscos e Carnes Grelhadas", price: "17.000 - 34.000 Kz" },
      { name: "A Varanda da Acácia", specialty: "Peixe Fresco e Pratos Típicos", price: "12.750 - 25.500 Kz" }
    ],
    transport: ["Aeroporto da Catumbela", "Comboio do CFB (Caminho de Ferro de Benguela)", "Táxis locais de Benguela e Lobito"],
    rating: 4.85
  },
  {
    id: "namibe",
    name: "Namibe",
    capital: "Moçâmedes",
    history: "Originalmente povoada por comunidades pescadoras e caçadoras, foi oficialmente fundada em 1840 como Moçâmedes, abrigando colonos portugueses, madeirenses e alemães.",
    location: "Sudoeste de Angola",
    population: "Cerca de 600 mil habitantes",
    climate: "Desértico e árido, com grandes amplitudes térmicas entre o dia e a noite.",
    culture: "Terra dos povos nómadas Mucubais, que mantêm rituais pastoris sagrados e uma arte corporal e têxtil única.",
    gastronomy: "Peixe seco assado na brasa, caldeiradas de marisco fresco e frutos tropicais do vale do Giraul.",
    mapCoord: { lat: -15.19, lng: 12.15 },
    image: "/fotos/Namibe/Namibe.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "O Deserto do Namibe é o mais antigo do mundo, partilhado com a Namíbia.",
      "Abriga a 'Welwitschia Mirabilis', uma planta desértica rara que pode viver mais de 1500 anos.",
      "As águas térmicas do Pediva são famosas pelas suas propriedades minerais curativas."
    ],
    bestSeason: "Junho a Setembro (Cacimbo fresco, evita o calor extremo do deserto).",
    hotels: [
      { name: "Hotel Infante", stars: 3, price: "59.500 Kz/noite" },
      { name: "Chik Chik Namibe", stars: 4, price: "85.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Restaurante Flamingo", specialty: "Marisco fresco e Caril de Lagosta", price: "15.300 - 29.750 Kz" },
      { name: "O Farol", specialty: "Peixe Grelhado na Brasa", price: "10.200 - 21.250 Kz" }
    ],
    transport: ["Aeroporto de Welwitschia Mirabilis", "Comboio Moçâmedes (CFM)", "Estrada EN100"],
    rating: 4.9
  },
  {
    id: "cabinda",
    name: "Cabinda",
    capital: "Cabinda",
    history: "Um enclave separado geograficamente do resto de Angola pelo rio Congo. Estabelecido como protetorado português em 1885 no Tratado de Simulambuco. É o maior polo de exploração de petróleo de Angola.",
    location: "Extremo Norte (Enclave)",
    population: "Cerca de 850 mil habitantes",
    climate: "Equatorial húmido, com chuvas abundantes e vegetação de floresta densa.",
    culture: "Celebra o Bakama (sociedade secreta ritual com masks de palha e folhas de bananeira). Rico artesanato em madeira de ébano.",
    gastronomy: "Saka-Saka (feito com folhas de mandioca picadas, peixe fumado e óleo de palma) e Chikuanga (pão de mandioca embrulhado em folhas de bananeira).",
    mapCoord: { lat: -5.55, lng: 12.2 },
    image: "/fotos/Cabinda/Cabinda.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Faz fronteira com a República do Congo e a República Democrática do Congo.",
      "Abriga a Floresta do Maiombe, apelidada de 'O Pulmão Verde de Angola'.",
      "O Tratado de Simulambuco de 1885 foi assinado sob um embondeiro que ainda hoje é um monumento histórico."
    ],
    bestSeason: "Junho a Setembro.",
    hotels: [
      { name: "Hotel Maiombe", stars: 4, price: "102.000 Kz/noite" },
      { name: "Hotel Executive Cabinda", stars: 4, price: "97.750 Kz/noite" }
    ],
    restaurants: [
      { name: "Toca do Pescador", specialty: "Saka-Saka com Chikuanga", price: "12.750 - 25.500 Kz" },
      { name: "Restaurante Simulambuco", specialty: "Grelhados e Cozinha Angolana", price: "10.200 - 23.800 Kz" }
    ],
    transport: ["Aeroporto de Cabinda (Voos diários da TAAG)", "Conexão marítima por Catamarã desde Luanda"],
    rating: 4.7
  },
  {
    id: "zaire",
    name: "Zaire",
    capital: "Mbanza Kongo",
    history: "O berço do grandioso Reino do Kongo, um dos impérios mais poderosos da África Central que estabeleceu relações diplomáticas com a Europa no século XV. Mbanza Kongo foi declarada Património Mundial da UNESCO em 2017.",
    location: "Noroeste de Angola",
    population: "Cerca de 700 mil habitantes",
    climate: "Tropical húmido e quente.",
    culture: "Tradições do povo Bakongo, coroação dos reis tradicionais e relíquias do primeiro contacto cristão na África subsariana.",
    gastronomy: "Pratos à base de mandioca, peixe fumado e carnes com molho de dendém.",
    mapCoord: { lat: -6.27, lng: 14.24 },
    image: "/fotos/Zaire/Zaire1.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Mbanza Kongo abriga o 'Sunguila', o local onde eram embalsamados os corpos dos antigos Reis do Congo (Manikongo).",
      "Possui as ruínas da Kulumbimbi, a primeira igreja construída na África Subsariana (século XV).",
      "O rio Congo corre ao longo da fronteira norte da província."
    ],
    bestSeason: "Maio a Outubro.",
    hotels: [
      { name: "Hotel Kulumbimbi", stars: 3, price: "63.750 Kz/noite" },
      { name: "Zaire Palace Hotel", stars: 3, price: "51.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Restaurante Manikongo", specialty: "Moamba de Peixe Seco", price: "8.500 - 18.700 Kz" }
    ],
    transport: ["Estrada Nacional Luanda-Caxito-Mbanza Kongo", "Aeroporto de Mbanza Kongo"],
    rating: 4.85
  },
  {
    id: "uige",
    name: "Uíge",
    capital: "Uíge",
    history: "Famosa pelas suas vastas plantações de café que outrora tornaram Angola um dos maiores exportadores mundiais de café robusta. Teve papel crucial na resistência anti-colonial no norte.",
    location: "Norte de Angola",
    population: "Cerca de 1.7 milhões de habitantes",
    climate: "Tropical húmido de altitude, fresco e chuvoso.",
    culture: "Danças tradicionais Bakongo, cerimónias do mel e rituais rurais nas florestas tropicais de café.",
    gastronomy: "Chikuanga acompanhado com bagre fumado e folhas de mandioca no vapor.",
    mapCoord: { lat: -7.61, lng: 15.06 },
    image: "/src/assets/images/uige_coffee_plantation_1783976572315.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "É conhecida como 'A Terra do Café Bago Vermelho'.",
      "As Grutas do Nzau Evua guardam vestígios milenares e mistérios sagrados.",
      "As Quedas do Bombo proporcionam banhos naturais fantásticos rodeados de florestas."
    ],
    bestSeason: "Junho a Setembro.",
    hotels: [
      { name: "Hotel Sofia", stars: 3, price: "55.250 Kz/noite" },
      { name: "Grande Hotel do Uíge", stars: 3, price: "59.500 Kz/noite" }
    ],
    restaurants: [
      { name: "Café Vermelho Grill", specialty: "Cozinha Tradicional e Café Robusta", price: "8.500 - 17.000 Kz" }
    ],
    transport: ["Estrada Nacional Luanda-Uíge", "Autocarros interprovinciais"],
    rating: 4.6
  },
  {
    id: "lunda-norte",
    name: "Lunda Norte",
    capital: "Dundo",
    history: "Conhecida pela imensa riqueza de diamantes que moldou o desenvolvimento da região. É a terra original do povo Cokwe, famoso pelas suas artes plásticas excepcionais, como a estatueta do Pensador.",
    location: "Extremo Nordeste de Angola",
    population: "Cerca de 950 mil habitantes",
    climate: "Tropical húmido equatorial.",
    culture: "Berço da cultura Cokwe, das danças tradicionais Tchianda e Akishi, e das máscaras místicas Mwana Pwo e Cihongo.",
    gastronomy: "Funge de milho com molho de quiabos e peixe do rio grelhado.",
    mapCoord: { lat: -7.38, lng: 20.83 },
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "O Museu do Dundo possui uma das melhores coleções etnográficas de África.",
      "Foi daqui que surgiu o famoso símbolo nacional de Angola, 'O Pensador'.",
      "Os rios Cuango e Cassai cortam a província com magníficas quedas de água e praias fluviais."
    ],
    bestSeason: "Junho a Agosto.",
    hotels: [
      { name: "Dundo Hotel", stars: 3, price: "68.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Sabor da Lunda", specialty: "Peixe Grelhado e Funge", price: "10.200 - 21.250 Kz" }
    ],
    transport: ["Aeroporto de Camaquenzo (Dundo)", "Estrada EN220"],
    rating: 4.5
  },
  {
    id: "lunda-sul",
    name: "Lunda Sul",
    capital: "Saurimo",
    history: "Desmembrada da antiga província da Lunda em 1978. Possui vastos recursos minerais e é atravessada por rotas comerciais ancestrais do povo Cokwe e de mercadores africanos e europeus.",
    location: "Nordeste de Angola",
    population: "Cerca de 650 mil habitantes",
    climate: "Tropical húmido, quente e chuvoso na maior parte do ano.",
    culture: "Forte herança Corográfica Cokwe. O festival de música tradicional e danças rituais reúne milhares de pessoas anualmente.",
    gastronomy: "Carne de caça com funge de bombó, feijão com óleo de palma.",
    mapCoord: { lat: -9.66, lng: 20.39 },
    image: "https://images.unsplash.com/photo-1472214222541-d510753a49fa?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "As quedas do rio Chicapa são conhecidas pelas suas paisagens verdejantes idílicas.",
      "As estatuetas esculpidas em Saurimo representam espíritos míticos de caçadores lendários.",
      "Saurimo desenvolveu-se como um polo de lapidação de diamantes moderno."
    ],
    bestSeason: "Junho a Setembro.",
    hotels: [
      { name: "Chik Chik Saurimo", stars: 4, price: "80.750 Kz/noite" }
    ],
    restaurants: [
      { name: "Chicapa Restaurante", specialty: "Pratos Típicos e Grelhados", price: "10.200 - 25.500 Kz" }
    ],
    transport: ["Aeroporto de Saurimo Deon", "Estrada Nacional EN230"],
    rating: 4.45
  },
  {
    id: "moxico",
    name: "Moxico",
    capital: "Luena",
    history: "A maior província de Angola em extensão territorial. Historicamente ligada aos caminhos de ferro e foi palco de momentos cruciais na consolidação da paz em Angola no início do século XXI.",
    location: "Extremo Leste de Angola",
    population: "Cerca de 900 mil habitantes",
    climate: "Tropical húmido, suavizado pelo planalto leste, com temperaturas médias de 22°C.",
    culture: "Danças rituais e máscaras do povo Luchaze e Chokwe, forte união das comunidades rurais do leste.",
    gastronomy: "Funge de mandioca, carne fumada e cogumelos colhidos na floresta de Miombo.",
    mapCoord: { lat: -11.79, lng: 19.91 },
    image: "/fotos/Moxico/Moxico.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "É a maior província do país, com uma área superior à de vários países europeus inteiros.",
      "Os Lagos do Dilolo são os maiores lagos de água doce de Angola.",
      "O Parque Nacional da Cameia abriga riquíssimas reservas de aves aquáticas e pântanos espetaculares."
    ],
    bestSeason: "Maio a Outubro.",
    hotels: [
      { name: "Hotel Luena", stars: 3, price: "63.750 Kz/noite" }
    ],
    restaurants: [
      { name: "O Cantinho do Leste", specialty: "Carne Fumada com Funge", price: "8.500 - 17.000 Kz" }
    ],
    transport: ["Aeroporto de Luena", "Caminho de Ferro de Benguela (Comboio que cruza o Moxico até à fronteira)", "Estrada EN250"],
    rating: 4.55
  },
  {
    id: "cuanza-norte",
    name: "Cuanza Norte",
    capital: "Ndalatando",
    history: "Intimamente ligada à herança industrial e agrícola inicial de Angola colonial e aos reinos tradicionais do Ndongo. Famosa pelo seu centro botânico e reservas naturais de águas termais.",
    location: "Centro-Norte de Angola",
    population: "Cerca de 500 mil habitantes",
    climate: "Sub-húmido e quente tropical.",
    culture: "Artesanato de argila, canções tradicionais em Kimbundu e lendas da floresta mística da Carreira de Tiro.",
    gastronomy: "Galinha de Cabidela tradicional e Calulu com peixe fresco das lagoas do rio Kwanza.",
    mapCoord: { lat: -9.3, lng: 14.91 },
    image: "/fotos/Kwanza-Norte/Kwanza-Norte.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "O Centro Botânico de Ndalatando possui espécies de plantas exóticas de todo o mundo, como rosas de porcelana.",
      "Ndalatando era conhecida historicamente como 'Vila Salazar'.",
      "O rio Kwanza serpenteia a sul da província oferecendo rotas turísticas espetaculares."
    ],
    bestSeason: "Maio a Setembro.",
    hotels: [
      { name: "Hotel Terminus Ndalatando", stars: 3, price: "59.500 Kz/noite" }
    ],
    restaurants: [
      { name: "Restaurante Rosa de Porcelana", specialty: "Galinha de Cabidela", price: "10.200 - 21.250 Kz" }
    ],
    transport: ["Estrada Nacional EN230 (Autoestrada Luanda-Malanje)", "Caminho de Ferro de Luanda"],
    rating: 4.65
  },
  {
    id: "cuanza-sul",
    name: "Cuanza Sul",
    capital: "Sumbe",
    history: "Local de praias formosas, montanhas escarpadas e vestígios pré-históricos de pinturas rupestres. Teve papel económico expressivo na pecuária e na cultura do café no planalto da Gabela.",
    location: "Costa Central de Angola",
    population: "Cerca de 2.1 milhões de habitantes",
    climate: "Varia de árido e semiárido no litoral a temperado húmido no planalto da Gabela.",
    culture: "Música folclórica pastoril, danças acrobáticas e as Festas do Sumbe (FestiSumbe) que atraem artistas de todo o mundo de língua portuguesa.",
    gastronomy: "Sumbe grelhado, caris de lagosta costeira e quibebe de abóbora.",
    mapCoord: { lat: -11.2, lng: 13.84 },
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Abriga as águas termais da Conda, famosas pelas suas propriedades terapêuticas.",
      "A floresta de Gabela é lar de espécies de aves endémicas raras de Angola.",
      "As Quedas de Binga, no rio Keve, são um espetáculo de águas turbulentas."
    ],
    bestSeason: "Maio a Outubro (Cacimbo agradável).",
    hotels: [
      { name: "Ritz Sumbe", stars: 3, price: "63.750 Kz/noite" },
      { name: "Hotel Terminus Gabela", stars: 3, price: "55.250 Kz/noite" }
    ],
    restaurants: [
      { name: "Maresia do Sumbe", specialty: "Peixe e Marisco fresco", price: "12.750 - 25.500 Kz" }
    ],
    transport: ["Estrada Nacional EN100 (Luanda-Lobito)", "Aeródromo de Sumbe"],
    rating: 4.75
  },
  {
    id: "bie",
    name: "Bié",
    capital: "Cuíto",
    history: "Situada exatamente no centro geográfico de Angola, no coração do Planalto Central. Teve papel preponderante nas rotas de comércio tradicionais de Ovimbundu que ligavam o leste à costa atlântica.",
    location: "Centro de Angola",
    population: "Cerca de 1.7 milhões de habitantes",
    climate: "Tropical de altitude, fresco com temperaturas de 18°C a 21°C.",
    culture: "Artesanato requintado em madeira e ricas manifestações teatrais populares em Umbundu.",
    gastronomy: "Pirão de milho e feijão com óleo de dendém acompanhado de carne grelhada de cabrito.",
    mapCoord: { lat: -12.38, lng: 16.94 },
    image: "/fotos/Bie/Bié.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Cuito é historicamente conhecida como 'A Cidade Mártir' devido à sua resistência heróica em conflitos.",
      "No Bié localiza-se o marco do Centro Geográfico de Angola na comuna de Camacupa.",
      "As lagoas do Humbe e do Chissol são ricas em biodiversidade aquática."
    ],
    bestSeason: "Maio a Setembro.",
    hotels: [
      { name: "Hotel Cuito", stars: 3, price: "51.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Cantinho do Planalto", specialty: "Feijoada e Grelhados", price: "8.500 - 18.700 Kz" }
    ],
    transport: ["Aeroporto de Cuito", "Caminho de Ferro de Benguela", "Estrada EN250"],
    rating: 4.6
  },
  {
    id: "huambo",
    name: "Huambo",
    capital: "Huambo",
    history: "Anteriormente denominada 'Nova Lisboa' e idealizada para ser a capital de Angola na era colonial devido ao seu clima excecional. Fundada em 1912 pelo governador português Norton de Matos. É um importante polo académico e ferroviário.",
    location: "Planalto Central de Angola",
    population: "Cerca de 2.3 milhões de habitantes",
    climate: "Temperado de altitude, muito fresco nas noites de cacimbo (pode descer a 5°C).",
    culture: "Grande centro literário e artístico, com ritmos locais e danças típicas como a Olundongo do povo Ovimbundu.",
    gastronomy: "Funge de milho amarela e pratos de caça variados com molho picante.",
    mapCoord: { lat: -12.77, lng: 15.73 },
    image: "/fotos/Huambo/Huambo.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "O Huambo é circundado pelo imponente Monte Moco, o ponto mais alto de Angola (2.620 metros).",
      "Diz-se que possui o clima mais agradável de Angola, com brisas montanhosas constantes.",
      "As ruínas do palácio de Norton de Matos são um dos destaques arquitetónicos."
    ],
    bestSeason: "Maio a Outubro (Cacimbo fresco e ensolarado).",
    hotels: [
      { name: "Hotel Roma Huambo", stars: 4, price: "72.250 Kz/noite" },
      { name: "Ekuikui I Wellness Hotel", stars: 4, price: "93.500 Kz/noite" }
    ],
    restaurants: [
      { name: "O Verdelhão", specialty: "Cozinha Portuguesa e Angolana", price: "12.750 - 25.500 Kz" },
      { name: "Restaurante Novo Horizonte", specialty: "Grelhados e Massas", price: "8.500 - 21.250 Kz" }
    ],
    transport: ["Aeroporto Albano Machado", "Caminho de Ferro de Benguela", "Estradas EN120/EN260"],
    rating: 4.8
  },
  {
    id: "cuando-cubango",
    name: "Cuando Cubango",
    capital: "Menongue",
    history: "Uma das maiores províncias em território, conhecida historicamente como as 'Terras do Fim do Mundo' devido ao isolamento. Atualmente é celebrada pelo seu potencial ecoturístico fantástico ligado ao Delta do Okavango.",
    location: "Extremo Sudeste de Angola",
    population: "Cerca de 600 mil habitantes",
    climate: "Tropical semiárido, com savanas intermináveis.",
    culture: "Danças tribais dos povos Nganguela e San (comunidades caçadoras recolectoras de arco e flecha).",
    gastronomy: "Pratos de milho, peixe assado de rio e mel silvestre.",
    mapCoord: { lat: -14.65, lng: 17.68 },
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Integra o projeto transfronteiriço Okavango-Zambeze (KAZA), a maior área de conservação da natureza do mundo.",
      "Os rios Cuando e Cubango alimentam um dos santuários de vida selvagem mais intocados de África.",
      "A Batalha de Cuito Cuanavale (1987-1988) foi a maior batalha em solo africano desde a II Guerra Mundial."
    ],
    bestSeason: "Junho a Setembro (estação seca para safáris de observação de elefantes).",
    hotels: [
      { name: "Hotel Ritz Menongue", stars: 3, price: "68.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Menongue Grill", specialty: "Peixe Grelhado e Bifes", price: "10.200 - 21.250 Kz" }
    ],
    transport: ["Aeroporto de Menongue", "Comboio Moçâmedes (fim de linha)", "Estrada EN140"],
    rating: 4.7
  },
  {
    id: "cunene",
    name: "Cunene",
    capital: "Ondjiva",
    history: "Região com uma herança heróica na luta de resistência contra a ocupação colonial portuguesa liderada pelo rei Mandume ya Ndemufayo do povo Cuanhama.",
    location: "Sul de Angola (fronteira com a Namíbia)",
    population: "Cerca de 1.1 milhões de habitantes",
    climate: "Semidesértico a árido quente, com secas periódicas.",
    culture: "Fascinante cultura dos guerreiros Cuanhama (povo Ovambo), famosas danças tradicionais dos bastões e adornos corporais rituais de argila e gordura.",
    gastronomy: "Pirão de massango (painço) e carnes assadas na fogueira pastoril.",
    mapCoord: { lat: -17.06, lng: 15.73 },
    image: "/fotos/Cunene/Cunene1.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Abriga o Memorial ao Rei Mandume em Oihole, local onde o rei heróico preferiu a morte à rendição.",
      "É atravessada pelo imponente rio Cunene que se precipita na queda das Ruacaná.",
      "O embondeiro gigante de Pepino tem um tronco tão largo que foi utilizado no passado como refúgio e depósito."
    ],
    bestSeason: "Maio a Agosto.",
    hotels: [
      { name: "Hotel Ondjiva", stars: 3, price: "59.500 Kz/noite" }
    ],
    restaurants: [
      { name: "Sabor do Cunene", specialty: "Carne de Sol e Pirão de Massango", price: "8.500 - 18.700 Kz" }
    ],
    transport: ["Estrada EN100 (Luanda-Ondjiva-Namíbia)", "Aeroporto de Ondjiva"],
    rating: 4.5
  },
  {
    id: "bengo",
    name: "Bengo",
    capital: "Caxito",
    history: "Criada em 1980 pela divisão da antiga província de Luanda. Berço do primeiro presidente de Angola, Dr. António Agostinho Neto (nascido em Icolo e Bengo), e rica em agricultura e recursos pesqueiros fluviais.",
    location: "Norte-Litoral, envolvendo a província de Luanda",
    population: "Cerca de 450 mil habitantes",
    climate: "Tropical húmido e quente.",
    culture: "Danças rituais da Ilha de Cassenga, rica tradição piscatória fluvial ao longo do rio Dande e lagoas do Panguila.",
    gastronomy: "Funge com molho de bagre e lagosta do rio, banana assada com ginguba (amendoim).",
    mapCoord: { lat: -8.58, lng: 13.66 },
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "A Muxima, local de peregrinação religiosa que abriga o Santuário da Nossa Senhora da Muxima, é o maior centro de devoção mariana da África subsariana.",
      "As praias de Cabo Ledo são famosas internacionalmente pelas suas ondas excelentes para a prática de surf.",
      "Faz divisa circular quase total com a província de Luanda."
    ],
    bestSeason: "Maio a Outubro.",
    hotels: [
      { name: "Carpe Diem Resort Cabo Ledo", stars: 4, price: "102.000 Kz/noite" },
      { name: "Resort Doce Mar", stars: 3, price: "68.000 Kz/noite" }
    ],
    restaurants: [
      { name: "Kibar Surf", specialty: "Peixe Grelhado e Sumos Naturais", price: "12.750 - 23.800 Kz" }
    ],
    transport: ["Estrada Nacional EN100", "Serviços de transporte rodoviário regular"],
    rating: 4.8
  },
  {
    id: "icolo-e-bengo",
    name: "Icolo e Bengo",
    capital: "Catete",
    history: "Recentemente estabelecida como província de pleno direito, Icolo e Bengo destaca-se pela sua profunda importância histórica e cultural para Angola. Localizada nas proximidades de Luanda, é o orgulhoso berço do Dr. António Agostinho Neto, poeta maior e primeiro Presidente da República de Angola.",
    location: "Costa Norte (Adjacente a Luanda)",
    population: "Aproximadamente 160 mil habitantes",
    climate: "Tropical seco, com temperaturas quentes e agradáveis na maior parte do ano.",
    culture: "Forte herança patriótica e literária, celebrada anualmente no prestigiado Centro Cultural Dr. António Agostinho Neto, em Catete.",
    gastronomy: "Funge de bombó, bagre fumado, calulu de peixe e banana assada com ginguba.",
    mapCoord: { lat: -9.1300, lng: 13.7100 },
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "É o berço histórico do fundador da nação angolana, Dr. António Agostinho Neto.",
      "Abriga o imponente Memorial Dr. António Agostinho Neto na vila de Catete, com a sua arquitetura monumental em formato de obelisco estilizado.",
      "Possui uma forte atividade agrícola tradicional, sendo uma das principais fontes de abastecimento de Luanda."
    ],
    bestSeason: "Maio a Outubro (estação fresca do Cacimbo).",
    hotels: [
      { name: "Hospedaria de Catete", stars: 3, price: "34.000 Kz/noite" }
    ],
    restaurants: [
      { name: "O Quintal de Catete", specialty: "Comida Típica e Peixe de Rio", price: "8.500 - 15.000 Kz" }
    ],
    transport: ["Estrada Nacional EN230", "Comboio do Caminho de Ferro de Luanda (CFL)"],
    rating: 4.65
  },
  {
    id: "cuando",
    name: "Cuando",
    capital: "Mavinga",
    history: "Consolidada como uma nova província na recente reforma territorial, Cuando cobre a deslumbrante porção oriental do antigo Cuando Cubango. É uma terra mística de vida selvagem pura, vastas savanas abertas e rios abundantes pertencentes à bacia hidrográfica do Okavango.",
    location: "Extremo Sudeste de Angola",
    population: "Cerca de 220 mil habitantes",
    climate: "Tropical semiárido, com grandes planícies secas e clima de savana.",
    culture: "Danças e rituais rurais tradicionais dos povos Nganguela e San, que mantêm viva uma profunda conexão e respeito com o meio ambiente e fauna local.",
    gastronomy: "Peixe de rio grelhado na brasa com pirão de milho e mel biológico silvestre das florestas.",
    mapCoord: { lat: -15.8200, lng: 20.3500 },
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Integra partes cruciais da espetacular bacia hidrográfica do Okavango, famosa pela riqueza ambiental.",
      "Suas savanas intocadas servem de corredor migratório para grandes manadas de elefantes e antílopes.",
      "A vila de Mavinga é célebre pelo seu papel de relevo na história moderna da região."
    ],
    bestSeason: "Junho a Setembro (estação seca ideal para observação de vida selvagem).",
    hotels: [
      { name: "Mavinga Guest House", stars: 3, price: "38.250 Kz/noite" }
    ],
    restaurants: [
      { name: "Sabor do Cuando", specialty: "Caça e Grelhados", price: "10.000 - 18.000 Kz" }
    ],
    transport: ["Estradas secundárias regionais", "Pista de aviação civil de Mavinga"],
    rating: 4.6
  },
  {
    id: "moxico-leste",
    name: "Moxico Leste",
    capital: "Cazombo",
    history: "Surgida da nova reorganização administrativa que visa aproximar os serviços públicos das comunidades mais remotas, a província do Moxico Leste abrange o limite leste de Angola. A sua história está intimamente ligada ao comércio transfronteiriço e à cultura rica dos povos lunda-tchokwe.",
    location: "Extremo Leste de Angola (Fronteira)",
    population: "Cerca de 280 mil habitantes",
    climate: "Tropical húmido, com uma época de chuvas generosa e florestas frondosas.",
    culture: "Grandes celebrações folclóricas com máscaras tradicionais Chokwe e fortes interações de fronteira com as comunidades da Zâmbia.",
    gastronomy: "Funge de mandioca com peixe seco fumado de rio e cogumelos silvestres colhidos na floresta de Miombo.",
    mapCoord: { lat: -11.9100, lng: 22.9100 },
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    curiosities: [
      "Faz divisa direta e ativa com a República da Zâmbia, potenciando um comércio transfronteiriço muito dinâmico.",
      "A capital Cazombo situa-se nas deslumbrantes margens do majestoso rio Zambeze, um dos rios mais importantes de África.",
      "Os artesãos locais são mundialmente conhecidos pela talha de madeira refinada e cestaria tradicional."
    ],
    bestSeason: "Maio a Setembro (estação seca e agradável).",
    hotels: [
      { name: "Cazombo River Lodge", stars: 3, price: "42.500 Kz/noite" }
    ],
    restaurants: [
      { name: "Cantinho do Zambeze", specialty: "Peixe Fresco e Funge", price: "8.000 - 16.000 Kz" }
    ],
    transport: ["Estrada EN250", "Caminho de Ferro de Benguela (estação de Luau a norte)"],
    rating: 4.55
  }
];

export const TOURIST_SPOTS: TouristSpot[] = [
  {
    id: "kalandula",
    name: "Quedas de Kalandula",
    provinceId: "malanje",
    category: TouristCategory.Nature,
    description: "As Quedas de Kalandula são as segundas maiores quedas d'água de África, com uma extensão impressionante de 410 metros de largura e uma queda livre espetacular de 105 metros. Alimentadas pelo rio Lucala, criam um véu de espuma branca e nuvens de vapor que desenham arco-íris mágicos no meio de uma densa vegetação tropical intocada.",
    history: "Conhecidas durante a era colonial como Quedas do Duque de Bragança, recuperaram o seu nome de origem tradicional, Kalandula, após a independência nacional em 1975. O local tem um profundo significado espiritual para as comunidades locais, que realizavam rituais de purificação nas suas águas puras.",
    curiosities: [
      "São as segundas maiores de África em volume de água, apenas atrás das Quedas de Vitória.",
      "As brumas constantes criam um microclima florestal luxuriante e húmido ao redor do miradouro.",
      "Diz a lenda local que o som estrondoso das quedas afugenta os maus espíritos da província."
    ],
    image: "/src/assets/images/kalandula_falls_1783893420397_1783938463169.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -9.0781, lng: 16.2378 },
    price: "Grátis (Guia voluntário opcional: ~4.250 Kz)",
    hours: "07:00 às 18:00 (Aconselhável visitar de dia)",
    bestSeason: "Janeiro a Abril (Ápico do caudal) ou Cacimbo (Junho a Agosto) para melhor visibilidade sem chuva.",
    visitDuration: "3 horas",
    difficulty: "Fácil",
    whatToBring: ["Capa de chuva (o vapor molha bastante)", "Calçado antiderrapante", "Câmara impermeável", "Repelente de insetos"],
    oQueFazer: [
      "Caminhada até ao miradouro principal",
      "Descida guiada até à base das quedas (para os mais aventureiros)",
      "Sessão fotográfica profissional no pôr do sol",
      "Piquenique na zona florestal circundante"
    ],
    nearbyHotels: ["Pousada de Kalandula", "Hotel Palanca Malanje"],
    nearbyRestaurants: ["Pousada de Kalandula Grill", "Restaurante Luanda-Kalandula"],
    rating: 4.98,
    commentsCount: 142
  },
  {
    id: "serra-leba",
    name: "Serra da Leba",
    provinceId: "huila",
    category: TouristCategory.Adventure,
    description: "A Serra da Leba é um dos cartões-postais mais famosos de Angola, renomada pela sua estrada espetacular e sinuosa esculpida na rocha da escarpa montanhosa. São dezenas de curvas perfeitas que sobem e vencem um desnível de mais de 1000 metros in poucos quilómetros, oferecendo vistas abismais e um nevoeiro poético constante que envolve as montanhas ao entardecer.",
    history: "A estrada foi projetada e construída no final da década de 1960 pelo engenheiro português Mário Sanches, sendo considerada na época uma obra-prima de engenharia civil devido à extrema dificuldade de recortar as montanhas íngremes do planalto da Huíla.",
    curiosities: [
      "A estrada possui 56 curvas sinuosas esculpidas na encosta íngreme.",
      "A noite, a vista do miradouro com os faróis dos carros subindo as curvas em longa exposição cria um espetáculo de luzes inesquecível.",
      "No topo localiza-se uma queda d'água que precipita do cume da montanha."
    ],
    image: "/src/assets/images/serra_da_leba_road_1783977248568.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -15.0683, lng: 13.2384 },
    price: "Grátis",
    hours: "24 horas (Recomenda-se evitar subir à noite sob nevoeiro denso)",
    bestSeason: "Maio a Outubro (Cacimbo seco, com céus azuis limpos do topo)",
    visitDuration: "2 horas (incluindo paragem no miradouro)",
    difficulty: "Moderado",
    whatToBring: ["Casaco quente (altitude elevada arrefece bastante)", "Câmara fotográfica", "Binóculos para observar as aves no vale"],
    oQueFazer: [
      "Paragem obrigatória no Miradouro da Leba",
      "Degustação de frutas tropicais vendidas pelas zungueiras muílas no topo",
      "Fotografia paisagística",
      "Condução emocionante pelas curvas lendárias"
    ],
    nearbyHotels: ["Resort Pululukwa", "Hotel Serra da Chela Lubango"],
    nearbyRestaurants: ["Miradouro Bar e Café", "Espaço Pululukwa Gourmet"],
    rating: 4.96,
    commentsCount: 98
  },
  {
    id: "miradouro-lua",
    name: "Miradouro da Lua",
    provinceId: "luanda",
    category: TouristCategory.Photographic,
    description: "O Miradouro da Lua é uma das paisagens mais dramáticas e hipnotizantes de Angola. Trata-se de um conjunto de falésias esculpidas pela erosão pluvial e eólica ao longo de milhares de anos ao longo da costa atlântica. As ravinas recortadas em tons de argila vermelha, branca, ocre e amarela formam agulhas e torres naturais que assemelham-se perfeitamente à superfície da lua.",
    history: "Este local icónico serviu de cenário para o primeiro filme de co-produção luso-angolana, 'O Miradouro da Lua' (1993) do realizador Jorge António. Desde então, tornou-se o local mais visitado por quem sai de Luanda em direção ao sul.",
    curiosities: [
      "A erosão contínua muda ligeiramente a forma das agulhas de argila a cada estação das chuvas.",
      "As cores das falésias mudam dramaticamente conforme a hora do dia, atingindo o máximo de brilho ao pôr do sol.",
      "Fica mesmo ao lado da autoestrada costeira EN100."
    ],
    image: "/fotos/Luanda/Luanda1.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -9.3371, lng: 13.1492 },
    price: "Grátis",
    hours: "Aberto permanentemente (Melhor horário: 16:30 às 18:00 para o pôr do sol)",
    bestSeason: "Qualquer época do ano, o entardecer é sempre mágico.",
    visitDuration: "1 hora",
    difficulty: "Fácil",
    whatToBring: ["Câmara fotográfica", "Óculos escuros", "Água para se manter hidratado"],
    oQueFazer: [
      "Caminhada segura pela borda de proteção",
      "Apreciação do pôr do sol com o contraste das cores quentes",
      "Fotografia artística",
      "Compra de artesanato local aos vendedores locais"
    ],
    nearbyHotels: ["Carpe Diem Cabo Ledo", "Resort Belas Luanda"],
    nearbyRestaurants: ["Lookal Ocean Club (a caminho)", "Quiosques de Sumos no miradouro"],
    rating: 4.91,
    commentsCount: 175
  },
  {
    id: "parque-kissama",
    name: "Parque Nacional da Kissama",
    provinceId: "bengo",
    category: TouristCategory.Ecotourism,
    description: "Com uma área colossal de 9.600 quilómetros quadrados, a Kissama é o maior e mais acessível parque nacional de Angola. Delimitado pelo rio Kwanza a norte e o mar de dunas a oeste, o parque apresenta uma vegetação mista de floresta de cactos, savanas abertas e embondeiros gigantescos, sendo o lar de elefantes, girafas, zebras, antílopes e manatins do Kwanza.",
    history: "Estabelecido como reserva de caça em 1938 e elevado a parque nacional em 1957. Após o final do conflito armado, o parque foi revitalizado através da histórica 'Operação Arca de Noé' no ano 2000, que transportou de avião manadas inteiras de elefantes, zebras e girafas a partir da África do Sul e do Botswana.",
    curiosities: [
      "Abriga milhares de embondeiros sagrados (baobás), a árvore nacional de Angola.",
      "Os elefantes reintroduzidos na Operação Arca de Noé adaptaram-se perfeitamente e a população está a crescer de forma saudável.",
      "A norte, o rio Kwanza permite safáris fluviais fascinantes para ver crocodilos e aves aquáticas raras."
    ],
    image: "/src/assets/images/quissama_national_park_1783939131724.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -9.4167, lng: 13.4167 },
    price: "40 USD (Inclui guia do parque e safári em jipe 4x4)",
    hours: "Safari das 06:30 às 11:00 e das 15:30 às 18:30 (Horas de maior atividade animal)",
    bestSeason: "Maio a Outubro (Estação seca, os animais concentram-se junto aos pontos de água).",
    visitDuration: "1 a 2 dias (Recomenda-se pernoitar nos bungalows do Kawa Camp)",
    difficulty: "Moderado",
    whatToBring: ["Binóculos", "Roupa em tons neutros (caqui, verde ou bege)", "Repelente", "Protetor solar e chapéu"],
    oQueFazer: [
      "Game Drive num veículo todo-terreno aberto",
      "Cruzeiro turístico de barco no rio Kwanza",
      "Alojamento no Kawa Camp no meio da natureza",
      "Observação de aves exóticas"
    ],
    nearbyHotels: ["Kawa Camp Bungalows (dentro do parque)", "Resort Doce Mar Cabo Ledo"],
    nearbyRestaurants: ["Restaurante do Kawa Camp", "Restaurantes de Cabo Ledo"],
    rating: 4.88,
    commentsCount: 86
  },
  {
    id: "mbanza-kongo",
    name: "Ruínas de Mbanza Kongo",
    provinceId: "zaire",
    category: TouristCategory.Historical,
    description: "Mbanza Kongo foi a capital do próspero e sofisticado Reino do Congo entre os séculos XIV e XIX. O sítio histórico engloba as ruínas arquitetónicas das primeiras igrejas cristãs da África subsariana, as sepulturas reais dos Manikongos, as árvores sagradas de conselho judiciário e vestígios arqueológicos inestimáveis que contam a história do contacto inicial da África Central com a Europa.",
    history: "Declarada Património Mundial da Humanidade pela UNESCO em 2017 devido ao seu valor histórico universal excecional. Mbanza Kongo representava o centro administrativo e espiritual de um império que dominava milhões de quilómetros quadrados na bacia central do rio Congo.",
    curiosities: [
      "Abriga a 'Kulumbimbi', que são as ruínas da catedral portuguesa construída em 1491.",
      "O 'Yala Nkuwu' é um embondeiro sagrado centenário onde o Rei (Manikongo) aplicava as sentenças judiciais da corte.",
      "O museu dos reis exibe cetros, coroas e vestimentas reais ricas do antigo império."
    ],
    image: "/fotos/Zaire/Zaire1.jpeg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -6.2658, lng: 14.2464 },
    price: "5 USD",
    hours: "09:00 às 16:00 (Segunda a Sábado)",
    bestSeason: "Maio a Outubro (estação seca, ideal para caminhadas arqueológicas).",
    visitDuration: "4 horas",
    difficulty: "Fácil",
    whatToBring: ["Calçado confortável para caminhadas", "Chapéu", "Guia turístico oficial para explicar a arqueologia"],
    oQueFazer: [
      "Visita às ruínas da Kulumbimbi",
      "Caminhada guiada ao museu dos Reis do Congo",
      "Observação do embondeiro Yala Nkuwu",
      "Exploração do túmulo sagrado da Rainha D. Leonor"
    ],
    nearbyHotels: ["Hotel Kulumbimbi", "Zaire Palace Hotel"],
    nearbyRestaurants: ["Manikongo Sabor Real", "O Cantinho da Tradição"],
    rating: 4.93,
    commentsCount: 64
  },
  {
    id: "tundavala",
    name: "Fenda da Tundavala",
    provinceId: "huila",
    category: TouristCategory.Nature,
    description: "A Fenda da Tundavala é um abismo colossal localizado no rebordo do planalto central da Huíla. A altitude no topo da fenda ultrapassa os 2.200 metros, caindo verticalmente mais de 1.200 metros em direção às planícies áridas do Namibe. A visão do miradouro é indescritível: uma fenda estreita e profunda recortada em rochas quartzíticas antigas de onde se avista a vastidão infinita do sudoeste angolano.",
    history: "Para os povos tradicionais da etnia Muíla, a fenda era um portal sagrado de comunicação com os espíritos dos antepassados. Os reis tradicionais realizavam no local rituais sagrados para pedir chuvas abundantes e proteção para o gado bovino pastoril.",
    curiosities: [
      "Em dias de atmosfera limpa, consegue-se ver nitidamente o deserto do Namibe e a linha férrea a dezenas de quilómetros.",
      "As correntes de ar ascendentes na fenda são tão fortes que arremessam pequenos objetos leves de volta para o miradouro.",
      "O local é rico em flora andina e flores raras que só crescem nos planaltos elevados da Huíla."
    ],
    image: "/src/assets/images/tundavala_gorge_1783976965948.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -14.8142, lng: 13.3764 },
    price: "Grátis",
    hours: "06:00 às 18:00 (Evitar em dias de chuva torrencial ou nevoeiro denso por segurança)",
    bestSeason: "Maio a Outubro (Excelente visibilidade).",
    visitDuration: "2 horas",
    difficulty: "Fácil (com corrimões de segurança no miradouro)",
    whatToBring: ["Casaco para o vento frio do planalto", "Câmara fotográfica com lente grande angular", "Água mineral"],
    oQueFazer: [
      "Caminhada guiada pelo rebordo escarpado",
      "Sessão de contemplação do abismo do miradouro",
      "Piquenique nas rochas planas",
      "Fotografia profissional das formações rochosas"
    ],
    nearbyHotels: ["Resort Pululukwa", "Hotel Serra da Chela Lubango"],
    nearbyRestaurants: ["Café Tundavala", "Ondjango Grill Lubango"],
    rating: 4.99,
    commentsCount: 112
  },
  {
    id: "cabo-ledo",
    name: "Praias de Cabo Ledo",
    provinceId: "bengo",
    category: TouristCategory.Beach,
    description: "Cabo Ledo é uma baía paradisíaca caracterizada por extensas praias de areia dourada banhadas pelo oceano Atlântico de águas azuis, límpidas e mornas. Rodeada de falésias brancas imponentes e dunas salpicadas por cactos, Cabo Ledo oferece ondas longas e perfeitas que atraem surfistas de todo o mundo, além de resorts rústicos e elegantes perfeitos para uma escapada de fim de semana relaxante.",
    history: "A baía foi historicamente um porto de refúgio natural para navegadores portugueses e holandeses durante o século XVII. Nas últimas décadas, passou de uma pequena vila de pescadores artesanais para o principal polo de ecoturismo de praia e desportos aquáticos de Angola.",
    curiosities: [
      "É considerado um dos melhores pontos de surf da África Ocidental devido à constância do swell de sul.",
      "As tartarugas marinhas escolhem anualmente estas praias para a desova na época quente.",
      "A baía está protegida de ventos fortes, mantendo a água incrivelmente calma junto à costa."
    ],
    image: "/src/assets/images/cabo_ledo_beach_1783976273917.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -9.6841, lng: 13.2084 },
    price: "Grátis (Praias públicas; tarifas aplicáveis apenas a resorts ou aluguer de espreguiçadeiras)",
    hours: "24 horas",
    bestSeason: "Dezembro a Abril (temperatura da água chega aos 28°C) ou Junho a Setembro para amantes de ondas grandes.",
    visitDuration: "1 a 3 dias",
    difficulty: "Fácil",
    whatToBring: ["Fato de banho", "Protetor solar ecológico", "Prancha de surf ou bodyboard", "Óculos de sol"],
    oQueFazer: [
      "Praticar Surf, Kitesurf ou Stand-Up Paddle",
      "Comer peixe fresco assado na brasa na praia",
      "Passeio ecológico ao pôr do sol pelas falésias",
      "Observação da desova noturna das tartarugas (com guia biológico na época certa)"
    ],
    nearbyHotels: ["Carpe Diem Resort Cabo Ledo", "Queiroz Point Resort"],
    nearbyRestaurants: ["Restaurante Carpe Diem", "Barracas de Mufete de Cabo Ledo"],
    rating: 4.92,
    commentsCount: 154
  },
  {
    id: "pedras-negras",
    name: "Pedras Negras de Pungo Andongo",
    provinceId: "malanje",
    category: TouristCategory.Historical,
    description: "As Pedras Negras de Pungo Andongo são uma série de formações rochosas megalíticas gigantescas, em blocos de arenito negro que se elevam abruptamente no meio da savana de Malanje. Estas estruturas geológicas colossais assemelham-se a enormes animais deitados e envolvem um profundo misticismo e relevância histórica nacional.",
    history: "O local serviu de capital fortificada natural para os Reis do Ndongo. Foi aqui que a mítica Rainha Ginga (Nzinga Mbandi) liderou a resistência heróica contra a ocupação colonial portuguesa no século XVII. Na rocha principal, encontra-se esculpida a lendária pegada da Rainha Ginga, que segundo a tradição oral, foi deixada como prova do seu poder divino.",
    curiosities: [
      "As rochas formam labirintos naturais de pedra que abrigavam milhares de guerreiros do reino.",
      "Diz a lenda local que quem pisar a pegada esculpida da Rainha Ginga ganha coragem eterna para vencer as dificuldades.",
      "A vegetação que cresce nas ranhuras das pedras negras é rica em plantas medicinais raras."
    ],
    image: "https://images.unsplash.com/photo-1432406186267-3306be65d6bc?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mapCoord: { lat: -9.6761, lng: 15.7164 },
    price: "3 USD (Apoio à conservação local)",
    hours: "08:00 às 17:00",
    bestSeason: "Maio a Outubro (Ideal para caminhadas e escalada de observação).",
    visitDuration: "3 horas",
    difficulty: "Moderado (requer caminhar por degraus recortados nas rochas)",
    whatToBring: ["Chapéu e protetor solar", "Água em abundância", "Calçado com excelente aderência"],
    oQueFazer: [
      "Subida guiada até ao 'Miradouro do Gigante' no topo das pedras",
      "Visita arqueológica à pegada lendária da Rainha Ginga",
      "Fotografia de paisagem das savanas circundantes",
      "Exploração histórica das ruínas coloniais próximas"
    ],
    nearbyHotels: ["Pousada de Kalandula", "Hotel Palanca Malanje"],
    nearbyRestaurants: ["Quiosque das Pedras", "Restaurante Rainha Ginga em Malanje"],
    rating: 4.95,
    commentsCount: 76
  }
];

export const EVENTS: EventItem[] = [
  {
    id: "carnaval-luanda",
    name: "Carnaval de Luanda",
    date: "Fevereiro (Terça-feira de Carnaval)",
    location: "Marginal da Baía de Luanda, Luanda",
    description: "O maior e mais colorido festival cultural de Angola. Grupos carnavalescos das várias províncias desfilam na icónica Marginal de Luanda, exibindo trajes tradicionais extravagantes, máscaras rituais e dançando ao ritmo contagiante do Semba, Cabetula e Varina. Mistura sátira política, homenagens ancestrais e uma energia eletrizante.",
    category: "Festivais",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    // Festas do Mar em Benguela
    id: "festas-mar",
    name: "Festas do Mar",
    date: "Todo o mês de Março",
    location: "Litoral de Benguela, Lobito e Baía Azul",
    description: "Um festival costeiro anual de Benguela, com dezenas de eventos culturais, desportivos, feiras de gastronomia marítima, concertos ao vivo ao longo das praias e competições de desportos náuticos (motos de água, vela e pesca desportiva). Atrai turistas nacionais e internacionais.",
    category: "Cultura",
    image: "/fotos/Benguela/Benguela1.jpg"
  },
  {
    id: "festi-sumbe",
    name: "FestiSumbe",
    date: "Setembro",
    location: "Sumbe, Cuanza Sul",
    description: "O maior festival internacional de música ao vivo de Angola. O evento reúne ao longo de um fim de semana inteiro os maiores expoentes da música nacional e artistas convidados de países lusófonos (Brasil, Cabo Verde, Portugal, Moçambique), tocando Kizomba, Semba, Zouk e Kuduro à beira-mar.",
    category: "Festivais",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "peregrinacao-muxima",
    name: "Peregrinação da Nossa Senhora da Muxima",
    date: "Primeiro fim de semana de Setembro",
    location: "Santuário da Muxima, Bengo",
    description: "A maior peregrinação cristã mariana da África Subsariana. Mais de um milhão de devotos deslocam-se de todo o país à pacata vila da Muxima nas margens do rio Kwanza para render homenagem à imagem milagrosa da 'Mamã Muxima', num evento de imensa beleza religiosa e folclore angolano.",
    category: "Eventos Religiosos",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "welwitschia-mirabilis",
    title: "A fascinante história da Welwitschia Mirabilis: A Rainha do Deserto",
    category: "Natureza",
    snippet: "Descubra como esta planta pré-histórica sobrevive num dos ambientes mais inóspitos da Terra apenas com o orvalho matinal.",
    content: "No coração do árido Deserto do Namibe, cresce uma das maiores maravilhas da botânica mundial: a *Welwitschia Mirabilis*. Descoberta pelo médico e botânico austríaco Friedrich Welwitsch em 1859, esta planta é um verdadeiro fóssil vivo que pode viver mais de 1.500 anos.\n\nA Welwitschia desenvolve apenas duas folhas que crescem continuamente a partir de um tronco subterrâneo espesso. Com o passar dos séculos, os fortes ventos do deserto rasgam estas duas folhas em dezenas de tiras que se espalham pelas dunas, dando a falsa impressão de que a planta possui múltiplas folhas.\n\nA sua sobrevivência extrema baseia-se na absorção de humidade do nevoeiro noturno que sobe do oceano Atlântico até ao interior do deserto. Os minúsculos estômatos presentes nas folhas capturam este orvalho matinal, garantindo a sua resiliência num deserto onde quase nunca chove. É, sem dúvida, o maior símbolo da resistência e beleza natural do sudoeste de Angola.",
    author: "Mateus Pedro",
    date: "5 de Julho de 2026",
    image: "/fotos/Namibe/Welwitshia Mirabilis1.jpeg",
    readTime: "4 min de leitura"
  },
  {
    id: "mbanza-kongo-unesco",
    title: "Mbanza Kongo: O berço histórico do antigo Império do Congo",
    category: "História",
    snippet: "Visite a mística cidade de Mbanza Kongo e entenda por que razão foi eleita Património da Humanidade pela UNESCO.",
    content: "Localizada na província do Zaire, a cidade de Mbanza Kongo guarda as páginas mais gloriosas e complexas da história africana. Fundada muito antes da chegada dos navegadores europeus, a cidade era a capital fortificada do Reino do Congo, um império medieval que dominava a África Central.\n\nEm 2017, a UNESCO consagrou o sítio histórico como Património Mundial, reconhecendo o valor universal excecional da sua herança urbana e arqueológica. Aqui, os visitantes podem contemplar as ruínas da Kulumbimbi, a primeira catedral cristã construída ao sul do Saara em 1491, e o Yala Nkuwu, o imponente embondeiro sagrado debaixo do qual o manicongo presidia tribunais e tomava decisões dinásticas.\n\nMbanza Kongo representa uma fusão única entre a arquitetura colonial inicial da Europa renascentista e os rituais, crenças e estruturas organizacionais de um império africano orgulhoso e sofisticado.",
    author: "Dra. Isabel Nzinga",
    date: "28 de Junho de 2026",
    image: "/fotos/Zaire/Zaire1.jpeg",
    readTime: "6 min de leitura"
  },
  {
    id: "guia-safari-kissama",
    title: "Guia completo para o seu safári no Parque Nacional da Kissama",
    category: "Dicas de Viagem",
    snippet: "Prepare a sua máquina e veja como organizar a sua visita ao santuário de vida selvagem mais famoso de Angola.",
    content: "O Parque Nacional da Kissama é uma das joias do turismo de natureza angolano. A apenas 75 quilómetros ao sul de Luanda, oferece uma oportunidade única de fazer safáris fotográficos e avistar animais selvagens sem necessitar de longas viagens.\n\nPara organizar o seu safári com sucesso, considere as seguintes dicas práticas:\n\n1. **Melhor época**: Visite durante o Cacimbo (Maio a Outubro). Sem chuva, os animais agrupam-se ao redor dos lagos e a vegetação está mais baixa, facilitando a observação.\n2. **Horários**: Os safáris iniciam muito cedo (06:30) ou ao fim da tarde (15:30), quando as temperaturas estão amenas e os animais estão ativos a procurar alimento.\n3. **Como chegar**: O ideal é ir num veículo todo-terreno 4x4, pois as estradas internas do parque são de terra batida e areia solta.\n4. **Onde ficar**: Hospede-se no Kawa Camp, localizado dentro do parque, para dormir rodeado pelos sons da savana e acordar com o canto de aves exóticas.\n\nA Kissama aguarda por si para uma aventura memorável. Estamos juntos!",
    author: "Carlos Silveira",
    date: "12 de Junho de 2026",
    image: "/src/assets/images/regenerated_image_1783939418571.jpg",
    readTime: "5 min de leitura"
  }
];

export const RECIPES: Recipe[] = [
  {
    id: "mufete",
    name: "Mufete de Peixe Grelhado",
    ingredients: [
      "1 Peixe Galo ou Carapau grande (fresco)",
      "500g de Feijão de óleo de palma",
      "2 Mandiocas cozidas",
      "2 Bananas-pão maduras cozidas",
      "3 Batatas-doces cozidas",
      "Para o molho: 1 Cebola roxa picada finamente, azeite, sumo de limão, jindungo (piripiri) e salsa fresca."
    ],
    history: "O Mufete é o prato de rua e celebração por excelência na costa de Luanda. Tradicionalmente consumido aos sábados e em convívios familiares à beira da praia, este prato reflete a relação íntima de Luanda com o mar Atlântico.",
    recipe: [
      "Grelhe o peixe temperado com limão e sal grosso na brasa viva até ficar suculento e dourado.",
      "Coza o feijão e misture-o delicadamente com óleo de palma puro e cebola.",
      "Coza a mandioca, as bananas-pão e as batatas-doces cortadas em rodelas médias.",
      "Prepare o molho de vinagrete tradicional misturando a cebola picada, o sumo de limão espremido na hora, azeite, salsa e jindungo esmagado.",
      "Sirva o peixe rodeado pelos acompanhamentos cozidos quentes, regando tudo com o feijão de óleo de palma e aplicando o molho vinagrete por cima do peixe grelhado."
    ],
    image: "/src/assets/images/mufete_peixe_grelhado_1783893610536.jpg",
    difficulty: "Fácil",
    duration: "45 min"
  },
  {
    id: "calulu",
    name: "Calulu de Peixe",
    ingredients: [
      "500g de Peixe fresco (Corvina ou Pargo)",
      "300g de Peixe seco fumado (bagre)",
      "1 molho de folhas de quiabos ou espinafres",
      "150g de Quiabos frescos tenros",
      "2 Beringelas médias",
      "2 Cebolas cortadas em rodelas",
      "3 Tomates maduros picados",
      "1 chávena de Óleo de Palma puro"
    ],
    history: "O Calulu é um prato histórico de Angola, preparado em panela de barro há séculos. Simboliza a fusão de vegetais da horta e peixe seco, usado tradicionalmente para conservação pelos povos tradicionais.",
    recipe: [
      "Coloque o peixe seco de molho em água morna para retirar o excesso de sal.",
      "Numa panela de barro grande, disponha camadas alternadas de cebola, tomate, peixe fresco, peixe seco dessalgado, quiabos, beringela em cubos e as folhas verdes lavadas.",
      "Rregue tudo generosamente com o óleo de palma puro.",
      "Tape a panela de barro e leve ao lume médio-baixo, sacudindo a panela ocasionalmente para não colar (evite mexer com colher para não desfazer o peixe).",
      "Deixe cozer em lume brando por cerca de 30 a 40 minutos até os vegetais ficarem tenros e o molho de óleo de palma bem ligado. Sirva com funge quente de bombó."
    ],
    image: "/src/assets/images/calulu_de_peixe_1783893610537_1783938444266.jpg",
    difficulty: "Médio",
    duration: "60 min"
  }
];

export const CULTURE_TOPICS = {
  dances: [
    { name: "Semba", desc: "A dança de salão urbana por excelência de Luanda. O nome provém de 'Masemba', que significa 'umbigada' (contacto físico expressivo e divertido entre parceiros). É festiva, alegre e cheia de improviso teatral." },
    { name: "Kizomba", desc: "Um ritmo sensual e romântico apreciado em todo o mundo. Nascido na década de 1980 em Luanda, combina influências de ritmos tradicionais como o Semba com influências de Zouk, caracterizado por passos fluidos e abraços íntimos." },
    { name: "Kuduro", desc: "O ritmo urbano contemporâneo de Luanda que tomou de assalto as pistas internacionais. Caracteriza-se por batidas eletrónicas rápidas (de alta energia) e passos de dança incrivelmente atléticos, acrobáticos e cheios de humor urbano." }
  ],
  masks: [
    { name: "Mwana Pwo (Cokwe)", desc: "Representa a beleza feminina idealizada e os espíritos ancestrais das jovens mulheres Cokwe. Usada por bailarinos homens em rituais rurais festivos para demonstrar elegância, fertilidade e graça corporal." },
    { name: "Samona", desc: "Máscara tradicional entalhada em ébano ou palha sagrada, usada em rituais do norte por sociedades secretas tradicionais para simbolizar sabedoria judicial e autoridade clânica." },
    { name: "Cihongo (Cokwe)", desc: "Representa o espírito masculino do poder, da riqueza e da autoridade monárquica do caçador líder. Caracteriza-se por traços fortes na testa e mandíbula esculpida." }
  ],
  languages: [
    { name: "Kimbundu", desc: "Falada na região norte, incluindo Luanda, Bengo, Cuanza Norte e Malanje. É uma das línguas bantas com maior influência e léxico incorporado no português de Angola." },
    { name: "Umbundu", desc: "A língua banta mais falada em Angola, nativa do Planalto Central (Huambo, Bié, Benguela e Huíla) pelo povo Ovimbundu." },
    { name: "Kikongo", desc: "Língua nativa das províncias do Zaire e Uíge, com forte ligação ao antigo e prestigiado Império do Congo." },
    { name: "Cokwe", desc: "Língua de grande prestígio cultural falada no leste do país (Lundas e Moxico), rica em provérbios filosóficos e literatura oral." }
  ],
  instruments: [
    { name: "Dikanza", desc: "Instrumento de percussão feito de cana de bambu estriada, tocado por fricção com uma vareta de madeira. É o compasso rítmico fundamental do Semba e da música de Luanda." },
    { name: "Marimba", desc: "Xilofone tradicional feito de lâminas de madeira de ébano afinadas e cabaças naturais que atuam como caixas de ressonância, muito tocada no planalto norte." },
    { name: "Puita", desc: "Tambor de fricção cilíndrico de origem banta que produz um som grave contínuo fascinante e melancólico ao esfregar uma vara molhada no interior do couro." }
  ]
};
