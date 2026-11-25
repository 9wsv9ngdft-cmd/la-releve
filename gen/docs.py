import asyncio, sys
# v2.5 : écrit de nouveaux fichiers (les anciens 04-07 restent pour la version MJ dans /mj/).
from playwright.async_api import async_playwright

OUT = sys.argv[1]

BASE = """<!DOCTYPE html><html><head><meta charset='utf-8'><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a1a;display:flex;align-items:center;justify-content:center;width:%(w)dpx;height:%(h)dpx;overflow:hidden}
.hand{font-family:'Comic Relief','Comic Sans MS',cursive}
%(css)s
</style></head><body>%(body)s</body></html>"""

# Effet "photo d'écran" : légère perspective, lignes, vignette
SCREEN_FX = """
.photo{position:relative;transform:perspective(1400px) rotateX(4deg) rotateY(-3deg) rotate(-1deg);box-shadow:0 0 0 14px #0c0c0c,0 0 0 16px #333,0 30px 60px #000}
.photo::after{content:'';position:absolute;inset:0;pointer-events:none;
 background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 3px),
 radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.10),transparent 45%),
 radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55))}
"""
PAPER_FX = """
.paper{position:relative;background:#f4f1e8;color:#222;box-shadow:0 25px 50px rgba(0,0,0,.7);
 background-image:radial-gradient(ellipse at 70% 80%,rgba(120,100,60,.12),transparent 60%),radial-gradient(ellipse at 10% 10%,rgba(255,255,255,.6),transparent 40%)}
.paper::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.35))}
"""

DOCS = {}

