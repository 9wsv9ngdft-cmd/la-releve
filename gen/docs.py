import asyncio, sys
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
  <text x='75' y='812'><tspan fill='#c0392b' font-weight='bold'>S.14</tspan> : grille à verrouillage électronique — ouverture par code d'urgence ou à distance depuis le poste administrateur.</text>
  <text x='75' y='834'><tspan fill='#555' font-weight='bold'>S.03</tspan> : porte roulante, cadenas mécanique à combinaison (hors système). <tspan fill='#c0392b' font-weight='bold'>S.01</tspan> : porte coupe-feu verrouillée de 19h à 7h.</text>
 </g>
</svg>"""
DOCS['04_plan'] = dict(w=1500, h=1060, css=PAPER_FX + """
.paper{padding:22px;transform:rotate(1.3deg)}
.tape{position:absolute;width:120px;height:34px;background:rgba(240,230,180,.75);top:-14px}
""", body="<div class='paper'><div class='tape' style='left:40px;transform:rotate(-8deg)'></div><div class='tape' style='right:40px;transform:rotate(7deg)'></div>" + PLAN_SVG + "</div>")

# ---------------------------------------------------------------- 05 SUPERVISION
DOCS['05_supervision'] = dict(w=1200, h=620, css=SCREEN_FX + """
.photo{width:1080px;background:#050a05;color:#5dff7a;font-family:'DejaVu Sans Mono',monospace;padding:26px 30px;font-size:19px;line-height:1.7}
.h{color:#b6ffbf;border-bottom:1px solid #1d5a28;margin-bottom:10px;padding-bottom:6px}
.w{color:#ffd35c}.r{color:#ff6a6a}.d{color:#2f8f44}
""", body="""
<div class='photo'>
 <div class='h'>SUPERVISION TECHNIQUE — SS-B · terminal S.12 · journal des événements</div>
 <div class='d'>17:05  PORTE S.01 — sortie badge M-408</div>
 <div class='d'>18:15  PORTE S.01 — sortie badge K-104</div>
 <div class='w'>19:36  CAMÉRAS SS-B — arrêt planifié (maintenance) — opérateur ADM-408</div>
 <div class='w'>19:38  BADGE J-732 — réactivation manuelle — opérateur ADM-408</div>
 <div class='w'>19:41  PORTE S.01 — ouverture à distance — opérateur ADM-408</div>
 <div>19:42  BADGE J-732 — accès accordé — porte S.01</div>
 <div>19:50  BADGE L-511 — accès accordé — porte S.01</div>
 <div class='w'>20:31  RÉSEAU — relais GSM SS-B en mode dégradé</div>
 <div class='r'>21:12  PORTE S.07 (RÉSERVE R-9) — ouverture — opérateur ADM-408</div>
 <div class='r'>21:14  S.09 BROYEUR — mise sous tension</div>
 <div>21:26  _</div>
</div>""")

# ---------------------------------------------------------------- 06 GESTION APPAREIL
DOCS['06_gestion_appareil'] = dict(w=760, h=1400, css="""
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
 <div class='lbl'>Administrateur</div>
 <div class='card'><div class='row'><span>Identifiant</span><span class='v'>ADM-408</span></div>
 <div class='row'><span>Site</span><span class='v'>Archives Nord</span></div>
 <div class='row'><span>Dernière action</span><span class='v'>aujourd'hui 21:5x</span></div></div>
 <div class='lbl'>L'administrateur peut</div>
 <div class='card'>
 <div class='row'><span>Voir la localisation</span><span class='v'>✓</span></div>
 <div class='row'><span>Consulter les messages</span><span class='v'>✓</span></div>
 <div class='row'><span>Envoyer / supprimer des messages</span><span class='v'>✓</span></div>
 <div class='row'><span>Recevoir les alertes du site</span><span class='v'>✓</span></div></div>
</div></div>""")

# ---------------------------------------------------------------- 07 RADIATION
DOCS['07_radiation'] = dict(w=1100, h=1400, css=PAPER_FX + """
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
 <div class='lh'><b>ARCHIVES NORD</b><span>Direction de site<br>Le 12/09/2026</span></div>
 <p><b>Objet : notification de radiation — M. Julien VASSEUR, archiviste (badge J-732)</b></p>
 <p>Monsieur,</p>
 <p>Le 09/09, vous avez accédé sans autorisation à la Réserve R-9 (fonds sensibles) en dehors de vos horaires de service.</p>
 <p>Ces faits constituent une faute grave. Votre badge est désactivé à compter de ce jour et tout accès au site vous est interdit.</p>
 <p>Vos accusations concernant de prétendues « irrégularités » dans les bordereaux de destruction ne reposent sur aucun élément et ne seront pas examinées.</p>
 <p>Veuillez agréer, Monsieur, l'expression de mes salutations distinguées.</p>
 <div class='sig'>M. Delacroix</div>
 <div>Marc DELACROIX — Chef de site</div>
 <div class='margin hand'>Les bordereaux R-9 sont antidatés et signés M-408.<br>Il détruit tout avant l'audit.<br>J'ai gardé des copies. — J.V.</div>
</div>""")

# ---------------------------------------------------------------- 09 POST-IT GRILLE
POSTIT = """
.wall{width:900px;height:900px;background:#5b5f61;display:flex;align-items:center;justify-content:center;position:relative;
 background-image:radial-gradient(ellipse at 40%% 30%%,rgba(255,255,255,.18),transparent 55%%),radial-gradient(ellipse at center,transparent 40%%,rgba(0,0,0,.7))}
.pi{width:560px;padding:44px 40px;background:#fff27a;color:#1d1d6b;font-size:37px;line-height:1.35;box-shadow:0 18px 30px rgba(0,0,0,.6);transform:rotate(%(rot)s);text-align:center}
.torn{clip-path:polygon(0 4%%,8%% 0,20%% 3%%,35%% 0,50%% 4%%,65%% 0,80%% 3%%,100%% 0,100%% 100%%,0 100%%)}
"""
DOCS['09_postit_grille'] = dict(w=900, h=900, css=POSTIT % {'rot': '-4deg'}, body="""
<div class='wall'><div class='pi hand torn'>CODE URGENCE =<br>N° ISSUE (2 chiffres)<br>+ 2 DERNIERS CHIFFRES<br>DU DERNIER BADGE<br>ENTRÉ AVANT 19H45</div></div>""")
DOCS['10_etiquette_quai'] = dict(w=900, h=900, css=(POSTIT % {'rot': '3deg'}).replace('#fff27a', '#f3f0e6'), body="""
<div class='wall'><div class='pi hand' style='border:3px solid #c9c2a8'>Cadenas quai :<br>combinaison du jour<br>= mon heure de départ<br>(HHMM)<br><br>— K.M.</div></div>""")


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
