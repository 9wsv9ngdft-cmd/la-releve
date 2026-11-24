/* =====================================================================
   LA RELÈVE — scénario (v3, version « vrai numéro »)
   Jetons remplacés automatiquement dans la console :
     {P}   prénom du joueur (toujours, l'intrus le connaît)
     {,P}  « , Prénom » ou rien
     {,L}  « , Prénom » seulement si le joueur l'a donné à Léo
     {e}   accord : « e » (féminin), « » (masculin) ou « ·e »
   Les messages de l'intrus sont entre ``` pour apparaître en police
   machine dans WhatsApp, dans la conversation de Léo.
   ===================================================================== */

const STORY = {
  truth: "Marc Delacroix, chef de site (matricule M-408), détruit ce soir les archives de la Réserve R-9 qui prouvent sa fraude (bordereaux de destruction antidatés). Il a coupé les caméras, réactivé le badge de Julien Vasseur (l'archiviste qu'il a fait virer pour l'avoir découvert) pour lui faire porter le chapeau, et il contrôle à distance le téléphone de service de Léo (profil de gestion ADM-408). Vasseur n'est PAS dans le bâtiment. La seule sortie sûre est le quai (cadenas mécanique, hors système) : la grille de l'issue Est est électronique, Delacroix peut l'ouvrir et l'attendre derrière."
};

