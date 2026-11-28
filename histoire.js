/* =====================================================================
   LA RELÈVE — histoire v2.5 de l'appli « VEILLE »
   Le joueur est l'opérateur·rice #42. Léo (L-511) est le gardien du Sous-Sol B.
   Jetons : {P} prénom · {,P} « , prénom » · {e} accord (e / rien)
   Toutes les fonctions (leo, faux, journal, keypad…) sont définies dans index.html.
   ===================================================================== */

/* ---------------------------------------------------------------------
   MÉDIAS : pour chaque clé, le jeu essaie les fichiers dans l'ordre.
   1er = fichier FINAL (nom du kit de production, à déposer dans medias/)
   suivants = PROVISOIRES (générés par gen/provisoires.py ou vocaux v1).
   --------------------------------------------------------------------- */
const MEDIA = {
  // Photos de Léo (couleur, verticales, flash)
  couloir:      ['medias/couloir_ch2.jpg', 'medias/01_couloir.jpg'],
  registre:     ['medias/02_registre.jpg'],
  plan:         ['medias/plan_ssb.jpg', 'medias/04_plan.jpg'],
  vitre_sil:    ['medias/vitre_silhouette.jpg', 'medias/provisoire/vitre_silhouette.jpg'],
  vitre_vide:   ['medias/vitre_vide.jpg', 'medias/provisoire/vitre_vide.jpg'],
  gestion:      ['medias/gestion_maint104.jpg'],
  trainee:      ['medias/trainee_sang_vasseur.jpg', 'medias/provisoire/trainee_sang_vasseur.jpg'],
  sang_grille:  ['medias/sang_grille_s14.jpg', 'medias/16_sang_porte.jpg'],
  postit:       ['medias/postit_1432.jpg', 'medias/provisoire/postit_1432.jpg'],
  cadenas:      ['medias/cadenas_km.jpg', 'medias/provisoire/cadenas_km.jpg'],
  // Documents
  radiation:    ['medias/radiation_annotee.jpg'],
  note_r9:      ['medias/note_r9.jpg', 'medias/provisoire/note_r9.jpg'],
  supervision:  ['medias/supervision_maint104.jpg'],
  // Flux caméras (N&B, vue plongeante, sans texte incrusté)
  cam01_vide:   ['medias/cam01_couloir_vide.jpg', 'medias/provisoire/cam01_couloir_vide.jpg'],
  cam01_sil:    ['medias/cam01_couloir_silhouette.jpg', 'medias/provisoire/cam01_couloir_silhouette.jpg'],
  cam02_vide:   ['medias/cam02_service_vide.jpg', 'medias/provisoire/cam02_service_vide.jpg'],
  cam02_sil:    ['medias/cam02_service_silhouette.jpg', 'medias/provisoire/cam02_service_silhouette.jpg'],
  cam03_vide:   ['medias/cam03_grille_vide.jpg', 'medias/provisoire/cam03_grille_vide.jpg'],
  cam03_sil:    ['medias/cam03_grille_s14.jpg', 'medias/provisoire/cam03_grille_s14.jpg'],
  cam03_obj:    ['medias/cam03_objectif.jpg', 'medias/provisoire/cam03_objectif.jpg'],
  // Sons
  nappe:        ['medias/nappe_ssb.m4a', 'medias/nappe_ssb.wav'],          // absente : nappe synthétisée par le code
  a0:           ['medias/audio0_leo_ancrage.mp3', 'medias/provisoire/audio0_leo_ancrage.mp3'],
  a1:           ['medias/audio1_vasseur_1940.mp3', 'medias/provisoire/audio1_vasseur_1940.mp3'],
  a2:           ['medias/audio2_appel_faux_leo.mp3', 'medias/provisoire/audio2_appel_faux_leo.mp3'],
  a3:           ['medias/audio3_binaural_22s.mp3', 'medias/provisoire/audio3_binaural_22s.mp3'],
  a3_echec:     ['medias/audio3_echec.mp3', 'medias/provisoire/audio3_echec.mp3'],
  a4_poignee:   ['medias/audio4_poignee.mp3', 'medias/provisoire/audio4_poignee.mp3'],
  a4_parquet:   ['medias/audio4_parquet.mp3', 'medias/provisoire/audio4_parquet.mp3'],
  a5_secours:   ['medias/audio5_secours.mp3', 'medias/provisoire/audio5_secours.mp3'],
  fin4_souffle: ['medias/audio_fin4_souffle.mp3', 'medias/provisoire/audio_fin4_souffle.mp3'],
  ch4_coups:    ['medias/ch4_coups.mp3', 'medias/provisoire/ch4_coups.mp3'],
  ch7_vocal:    ['medias/ch7_vocal_inaudible.mp3', 'medias/provisoire/ch7_vocal_inaudible.mp3'],
  ch7_coup:     ['medias/ch7_coup_sec.mp3', 'medias/provisoire/ch7_coup_sec.mp3'],
  ch7_obtu:     ['medias/ch7_obturateur.mp3', 'medias/provisoire/ch7_obturateur.mp3'],
  fin3_echec:   ['medias/fin3_echec.mp3', 'medias/provisoire/fin3_echec.mp3'],
  fin3_choc:    ['medias/fin3_choc.mp3', 'medias/provisoire/fin3_choc.mp3'],
  fin1_pas:     ['medias/fin1_pas_droite.mp3', 'medias/provisoire/fin1_pas_droite.mp3'],
};

