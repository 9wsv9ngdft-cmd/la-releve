# La Relève — appli VEILLE (v2.5)

Jeu d'horreur psychologique et d'enquête en temps réel sur smartphone, 100 % autonome, environ 45 minutes (ou 20 en relève courte), **interdit aux moins de 18 ans**. Le joueur devient l'opérateur·rice #42 de télésurveillance de nuit des Archives Nord. Léo (L-511) est le gardien du Sous-Sol B.

- **Jouer :** `https://9wsv9ngdft-cmd.github.io/la-releve/` (Safari › Partager › « Sur l'écran d'accueil », la nuit, seul, lumière éteinte, écouteurs, volume à moitié).
- **Créneau :** le portail n'ouvre de relève qu'entre 22:00 et 04:00 (prise de poste conseillée à 23:14).
- **Tester :** ajouter `?fast=1` à l'adresse (tout va plus vite et le créneau est contourné).
- **Jouer de jour :** ajouter `?bonjour=1` à l'adresse (créneau contourné, vitesse normale).
- **Briefing :** avant le portail, un module d'accueil d'environ 1 min (texte seul sur la nappe, bouton « Passer › ») présente le site, Léo et le poste. Il ne se rejoue pas dans le même onglet. Textes dans `histoire.js` (objet `BRIEFING`).
- **Relève courte :** au portail, « Durée de la relève » propose la garde complète (45 min) ou courte (20 min). La version courte resserre les dialogues et les attentes, retire le bouton « Confort opérateur » et les lignes Observation, et ramène le chrono final à 2 min 30. Script de référence : `garde_courte_20min_script.md` dans le projet.
- **Recommencer :** toucher 5 fois « VEILLE » en haut de l'écran (portail, appli ou relevé). Cela efface aussi la mémoire de fin de partie : sans ça, le portail affiche le statut du poste #42 indéfiniment.

## Fichiers

- **`index.html`** : le moteur (portail, interphone, caméras, dossiers, pièges, son, relevé #42).
- **`histoire.js`** : toute l'histoire (chapitres 1 à 13, 4 fins, textes, liste des médias).
- **`medias/`** : images et sons. **`medias/provisoire/`** : médias de remplacement générés en attendant les vrais.
- **`gen/`** : scripts de génération (`docs.py` pour les documents, `provisoires.py` pour les médias provisoires).
- **`mj/`** : l'ancienne version MJ WhatsApp (inchangée, utilise toujours les anciens fichiers `01_` à `17_`).

## Remplacer un média provisoire

Il suffit de déposer le fichier final dans `medias/` **avec le nom du kit de production** (par ex. `medias/vitre_silhouette.jpg`, `medias/audio0_leo_ancrage.mp3`, `medias/nappe_ssb.m4a`). Le jeu charge toujours le fichier final s'il existe, et ne prend le provisoire qu'en son absence. La liste complète des noms est en haut de `histoire.js` (objet `MEDIA`).

La caméra et le micro sont traités uniquement sur le téléphone : la photo de badge, le portrait et la voix restent en mémoire vive et ne sont jamais sauvegardés. Seuls le prénom, la fin obtenue et le texte du journal #42 restent sur l'appareil.