const STEPS = [
  /* ------------------------------------------------------------ ACTE 1 */
  { id:'1', act:1, time:'20:00', who:'leo', title:'Intro Karim',
    text:"Karim tu dors ? Le badge du sous-sol B répond plus et les caméras viennent de couper. Dis-moi que c'est toi qui fais la maintenance." },
  { id:'2', act:1, time:'après sa réponse', who:'leo', title:'Excuse erreur',
    text:"Merde désolé, j'ai dû me gourer d'un chiffre dans le répertoire 😬 Je suis gardien de nuit aux Archives Nord, c'est ma 2e semaine. J'ai une barre de réseau au sous-sol, impossible de joindre le poste de garde." },
  { id:'2b', act:1, time:'juste après', who:'leo', title:'Demander le prénom',
    text:"Au fait t'es qui ? Que je t'enregistre pas sous « numéro inconnu » 😅",
    note:"S'il ou elle donne son prénom : coche « a donné son prénom à Léo » en haut. Sinon, laisse décoché : Léo ne l'utilisera pas, mais l'intrus, lui, le connaîtra (message 13 bis)." },
  { id:'3', act:1, time:'20:20', who:'leo', title:'Photo couloir', media:'01_couloir.jpg',
    text:"Désolé de te redéranger{,L}. Mon écran est fissuré, j'y vois rien dans le noir. La porte au fond du couloir, elle est ouverte ou c'est moi qui hallucine ?" },
  { id:'4', act:1, time:'20:35', who:'leo', title:'Annonce registre',
    text:"Ok je flippe pas mais c'est pas normal. Le PC de sécurité est allumé, je t'envoie l'écran des badges de ce soir. Tu peux me dire s'il y a encore quelqu'un dans le bâtiment à part moi ?" },

  /* ------------------------------------------------------------ ACTE 2 */
  { id:'5', act:2, time:'20:50', who:'leo', title:'Photo registre', media:'02_registre.jpg', enigma:'E1',
    text:"Tiens. J'ai pas le temps de tout lire, dis-moi vite si tu vois un truc louche." },
  { id:'6', act:2, time:'dès « Vasseur »', who:'leo', title:'Vocal bruits', media:'03_vocal_bruits.mp3',
    text:"", timer:{ label:'Silence total', min:5, note:"« écrit… » fantôme : tape quelques lettres puis efface, sans rien envoyer. Attends 1 min, puis étape 7." },
    note:"Envoie le vocal puis silence radio complet, même s'il ou elle écrit." },
  { id:'7', act:2, time:'+6 min', who:'leo', title:'Enfermé',
    text:"Il est juste devant le local technique. Je me suis enfermé dedans. Vasseur… c'est le gars viré en septembre, on m'a dit de jamais le laisser entrer. Comment il a pu passer avec un badge désactivé ??" },
  { id:'8', act:2, time:'21:25', who:'leo', title:'Photo plan', media:'04_plan.jpg', enigma:'E2',
    text:"J'ai décroché le plan au mur. Il bloque le couloir principal. Y a une porte derrière moi avec un digicode, tu vois le code sur l'écran des badges de tout à l'heure ? Et je vais où après ?" },
  { id:'8b', act:2, time:'juste après', who:'leo', title:'Écran supervision', media:'05_supervision.jpg',
    text:"Y a aussi un écran de supervision allumé ici. Je comprends rien à ce qu'il raconte, garde-le au cas où.",
    note:"Document clé pour plus tard (énigme 4). Ne pas aider dessus maintenant." },
  { id:'9', act:2, time:'dès 408# + chemin', who:'leo', title:'Code validé',
    text:"Ça a marché ! Je suis dans le couloir de service. Je coupe le son, je te tiens au courant." },
  { id:'9b', act:2, time:'+2 min', who:'intrus', title:"1er message de l'intrus",
    text:"```Merci pour le code{,P}.```",
    note:"Envoyé depuis le numéro de Léo : l'intrus parle dans sa conversation. Puis 3 min sans répondre." },

  /* ------------------------------------------------------------ ACTE 3 */
  { id:'10', act:3, time:'21:50', who:'intrus', title:'Message piégé (à supprimer)',
    text:"Ne l'écoute pas. Il te ment depuis le début.",
    timer:{ label:'Supprimer pour tous', sec:4, note:"Appui long sur le message › Supprimer › Supprimer pour tous" },
    note:"Écrit comme Léo (pas de ```). 4 s après : « Supprimer pour tous »." },
  { id:'11', act:3, time:'quand il/elle réagit', who:'leo', title:'Léo nie',
    text:"Quoi ?? J'ai rien supprimé moi ! Mon tel fait n'importe quoi, des messages partent tout seuls." },
  { id:'11b', act:3, time:'+2 min', who:'leo', title:'Capture réglages', media:'06_gestion_appareil.jpg', enigma:'E3',
    text:"J'ai fouillé dans les réglages, y a ce truc. C'est le tel du boulot. C'est normal ça ??" },
  { id:'12', act:3, time:'22:05', who:'call', title:'Appel masqué', media:'appel_masque.mp3',
    text:"#31# puis le numéro du joueur. Dès qu'il/elle décroche : joue l'audio près du micro, puis raccroche net. Pas de réponse ? Laisse l'audio sur la messagerie.",
    note:"Appelle depuis un téléphone que le joueur ne connaît pas, ou depuis le tien en #31#." },
  { id:'13', act:3, time:'22:15', who:'intrus', title:'Doute',
    text:"```Tu es sûr{e} d'aider la bonne personne{,P} ?```" },
  { id:'13bis', act:3, time:'+1 min', who:'intrus', title:"L'intrus connaît son prénom", onlyIfNameHidden:true,
    text:"```Tu ne lui as jamais dit ton prénom. Moi je le connais, {P}.```",
    note:"Seulement si le joueur n'a pas donné son prénom à Léo." },
  { id:'14', act:3, time:'22:25', who:'leo', title:'Lettre de radiation', media:'07_radiation.jpg', enigma:'E4',
    text:"Y a des feuilles partout par terre devant la salle de tri. Ça sent le cramé, le broyeur tourne tout seul. Regarde, c'était dans le tas. Vasseur il a été viré pour ça ??" },
  { id:'15', act:3, time:'22:35', who:'leo', title:'Qui est-ce ?',
    text:"Je comprends plus rien. Vasseur il est où ? Et qui écrit dans mon tel ?? Toi tu crois que c'est qui ?",
    note:"Laisse le joueur raisonner. Ne confirme rien : Léo doute de tout. Réponses toutes prêtes dans l'onglet Impro." },

  /* ------------------------------------------------------------ ACTE 4 */
  { id:'16', act:4, time:'22:45', who:'leo', title:'Vidéo + choix de sortie', media:'08_video_couloir.mp4', enigma:'E5',
    text:"Il est dans le couloir de service, je l'entends. J'ai deux sorties : la grille de l'issue Est (salle 14) ou le quai de livraison (salle 3) avec la porte roulante. JE VAIS OÙ ?" },

  { id:'G1', act:4, branch:'G', time:'s\'il/elle dit : salle 14', who:'leo', title:'Grille : post-it', media:'09_postit_grille.jpg', enigma:'E6G',
    text:"J'y suis. La grille est bloquée, y a un post-it sur le boîtier. Il arrive, donne-moi les 4 chiffres VITE !",
    timer:{ label:'CHRONO FINAL', min:5, note:"Temps écoulé ou 2 codes faux → FIN 4" } },
  { id:'G2', act:4, branch:'G', time:'dès 1432', who:'leo', title:'Dernière chance',
    text:"Attends… le voyant est passé au vert AVANT que je tape le dernier chiffre. La grille s'est ouverte toute seule. C'est normal ??",
    note:"Dernière chance. « Sors » → FIN 3. « Retourne au quai » → Q1 (le chrono continue)." },

  { id:'Q1', act:4, branch:'Q', time:'s\'il/elle dit : quai', who:'leo', title:'Quai : cadenas', media:'10_etiquette_quai.jpg', enigma:'E6Q',
    text:"Je suis au quai. Cadenas à 4 chiffres sur la porte roulante, y a une étiquette scotchée. K.M. c'est qui ?? VITE",
    timer:{ label:'CHRONO FINAL', min:5, note:"Temps écoulé ou 2 codes faux → FIN 4" },
    note:"Si le chrono tourne déjà (retour depuis la grille), ne le relance pas." },
  { id:'Q2', act:4, branch:'Q', time:'dès 1815', who:'leo', title:'Dehors !', media:'fin_survie.mp3',
    note:"Envoie d'abord le vocal de survie, puis ce message.",
    text:"C'EST OUVERT. Je suis dehors, je cours vers la rue.", stopTimer:'CHRONO FINAL' },
  { id:'Q3', act:4, branch:'Q', time:'+2 min', who:'leo', title:'Accusation', enigma:'E7',
    text:"Je suis à l'abri. J'ai pris une des feuilles R-9 dans ma veste. Les flics arrivent. C'était qui, d'après toi ? Je leur dis quoi ?" },

  { id:'R1', act:4, time:'pendant les chronos', who:'leo', title:'Relance 1', repeat:true,
    text:"J'entends ses pas, dépêche-toi !!" },
  { id:'R2', act:4, time:'pendant les chronos', who:'leo', title:'Relance 2', repeat:true,
    text:"Il a une lampe, je vois la lumière sous la porte" },

  /* ------------------------------------------------------------ FINS */
  { id:'F1', act:5, ending:'1 · La vérité', time:'Q3 → « Delacroix »', who:'leo', title:'Fin 1 : la vérité',
    text:"Delacroix… le chef de site. Les caméras, le badge de Vasseur, mon téléphone… tout vient de lui. Je leur donne tout. Merci{,L}. Vraiment.",
    after:{ wait:'+10 min', who:'intrus', text:"```Tu aurais dû rester en dehors de ça, {P}.```" } },
  { id:'F2', act:5, ending:'2 · Le bouc émissaire', time:'Q3 → Vasseur ou autre', who:'leo', title:'Fin 2 : le bouc émissaire',
    text:"Vasseur. Ok. Je leur dis Vasseur.",
    after:{ wait:'+10 min', who:'intrus', text:"```Merci pour Vasseur, {P}. Bonne nuit.```" } },
  { id:'F3', act:5, ending:'3 · Le piège', time:'G2 → « sors »', who:'leo', title:'Fin 3 : le piège',
    text:"Je sors. Y a quelqu'un dehors avec une lampe, il me fait signe… c'est peut-être les secours",
    after:{ wait:'+1 min : vocal fin_echec, puis supprime la photo de profil de Léo. +5 min', who:'intrus', text:"```Il est avec moi maintenant. Bonne nuit, {P}.```" },
    media:'fin_echec.mp3', stopTimer:'CHRONO FINAL' },
  { id:'F4', act:5, ending:'4 · Silence', time:'chrono à 0 ou 2 codes faux', who:'leo', title:'Fin 4 : silence', media:'fin_echec.mp3',
    text:"",
    after:{ wait:'Supprime la photo de profil de Léo. +5 min', who:'intrus', text:"```Trop tard, {P}.```" },
    stopTimer:'CHRONO FINAL', note:"Avant le vocal : 2 min de silence." },
  { id:'REV', act:5, time:'10 min après la fin', who:'mj', title:'Révélation (toutes les fins)',
    text:"🎬 FIN — « La Relève »\nMerci d'avoir joué{,P} ! Léo, l'intrus et les Archives Nord n'existent pas : tout était un jeu.\nTa fin : ____ (il y en a 4). On en parle ? 😄",
    note:"Envoie-la depuis le numéro de Léo, puis appelle le joueur avec ton vrai numéro." },
];