const DOCS = {
  acces:       { title: 'Accès commandés à distance',            type: 'acces' },
  equipe:      { title: 'Qui est qui · personnel du site',       type: 'equipe' },
  badges:      { title: 'Journal des badges — SS-B',             type: 'badges' },
  plan:        { title: "Plan d'évacuation — SS-B",              img: 'plan' },
  a1:          { title: 'Archive interphone · SS-B · 19:40',      type: 'audio', audio: 'a1' },
  gestion:     { title: 'Capture — téléphone de service L-511',  img: 'gestion' },
  radiation:   { title: 'Notification de radiation · J-732',     img: 'radiation' },
  note:        { title: 'Note de procédure · Réserve R-9',       img: 'note_r9' },
  supervision: { title: 'Journal de supervision technique',      img: 'supervision' },
  r41:         { title: 'Relevé de session — poste #41',         type: 'r41' },
  r42:         { title: 'Relevé de session — poste #42',         type: 'r42' },
};

/* Journal des badges (affiché sur le poste de l'opérateur) */
const BADGES = [
  ['DELACROIX Marc', 'M-408', '08:12', '17:05', 'CHEF SITE'],
  ['BENALI Sophie',  'S-219', '08:45', '17:30', 'ACTIF'],
  ['MANSOUR Karim',  'K-104', '09:00', '18:15', 'MAINT.'],
  ['VASSEUR Julien', 'J-732', '19:42', '--:--', 'RADIÉ*'],
  ['MOREAU Léo',     'L-511', '19:50', '--:--', 'GARDE NUIT'],
];

/* Relevé #41 (nuit de la rotation 2024-08) */
const R41 = [
  ['23:14:02', 'Connexion validée. Clauses PTI-N signées.'],
  ['23:29:44', 'Commande S.12 (408#) – OUVERT (verrou R-9 libéré)'],
  ['23:36:18', 'Absence opérateur détectée (00:11)'],
  ['23:41:05', 'Contrôle CAM 00 : portrait enregistré'],
  ['23:51:12', 'Retour audio gardien coupé (confort opérateur)'],
  ['23:54:30', 'Signal gardien SS-B : perte de liaison'],
  ['23:57:49', 'Micro opérateur : bruit de poignée détecté'],
  ['23:58:03', 'Déconnexion anormale.'],
  ['23:58:04', 'POSTE VACANT. Flux CAM 00 maintenu ouvert.[!]', 'orange'],
];
const R41_LAST = "En attente de l'opérateur #42.";

const CAMS = [
  { id: 'c0', label: 'CAM 00 · POSTE OPÉRATEUR' },
  { id: 'c1', label: 'CAM 01 · COULOIR PRINCIPAL', src: 'cam01_vide' },
  { id: 'c2', label: 'CAM 02 · COULOIR DE SERVICE', src: 'cam02_vide' },
  { id: 'c3', label: 'CAM 03 · GRILLE S.14',        src: 'cam03_vide' },
];

/* Briefing d'accueil (avant le portail) : texte seul, sur la nappe.
   Chaque carton : lignes affichées l'une après l'autre. hold = secondes de lecture après la dernière ligne.
   img = image du MEDIA affichée au-dessus des lignes. */
