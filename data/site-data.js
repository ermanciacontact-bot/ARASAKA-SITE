const image = (id, width = 1600, quality = 82) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

const asset = (name) => `/assets/${name}`;

const contactPhone = "+33 6 52 83 11 60";
const whatsappNumber = "33652831160";

module.exports = {
  company: {
    name: "ARASAKA",
    baseline: "Architecture tropicale adaptée au climat tropical",
    location: "Abidjan, Angre 7e Tranche, Côte d'Ivoire",
    franceLocation: "Savigny-le-Temple 77176, France",
    ermanciaLocation: "Ermancia, 77176 Savigny-le-Temple",
    director: "M. Tchotchoe Maixent",
    partner: "En collaboration avec l'entreprise Ermancia en France",
    architectPartner:
      "Partenariat avec le cabinet d'architecture GEAP pour assurer la cohérence des études, la qualité des choix architecturaux, la coordination du projet et une meilleure maîtrise des délais.",
    standards:
      "ARASAKA travaille avec des artisans et techniciens formés dans les meilleurs lycées techniques du pays, dans une culture de chantier alignée sur les normes internationales.",
    finishPromise:
      "ARASAKA met toute son expertise au service de finitions à la hauteur des standards internationaux les plus exigeants.",
    phone: contactPhone,
    telHref: "tel:+33652831160",
    whatsappNumber,
    whatsappHref: `https://wa.me/${whatsappNumber}`,
    email: "contact@arasaka.ci",
  },
  nav: [
    { href: "/", key: "home", label: "Accueil" },
    { href: "/qui-sommes-nous", key: "about", label: "Qui sommes-nous" },
    { href: "/diaspora", key: "diaspora", label: "Diaspora" },
    { href: "/plans", key: "plans", label: "Villas" },
    { href: "/materiaux", key: "materials", label: "Matériaux" },
    { href: "/galerie", key: "gallery", label: "Galerie" },
    { href: "/services", key: "services", label: "Services" },
    { href: "/contact", key: "contact", label: "Contact" },
  ],
  images: {
    hero: asset("hero-villa-btc-piscine-lagon.png"),
    rammedEarth: image("photo-1761367950537-14f834333ecc", 1400, 82),
    tropicalPool: asset("piscine-lagon-villa-tropicale.png"),
    bambooWall: asset("bambou-decoration-cloture.png"),
    wood: asset("bois-africain-teck-iroko.png"),
    contactParcel: asset("parcelle-nue-centre-ville-abidjan.png"),
    interiorWood: asset("sejour-cuisine-jardin-tropical.png"),
    mudWall: image("photo-1759323371061-1888a17d011a", 1200, 82),
    greenRoof: asset("toiture-vegetalisee-btc-pise.png"),
    bricks: asset("villa-btc-premium-abidjan.png"),
    whiteVilla: asset("villa-blanche-premium-beton.png"),
    whiteVillaGarden01: asset("villa-blanche-baies-jardin-01.png"),
    whiteVillaGarden02: asset("villa-blanche-baies-jardin-02.png"),
    whiteVillaPool03: asset("villa-blanche-baies-piscine-03.png"),
    whiteVillaEntrance04: asset("villa-blanche-entree-jardin-04.png"),
    whiteDuplexGarden01: asset("villa-duplex-blanche-jardin-01.png"),
    whiteDuplexPool02: asset("villa-duplex-blanche-piscine-02.png"),
    premiumVillaConcept: asset("villa-moderne-blanche-terrasse-piscine-naturelle.png"),
    premiumVillaPlan: asset("plan-detaille-villa-blanche-piscine.png"),
    teakTerrace: asset("terrasse-teck-iroko-piscine.png"),
    diasporaClients: asset("diaspora-clients-premium-visio.png"),
    diasporaSite: asset("suivi-chantier-techniciens-premium.png"),
    poolSun01: asset("piscine-lagon-grand-soleil-01.png"),
    poolCourtyard02: asset("piscine-cour-tropicale-02.png"),
    vegetalFence02: asset("cloture-vegetale-villa-premium-02.png"),
    interiorCourtyardLiving: asset("interieur-sejour-vue-cour-tropicale.png"),
    suiteCourtyard: asset("suite-vue-cour-tropicale.png"),
    materialsHeroNatural: asset("hero-materiaux-naturels-afrique.png"),
    modernVilla: image("photo-1600607687939-ce8a6c25118c", 1600, 82),
    bedroom: image("photo-1505693416388-ac5ce068fe85", 1200, 82),
    garden: image("photo-1500530855697-b586d89ba3ee", 1400, 82),
    remoteHero: asset("piscine-lagon-villa-tropicale.png"),
    tropicalVillaLocal: asset("piscine-lagon-villa-tropicale.png"),
    coveredTerrace: asset("terrasse-pergola-materiaux-locaux.png"),
    pergolaWood: asset("pergola-veranda-bambou-bois.png"),
    tropicalGarden: asset("piscine-lagon-villa-tropicale.png"),
    localMaterialsInterior: asset("sejour-cuisine-jardin-tropical.png"),
    vegetalFence: asset("cloture-vegetale-premium.png"),
    bedroomSuite: asset("chambre-suite-jardin-tropical.png"),
    bathroomGarden: asset("salle-eau-pierre-jardin.png"),
    centralPatio: asset("patio-central-btc-pise.png"),
    villaEntrance: asset("entree-villa-jardin-tropical.png"),
  },
  proofPoints: [
    "Matériaux naturels et durables",
    "Ventilation naturelle et confort thermique",
    "Chantier contrôlé, devis clair et reporting",
      "Pont France - Côte d'Ivoire pour la diaspora",
      "Coordination avec le cabinet d'architecture GEAP",
      "Finitions aux standards internationaux",
  ],
  positioning: {
    title:
      "Une architecture adaptée au climat tropical, entre pierre, béton, terre, bois, bambou et végétation.",
    text:
      "ARASAKA conçoit des villas et rénovations qui privilégient l'ombre, la ventilation naturelle, les jardins, les terrasses couvertes et une palette de matériaux cohérente avec le climat tropical.",
  },
  targetMarkets: [
    {
      title: "Diaspora ivoirienne",
      scope: "France, Belgique, Suisse, Canada",
      text:
        "Construction suivie à distance avec reporting mensuel, photos, vidéos WhatsApp, réunions visio, budget sécurisé et contrôle qualité.",
    },
    {
      title: "Propriétaires de villas à Abidjan",
      scope: "Rénovation, extension, modernisation",
      text:
        "Façades, extensions, pergolas, terrasses, cuisines extérieures, clôtures, piscines, jardins et confort thermique.",
    },
    {
      title: "Familles exigeantes",
      scope: "Villas et maisons familiales",
      text:
        "Maisons bien ventilées, pièces fluides, devis détaillé, étapes claires et choix possible entre béton classique et matériaux naturels.",
    },
    {
      title: "Investisseurs locatifs",
      scope: "Petits immeubles et extensions",
      text:
        "Petits immeubles locatifs, dépendances, optimisation de terrain, maîtrise du budget et suivi d'exécution documenté.",
    },
  ],
  advantages: [
    {
      title: "Maison pensée pour le climat tropical",
      text:
        "Ventilation naturelle, ombrage, vérandas, patios, toitures ventilées, protections solaires et jardins pour réduire la chaleur.",
    },
    {
      title: "Chantier mieux contrôlé",
      text:
        "Planning, devis détaillé, contrat clair, appels de fonds par étapes, photos et vidéos d'avancement.",
    },
    {
      title: "Matériaux locaux valorisés",
      text:
        "BTC, bois, bambou, pisé, pierre locale et végétalisation, avec possibilité de béton classique selon le projet.",
    },
    {
      title: "Confiance diaspora",
      text:
        "Un interlocuteur structuré pour limiter les mauvaises surprises, sécuriser les décisions et rendre l'avancement visible à distance.",
    },
  ],
  offers: [
    {
      title: "Construction, rénovation et extension",
      audience: "Offre diaspora",
      text:
        "Un accompagnement complet pour créer ou transformer votre bien en Côte d'Ivoire et donner forme à un art de vivre moderne africain.",
      cta: "Découvrir l'offre diaspora",
      href: "/diaspora",
    },
    {
      title: "Immeuble et mini-cité clé en main",
      audience: "Investisseurs immobiliers",
      text:
        "Optimisation du terrain, conception, estimation, planning, suivi de chantier, contrôle qualité et livraison d'un bien prêt à louer.",
      cta: "Étudier un investissement",
    },
    {
      title: "Rénovation et agrandissement",
      audience: "Propriétaires",
      text:
        "Modernisation, extension, reprise des finitions et amélioration du confort pour révéler tout le potentiel d'un bien existant.",
      cta: "Étudier une rénovation",
    },
    {
      title: "Finalisation d'appartement en promotion immobilière",
      audience: "Acquéreurs et investisseurs",
      text:
        "État des lieux, définition des finitions, achèvement des lots, coordination des intervenants, contrôle qualité et livraison d'un appartement prêt à vivre ou à louer.",
      cta: "Finaliser un appartement",
    },
    {
      title: "Jardins et espaces de vie extérieurs",
      audience: "Art de vivre tropical",
      text:
        "Jardins tropicaux, piscines lagon, pergolas, terrasses couvertes et espaces extérieurs pensés comme de véritables pièces à vivre.",
      cta: "Imaginer un espace extérieur",
    },
  ],
  remoteBuildOffers: [
    {
      title: "Rénovation",
      subtitle: "Moderniser une villa existante à Abidjan",
      text:
        "Façade, extension, terrasse couverte, pergola, cuisine extérieure, jardin tropical, piscine et amélioration du confort thermique.",
      details: ["Audit du bien", "Devis détaillé", "Planning par étapes", "Photos et vidéos d'avancement"],
      cta: "Demander une rénovation",
    },
    {
      title: "Villa clé en main",
      subtitle: "Construire une villa tropicale complète",
      text:
        "Conception, études, choix des matériaux, budget, chantier, finitions et livraison d'une villa pensée pour l'air, l'ombre et la vie dehors.",
      details: ["Villa tropicale", "BTC, bois, bambou, pisé", "Véranda et patio", "Jardin et terrasse couverte"],
      cta: "Étudier une villa clé en main",
    },
    {
      title: "Suivi diaspora",
      subtitle: "Piloter le projet depuis l'étranger",
      text:
        "Un accompagnement structuré pour les clients en France, Belgique, Suisse, Canada ou ailleurs, avec reporting clair et décisions sécurisées.",
      details: ["Réunions visio", "Reporting mensuel", "Vidéos WhatsApp", "Appels de fonds par étapes"],
      cta: "Mettre en place un suivi diaspora",
    },
  ],
  remoteBuildPhotos: [
    {
      title: "Villa blanche premium en béton ventilé",
      text: "Béton clair, baies protégées, débords et terrasse ombragée pour une maison lumineuse et respirante.",
      imageKey: "whiteVilla",
    },
    {
      title: "Villa en matériaux naturels",
      text: "BTC, pisé, bois, bambou et toiture végétalisée pour un confort tropical plus doux.",
      imageKey: "greenRoof",
    },
    {
      title: "Piscine lagon",
      text: "Eau turquoise, plages naturelles, végétation et ambiance de jardin privé.",
      imageKey: "tropicalPool",
    },
    {
      title: "Séjour avec cuisine ouverte",
      text: "Îlot central, grandes baies et relation directe avec un jardin tropical.",
      imageKey: "interiorWood",
    },
    {
      title: "Terrasse couverte en matériaux locaux",
      text: "Bois, bambou, pierre et ombre profonde pour vivre dehors sans surchauffe.",
      imageKey: "coveredTerrace",
    },
    {
      title: "Clôture végétale",
      text: "Intimité, fraîcheur, intégration paysagère et limite plus douce qu'un mur plein.",
      imageKey: "vegetalFence",
    },
    {
      title: "Chambre suite ouverte sur jardin",
      text: "Ouvertures protégées, ventilation naturelle et continuité avec la végétation.",
      imageKey: "bedroomSuite",
    },
    {
      title: "Salle d'eau pierre et bois",
      text: "Matières minérales, ventilation, lumière douce et relation avec un patio planté.",
      imageKey: "bathroomGarden",
    },
    {
      title: "Patio central",
      text: "Un vide végétal au cœur de la maison pour apporter air, ombre et lumière.",
      imageKey: "centralPatio",
    },
    {
      title: "Entrée plantée",
      text: "Une arrivée sobre, ombragée, où le jardin participe au confort et à l'intimité.",
      imageKey: "villaEntrance",
    },
  ],
  services: [
    {
      title: "Construction de villas",
      short: "Villas basses, villas familiales et résidences haut de gamme adaptées au climat tropical.",
    },
    {
      title: "Rénovation haut de gamme",
      short: "Modernisation de maisons, redistribution des pièces, finitions et valorisation patrimoniale.",
    },
    {
      title: "Extensions de villas",
      short: "Agrandissements, nouvelles pièces, terrasses, cuisines extérieures, clôtures et façades modernisées.",
    },
    {
      title: "Architecture tropicale",
      short: "Orientation, ombrage, patios, vérandas, ventilation croisée et circulation fluide.",
    },
    {
      title: "Aménagements extérieurs",
      short: "Jardins fleuris, zones ombragées, terrasses, circulations et lieux de vie dehors.",
    },
    {
      title: "Piscines lagon",
      short: "Bassins naturels, plages immergées, intégration paysagère et ambiance resort privé.",
    },
    {
      title: "Pergolas et vérandas",
      short: "Structures bois ou bambou, protections solaires, salons extérieurs et repas au jardin.",
    },
    {
      title: "Accompagnement diaspora",
      short: "Cadrage à distance, suivi documenté, collaboration France - Côte d'Ivoire et reporting clair.",
    },
    {
      title: "Petit immeuble locatif clé en main",
      short: "Conception et suivi de petits programmes locatifs avec optimisation du terrain, du budget et des délais.",
    },
    {
      title: "Définition précise du projet",
      short: "Programme, plans, budget, planning et standards de finition verrouillés avant exécution.",
    },
    {
      title: "Coordination architecturale",
      short:
        "Travail en partenariat avec le cabinet d'architecture GEAP pour assurer la cohérence des études, du suivi et des délais.",
    },
  ],
  materials: [
    {
      title: "Béton",
      subtitle: "Structure, dalles, voiles et villas blanches",
      imageKey: "whiteVilla",
      text: "Le béton reste un matériau central pour certaines structures, villas blanches contemporaines et ouvrages exposés.",
      thermal: "À utiliser avec protections solaires, ventilation, débords et végétation pour éviter la surchauffe.",
      eco: "Durable lorsqu'il est bien dimensionné, limité aux usages pertinents et associé à des matériaux locaux plus sobres.",
    },
    {
      title: "BTC",
      subtitle: "Villas en terre comprimée",
      imageKey: "bricks",
      text: "La BTC permet de créer des villas respirantes, élégantes et naturellement adaptées à la chaleur tropicale.",
      thermal: "Stocke la fraîcheur et limite les pics de chaleur dans les pièces.",
      eco: "Valorise la terre locale, réduit les transports et demande moins d'énergie que des matériaux fortement transformés.",
    },
    {
      title: "Bois africain",
      subtitle: "Teck, iroko, finitions",
      imageKey: "teakTerrace",
      text: "Le teck et l'iroko apportent une finition noble, durable et adaptée aux terrasses, plafonds et espaces extérieurs protégés.",
      thermal: "Protège du rayonnement direct et améliore le confort des terrasses et plafonds ventilés.",
      eco: "Matériau renouvelable lorsqu'il est choisi, traité et sourcé correctement.",
    },
    {
      title: "Bambou",
      subtitle: "Clôtures, claustras, ombrage",
      imageKey: "bambooWall",
      text: "Léger, tropical et graphique, le bambou permet de composer des clôtures décoratives, claustras et zones d'ombrage respirantes.",
      thermal: "Filtre le soleil sans bloquer la ventilation naturelle.",
      eco: "Croissance rapide, faible poids et intégration naturelle dans les jardins tropicaux.",
    },
    {
      title: "Pisé",
      subtitle: "Ravalement et enduits intérieurs",
      imageKey: "mudWall",
      text: "Le pisé est utilisé en ravalement ou en enduit intérieur pour apporter une finition naturelle, minérale et élégante.",
      thermal: "En enduit, il améliore la sensation de confort et participe à la régulation naturelle de l'humidité.",
      eco: "Matière peu transformée, locale et réparable, adaptée aux finitions sobres et durables.",
    },
    {
      title: "Toitures végétalisées",
      subtitle: "Fraicheur, inertie, paysage",
      imageKey: "greenRoof",
      text: "Elles réduisent l'échauffement des volumes, prolongent le jardin et renforcent l'intégration au site.",
      thermal: "Protège la toiture du soleil et ralentit la transmission de chaleur.",
      eco: "Favorise la biodiversité, retient une partie des eaux de pluie et végétalise le bâti.",
    },
  ],
  plans: [
    {
      title: "Villa premium blanche avec terrasse et piscine",
      slug: "premium-pool",
      surface: "280 - 360 m2",
      imageKey: "premiumVillaConcept",
      features: ["Plan détaillé", "Terrasse couverte", "Piscine lagon", "Baies vitrées", "Suite parentale"],
    },
    {
      title: "Villa basse 3 chambres",
      slug: "compact",
      surface: "150 - 190 m2",
      imageKey: "whiteVillaGarden01",
      features: ["Séjour traversant", "Suite parentale", "Véranda ombragée", "Jardin tropical"],
    },
    {
      title: "Villa familiale avec patio",
      slug: "patio",
      surface: "220 - 280 m2",
      imageKey: "centralPatio",
      features: ["Patio central", "Cuisine ouverte", "4 chambres", "Piscine lagon"],
    },
    {
      title: "Villa tropicale grande véranda",
      slug: "veranda",
      surface: "260 - 340 m2",
      imageKey: "coveredTerrace",
      features: ["Grande véranda", "Baies vitrées", "Pergola bois", "Toiture végétalisée"],
    },
    {
      title: "Residence diaspora clé en main",
      slug: "diaspora",
      surface: "240 - 340 m2",
      imageKey: "whiteDuplexGarden01",
      features: ["Suivi à distance", "Étapes validées", "Reporting photos", "Livraison cadrée"],
    },
  ],
  gallery: [
    { title: "Villa blanche premium en béton ventilé", category: "villas-blanches", imageKey: "whiteVilla" },
    { title: "Villa blanche avec grandes baies sur jardin", category: "villas-blanches", imageKey: "whiteVillaGarden01" },
    { title: "Villa blanche contemporaine et jardin tropical", category: "villas-blanches", imageKey: "whiteVillaGarden02" },
    { title: "Villa blanche, baies vitrées et piscine", category: "villas-blanches", imageKey: "whiteVillaPool03" },
    { title: "Entrée de villa blanche premium", category: "villas-blanches", imageKey: "whiteVillaEntrance04" },
    { title: "Villa duplex blanche avec balcon", category: "villas-blanches", imageKey: "whiteDuplexGarden01" },
    { title: "Villa duplex blanche avec piscine", category: "villas-blanches", imageKey: "whiteDuplexPool02" },
    { title: "Villa moderne blanche, terrasse et piscine naturelle", category: "villas-blanches", imageKey: "premiumVillaConcept" },
    { title: "Villa en BTC et jardin tropical", category: "materiaux-naturels", imageKey: "bricks" },
    { title: "Villa en matériaux naturels et toiture végétalisée", category: "materiaux-naturels", imageKey: "greenRoof" },
    { title: "Piscine lagon et jardin tropical", category: "piscines", imageKey: "tropicalPool" },
    { title: "Piscine lagon grand soleil", category: "piscines", imageKey: "poolSun01" },
    { title: "Piscine de cour tropicale", category: "piscines", imageKey: "poolCourtyard02" },
    { title: "Séjour avec cuisine ouverte et îlot central", category: "interieurs", imageKey: "interiorWood" },
    { title: "Séjour ouvert sur cour tropicale", category: "interieurs", imageKey: "interiorCourtyardLiving" },
    { title: "Chambre suite ouverte sur jardin", category: "interieurs", imageKey: "bedroomSuite" },
    { title: "Suite avec vue sur cour intérieure", category: "interieurs", imageKey: "suiteCourtyard" },
    { title: "Salle d'eau en pierre et bois", category: "interieurs", imageKey: "bathroomGarden" },
    { title: "Patio central en BTC et pisé", category: "materiaux-naturels", imageKey: "centralPatio" },
    { title: "Terrasse couverte en bois et bambou", category: "terrasses", imageKey: "coveredTerrace" },
    { title: "Pergola bois et bambou", category: "terrasses", imageKey: "pergolaWood" },
    { title: "Entrée de villa et allée plantée", category: "jardins", imageKey: "villaEntrance" },
    { title: "Clôture végétale premium", category: "jardins", imageKey: "vegetalFence" },
    { title: "Clôture végétale tropicale", category: "jardins", imageKey: "vegetalFence02" },
    { title: "Clôture décorative en bambou", category: "jardins", imageKey: "bambooWall" },
    { title: "Terrasse en teck et iroko", category: "terrasses", imageKey: "teakTerrace" },
  ],
  process: [
    {
      step: "01",
      title: "Cadrage du besoin",
      text: "Programme, terrain, budget, attentes de confort, calendrier et niveau de finition.",
    },
    {
      step: "02",
      title: "Avant-projet",
      text:
        "Plans, principes de ventilation, vues, choix des espaces extérieurs et coordination avec le cabinet d'architecture GEAP.",
    },
    {
      step: "03",
      title: "Budget et planning",
      text: "Estimation claire, étapes de validation, délais des études et priorités techniques.",
    },
    {
      step: "04",
      title: "Travaux suivis",
      text: "Exécution soignée, contrôle qualité, reportings et arbitrages documentés.",
    },
    {
      step: "05",
      title: "Livraison",
      text: "Réception, finitions, conseils d'entretien et accompagnement après travaux.",
    },
  ],
};