const ACTS = { 1:"Acte 1 — L'anomalie", 2:"Acte 2 — L'enquête", 3:"Acte 3 — La paranoïa", 4:"Acte 4 — La fuite", 5:"Fins & révélation" };

const ENIGMAS = [
  { id:'E1', title:"1. Qui est encore dans le bâtiment ?", doc:'02_registre.jpg',
    solution:"Julien VASSEUR (badge J-732) : entré à 19:42, jamais ressorti. À remarquer pour plus tard : son badge est RADIÉ depuis le 12/09, et l'écran signale un « forçage manuel » du lecteur.",
    accept:"Vasseur / Julien / J-732",
    hints:[
      "Regarde la colonne Sortie, y en a qui sont jamais repartis ?",
      "Moi c'est L-511, je suis arrivé à 19h50. Y a quelqu'un d'autre sans heure de sortie ?",
      "Vasseur… c'est pas le nom qu'on m'a dit de jamais laisser entrer ?" ] },
  { id:'E2', title:"2. Le digicode et le chemin", doc:'02_registre.jpg + 04_plan.jpg',
    solution:"Code 408# : la note de sécurité dit « matricule du chef de site (3 chiffres + #) », et Delacroix a le badge M-408. Chemin : porte arrière du S.12, puis couloir de service.",
    accept:"408# (408 suffit) + « couloir de service » / « porte arrière »",
    hints:[
      "Y a pas une note en bas de l'écran des badges ?",
      "Ça parle du chef de site. Il est dans la liste, lui ?",
      "Son badge c'est M-quelque chose non ? Juste les chiffres et dièse ?",
      "Et sur le plan, la porte arrière du local technique donne où ?" ] },
  { id:'E3', title:"3. Qui contrôle le téléphone de Léo ?", doc:'06_gestion_appareil.jpg',
    solution:"ADM-408, donc le matricule 408 : Marc Delacroix, le chef de site. C'est lui qui supprime et envoie des messages dans le téléphone de Léo.",
    accept:"Delacroix / chef de site / 408",
    hints:[
      "ADM-408… j'ai déjà vu ce numéro ce soir non ?",
      "408, c'est pas le code de la porte de tout à l'heure ?",
      "Attends… c'est le chef de site qui a la main sur mon téléphone ??" ] },
  { id:'E4', title:"4. Comment l'intrus est-il entré ?", doc:'05_supervision.jpg + 07_radiation.jpg + 02_registre.jpg',
    solution:"Delacroix sort officiellement à 17:05. À 19:36 il coupe les caméras, à 19:38 il réactive le badge radié de Vasseur, et à 19:41 il ouvre la porte à distance. À 19:42, c'est lui qui entre avec le badge J-732. À 21:12 il ouvre la Réserve R-9 et lance le broyeur. Son mobile : Vasseur l'avait accusé d'antidater les bordereaux (lettre). Vasseur n'est pas là, il sert de bouc émissaire.",
    accept:"Toute explication qui relie ADM-408, le badge réactivé et Delacroix",
    hints:[
      "Sur l'écran de supervision de tout à l'heure, y a des lignes entre 19h30 et 19h45, tu les as lues ?",
      "Le badge de Vasseur est marqué RADIÉ… comment il a pu passer avec ?",
      "Quelqu'un l'a réactivé à 19h38. Qui ?",
      "Et pourquoi quelqu'un voudrait faire accuser Vasseur ? Relis la lettre." ] },
  { id:'E5', title:"5. Quelle sortie ?", doc:'04_plan.jpg',
    solution:"Le QUAI (S.03). La grille du S.14 est électronique et peut être commandée « à distance depuis le poste administrateur », donc par Delacroix. Le cadenas du quai est mécanique, « hors système ».",
    accept:"Quai / salle 3 / porte roulante",
    hints:[
      "La grille du 14, c'est électronique. Qui peut la contrôler ?",
      "Regarde la légende en bas du plan, pour les deux sorties.",
      "Le cadenas du quai, c'est du mécanique, personne peut le bloquer depuis un PC…" ] },
  { id:'E6Q', title:"6. Le cadenas du quai", doc:'10_etiquette_quai.jpg + 02_registre.jpg',
    solution:"1815. K.M. = Karim MANSOUR, le gars de la maintenance (celui à qui Léo voulait écrire au début), sorti à 18:15.",
    accept:"1815 (2 essais faux = FIN 4)",
    hints:[
      "K.M., c'est qui ? Il doit être sur l'écran des badges.",
      "Mansour… Karim ! C'est lui que je voulais écrire au début. Il est parti à quelle heure ?",
      "Son heure de départ en 4 chiffres, genre 2145 ?" ] },
  { id:'E6G', title:"6 bis. Le code de la grille (piège)", doc:'09_postit_grille.jpg + 04_plan.jpg + 02_registre.jpg',
    solution:"1432 : issue n° 14, et 32 pour le dernier badge entré avant 19h45, J-732 à 19:42. Le code est juste, mais c'est un piège : la grille s'ouvre parce que Delacroix l'attend derrière.",
    accept:"1432, puis dernière chance (G2)",
    hints:[
      "La salle c'est la 14, ça fait déjà les deux premiers chiffres.",
      "Le dernier badge entré avant 19h45, c'était lequel ?",
      "C'était quoi déjà le numéro de badge de Vasseur ??" ] },
  { id:'E7', title:"7. L'accusation", doc:'tous',
    solution:"Delacroix → FIN 1 « La vérité ». Vasseur ou n'importe qui d'autre → FIN 2 « Le bouc émissaire ».",
    accept:"Delacroix / le chef de site",
    hints:[
      "Qui avait intérêt à ce que Vasseur se fasse accuser ?",
      "Qui a signé la lettre de Vasseur ?",
      "Delacroix est sorti à 17h05 d'après l'écran… mais après ?" ] },
];