const BRIEFING = {
  titre: 'ARCHIVES NORD · FORMATION',
  intro: ['FORMATION OBLIGATOIRE', 'Avant votre première nuit de surveillance, une courte présentation (1 min).', 'Mettez vos écouteurs.', 'Avant de commencer : bouton silencieux désactivé (sur la tranche), verrouillage automatique sur «\u00a0Jamais\u00a0», mode Ne pas déranger.'],
  lancer: 'COMMENCER',
  cartons: [
    { lines: ['ARCHIVES NORD', 'Service de surveillance de nuit', 'Formation des nouveaux opérateurs'], hold: 1.5, style: 'head' },
    { lines: ['Ce soir, vous surveillez un bâtiment d\'archives.', 'À distance, depuis chez vous, avec votre téléphone.'], hold: 2 },
    { lines: ['Le lieu : le Sous-Sol B.', 'Deux étages sous terre. Des couloirs, des réserves, un local technique.'], img: 'plan', hold: 3.5 },
    { lines: ['Sur place, un seul gardien : Léo.', 'Il fait sa ronde avec une lampe et un téléphone.', 'Il ne connaît aucun code.'], hold: 2 },
    { lines: ['Vous, vous avez :', '· le chat avec Léo', '· les caméras du sous-sol', '· les dossiers du site', '· les codes des portes, à envoyer à distance'], hold: 2.5, style: 'list' },
    { lines: ['Votre mission : veiller sur Léo jusqu\'à la fin de sa ronde.'], hold: 2 },
    { lines: ['Les personnes du site :', '· Marc Delacroix · chef de site', '· Karim Mansour · maintenance', '· Léo Moreau · gardien de nuit', 'La liste complète est dans vos dossiers.'], hold: 2.5, style: 'list' },
    { lines: ['Vous travaillez seul·e, de chez vous, la nuit.', 'Pour votre sécurité, l\'entreprise doit savoir où vous êtes. Votre dossier vous le demandera.'], hold: 2 },
    { lines: ['L\'opérateur d\'avant, le n° 41, a quitté son poste en pleine nuit.', 'Sans prévenir. Le poste est libre.'], hold: 2.5 },
    { lines: ['Trois règles.', '1. Restez dans l\'appli. Chaque absence est notée.', '2. Écouteurs, lumière basse, seul·e dans la pièce.'], hold: 2 },
    { lines: ['3. N\'ouvrez aucune porte sans l\'accord de la Direction.'], hold: 3.5, style: 'warn' },
    { lines: ['Fin de la formation · {HH:MM}', 'Remplissez maintenant votre dossier de prise de poste.'], hold: 0, style: 'end' },
  ],
  bouton: 'REMPLIR MON DOSSIER',
};

/* Personnel du site (dossier « Qui est qui », disponible dès le début) */
const EQUIPE = [
  ['Marc DELACROIX', 'Chef de site', 'M-408'],
  ['Sophie BENALI',  'Administration', 'S-219'],
  ['Karim MANSOUR',  'Maintenance', 'K-104'],
  ['Léo MOREAU',     'Gardien de nuit (sur place ce soir)', 'L-511'],
  ['Vous',           'Opérateur·rice de surveillance à distance', '#42'],
];

/* Panneau « Accès » : portes commandées à distance. from = chapitre où la porte apparaît. */
const ACCES = [
  { id: 's12', nom: 'S.12 · porte arrière du local technique', format: '3 chiffres + #', ou: 'Note sécurité en bas du journal des badges', from: 5 },
  { id: 's14', nom: 'S.14 · grille de la salle 14', format: '4 chiffres', ou: 'Sur place : demande à Léo ce qu\'il voit', from: 11 },
  { id: 's3',  nom: 'S.3 · cadenas K.M. du quai', format: '4 chiffres', ou: 'Le propriétaire du cadenas : qui est K.M. ?', from: 11 },
];

/* Hors créneau et persistance (portail) */
const PORTAIL = {
  horsCreneau: 'Aucune relève disponible. Prochaine prise de poste : 22:00.',
  statut: {
    verite:  () => 'Poste #42 · fin de garde enregistrée · statut : reconduit · prochaine garde : ce soir 23:00',
    bouc:    () => 'Poste #42 · clôturé · prime de discrétion versée',
    piege:   () => `Poste #42 · vacant · Poste #43 · candidature reçue · ${hms()}`,
    silence: () => `Poste #42 · vacant · Poste #43 · candidature reçue · ${hms()}`,
  },
};

/* =====================================================================
   CHAPITRES (Ch. 0 = portail, géré par le moteur)
   ===================================================================== */
/* Relève courte (20 min) : C(normal, courte) choisit la valeur selon le format de garde. */
const C = (n, c) => S.court ? c : n;

