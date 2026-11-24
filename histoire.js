/* =====================================================================
   LA RELÈVE — histoire de l'appli automatique « VEILLE »
   Le joueur est l'opérateur·rice de télésurveillance de nuit.
   Jetons : {P} prénom · {,P} « , prénom » · {e} accord (e / rien / ·e)
   Toutes les fonctions (leo, ask, keypad…) sont définies dans index.html.
   ===================================================================== */

const DOCS = {
  registre:    { title: "Journal des badges — SS-B",        src: "medias/02_registre.jpg" },
  plan:        { title: "Plan d'évacuation — SS-B",          src: "medias/04_plan.jpg" },
  supervision: { title: "Journal de supervision technique",  src: "medias/05_supervision.jpg" },
  gestion:     { title: "Capture — téléphone de Léo",        src: "medias/06_gestion_appareil.jpg" },
  radiation:   { title: "Lettre trouvée par terre",          src: "medias/07_radiation.jpg" },
  sang:        { title: "Photo — grille S.14",               src: "medias/16_sang_porte.jpg" },
  postit:      { title: "Post-it — grille S.14",             src: "medias/09_postit_grille.jpg" },
  etiquette:   { title: "Étiquette — cadenas du quai",       src: "medias/10_etiquette_quai.jpg" },
};

const CAMS = [
  { id: 'c1', label: 'CAM 01 · COULOIR PRINCIPAL', src: 'medias/01_couloir.jpg' },
  { id: 'c2', label: 'CAM 02 · COULOIR DE SERVICE', src: 'medias/cam_service.jpg' },
  { id: 'c3', label: 'CAM 03 · ISSUE EST (S.14)',   src: 'medias/cam_s14.jpg' },
  { id: 'c4', label: 'CAM 04 · LOCAL TECHNIQUE',    src: 'medias/cam_service.jpg' },
];

const OUI = /\b(oui|ouais|yes|y a|ya|quelqu|silhouette|ombre|homme|mec|type|personne au fond|au fond|yeux|forme|vu|vois)\b/;