const IMPRO = [
  { when:"Il/elle va trop vite ou pose une question imprévue", text:"Chut, j'éteins l'écran, j'ai entendu un bruit. Je reviens." },
  { when:"« Pourquoi t'appelles pas la police ? »", text:"Zéro réseau voix ici, y a que les messages qui passent, et encore, près de la grille d'aération." },
  { when:"« Envoie une photo de toi / appelle-moi »", text:"Je peux pas parler, il m'entendrait. Et le flash ça le ferait venir direct." },
  { when:"Il/elle accuse Delacroix trop tôt", text:"Le chef de site ?? Mais il est parti à 17h05, c'est marqué sur l'écran…" },
  { when:"Il/elle accuse Léo de mentir", text:"Je te jure que c'est moi. Demande-moi n'importe quoi. Je suis juste le nouveau, je voulais pas de problème." },
  { when:"Il/elle demande « c'est une blague ? »", text:"J'aimerais bien que ce soit une blague. Vraiment." },
  { when:"Silence trop long du joueur", text:"T'es là ?? Me laisse pas tout seul s'il te plaît" },
  { when:"Il/elle veut arrêter de jouer / se coucher", text:"Ok… merci pour ton aide en tout cas. Je vais me débrouiller." },
];

const MEDIA = [
  { file:'01_couloir.jpg', ready:true, desc:"Couloir sombre, porte au fond (image tirée de ta vidéo)" },
  { file:'02_registre.jpg', ready:true, desc:"Écran des badges (énigmes 1, 2, 6)" },
  { file:'03_vocal_bruits.mp3', ready:true, desc:"Vocal de Léo, bruits dans le couloir (20 s)" },
  { file:'03_vocal_bruits_court.mp3', ready:true, desc:"Version courte du même vocal (15 s), au choix" },
  { file:'04_plan.jpg', ready:true, desc:"Plan d'évacuation du SS-B (énigmes 2, 5)" },
  { file:'05_supervision.jpg', ready:true, desc:"Journal de supervision (énigme 4)" },
  { file:'06_gestion_appareil.jpg', ready:true, desc:"Capture des réglages du téléphone de Léo (énigme 3)" },
  { file:'07_radiation.jpg', ready:true, desc:"Lettre de radiation de Vasseur (énigme 4, mobile)" },
  { file:'08_video_couloir.mp4', ready:true, desc:"Vidéo à la lampe torche (10 s)" },
  { file:'09_postit_grille.jpg', ready:true, desc:"Post-it sur la grille du S.14 (piège)" },
  { file:'10_etiquette_quai.jpg', ready:true, desc:"Étiquette du cadenas du quai (énigme 6)" },
  { file:'appel_masque.mp3', ready:true, desc:"Audio de l'appel masqué (8 s)",
    howto:"S'il cite un prénom (« Camille »), réenregistre-le pour chaque nouveau joueur avec son prénom, {P}. Idée de texte : « {P}. Tu crois que c'est Vasseur ? Continue de le croire. C'est mieux pour toi. »" },
  { file:'fin_survie.mp3', ready:true, desc:"Vocal de survie, grille/porte ouverte (étape Q2)" },
  { file:'fin_echec.mp3', ready:true, desc:"Vocal d'échec, chute du téléphone (fins 3 et 4)" },
  { file:'leo.jpg', ready:false, desc:"Photo de profil de Léo (volontairement hors du dépôt)",
    howto:"À mettre directement comme photo de profil WhatsApp du numéro de Léo. Le dépôt GitHub est public : on n'y met pas de visage." },
];

