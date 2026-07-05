const image = (id, width = 1600, quality = 82) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

const asset = (name) => `/assets/${name}`;
const partnerRealisationAsset = (name) => asset(`realisations-partenaires/${name}`);
const portfolioAsset = (name) => asset(`images/portfolio/${name}`);
const portfolioImage = (number) => portfolioAsset(`portfolio-source-${String(number).padStart(3, "0")}.jpg`);
const portfolioItemsFrom = (numbers, item) =>
  numbers.map((number, index) => ({
    ...item,
    number,
    src: portfolioImage(number),
    title: numbers.length > 1 ? `${item.title} ${String(index + 1).padStart(2, "0")}` : item.title,
  }));
const portfolioItemsFromSources = (sources, item) =>
  sources.map((src, index) => ({
    ...item,
    src,
    title: sources.length > 1 ? `${item.title} ${String(index + 1).padStart(2, "0")}` : item.title,
  }));

const contactPhone = "+225 05 74 04 34 76";
const contactPhoneHref = "tel:+2250574043476";
const whatsappPhone = "+33 06 52 83 11 60";
const whatsappNumber = "33652831160";
const contactEmail = "arasakaci.contact@gmail.com";
const portfolioAfricanManagerImage = asset("portfolio-african-project-manager.png");

const portfolioCategories = [
  { key: "all", label: "Tous" },
  { key: "conception", label: "Conception" },
  { key: "visualisation-3d", label: "Visualisation 3D" },
  { key: "cuisines", label: "Cuisines" },
  { key: "decoration", label: "Décoration" },
  { key: "airbnb", label: "Airbnb" },
];

const portfolioItems = [
  ...portfolioItemsFrom([1], {
    category: "conception",
    label: "Conception",
    title: "Plan 2D et optimisation des espaces",
    caption: "Avant chaque chantier, ARASAKA structure circulation, implantation, volumes, usages et finitions.",
    usage: "Étude, cadrage client et validation du programme.",
  }),
  ...portfolioItemsFromSources([asset("portfolio-projection-3d-afrique-naturelle.png")], {
    category: "visualisation-3d",
    label: "Visualisation 3D",
    title: "Projection matériaux naturels et Afrique",
    caption: "Une projection d'ambiance qui relie matériaux locaux, ventilation, lumière et style africain contemporain.",
    usage: "Validation des ambiances, matières, volumes et intentions architecturales.",
  }),
  ...portfolioItemsFrom([32, 33, 35, 38, 40, 41, 46, 48, 52, 55, 57, 62, 63], {
    category: "decoration",
    label: "Décoration",
    title: "Décoration et mise en ambiance",
    caption: "Mobilier, luminaires, textiles et objets donnent au logement une identité immédiatement lisible.",
    usage: "Décoration, ameublement, home staging et valorisation locative.",
  }),
  ...portfolioItemsFrom([34, 54, 61], {
    category: "cuisines",
    label: "Cuisines",
    title: "Cuisine aménagée et intégrée",
    caption: "Des cuisines fonctionnelles, élégantes et intégrées à l'ambiance générale du logement.",
    usage: "Implantation, rangements, plans de travail, façades et finitions.",
  }),
  {
    category: "cuisines",
    label: "Cuisines",
    title: "Pilotage d'un intérieur premium",
    caption: "Un interlocuteur qualifié relie conception, chantier, finitions et mise en valeur du logement.",
    usage: "Présentation client, coordination projet et valorisation immobilière.",
    src: portfolioAfricanManagerImage,
  },
  ...portfolioItemsFrom([45, 47, 50, 53], {
    category: "airbnb",
    label: "Airbnb",
    title: "Appartement prêt à exploiter en Airbnb",
    caption: "Après les travaux, ARASAKA peut accompagner la mise en ambiance et la livraison d'un logement prêt à louer.",
    usage: "Logement meublé, location courte durée et mise en valeur immobilière.",
  }),
  ...portfolioItemsFromSources(
    [
      asset("portfolio-airbnb-salle-bain-avant-apres.png"),
      asset("portfolio-airbnb-combles-travaux.png"),
      asset("portfolio-airbnb-chambre-combles-finale.png"),
    ],
    {
      category: "airbnb",
      label: "Airbnb",
      title: "Transformation Airbnb",
      caption: "Exemples d'interventions et de mises en valeur réalisées pour un logement en location courte durée.",
      usage: "Avant / après, aménagement, décoration et présentation Airbnb.",
    },
  ),
];