# ---------------------------------------------------------------- 04 PLAN
PLAN_SVG = """
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1300 860' width='1300' height='860' font-family='DejaVu Sans' >
 <rect width='1300' height='860' fill='#fbfbf7'/>
 <rect x='0' y='0' width='1300' height='70' fill='#1b7d3a'/>
 <text x='30' y='46' fill='#fff' font-size='30' font-weight='bold'>PLAN D'ÉVACUATION — SOUS-SOL B</text>
 <text x='1270' y='46' fill='#fff' font-size='18' text-anchor='end'>Archives Nord · Niveau -2</text>
 <g stroke='#222' stroke-width='5' fill='#fff'>
  <!-- haut -->
  <rect x='60' y='110' width='220' height='220'/><rect x='280' y='110' width='240' height='220'/>
  <rect x='520' y='110' width='280' height='220'/><rect x='800' y='110' width='240' height='220'/>
  <!-- couloir principal -->
  <rect x='60' y='330' width='1080' height='90' fill='#eef3f7'/>
  <!-- bas -->
  <rect x='300' y='420' width='220' height='190'/><rect x='520' y='420' width='240' height='190'/>
  <rect x='760' y='420' width='220' height='190'/><rect x='980' y='420' width='160' height='190'/>
  <!-- couloir de service -->
  <rect x='300' y='610' width='840' height='80' fill='#f6efe2'/>
  <!-- quai -->
  <rect x='60' y='560' width='240' height='220' fill='#fff'/>
  <!-- issue est -->
  <rect x='1140' y='560' width='120' height='180' fill='#fff'/>
 </g>
 <!-- portes (blancs) -->
 <g stroke='#fbfbf7' stroke-width='9'>
  <line x1='390' y1='420' x2='440' y2='420'/><line x1='390' y1='610' x2='440' y2='610'/>
  <line x1='300' y1='630' x2='300' y2='680'/><line x1='1140' y1='625' x2='1140' y2='675'/>
  <line x1='600' y1='330' x2='650' y2='330'/><line x1='860' y1='420' x2='900' y2='420'/>
  <line x1='620' y1='420' x2='660' y2='420'/><line x1='160' y1='330' x2='210' y2='330'/>
  <line x1='370' y1='330' x2='420' y2='330'/>
 </g>
 <!-- grille S.14 -->
 <g stroke='#c0392b' stroke-width='3'><line x1='1260' y1='590' x2='1260' y2='710'/>
  <line x1='1252' y1='600' x2='1268' y2='600'/><line x1='1252' y1='620' x2='1268' y2='620'/><line x1='1252' y1='640' x2='1268' y2='640'/>
  <line x1='1252' y1='660' x2='1268' y2='660'/><line x1='1252' y1='680' x2='1268' y2='680'/><line x1='1252' y1='700' x2='1268' y2='700'/></g>
 <!-- porte roulante quai -->
 <g stroke='#555' stroke-width='3'><line x1='60' y1='600' x2='60' y2='740'/>
  <line x1='52' y1='610' x2='68' y2='610'/><line x1='52' y1='640' x2='68' y2='640'/><line x1='52' y1='670' x2='68' y2='670'/><line x1='52' y1='700' x2='68' y2='700'/><line x1='52' y1='730' x2='68' y2='730'/></g>
 <!-- coupe-feu escalier -->
 
 <g font-size='17' fill='#222' text-anchor='middle'>
  <text x='170' y='215' font-weight='bold'>S.01</text><text x='170' y='238'>Ascenseur</text><text x='170' y='258'>Escalier principal</text>
  <text x='400' y='215' font-weight='bold'>S.05</text><text x='400' y='238'>Poste de sécurité</text>
  <text x='660' y='215' font-weight='bold'>S.10</text><text x='660' y='238'>Archives courantes</text>
  <text x='920' y='215' font-weight='bold'>S.11</text><text x='920' y='238'>Salle de lecture</text>
  <text x='600' y='382' font-size='19' fill='#2c5f7c' font-style='italic'>COULOIR PRINCIPAL</text>
  <text x='410' y='500' font-weight='bold'>S.12</text><text x='410' y='522'>Local technique</text>
  <text x='640' y='500' font-weight='bold'>S.09</text><text x='640' y='522'>Salle de tri</text><text x='640' y='544' font-size='14'>(broyeur)</text>
  <text x='870' y='500' font-weight='bold'>S.07</text><text x='870' y='522'>Réserve R-9</text><text x='870' y='544' font-size='14'>fonds sensibles</text>
  <text x='1060' y='500' font-weight='bold'>S.16</text><text x='1060' y='522'>Sanitaires</text>
  <text x='720' y='657' font-size='19' fill='#8a5a14' font-style='italic'>COULOIR DE SERVICE</text>
  <text x='180' y='650' font-weight='bold'>S.03</text><text x='180' y='672'>Quai de livraison</text>
  <text x='1200' y='640' font-weight='bold'>S.14</text><text x='1200' y='662' font-size='14'>Issue de</text><text x='1200' y='680' font-size='14'>secours Est</text>
 </g>
 <!-- TGBT -->
 <rect x='940' y='617' width='60' height='26' fill='#f1c40f' stroke='#222' stroke-width='2'/><text x='970' y='636' font-size='13' text-anchor='middle'>TGBT</text>
 <!-- digicode -->
 <rect x='446' y='596' width='22' height='18' fill='#2980b9'/><text x='478' y='600' font-size='12' fill='#2980b9'>digicode</text>
 <!-- vous êtes ici -->
 <circle cx='350' cy='565' r='13' fill='#e74c3c'/><text x='370' y='571' font-size='15' fill='#e74c3c' font-weight='bold'>VOUS ÊTES ICI</text>
 <!-- flèches évacuation -->
 <g fill='#1b7d3a'><path d='M700 695 l60 0 l0 -10 l25 20 l-25 20 l0 -10 l-60 0z' transform='translate(260,-60)'/>
 <path d='M260 680 l-60 0 l0 -10 l-25 20 l25 20 l0 -10 l60 0z' transform='translate(80,-40)'/></g>
 <text x='60' y='545' font-size='14' fill='#555'>Cour de livraison ←</text>
 <text x='1270' y='770' font-size='14' fill='#555' text-anchor='end'>Rampe extérieure Est →</text>
 <!-- légende -->
 <rect x='60' y='790' width='1200' height='60' fill='#fff' stroke='#bbb'/>
 <g font-size='14' fill='#222'>
  <text x='75' y='812'><tspan fill='#c0392b' font-weight='bold'>S.14</tspan> : grille à verrouillage électronique — code d'urgence, ou déverrouillage prioritaire par la Direction.</text>
  <text x='75' y='834'><tspan fill='#555' font-weight='bold'>S.03</tspan> : porte roulante, cadenas mécanique à combinaison (hors système). <tspan fill='#c0392b' font-weight='bold'>S.01</tspan> : porte coupe-feu verrouillée de 19h à 7h.</text>
 </g>
</svg>"""
DOCS['plan_ssb'] = dict(w=1500, h=1060, css=PAPER_FX + """
.paper{padding:22px;transform:rotate(1.3deg)}
.tape{position:absolute;width:120px;height:34px;background:rgba(240,230,180,.75);top:-14px}
""", body="<div class='paper'><div class='tape' style='left:40px;transform:rotate(-8deg)'></div><div class='tape' style='right:40px;transform:rotate(7deg)'></div>" + PLAN_SVG + "</div>")