const CHAPTERS = [

  /* Ch. 1 — Prise de poste (0–3 min) */
  async () => {
    nappe.start();
    await addDoc('acces', true, true); await addDoc('equipe', true); await addDoc('plan', true);
    await sleep(C(2500, 1500));
    camBlip('c2');                      // parasite bénin : la bande caméras est un flux vivant
    await sleep(C(2500, 1500));
    await leo("salut ?");
    await leo("ah nickel ya quelqun au poste ce soir");
    await leo(C("léo, garde de nuit ss-b. jai cru que jallais encore faire la ronde tout seul comme mardi", "léo, garde de nuit ss-b"));
    await reply(C(60000, 45000));
    await leo("enchanté {P}");
    if (!S.court) await leo("par contre je te préviens leur café du distributeur a un goût de liquide vaisselle et il fait genre 12 degrés en bas");
    await leo("ma copine inès finit sa garde aux urgences à 6h jlui ai promis les croissants donc faut que je tienne");
    await leo(C("ils tont prévenu que cam 02 saute toutes les dix minutes ? karim devait passer voir ça avant de partir mais bon", "et cam 02 saute toutes les dix minutes, karim devait passer voir ça mais bon"));
    await reply(C(30000, 20000));
    await sleep(C(4000, 3000));
    camSet('c1', { off: true }); camSet('c2', { off: true });
    await journal('CAM 01 · CAM 02 · signal perdu');
    await sleep(C(3000, 2000));
    if (S.court) await leo("ok bon bah super. tout est passé au noir chez toi aussi ?");
    else { await leo("ok bon bah super"); await leo("tu les as encore toi ou tout est passé au noir ?"); }
    await reply(C(60000, 30000));
    await leo('', { audio: 'a0' });
    await sleep(14000);
  },

  /* Ch. 2 — Le couloir (3–6 min) · Piège 2 activé */
  async () => {
    S.flags.p2 = true; save();
    if (S.court){
      await sleep(2000);
      await leo("jsuis au sous sol b, ça pue lhumidité");
      await sleep(3000);
      await leo('', { img: 'couloir' });
      await leo("la porte tout au fond elle est ouverte là non ?");
      await leo("je te jure que je lai tirée à 20h en prenant ma garde");
      await reply(45000);
      await leo("bon jme fais des films. je vais au poste de garde voir qui a badgé ce soir");
      return;
    }
    await sleep(14000);
    await leo("jsuis au sous sol b");
    await leo("ça pue lhumidité ici cest fou, on dirait un parking abandonné");
    await leo("attends deux secondes");
    await sleep(4000);
    await leo('', { img: 'couloir' });
    await leo("dis moi que jhallucine");
    await leo("la porte tout au fond elle est ouverte là non ?");
    await leo("je te jure que je lai tirée à 20h en prenant ma garde, jai même entendu le loquet claquer");
    await reply(75000);
    await leo("ya pas de fenêtre ici on est deux étages sous terre");
    await leo("bon ok jme fais des films cest sûrement quelqun de laprem qui a mal claqué le battant");
    await leo("laisse moi deux minutes je vais jeter un œil au poste de garde voir qui a badgé ce soir, histoire de pas déclencher une alerte pour rien sur ma période dessai");
  },

  /* Ch. 3 — Journal des badges (É1) · Piège 13 */
  async () => {
    await sleep(C(9000, 5000));
    for (let i = 0; i < C(3, 2); i++){ await ghostTyping(2600); if (i === 0) camBlip('c3'); await sleep(C(4000, 3000)); }
    await sleep(C(6000, 3000));
    await leo("bon jsuis au poste de garde");
    await leo('', { img: 'registre' });
    await leo("cest le journal des badges de ce soir. toi tu las aussi sur ton poste normalement");
    await addDoc('badges');
    S.flags.obsBadges = true; save();
    await leo("ya encore quelqun dans le bâtiment à part moi ?");
    await ask({
      ok: [/vasseur|julien|j\s?-?\s?732|\b732\b/],
      hints: [
        "regarde la colonne sortie, ya des gens qui sont jamais repartis ?",
        "moi cest l-511, arrivé à 19h50. ya quelquun dautre sans heure de sortie ?",
        "attends… vasseur. cest pas le nom quils mont dit de jamais laisser entrer ?",
      ],
    });
    S.flags.obsBadges = false; save();
    if (S.court){
      await leo("vasseur ?? cest larchiviste qui sest fait virer en septembre");
      await leo("radié le 12/09. comment il a pu badger à 19h42 avec un badge désactivé");
      return;
    }
    await leo("vasseur ??");
    await leo("cest larchiviste qui sest fait virer en septembre");
    await leo("radié le 12/09 cest écrit. comment il a pu badger à 19h42 avec un badge désactivé");
  },

  /* Ch. 4 — Les bruits & archive 19h40 · Pièges 6a, 9, 13 */
  async () => {
    await sleep(C(6000, 4000));
    await leo(C("tas lheure toi ? ma montre sest arretée sur 19:40 jsais meme pas quand", "tas lheure toi ? ma montre sest arretée sur 19:40"));
    if (!S.court) await leo("bref");
    await sleep(C(9000, 5000));
    nappe.cut();
    const vc = await leo('', { audio: 'ch4_coups', typingLabel: 'enregistre un audio…' });
    await voiceDone(vc, 40000);        // la photo arrive après le vocal (29 s), pas pendant
    await sleep(C(5000, 3000));
    await leo('', { img: 'vitre_sil', pair: 'vitre_vide' });
    await leo("tu vois quelquun toi ?");
    readMode('hold');
    const r = await reply(C(90000, 60000));
    if (r){ markRead(); await sleep(C(40000, 15000)); }
    readMode('auto');
    if (S.court) await leo("pardon jai pas osé bouger, jtenais le tel contre moi pour pas que lécran éclaire");
    else { await leo("pardon jai pas osé bouger"); await leo("jtenais le tel contre moi pour pas que lécran éclaire"); }
    await sleep(C(5000, 3000));
    await journal('Archive interphone · SS-B · 19:40 · restaurée');
    await addDoc('a1', true);
    nappe.back();
    await sleep(C(25000, 10000));
  },

  /* Ch. 5 — Le digicode et la première fêlure (É2 + Caméra active #1) */
  async () => {
    if (S.court) await leo("il est parti je crois. jai le plan dévacuation devant moi");
    else { await leo("il est parti je crois. jentends plus rien"); await leo("jai le plan dévacuation au mur devant moi"); }
    await leo('', { img: 'plan' });
    await addDoc('plan', true);
    if (S.court) await leo("ya une porte arrière avec un digicode. tu peux louvrir depuis ton poste, le code doit être sur le journal des badges");
    else {
      await leo("ya une porte arrière dans le local, sur le couloir de service. avec un digicode");
      await leo("toi tu peux louvrir à distance depuis ton poste non ? le code doit être noté quelque part sur le journal des badges");
    }
    await keypad({
      acc: 's12', title: 'PORTE S.12 · ARRIÈRE', sub: 'Commande à distance · opérateur #42',
      code: ['408#', '408'],
      hints: [
        "ya une note sécurité en bas du journal des badges non ?",
        "ça parle du chef de site. il est dans la liste ?",
        "son badge cest m-quelque chose. juste les 3 chiffres puis #",
      ],
    });
    r42('Commande S.12 (408#) – OUVERT (verrou R-9 libéré)');
    await journal('Porte S.12 · ouverture à distance · opérateur #42');
    if (S.court) await leo("ça a marché. cam 02 saute, tu peux la forcer ? dis moi quand cest dégagé et jtraverse");
    else {
      await leo("ça a marché");
      await leo("ok jsuis dans le couloir de service");
      await leo("cam 02 elle saute mais toi tu peux la forcer non ? dis moi quand cest dégagé et jtraverse");
    }
    const ok = await traversal();
    if (ok){
      await leo("jy vais", { fast: true });
      await sleep(3000);
    } else {
      S.wounds++; save();
      await burst(["putain", "il etait là", "il ma eu au bras jsais pas avec quoi", "jsuis passé mais ça saigne"], 1800);
    }
    await sleep(C(27000, 10000));
    await faux("Je suis passé dans le couloir de service. Tout va bien.");
    await sleep(C(10000, 6000));
    await leo("putain jai cru quil etait juste derriere moi", { fast: true });
    if (!S.court) await leo("mon cœur tape à 200 là attends jreprends mon souffle");
  },

  /* Ch. 6 — MAINT-104 et l'écran observé (É3) · Pièges 3, 4, 7a */
  async () => {
    S.flags.p3 = true; save();
    await sleep(C(3000, 2000));
    camBlip('c3', 'blip', 400);
    await sleep(C(3000, 2000));
    await leo("attends faut que je te dise un truc", { fast: true });
    await sleep(C(3500, 2500));
    deleteLast(); microGlitch();
    await sleep(C(6000, 4000));
    if (S.court){
      await leo("jai rien supprimé moi. mon tel fait nimporte quoi");
      await leo("regarde les réglages du tel de service");
    } else {
      await leo("jai rien supprimé moi");
      await leo("mon tel fait nimporte quoi depuis tout à lheure");
      await leo("jai été voir dans les réglages du tel de service, regarde");
    }
    await leo('', { img: 'gestion' });
    await addDoc('gestion', true);
    await leo("maint-104 cest quoi ce truc ? quelquun a la main sur mon tel là");
    await ask({
      ok: [/karim|mansour|k\s?-?\s?104|\b104\b|maint/],
      hints: [
        "104… jai déjà vu ce numéro ce soir. sur les badges ?",
        "maint cest la maintenance non ? qui sen occupe ici ?",
        "k-104… cest pas karim ça ?",
      ],
    });
    if (S.court) await leo("karim ?? il ma filé un double de badge ce matin en rigolant… pourquoi il ferait ça");
    else {
      await leo("karim ??");
      await leo("nan attends tu rigoles il ma encore filé un double de badge ce matin en rigolant");
      await leo("pourquoi il prendrait la main sur mon tel de service à cette heure là…");
    }
    const p3 = await waitFor(() => S.flags.p3first, C(40000, 20000));
    await sleep(p3 ? C(20000, 8000) : 3000);
    await faux("Ce n'est pas grave. Continue comme ça, tu fais très bien ton travail, {P}.");
    await sleep(C(12000, 6000));
    await camReconnect();               // pastille verte : caméra frontale réactivée en silence
    await sleep(C(20000, 10000));
  },

  /* Ch. 7 — Noir absolu & CAM 00 (Jump scare #1) · Pièges 4, 5, 9 */
  async () => {
    await leo("chut", { fast: true });
    const v = await leo('', { audio: 'ch7_vocal', typingLabel: 'enregistre un audio…', onPlay: () => nappe.cut() });
    await voiceDone(v, 30000);
    nappe.cut();
    await sleep(600);
    await play('ch7_coup');
    const shot = await darkCapture();
    r42('Contrôle CAM 00 : portrait enregistré');
    archivePortrait(shot, `Archive R-9 · portrait opérateur #42 · ${hms()} · ${S.local} · porte : ${S.porte} (déclaré)`);
    setLeo({ avatar: null });
    await sleep(C(15000, 8000));
    nappe.back();
    camSet('c1', { off: false });
    S.flags.periph = true; save();
    await sleep(6000);
  },

  /* Ch. 8 — Le corps, la R-9 et le bruit domestique (É4) · Pièges 14, 8a */
  async () => {
    await sleep(C(8000, 4000));
    await leo("jvais voir au fond vers le broyeur");
    await sleep(C(5000, 3000));
    await fakeCrash([
      { text: "tétais où ??" },
      { text: "{P} jai trouvé quelque chose" },
      { img: 'trainee' },
      { text: "ça part du broyeur" },
      { text: "cest lui. cest vasseur" },
    ]);
    await sleep(C(9000, 5000));
    if (S.court) await leo("ya des feuilles partout devant le broyeur. lis ça stp moi jy arrive pas jai les mains qui tremblent");
    else await leo("ya des feuilles partout par terre devant le broyeur. jte prends en photo tout ce qui est lisible");
    await addDoc('radiation');
    await addDoc('note');
    await addDoc('supervision');
    if (!S.court) await leo("lis ça stp moi jy arrive pas jai les mains qui tremblent");
    await sleep(3000);
    await journal('Relevé #41 · versé au dossier opérateur #42');
    await addDoc('r41', true);
    S.flags.obsR41 = true; save();
    let done = await waitFor(() => S.flags.p8done, C(120000, 60000));
    if (!done){ await journal('Relevé #41 · consultation requise · opérateur #42'); done = await waitFor(() => S.flags.p8done, C(60000, 30000)); }
    if (done) await sleep(C(12000, 8000));
    S.flags.obsR41 = false; save();
  },

  /* Ch. 9 — Sabotage et appel impossible · Piège 7a */
  async () => {
    await leo("{P} tas lu ? dis moi cest qui");
    await sabotage("C'est bon, le couloir est calme maintenant. Avance vers la salle 14.", C(90000, 45000));
    await sleep(1800);
    await leo("attends quoi ?? pk tu me dis daller en 14", { fast: true });
    await sleep(2500);
    await fakeCall({
      title: 'LÉO · Interphone', audio: 'a2',
      cues: [
        [8,  () => leo("cest pas moi qui tappelle raccroche !!", { fast: true })],
        [20, () => leo("RACCROCHE IL EST JUSTE DERRIERE LA VITRE", { fast: true })],
      ],
    });
    await sleep(C(5000, 3000));
    await leo("jsais plus qui croire");
    await sleep(C(8000, 4000));
  },

  /* Ch. 10 — Les 22 secondes en binaural (Jump scare #2 si raté) */
  async () => {
    await leo("il revient", { fast: true });
    if (S.court) await leo("ton micro dinterphone il est ouvert de mon côté, sil entend quoi que ce soit il saura où je suis");
    else { await leo("ton micro dinterphone il est ouvert de mon côté"); await leo("sil entend quoi que ce soit il saura où je suis"); }
    await sleep(2500);
    const res = await silenceBinaural();
    r42('Silence requis : ' + (res === 'ok' ? 'respecté' : 'rompu'));
    S.flags.periph = false;
    if (res !== 'ok'){
      S.wounds++; S.flags.silFail = true; save();
      await sleep(2500);
      await burst(["IL A CASSÉ LA VITRE", "il ma eu", "jcours"], 1400);
    } else {
      save();
      await sleep(3000);
      await leo("il sest éloigné");
      if (!S.court) await leo("jai cru que mon cœur allait lâcher");
    }
  },

  /* Ch. 11 — La sortie (É5 + Caméra active #2) · Pièges 7b, 12 */
  async () => {
    await sleep(3000);
    if (S.court) await leo("faut que je sorte. sur le plan ya la grille de la salle 14 ou le quai, salle 3");
    else { await leo("faut que je sorte dici"); await leo("sur le plan ya deux sorties. la grille de la salle 14 ou le quai, salle 3"); }
    startChrono(S.court ? (S.flags.silFail ? 120 : 150) : (S.flags.silFail ? 240 : 300));
    if (!S.court) showComfort();       // relève courte : pas de bouton Confort opérateur (Piège 7b)
    camSet('c3', { src: 'cam03_sil' }); S.flags.cam03 = 1; save();
    await sleep(C(2500, 1500));
    // garder le regard sur CAM 03 au moins 3,5 s (la silhouette surgit collée à l'objectif)
    await leo(C("attends. regarde cam 03 la grille. tout au fond à gauche, la porte elle bouge ou cest moi ?", "regarde cam 03. au fond à gauche, la porte elle bouge ?"));
    await sleep(C(3500, 2500));
    await faux("Le quai est bloqué de l'extérieur. Le couloir est calme maintenant, tu peux ouvrir la grille de la salle 14, je suis juste devant.");
    await sleep(1200);
    const v = await stolenVoice();
    await voiceDone(v, 12000);
    await sleep(3000);
    await burst(["ECOUTE PAS", "jai pas ecrit ça bordel", "et cest qui qui parle là", "dis moi où je vais 14 ou le quai VITE"], 1300);
    const r = await choice([
      { label: 'Grille S.14 · salle 14', value: 'G', match: /\b14\b|grille/ },
      { label: 'Quai S.3 · salle 3',     value: 'Q', match: /\b3\b|quai|livraison/ },
    ], { idle: C(45000, 25000), hint: "VITE {P} 14 ou le quai" });
    S.flags.route = r; save();
    r42('Sortie indiquée au gardien : ' + (r === 'G' ? 'S.14' : 'S.3'));
  },

  /* Ch. 12 — La fuite (É6) · Piège 6b */
  async () => {
    if (S.flags.route === 'G' && !S.flags.leftGrid){
      await leo("jsuis devant la grille");
      await leo('', { img: 'sang_grille' });
      await leo("ya du sang sur les barreaux cest pas le mien");
      await leo('', { img: 'postit' });
      await leo("ya un post-it sur le digicode. envoie le code depuis ton poste VITE");
      const k = await keypad({
        acc: 's14', title: 'GRILLE S.14', sub: "Code d'urgence · envoi à distance",
        code: ['1432'], maxWrong: 2, priority: true,
      });
      if (k === 'fail') return ending('silence');
      await leo("attends", { fast: true });
      await leo("le voyant est passé au vert tout seul. jai même pas encore reçu ton code");
      const v = await choice([
        { label: 'Sors, vite',                   value: 'out', match: /sors|vas.?y|go|cours|fonce|ouvre/ },
        { label: 'Non. Demi-tour, va au quai',   value: 'Q',   match: /non|quai|demi|retour|pi[eè]ge|attends/ },
      ], { idle: C(40000, 20000), hint: "{P} je sors ou pas ??" });
      if (v === 'out') return ending('piege');
      S.flags.leftGrid = true; save();
      chronoPenalty(C(50, 25));
      await leo("ok ok jfais demi tour");
      await sleep(C(8000, 4000));
    }
    S.flags.p6b = true; save();
    if (S.wounds === 0){
      await leo("ok jsuis devant le quai jai le cadenas avec létiquette K.M. devant les yeux", { img: 'cadenas' });
      await leo("faut 4 chiffres tu te rappelles à quelle heure il a badgé en sortant ??");
      await leo("fais vite jentends les néons qui claquent dans le couloir derrière moi");
    } else if (S.wounds === 1){
      await leo("jsuis au quai", { img: 'cadenas' });
      await leo("mon bras pisse le sang jai du mal à tenir le tel");
      await leo("ya un cadenas K.M. 4 chiffres cest quoi le code stp vite");
    } else {
      await leo("jarive pas a tenir debout", { img: 'cadenas' });
      await leo("cadenas km");
      await leo("4 chifres {P} stp jai plus de force");
      await leo("il march pas il court pas il arrive juste vite");
    }
    const k = await keypad({
      acc: 's3', title: 'CADENAS QUAI · K.M.', sub: 'Combinaison à transmettre à L-511',
      code: ['1815'], maxWrong: 2,
      hints: S.wounds < 2
        ? ["k.m. cest qui ? il est sur les badges ?", "mansour… il est parti à quelle heure ?"]
        : ["pas ça", "vite"],
    });
    if (k === 'fail') return ending('silence');
    stopChrono();
  },

  /* Ch. 13 — Dehors (É7) · saisie libre, pas de QCM */
  async () => {
    hideComfort();
    await sleep(C(6000, 3000));
    if (S.court){
      await leo("jsuis dehors, les flics viennent de rentrer par le portail");
      await leo("jai la feuille R-9 sur moi mais ils me demandent qui a ouvert le sous sol. je leur donne quel nom ?");
    } else {
      await leo("jsuis dehors");
      await leo("jsuis sur le parking les flics viennent de rentrer par le portail");
      await leo("jai la feuille R-9 sur moi mais ils me demandent qui a ouvert le sous sol");
      await leo("dis moi vite je leur donne quel nom ?");
    }
    let tries = 0;
    while (true){
      const r = await reply(0); const n = norm(r);
      if (/delacroix|marc|chef|\b408\b|direction/.test(n)){ S.flags.named = r; save(); return ending('verite'); }
      if (/karim|mansour|\b104\b/.test(n)){ S.flags.named = r; S.flags.accused = 'K'; save(); return ending('bouc'); }
      if (/vasseur|julien|\b732\b/.test(n)){ S.flags.named = r; S.flags.accused = 'V'; save(); return ending('bouc'); }
      if (/benali|sophie/.test(n)) await leo("benali ? elle est partie à 17h30… tes sûr ? donne moi un nom vite");
      else await leo(tries++ ? "un nom {P}. ils attendent" : "qui ? jai besoin dun nom de famille, vite");
    }
  },
];