const portfolioVirtualTours = [
  {
    title: "Appartement meublé - parcours 01",
    subtitle: "Séjour, cuisine, décoration et finitions",
    cover: portfolioImage(45),
    slides: [
      { src: portfolioImage(45), title: "Séjour meublé et ambiance locative" },
      { src: portfolioImage(47), title: "Espace décoré prêt à exploiter" },
      { src: portfolioImage(50), title: "Ambiance finale du premier appartement" },
      { src: portfolioImage(34), title: "Cuisine aménagée et coin repas" },
      { src: portfolioImage(32), title: "Mise en ambiance décorative" },
    ],
  },
  {
    title: "Appartement meublé - parcours 02",
    subtitle: "Ambiance naturelle, décoration et finitions",
    cover: portfolioImage(53),
    slides: [
      { src: portfolioImage(53), title: "Appartement prêt à exploiter" },
      { src: portfolioImage(54), title: "Cuisine intégrée" },
      { src: portfolioImage(61), title: "Cuisine et rangements" },
      { src: portfolioImage(52), title: "Détails de finition et confort" },
      { src: portfolioImage(55), title: "Ambiance décorative du second appartement" },
    ],
  },
];

const homeVillaVideo = {
  label: "Villa à vendre",
  title: "Villa basse premium 3 chambres",
  price: "79,9 M FCFA",
  video: asset("visite-guidee-vente-villa-equipee-79m9.webp"),
  poster: asset("visite-guidee-vente-villa-equipee-79m9-poster.jpg"),
  description:
    "Une villa basse premium pensée pour une vie familiale élégante, fonctionnelle et immédiatement valorisante. Ses volumes fluides associent 3 chambres avec salle de bain privative, espaces de réception, cuisine ouverte avec îlot central, espaces techniques discrets et véranda couverte finition bois.",
  commercialCopy:
    "Le programme réunit une suite parentale avec salle de bain et WC privatifs, deux chambres supplémentaires avec salle de bain privative, un toilette visiteur, une cuisine africaine, une buanderie et un cellier. Les finitions sont prévues dans un esprit haut de gamme, aligné sur des standards internationaux.",
  features: [
    "3 chambres avec salles de bain privatives",
    "Cuisine ouverte avec îlot central",
    "Cuisine africaine",
    "Buanderie et cellier",
    "Véranda couverte finition bois",
    "Finitions haut de gamme",
    "Standards internationaux",
    "Piscine en option",
  ],
  detailGroups: [
    {
      title: "Espace nuit",
      items: [
        "Suite parentale avec salle de bain et WC privatifs",
        "Deux chambres supplémentaires avec salle de bain privative",
        "Salle de bain dans chaque chambre",
        "Toilette visiteur",
      ],
    },
    {
      title: "Cuisine et service",
      items: [
        "Cuisine ouverte meublée et équipée avec îlot central",
        "Cuisine africaine",
        "Buanderie",
        "Cellier",
      ],
    },
    {
      title: "Finitions et extérieur",
      items: [
        "Finitions haut de gamme aux standards internationaux",
        "Véranda couverte finition bois",
        "Piscine disponible en option",
      ],
    },
  ],
};

const portfolioCapabilities = [
  "Conception et optimisation des espaces",
  "Projection 3D et choix des matières",
  "Cuisines intégrées",
  "Décoration et mise en ambiance",
  "Décoration, home staging et Airbnb",
  "Pilotage et valorisation immobilière",
];