const CHAPTERS = [

  /* 1 — Prise de poste */
  async () => {
    await sys("Connexion au site ARCHIVES NORD — sous-sol B… OK");
    await sys("Gardien en poste : MOREAU Léo · badge L-511");
    await sleep(5000);
    camLost('c4'); await sys("⚠ CAM 04 · LOCAL TECHNIQUE — signal perdu");
    await sleep(3500);
    camLost('c1'); camLost('c2'); await sys("⚠ CAM 01, CAM 02 — signal perdu");
    await sleep(2500);
    await leo("Salut ! C'est toi qui prends le poste ce soir ? Moi c'est Léo, le gardien de nuit 👋");
    await leo("Les caméras du sous-sol B viennent de couper. Tu les vois de ton côté ?");
    await reply(70000);
    await leo("Ouais chez moi aussi c'est noir. Et le badge du SS-B répond plus.");
    await leo("Je descends voir. Reste en ligne stp, j'ai qu'une barre de réseau en bas.");
  },

  /* 2 — Le couloir */
  async () => {
    await sleep(22000);
    await ghostTyping(5000);
    await sleep(6000);
    await leo("Mon écran est fissuré, j'y vois rien dans le noir. La porte au fond du couloir, elle est ouverte ou c'est moi ?", { img: 'medias/01_couloir.jpg' });
    await reply(75000);
    await leo("Je l'avais fermée à ma ronde de 20h. J'aime pas ça.");
  },

  /* 3 — Le journal des badges (énigme 1) */
  async () => {
    await leo("Toi t'as le journal des badges sur ton poste. Tu peux regarder s'il y a encore quelqu'un dans le bâtiment à part moi ?");
    await addDoc('registre');
    await ask({
      ok: [/vasseur|julien|j\s?-?\s?732|\b732\b/],
      hints: [
        "Regarde la colonne SORTIE, y en a qui sont jamais repartis ?",
        "Moi c'est L-511, arrivé à 19h50. Y a quelqu'un d'autre sans heure de sortie ?",
        "Vasseur… c'est pas le nom qu'on m'a dit de jamais laisser entrer ?",
      ],
    });
    await leo("Vasseur ?? C'est le gars qui s'est fait virer en septembre…");
    await leo("Comment il a pu passer avec un badge désactivé ?");
  },

  /* 4 — Les bruits, la photo par la vitre */
  async () => {
    await sleep(4000);
    await leo("", { audio: 'medias/03_vocal_bruits.mp3', typingLabel: 'enregistre un audio…' });
    await sleep(45000);
    await ghostTyping(7000);
    await sleep(15000);
    await leo("Il est juste devant le local technique. Je me suis enfermé dedans.");
    await sleep(9000);
    await leo("J'ai pris une photo par la vitre pour voir s'il est parti. Moi je vois rien. Toi tu vois quelqu'un ?", { img: 'medias/11_photo_silhouette.jpg' });
    const r = await reply(90000);
    if (r && OUI.test(norm(r))) await leo("Quoi ? Où ça ?");
    else await leo("Attends… au fond. Dans l'encadrement de la porte.");
    await sleep(3000);
    await burst(["Y avait personne quand je l'ai prise.", "Je te jure.", "Y AVAIT PERSONNE."], 1600);
    await sleep(20000);
  },

  /* 5 — Le digicode (énigme 2) */
  async () => {
    await leo("J'ai décroché le plan au mur. Il bloque le couloir principal.", { img: 'medias/04_plan.jpg' });
    await addDoc('plan', true);
    await leo("Y a une porte derrière moi, sur le couloir de service, avec un digicode. Toi tu peux l'ouvrir à distance depuis ton poste !");
    await leo("Le code doit être noté quelque part sur le journal des badges.");
    await keypad({
      title: 'PORTE S.12 · ARRIÈRE', sub: 'Ouverture à distance',
      code: ['408', '408#'],
      hints: [
        "Y a une note de sécurité en bas du journal des badges, non ?",
        "Ça parle du chef de site. Il est dans la liste ?",
        "Son badge c'est M-quelque chose. Juste les 3 chiffres, puis #.",
      ],
    });
    await sys("🔓 PORTE S.12 (arrière) — ouverture à distance — opérateur : {P}");
    await leo("Ça a marché !! Je passe dans le couloir de service.");
    await leo("Je coupe le son, je te tiens au courant.");
    await addDoc('supervision');
    await sleep(25000);
    await intrus("Merci pour le code, {P}.");
    await sleep(15000);
  },

  /* 6 — Paranoïa (énigme 3) */
  async () => {
    await leo("Ne l'écoute pas. Il te ment depuis le début.", { fast: true });
    await sleep(4000);
    deleteLast(); glitch(900);
    await reply(60000);
    await leo("Quoi ?? J'ai rien supprimé moi ! Mon tel fait n'importe quoi, des messages partent tout seuls.");
    await sleep(6000);
    await leo("J'ai fouillé dans les réglages, y a ce truc. C'est le tel du boulot.", { img: 'medias/06_gestion_appareil.jpg' });
    await addDoc('gestion', true);
    await leo("ADM-408… ça te dit quelque chose ?");
    await ask({
      ok: [/delacroix|marc|chef|408|m\s?-?\s?408|directeur|patron/],
      hints: [
        "408, j'ai déjà vu ce numéro ce soir non ?",
        "C'est pas le code de la porte de tout à l'heure ?",
        "Le matricule du chef de site, c'était quoi déjà ?",
      ],
    });
    await leo("Le chef de site ?? Mais il est parti à 17h05, c'est marqué sur le journal…");
    await sleep(8000);
    camBack('c2', 'medias/11_photo_silhouette.jpg');
    await sys("CAM 02 · COULOIR DE SERVICE — signal rétabli");
    await sleep(7000);
    camLost('c2');
    await sleep(10000);
  },

  /* 7 — Le vocal, la caméra 0 */
  async () => {
    await leo("Écoute…", { fast: true });
    await leo("", { audio: 'medias/13_vocal_ecoute.mp3', typingLabel: 'enregistre un audio…' });
    await sleep(40000);
    await sys("⚠ CAM 00 · POSTE OPÉRATEUR — connexion entrante");
    await sleep(1200);
    await cam0("JE TE VOIS, {P}.");
    await sleep(4000);
    await intrus("Tu es sûr{e} d'aider la bonne personne ?");
    await sleep(5000);
    setLeo({ avatar: 'medias/15_profil_noir.jpg', status: 'il est encore là' });
    await sys("Léo a modifié sa photo de profil.");
    await sleep(15000);
  },

  /* 8 — La lettre (énigme 4) */
  async () => {
    setLeo({ status: 'en ligne' });
    await leo("J'ai rien touché à mon profil. Je te jure.");
    await sleep(5000);
    await leo("Y a des feuilles partout devant la salle de tri. Ça sent le cramé, le broyeur tourne tout seul. Regarde, c'était dans le tas.", { img: 'medias/07_radiation.jpg' });
    await addDoc('radiation', true);
    await leo("Vasseur s'est fait virer pour ça ??");
    await sleep(6000);
    await leo("Attends. Y a un truc sous les feuilles.", { fast: true });
    await ghostTyping(6000);
    await sleep(5000);
    await leo("C'est une main.");
    await burst(["Y a du sang partout.", "C'est Vasseur. Il a encore son badge autour du cou.", "Il a la gorge ouverte. Il bouge plus.", "putain putain putain"], 2200);
    await sleep(9000);
    await leo("Il est mort depuis des heures, il est froid. Alors QUI se balade avec son badge depuis 19h42 ?? Comment son badge désactivé a pu marcher ?");
    await ask({
      ok: [/reactiv|r[ée]-?activ|adm|408|delacroix|chef|supervision/],
      hints: [
        "T'as un journal de supervision sur ton poste, non ? Regarde entre 19h30 et 19h45.",
        "Le badge de Vasseur était désactivé… quelqu'un l'a réactivé ?",
        "19h38, réactivation manuelle… par quel opérateur ?",
      ],
    });
    await leo("Donc Delacroix a réactivé le badge d'un mort pour faire croire que c'était lui… et il a coupé les caméras.");
    await reply(45000);
    await leo("Je sais plus qui croire.");
  },

  /* 9 — L'appel */
  async () => {
    await sleep(12000);
    const r = await fakeCall({ title: 'LÉO · Interphone', audio: 'medias/14_appel_souffle.mp3' });
    await sleep(2500);
    if (r === 'answered') await leo("Pardon. Je pouvais pas parler. Il était juste derrière la porte.");
    else await leo("Décroche quand j'appelle stp… Il était juste derrière la porte.");
  },

  /* 10 — Le silence (micro) */
  async () => {
    await sleep(6000);
    await leo("Il revient.", { fast: true });
    await leo("Ton micro d'interphone est ouvert de mon côté. S'il entend quoi que ce soit, il saura où je suis.");
    await leo("Ne fais AUCUN bruit.");
    const res = await silenceTest(22);
    if (res === 'heard') {
      S.flags.heard = true; save();
      await leo("IL T'A ENTENDU.", { fast: true });
      await leo("Il a cassé la vitre de la porte. Il a passé le bras, il m'a eu à l'épaule avec un truc coupant.");
      await leo("Ça saigne beaucoup. Je cours.");
    } else {
      await leo("…il s'éloigne. J'ai cru que mon cœur allait lâcher.");
    }
  },

  /* 11 — La sortie (énigme 5) : chrono final */
  async () => {
    await sleep(4000);
    if (!S.flags.heard){ await leo("Il m'a eu. Je sais pas d'où il est sorti, au bras, avec un cutter je crois."); await leo("Ça arrête pas de saigner, je mets la main dessus."); }
    await leo("J'ai deux sorties : la grille de l'issue Est (salle 14) ou le quai de livraison (salle 3). Il revient. JE VAIS OÙ ?", { video: 'medias/08_video_couloir.mp4' });
    startChrono(S.flags.heard ? 240 : 300);
    const v = await choice([
      { label: '🚪 Salle 14 — la grille', value: 'G', match: /\b14\b|grille|est\b/ },
      { label: '📦 Salle 3 — le quai',   value: 'Q', match: /\b3\b|quai|livraison|roulante/ },
    ], { idle: 50000, hint: "Regarde la légende en bas du plan, VITE ! Qui peut contrôler la grille ?" });
    S.flags.route = v; save();
  },

  /* 12 — La fuite (énigme 6) */
  async () => {
    if (S.flags.route === 'G' && !S.flags.leftGrid) {
      await leo("jsuis devant la grille. y a une main en sang sur la porte. cest pas la mienne", { img: 'medias/16_sang_porte.jpg' });
      await leo("Y a un post-it sur le boîtier. Toi tu peux envoyer le code d'urgence depuis ton poste. VITE", { img: 'medias/09_postit_grille.jpg' });
      await addDoc('postit');
      const r = await keypad({
        title: 'GRILLE S.14 · CODE URGENCE', sub: 'Envoi à distance',
        code: ['1432'], maxWrong: 2,
        hints: [
          "La salle c'est la 14, ça fait déjà les deux premiers chiffres.",
          "Le dernier badge entré avant 19h45, c'était lequel ?",
          "C'était quoi le numéro de badge de Vasseur déjà ??",
        ],
      });
      if (r === 'fail') return ending('silence');
      await leo("Attends…", { fast: true });
      await leo("Le voyant est passé au vert AVANT que ton code arrive. La grille s'ouvre toute seule. C'est normal ??");
      const v = await choice([
        { label: '🏃 Sors, vite !',                   value: 'out', match: /sors|vas.?y|go|cours|fonce|ouvre/ },
        { label: '↩️ Non ! Fais demi-tour, va au quai', value: 'Q',  match: /non|quai|demi|retour|piege|pi[eè]ge|attends/ },
      ], { idle: 40000, hint: "Qui d'autre que toi peut ouvrir cette grille à distance ?" });
      if (v === 'out') return ending('piege');
      S.flags.leftGrid = true; save();
      await leo("Ok ok je fais demi-tour, je cours au quai.");
    }
    await leo("jsuis au quai. jvois flou, jai perdu bcp de sang");
    await leo("Cadenas à 4 chiffres sur la porte roulante, y a une étiquette. C'est qui K.M. ?? Donne moi la combinaison VITE", { img: 'medias/10_etiquette_quai.jpg' });
    await addDoc('etiquette');
    const r = await keypad({
      title: 'CADENAS QUAI', sub: 'Transmettre la combinaison à Léo',
      code: ['1815'], maxWrong: 2,
      hints: [
        "K.M., il doit être sur le journal des badges !",
        "Mansour… Karim, de la maintenance. Il est parti à quelle heure ?",
        "Son heure de départ en 4 chiffres, genre 2145 !",
      ],
    });
    if (r === 'fail') return ending('silence');
    stopChrono();
  },

  /* 13 — Dehors (énigme 7) */
  async () => {
    await leo("", { audio: 'medias/fin_survie.mp3', typingLabel: 'enregistre un audio…' });
    await leo("C'EST OUVERT. Je suis dehors !!");
    await sleep(8000);
    await leo("Je suis à l'abri. J'ai pris une des feuilles R-9 dans ma veste. Les flics arrivent.");
    await leo("{P}… c'était qui, d'après toi ? Je leur dis quoi ?");
    const v = await choice([
      { label: 'Marc DELACROIX',  value: 'D', match: /delacroix|marc|chef/ },
      { label: 'Julien VASSEUR',  value: 'V', match: /vasseur|julien/ },
      { label: 'Karim MANSOUR',   value: 'M', match: /mansour|karim/ },
      { label: 'Sophie BENALI',   value: 'B', match: /benali|sophie/ },
    ], { idle: 120000 });
    S.flags.accused = v; save();
    return ending(v === 'D' ? 'verite' : 'bouc');
  },
];