const PREP = [
  { group:"Le numéro de Léo", items:[
    "Une 2e ligne : carte prépayée ou eSIM (2 à 5 €), dans un 2e téléphone ou en double SIM.",
    "WhatsApp installé sur ce numéro, nom « Léo », photo de profil (leo.jpg). WhatsApp est indispensable pour « Supprimer pour tous », les vocaux et les vidéos.",
    "Ce numéro n'a jamais écrit au joueur, et le joueur ne l'a pas dans ses contacts.",
    "Tous les médias rangés dans un album « La Relève » sur le téléphone de Léo, ou envoyés avec le bouton Partager de cette console.",
  ]},
  { group:"Voix et appel", items:[
    "Vocaux de Léo enregistrés par une voix que le joueur ne connaît pas, ou avec une appli de changement de voix.",
    "Appel masqué : voix différente de celle de Léo, avec le prénom du joueur.",
    "Test #31# : compose #31# puis le numéro, sur un téléphone ami.",
    "Si l'iPhone du joueur réduit au silence les appels inconnus, l'appel ira sur la messagerie : l'audio est prévu pour y être laissé.",
  ]},
  { group:"Console MJ", items:[
    "Console ouverte sur un 2e écran (tablette ou PC) si possible. Sinon en multitâche sur le téléphone de Léo.",
    "Prénom du joueur et accord renseignés en haut du Conducteur.",
    "Onglet Médias : tout est en vert.",
    "Réinitialiser la console avant la partie (bouton en bas de cet onglet).",
  ]},
  { group:"Sécurité (à ne pas sauter)", items:[
    "Arrête et révèle tout de suite si le joueur parle d'appeler la police, les secours, le 112 ou une vraie entreprise, s'il veut aller sur place, ou s'il a vraiment peur.",
    "Le message « Révélation » est prêt dans le Conducteur, pour n'importe quel moment.",
    "Si possible, préviens quelqu'un de son entourage (coloc, conjoint) qu'un jeu est en cours ce soir.",
    "Archives Nord, Léo, Delacroix et Vasseur sont fictifs. Ne remplace jamais ces noms par une vraie entreprise ou une vraie personne.",
  ]},
];