const xgoneInternationalProjects = [
  {
    type: "Showrooms automobile",
    title: "CFAO Motors Togo",
    location: "Lomé, Togo",
    client: "CFAO Motors Togo",
    amount: "1,020 milliard FCFA",
    period: "Livré en 2025",
    status: "Livré",
    summary:
      "Construction de trois showrooms et rénovation de l'existant pour un acteur automobile de référence.",
    highlights: ["Tertiaire premium", "Rénovation en site existant", "Image de marque"],
  },
  {
    type: "Immeuble commercial",
    title: "Grand Marché de Lomé",
    location: "Lomé, Togo",
    client: "Client privé",
    amount: "1,100 milliard FCFA",
    period: "En cours",
    status: "En cours",
    summary:
      "Projet commercial d'envergure au coeur d'un pôle marchand stratégique de la capitale togolaise.",
    highlights: ["Commerce", "Structure d'envergure", "Pilotage privé"],
  },
  {
    type: "Institution publique",
    title: "Institution de la République Togolaise",
    location: "Lomé, Togo",
    client: "État togolais",
    amount: "300 millions FCFA HT",
    period: "Livré en 2025",
    status: "Livré",
    summary:
      "Rénovation de bureaux institutionnels avec une exigence élevée de discrétion, de finition et de continuité d'usage.",
    highlights: ["Institutionnel", "Rénovation lourde", "Finitions soignées"],
  },
  {
    type: "Ministère",
    title: "Cabinet du Ministre de l'Urbanisme",
    location: "Lomé, Togo",
    client: "Ministère de l'Urbanisme, de l'Habitat et de la Réforme Foncière",
    amount: "210 millions FCFA",
    period: "Livré en 2025",
    status: "Livré",
    summary:
      "Rénovation d'un espace ministériel sensible, pensé pour conjuguer représentation, fonctionnalité et qualité d'exécution.",
    highlights: ["Administration", "Espace de représentation", "Exécution maîtrisée"],
  },
  {
    type: "Réhabilitation industrielle",
    title: "Ancienne usine textile de Datcha",
    location: "Datcha, Togo",
    client: "BENART Togo",
    amount: "400 millions FCFA",
    period: "Livré en 2024",
    status: "Livré",
    summary:
      "Rénovation d'une partie d'un site industriel existant, avec reprise des volumes et requalification des espaces.",
    highlights: ["Industrie", "Réhabilitation", "Requalification"],
  },
  {
    type: "Entrepôts",
    title: "Deux entrepôts à Lomé",
    location: "Lomé, Togo",
    client: "CCT BATIMAT",
    amount: "1,300 milliard FCFA",
    period: "Livré en 2019",
    status: "Livré",
    summary:
      "Construction d'infrastructures logistiques pensées pour la fonctionnalité, la robustesse et la performance d'exploitation.",
    highlights: ["Logistique", "Bâtiment industriel", "Grande capacité"],
  },
  {
    type: "Diplomatie",
    title: "Consulat de Slovaquie",
    location: "Lomé, Togo",
    client: "Consulat de Slovaquie",
    amount: "220 millions FCFA",
    period: "Livré en 2021",
    status: "Livré",
    summary:
      "Rénovation et extension d'un siège consulaire avec une attention particulière portée à l'image institutionnelle.",
    highlights: ["Extension", "Institution diplomatique", "Standing"],
  },
  {
    type: "Résidentiel haut standing",
    title: "Duplex privé à Lomé",
    location: "Lomé, Togo",
    client: "Client privé",
    amount: "520 millions FCFA",
    period: "Livré en 2023",
    status: "Livré",
    summary:
      "Construction résidentielle premium illustrant le savoir-faire X-GONE sur les logements privés de standing.",
    highlights: ["Villa duplex", "Client privé", "Finitions premium"],
  },
];

const xgoneAdditionalReferences = [
  "Rénovation du stade municipal de Tsévié pour l'État togolais.",
  "Rénovation du bâtiment principal de la Direction Générale de la CEET à Lomé.",
  "Construction d'une église et d'une communauté à Sokodé.",
  "Construction d'une église pour les Soeurs du Cénacle Togo.",
  "Plusieurs duplex résidentiels privés réalisés à Lomé.",
];

const partnerPhotoItems = (items) =>
  items.map(([title, category, location, filename]) => ({
    title,
    category,
    location,
    src: partnerRealisationAsset(filename),
  }));