const ENDINGS = {
  verite: {
    n: 1, title: 'LA VÉRITÉ',
    run: async () => {
      await leo("Delacroix… Les caméras, le badge de Vasseur, mon téléphone… tout vient de lui.");
      await leo("Je leur donne tout. Merci{,P}. Vraiment.");
      await sleep(9000);
      await intrus("Tu aurais dû rester en dehors de ça, {P}.");
    },
    text: "Léo est sorti et le vrai coupable est démasqué. Marc Delacroix, le chef de site, détruisait les preuves de sa fraude. Il a attiré Vasseur aux Archives et l'a tué, puis il a réactivé son badge pour faire croire qu'il était entré. Depuis le début, il contrôlait aussi le téléphone de Léo.",
  },
  bouc: {
    n: 2, title: 'LE BOUC ÉMISSAIRE',
    run: async () => {
      await leo(S.flags.accused === 'V' ? "Vasseur ?? Mais il est mort, je l'ai vu… Ok… je leur dis ce que tu veux." : "Ok. Je leur dis.");
      await sleep(9000);
      await intrus(S.flags.accused === 'V' ? "Accuser un mort. Bien joué, {P}." : "Merci pour ton aide, {P}. Bonne nuit.");
    },
    text: "Léo est sorti… mais tu as désigné la mauvaise personne. Vasseur est mort dans la Réserve R-9, et celui qui l'a tué court toujours.",
  },
  piege: {
    n: 3, title: 'LE PIÈGE',
    run: async () => {
      stopChrono();
      await leo("Je sors. Y a quelqu'un dehors avec une lampe… il me fait signe. C'est peut-être les secours");
      await sleep(5000);
      await leo("", { audio: 'medias/fin_echec.mp3', typingLabel: 'enregistre un audio…' });
      setLeo({ avatar: null, status: '' });
      await sleep(9000);
      await jumpScare();
      await intrus("Il est avec moi maintenant.");
      push({ who:'intrus', img:'medias/17_trainee.jpg', text:T("Bonne nuit, {P}.") });
    },
    text: "La grille s'est ouverte toute seule… parce que celui qui a tué Vasseur attendait Léo derrière.",
  },
  silence: {
    n: 4, title: 'SILENCE',
    run: async () => {
      stopChrono();
      await sleep(6000);
      await leo("", { audio: 'medias/fin_echec.mp3', typingLabel: 'enregistre un audio…' });
      setLeo({ avatar: null, status: '' });
      await sleep(9000);
      await jumpScare();
      push({ who:'intrus', img:'medias/17_trainee.jpg', text:T("Trop tard, {P}. Il ne répondra plus.") });
    },
    text: "Le temps s'est écoulé. Léo ne répondra plus.",
  },
};