# ---------------------------------------------------------------- 05 SUPERVISION
DOCS['supervision_maint104'] = dict(w=1200, h=620, css=SCREEN_FX + """
.photo{width:1080px;background:#050a05;color:#5dff7a;font-family:'DejaVu Sans Mono',monospace;padding:26px 30px;font-size:19px;line-height:1.7}
.h{color:#b6ffbf;border-bottom:1px solid #1d5a28;margin-bottom:10px;padding-bottom:6px}
.w{color:#ffd35c}.r{color:#ff6a6a}.d{color:#2f8f44}
""", body="""
<div class='photo'>
 <div class='h'>SUPERVISION TECHNIQUE — SS-B · journal des événements · tri : heure</div>
 <div class='d'>17:05  PORTE S.01 — sortie badge M-408</div>
 <div class='d'>18:15  PORTE S.01 — sortie badge K-104</div>
 <div class='w'>19:35  SESSION MAINT-104 ouverte — poste : BUREAU DIRECTION</div>
 <div class='w'>19:35  Élévation de privilèges : clé maître M-408 validée</div>
 <div class='w'>19:36  CAMÉRAS SS-B — arrêt planifié — session MAINT-104</div>
 <div class='w'>19:38  BADGE J-732 — réactivation manuelle — session MAINT-104</div>
 <div class='r'>19:38  RÉSERVE R-9 — ouverture exceptionnelle — session MAINT-104</div>
 <div>19:42  BADGE J-732 — accès accordé — porte S.01</div>
 <div class='r'>19:43  RÉSERVE R-9 — refermeture — session MAINT-104</div>
 <div class='w'>19:44  SESSION MAINT-104 fermée</div>
 <div>19:50  BADGE L-511 — accès accordé — porte S.01</div>
 <div>21:26  _</div>
</div>""")

# ---------------------------------------------------------------- 06 GESTION APPAREIL
DOCS['gestion_maint104'] = dict(w=760, h=1400, css="""
.ph{width:640px;height:1300px;background:#000;border-radius:60px;padding:22px;box-shadow:0 30px 60px #000;transform:rotate(-2deg)}
.sc{width:100%;height:100%;background:#f2f2f7;border-radius:42px;overflow:hidden;font-family:Inter,'DejaVu Sans';color:#111;position:relative}
.sc::before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.25) 40%,transparent 50%),repeating-linear-gradient(35deg,transparent 0 160px,rgba(0,0,0,.25) 160px 162px,transparent 162px 400px);pointer-events:none}
.bar{display:flex;justify-content:space-between;padding:22px 34px 10px;font-weight:600;font-size:20px}
.nav{padding:10px 26px;color:#0a7aff;font-size:22px}
h1{font-size:34px;padding:6px 26px 18px}
.card{background:#fff;margin:0 20px 18px;border-radius:14px;padding:18px 20px;font-size:20px;line-height:1.45}
.lbl{color:#6b6b70;font-size:16px;text-transform:uppercase;margin:0 36px 8px}
.row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e5e5ea}
.row:last-child{border:none}.v{color:#6b6b70}
.ic{width:70px;height:70px;border-radius:16px;background:#3a5a78;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:26px;margin-bottom:12px}
""", body="""
<div class='ph'><div class='sc'>
 <div class='bar'><span>21:58</span><span>▂▁▁ 4%</span></div>
 <div class='nav'>‹ Général</div>
 <h1>Gestion de l'appareil</h1>
 <div class='card'><div class='ic'>AN</div><b>Profil de gestion — ARCHIVES NORD</b><br>
 Cet appareil appartient à votre organisation et est supervisé à distance.</div>
 <div class='lbl'>Contrôle à distance</div>
 <div class='card'><div class='row'><span>Identifiant</span><span class='v'>MAINT-104</span></div>
 <div class='row'><span>Service</span><span class='v'>Maintenance</span></div>
 <div class='row'><span>Dernière action</span><span class='v'>aujourd'hui 21:5x</span></div></div>
 <div class='lbl'>Le contrôle à distance permet</div>
 <div class='card'>
 <div class='row'><span>Voir la localisation</span><span class='v'>✓</span></div>
 <div class='row'><span>Consulter les messages</span><span class='v'>✓</span></div>
 <div class='row'><span>Envoyer / supprimer des messages</span><span class='v'>✓</span></div>
 <div class='row'><span>Recevoir les alertes du site</span><span class='v'>✓</span></div></div>
</div></div>""")