/* =====================================================================
   LES 4 FINS (chacune se termine sur le relevé #42)
   ===================================================================== */
const ENDINGS = {
  verite: async () => {
    await leo("ok je leur dis marc delacroix, je leur montre la note et le journal");
    await leo("merci {P}… putain je tremble encore");
    await leo("jvais appeler inès");
    await leo("déconnecte toi et rentre te coucher");
    r42(`Nom transmis : ${S.flags.named}. Fin de garde enregistrée.`);
    r42('OPÉRATEUR RECONDUIT. Flux CAM 00 maintenu ouvert.[!]', 'orange');
    S.r42last = 'Prochaine relève : ce soir 23:00.'; save();
    await sleep(6000);
    await soberEnd('Fin de garde enregistrée. Merci pour votre service.', 5000);
    await camZeroLine();
    closeShift('verite');
  },

  bouc: async () => {
    if (S.flags.accused === 'K') await leo("ok je leur donne karim mansour, ils partent vérifier son poste");
    else await leo("vasseur ? mais il est mort en bas… attends les flics me croient pas");
    await sleep(9000);
    await direct(S.flags.accused === 'K' ? "Il t'a bien aidé pour le quai, pourtant. Merci, {P}." : "Accuser un mort. Bien joué, {P}.");
    r42(`Nom transmis : ${S.flags.named}. Dossier clôturé.`);
    r42('POSTE CLÔTURÉ. Flux CAM 00 maintenu ouvert.[!]', 'orange');
    S.r42last = 'Prime de discrétion versée.'; save();
    await sleep(5000);
    closeShift('bouc');
  },

  piege: async () => {
    stopChrono(); hideComfort();
    r42('Déverrouillage prioritaire S.14 : DIRECTION', '', S.flags.prioT);
    await fin3();   // 8 s d'impuissance sur CAM 03, vocal d'échec, choc, noir, notification d'Inès
    r42('Signal gardien SS-B : perte de liaison');
    r42('Déconnexion anormale.');
    r42('POSTE VACANT. Flux CAM 00 maintenu ouvert.[!]', 'orange');
    S.r42last = "En attente de l'opérateur #43."; save();
    closeShift('piege', true);
  },

  silence: async () => {
    stopChrono(); hideComfort();
    nappe.stop(); cutChat(); setLeo({ avatar: 'none', status: '' });
    await sleep(2500);
    const v = await leo('', { audio: 'fin4_souffle', fast: true, autoplay: true });
    await voiceDone(v, 6000);
    await blackout(5000);
    r42('Délai opérateur dépassé.');
    r42('Signal gardien SS-B : perte de liaison');
    r42('Déconnexion anormale.');
    r42('POSTE VACANT. Flux CAM 00 maintenu ouvert.[!]', 'orange');
    S.r42last = "En attente de l'opérateur #43."; save();
    closeShift('silence', true);
  },
};