const partnerRealisationPhotoGroups = [
  {
    partner: "X-GONE BTP",
    source: "Plaquette X-GONE BTP",
    title: "Réalisations X-GONE BTP",
    intro:
      "Photos de références partenaires issues de la plaquette X-GONE BTP : bureaux institutionnels, showrooms, sites industriels, équipements publics et résidentiel.",
    items: partnerPhotoItems([
      ["Institution de la République Togolaise - bureaux 01", "Institutionnel", "Lomé, Togo", "xgone-institution-republique-bureaux-01.jpg"],
      ["Institution de la République Togolaise - bureaux 02", "Institutionnel", "Lomé, Togo", "xgone-institution-republique-bureaux-02.jpg"],
      ["Institution de la République Togolaise - bureaux 03", "Institutionnel", "Lomé, Togo", "xgone-institution-republique-bureaux-03.jpg"],
      ["Cabinet du Ministre de l'Urbanisme", "Institutionnel", "Lomé, Togo", "xgone-cabinet-ministre-urbanisme.jpg"],
      ["CFAO Motors Togo - showrooms", "Tertiaire commercial", "Lomé, Togo", "xgone-cfao-motors-showrooms.jpg"],
      ["Ancienne usine textile de Datcha", "Réhabilitation industrielle", "Datcha, Togo", "xgone-usine-textile-datcha.jpg"],
      ["Duplex privé à Lomé", "Résidentiel haut standing", "Lomé, Togo", "xgone-duplex-prive-lome.jpg"],
      ["Église des Soeurs du Cénacle", "Communautaire", "Lomé, Togo", "xgone-eglise-soeurs-cenacle.jpg"],
      ["Duplex à Lomé", "Résidentiel", "Lomé, Togo", "xgone-duplex-lome.jpg"],
      ["Consulat de Slovaquie à Lomé", "Diplomatie", "Lomé, Togo", "xgone-consulat-slovaquie-lome.jpg"],
      ["Ministère du Commerce - bâtiment principal", "Bâtiment public", "Lomé, Togo", "xgone-ministere-commerce.jpg"],
      ["Entrepôt CCT BATIMAT 01", "Logistique", "Lomé, Togo", "xgone-entrepot-cct-batimat-01.jpg"],
      ["Église et communauté à Sokodé", "Communautaire", "Sokodé, Togo", "xgone-eglise-communaute-sokode.jpg"],
      ["Stade municipal de Tsévié", "Équipement public", "Tsévié, Togo", "xgone-stade-municipal-tsevie.jpg"],
      ["Entrepôt CCT BATIMAT 02", "Logistique", "Lomé, Togo", "xgone-entrepot-cct-batimat-02.jpg"],
      ["Direction Générale de la CEET", "Bâtiment public", "Lomé, Togo", "xgone-direction-generale-ceet.jpg"],
      ["Références résidentielles à Lomé", "Résidentiel", "Lomé, Togo", "xgone-references-residentielles-lome.jpg"],
    ]),
  },
  {
    partner: "GE Architectes & Partenaires (GEAP)",
    source: "Pressbook GEAP",
    title: "Réalisations et références GEAP",
    intro:
      "Sélection de références du pôle architecture, urbanisme et ingénierie GEAP, entité commune avec ARASAKA.",
    items: partnerPhotoItems([
      ["Berges lagunaires - Lomé Croisière", "Urbanisme", "Lomé, Togo", "geap-berges-lagunaires-lome-croisiere.jpg"],
      ["Littoral de Lomé Plage", "Urbanisme", "Lomé, Togo", "geap-littoral-lome-plage.jpg"],
      ["Immeuble de bureaux - Groupe Nana", "Bureaux", "Lomé, Togo", "geap-immeuble-bureaux-groupe-nana.jpg"],
      ["25 mairies au Togo et commerce extérieur", "Bâtiments publics", "Togo", "geap-mairies-togo-commerce-exterieur.jpg"],
      ["Complexe à Cotonou et siège Togo Telecom", "Bureaux", "Bénin / Togo", "geap-complexe-cotonou-togo-telecom.jpg"],
      ["BGFI Bank - Libreville et Port-Gentil", "Bureaux", "Gabon", "geap-bgfi-bank-gabon.jpg"],
      ["Bureaux bord de mer et Direction CEET", "Bureaux", "Gabon / Togo", "geap-bureaux-bord-mer-ceet.jpg"],
      ["Village balnéaire Les Palétuviers", "Hôtellerie", "Assinie, Côte d'Ivoire", "geap-village-balneaire-assinie.jpg"],
      ["Hôtel à Lomé et Blue Turtle", "Hôtellerie", "Lomé, Togo", "geap-hotel-lome-blue-turtle.jpg"],
      ["Mall commercial à Lomé", "Commercial", "Lomé, Togo", "geap-mall-commercial-lome.jpg"],
      ["Showrooms CFAO et CCT BATIMAT", "Commercial", "Togo", "geap-showrooms-cfao-cct-batimat.jpg"],
      ["Port fluvial et lagunaire de Dabou", "Aménagement portuaire", "Dabou, Côte d'Ivoire", "geap-port-fluvial-lagunaire-dabou.jpg"],
      ["Revalorisation des lagunes", "Urbanisme", "Lomé, Togo", "geap-revalorisation-lagunes.jpg"],
      ["Église et communauté à Sokodé", "Communautaire", "Sokodé, Togo", "geap-eglise-communaute-sokode.jpg"],
      ["École du Lycée Français de Lomé", "Écoles et universités", "Lomé, Togo", "geap-lycee-francais-lome.jpg"],
      ["Cité Renaissance", "Résidentiel", "Lomé, Togo", "geap-cite-renaissance-lome.jpg"],
      ["Projets résidentiels à Lomé 01", "Résidentiel", "Lomé, Togo", "geap-residentiel-lome-01.jpg"],
      ["Mini-cité en bordure de mer à Baguida", "Résidentiel", "Baguida, Togo", "geap-mini-cite-baguida.jpg"],
      ["Projets résidentiels à Lomé 02", "Résidentiel", "Lomé, Togo", "geap-residentiel-lome-02.jpg"],
      ["Mini-cité de 4 villas haut standing", "Résidentiel haut standing", "Togo", "geap-mini-cite-villas-standing.jpg"],
      ["Palais présidentiel secondaire 01", "Prestige", "Afrique de l'Ouest", "geap-palais-presidentiel-secondaire-01.jpg"],
      ["Palais présidentiel secondaire 02", "Prestige", "Afrique de l'Ouest", "geap-palais-presidentiel-secondaire-02.jpg"],
      ["Hôtel palace de prestige", "Prestige hôtelier", "Lomé, Togo", "geap-hotel-palace-prestige.jpg"],
    ]),
  },
];

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
      "ARASAKA et GE Architectes & Partenaires (GEAP) forment une seule et même entité, réunissant bâtiment, architecture, urbanisme et ingénierie pour renforcer les études, la qualité des choix architecturaux, la coordination du projet et la maîtrise des délais.",
    internationalPartner:
      "X-GONE BTP, partenaire international basé à Lomé au Togo, entreprise générale de construction et de rénovation active sur projets publics et privés, bâtiments de prestige et infrastructures.",
    legalOperationsPartner:
      "GROUPE ROYAL CONSULTING (GR CONSULTING), cabinet de management juridique en Côte d'Ivoire, accompagne la création, la gestion, la formation, l'assistance juridique, le recouvrement et la régularité des opérations.",
    standards:
      "ARASAKA travaille avec des artisans et techniciens formés dans les meilleurs lycées techniques du pays, dans une culture de chantier alignée sur les normes internationales.",
    finishPromise:
      "ARASAKA met toute son expertise au service de finitions à la hauteur des standards internationaux les plus exigeants.",
    phone: contactPhone,
    telHref: contactPhoneHref,
    whatsappPhone,
    whatsappNumber,
    whatsappHref: `https://wa.me/${whatsappNumber}`,
    email: contactEmail,
    emailHref: `mailto:${contactEmail}`,
    gmailHref: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`,
  },
  nav: [
    { href: "/", key: "home", label: "Accueil" },
    { href: "/qui-sommes-nous", key: "about", label: "Qui sommes-nous" },
    { href: "/diaspora", key: "diaspora", label: "Diaspora" },
    { href: "/realisations", key: "portfolio", label: "Réalisations" },
    { href: "/plans", key: "plans", label: "Inspirations" },
    { href: "/materiaux", key: "materials", label: "Matériaux" },
    { href: "/services", key: "services", label: "Prestations" },
    { href: "/contact", key: "contact", label: "Contact" },
  ],
  images: {
    hero: asset("hero-villa-btc-piscine-lagon.png"),
    portfolioHero: portfolioAfricanManagerImage,
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
      "ARASAKA et GEAP, une même entité",
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
      title: "Finalisation d'appartements et villas",
      short:
        "Achèvement, personnalisation et finitions d'appartements ou de villas acquis en promotion immobilière.",
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
      title: "Pôle architecture GEAP",
      short:
        "ARASAKA et GE Architectes & Partenaires (GEAP) agissent comme une seule entité pour assurer la cohérence des études, du suivi et des délais.",
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
      title: "Villa basse premium 3 chambres",
      slug: "compact",
      surface: "150 - 190 m2",
      imageKey: "whiteVillaGarden01",
      features: [
        "Suite parentale avec salle de bain et WC",
        "2 chambres supplémentaires avec salle de bain privative",
        "Salle de bain dans chaque chambre",
        "Toilette visiteur",
        "Cuisine ouverte meublée et équipée avec îlot central",
        "Cuisine africaine",
        "Buanderie",
        "Cellier",
        "Finitions haut de gamme aux standards internationaux",
        "Véranda couverte finition bois",
      ],
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
  portfolioCategories,
  portfolioItems,
  portfolioVirtualTours,
  partnerRealisationPhotoGroups,
  xgoneInternationalProjects,
  xgoneAdditionalReferences,
  homeVillaVideo,
  portfolioCapabilities,
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
        "Plans, principes de ventilation, vues, choix des espaces extérieurs et coordination portée par l'entité ARASAKA - GEAP.",
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