# ---------------------------------------------------------------- 07 RADIATION
DOCS['radiation_annotee'] = dict(w=1100, h=1400, css=PAPER_FX + """
.paper{width:900px;padding:70px 80px 230px;font-family:'Liberation Serif',serif;font-size:21px;line-height:1.55;transform:rotate(-2.2deg)}
.lh{display:flex;justify-content:space-between;border-bottom:3px solid #23415c;padding-bottom:12px;margin-bottom:30px;color:#23415c}
.lh b{font-size:28px;letter-spacing:2px}
p{margin-bottom:16px}
.sig{font-family:'TeX Gyre Chorus',cursive;font-size:44px;color:#1d2f6b;margin-top:6px}
.margin{position:absolute;right:60px;bottom:45px;width:430px;transform:rotate(-6deg);color:#1a3cb3;font-size:22px;line-height:1.35}
.fold{position:absolute;left:0;right:0;top:46%;height:2px;background:rgba(0,0,0,.08)}
.stain{position:absolute;width:160px;height:160px;border-radius:50%;border:10px solid rgba(110,70,30,.12);left:60px;bottom:90px}
""", body="""
<div class='paper'><div class='fold'></div><div class='stain'></div>
 <div class='lh'><b>ARCHIVES NORD</b><span>Direction de site<br>Le 12/09</span></div>
 <p><b>Objet : notification de radiation — M. Julien VASSEUR, archiviste (badge J-732)</b></p>
 <p>Monsieur,</p>
 <p>Le 09/09, vous avez accédé sans autorisation à la Réserve R-9 (fonds sensibles) en dehors de vos horaires de service.</p>
 <p>Ces faits constituent une faute grave. Votre badge est désactivé à compter de ce jour et tout accès au site vous est interdit.</p>
 <p>Les documents que vous prétendez avoir consultés relèvent de la Direction. Toute divulgation fera l'objet de poursuites.</p>
 <p>Veuillez agréer, Monsieur, l'expression de mes salutations distinguées.</p>
 <div class='sig'>M. Delacroix</div>
 <div>Marc DELACROIX — Chef de site</div>
 <div class='margin hand'>Karim m'a donné les clés du quai pour sortir sans passer par les lecteurs. Si Delacroix me trouve, c'est fini. — J.V.</div>
</div>""")

# ---------------------------------------------------------------- 09 POST-IT GRILLE
POSTIT = """
.wall{width:900px;height:900px;background:#5b5f61;display:flex;align-items:center;justify-content:center;position:relative;
 background-image:radial-gradient(ellipse at 40%% 30%%,rgba(255,255,255,.18),transparent 55%%),radial-gradient(ellipse at center,transparent 40%%,rgba(0,0,0,.7))}
.pi{width:560px;padding:44px 40px;background:#fff27a;color:#1d1d6b;font-size:37px;line-height:1.35;box-shadow:0 18px 30px rgba(0,0,0,.6);transform:rotate(%(rot)s);text-align:center}
.torn{clip-path:polygon(0 4%%,8%% 0,20%% 3%%,35%% 0,50%% 4%%,65%% 0,80%% 3%%,100%% 0,100%% 100%%,0 100%%)}
"""
DOCS['provisoire/postit_1432'] = dict(w=720, h=1280, css=POSTIT % {'rot': '-7deg'} + """
body{background:#000}
.wall{width:720px;height:1280px;background:#3d4143}
.kp{position:absolute;left:150px;top:380px;width:420px;height:560px;background:#8a8d8f;border-radius:18px;box-shadow:0 0 0 6px #6c6f71,0 30px 40px rgba(0,0,0,.8);
 background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.45),transparent 50%)}
.keys{position:absolute;left:60px;top:150px;display:grid;grid-template-columns:repeat(3,80px);gap:22px}
.keys i{display:block;height:64px;border-radius:10px;background:#1b1c1d;color:#ddd;font:600 30px 'DejaVu Sans';text-align:center;line-height:64px;font-style:normal;box-shadow:inset 0 3px 0 rgba(255,255,255,.25)}
.led{position:absolute;left:60px;top:70px;width:300px;height:44px;background:#200;border-radius:6px}
.pi{position:absolute;left:330px;top:300px;width:300px;padding:30px 20px;font-size:84px;text-align:center}
.pi small{display:block;font-size:30px;opacity:.55;text-decoration:line-through}
.fx{position:absolute;inset:0;background:radial-gradient(ellipse at 52% 45%,rgba(255,255,255,.18),transparent 35%,rgba(0,0,0,.85) 75%)}
""", body="""<div class='wall'><div class='kp'><div class='led'></div><div class='keys'>
<i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>*</i><i>0</i><i>#</i></div></div>
<div class='pi hand torn'><small>code S.1</small>1432</div><div class='fx'></div></div>""")

DOCS['provisoire/cadenas_km'] = dict(w=720, h=1280, css="""
body{background:#000}
.sc{position:relative;width:720px;height:1280px;background:#2a2b2a;overflow:hidden}
.chain{position:absolute;left:-40px;top:300px;width:800px;height:70px;border-top:22px dotted #6d6457;border-bottom:22px dotted #4f4940;transform:rotate(-8deg)}
.sh{position:absolute;left:250px;top:330px;width:220px;height:260px;border:34px solid #9b9a95;border-bottom:none;border-radius:120px 120px 0 0}
.body{position:absolute;left:190px;top:560px;width:340px;height:330px;background:linear-gradient(160deg,#a9a59b,#5c584f);border-radius:28px;box-shadow:0 30px 40px rgba(0,0,0,.8)}
.dials{position:absolute;left:34px;top:120px;display:flex;gap:14px}
.dials i{display:block;width:57px;height:96px;background:linear-gradient(#5a4a2a,#c9a95a 50%,#5a4a2a);border-radius:8px;font:700 44px 'DejaVu Sans Mono';color:#1b1408;text-align:center;line-height:96px;font-style:normal}
.tag{position:absolute;left:420px;top:880px;width:190px;height:120px;background:#d8cfa8;transform:rotate(14deg);border-radius:8px;font-size:62px;text-align:center;line-height:120px;color:#111}
.str{position:absolute;left:440px;top:840px;width:4px;height:70px;background:#222;transform:rotate(-30deg)}
.fx{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(255,255,255,.22),transparent 30%,rgba(0,0,0,.9) 70%)}
""", body="""<div class='sc'><div class='chain'></div><div class='sh'></div><div class='body'><div class='dials'><i>0</i><i>7</i><i>3</i><i>9</i></div></div>
<div class='str'></div><div class='tag hand'>K.M.</div><div class='fx'></div></div>""")

DOCS['provisoire/note_r9'] = dict(w=1100, h=1450, css=PAPER_FX + """
.paper{width:940px;padding:70px 80px 90px;font-family:'DejaVu Sans Mono',monospace;font-size:19px;line-height:1.55;transform:rotate(1.4deg);color:#262626}
.st{position:absolute;right:60px;top:175px;border:5px solid rgba(170,20,20,.75);color:rgba(170,20,20,.8);font:700 34px 'DejaVu Sans';padding:6px 16px;transform:rotate(-9deg);letter-spacing:3px}
h3{font-size:20px;margin:26px 0 18px;text-decoration:underline}
p{margin-bottom:14px}
.ms{font-size:27px;color:#1a2f8a;margin:22px 0 0 20px;transform:rotate(-2deg);line-height:1.3}
.sig{margin-top:34px}
""", body="""<div class='paper'><div class='st'>CONFIDENTIEL</div>
<div>ARCHIVES NORD — DIRECTION DE SITE</div><div>RÉF. INT/SS-B/R9 · DIFFUSION RESTREINTE (M-408)</div>
<h3>NOTE DE PROCÉDURE : Rotation annuelle — Secteur Sous-Sol B (Réserve R-9)</h3>
<p>1. Déverrouillage : Le verrou magnétique de la Réserve R-9 est couplé au code S.12 (408#). Activation à distance par l'opérateur VEILLE.</p>
<p>2. Personnel de garde (L-511) : Fin de service programmée à 00:00. Motif : démission / usure. Ne pas notifier les proches avant 72h (2022-04, 2023-11, 2024-08).</p>
<p>3. Consignes acoustiques : Ne pas répondre aux sollicitations vocales après ouverture R-9. Ne pas déverrouiller S.14.</p>
<p>4. Poste distant : Fin de session automatique à 00:00. Archivage CAM 00.</p>
<div class='ms hand'>Incident J-732 (Vasseur) — Radiation 12/09.<br>Ouverture Direction 19:38. À détruire.</div>
<div class='sig'>Marc DELACROIX — Chef de site (M-408)</div></div>""")


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, d in DOCS.items():
            pg = await b.new_page(viewport={'width': d['w'], 'height': d['h']}, device_scale_factor=1)
            await pg.set_content(BASE % d)
            await pg.wait_for_timeout(200)
            await pg.screenshot(path=f"{OUT}/{name}.jpg", type='jpeg', quality=86)
            await pg.close()
        await b.close()

asyncio.run(main())
