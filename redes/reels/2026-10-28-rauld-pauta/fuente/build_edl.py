"""Lista de cortes de los dos reels. Uso: python build_edl.py ytwords.json 1|2 edl.json"""
import json,sys
YT=json.load(open(sys.argv[1])); REEL=sys.argv[2]; OUT=sys.argv[3]
W="Cristián Warnken"; R="Juan Carlos Rauld"
ROL_R="DIRECTOR · CENTRO DE REFLEXIONES CRÍTICAS"; ROL_W="DESDE EL JARDÍN · RADIO PAUTA"
EM={"aparece.","existiese.","niña.","niña?","voz","daño.","dañarse.","contrario.","tecnócrata","escuchar","infancia.","niños."}
def clip(a,b,drop=(),fix=None,spk=None,brk=(),cut=None,**kw):
    fix=fix or {}; spk=spk or {}
    ws=[]
    for w in YT:
        if a<=w["s"]<b-0.05:
            k=round(w["s"],2)
            if k in drop: continue
            t=fix.get(k,w["w"])
            if t.lower().strip(",.") in ("eh","em"): continue
            d={"w":t,"s":w["s"],"e":min(w["e"],b)}
            if t in EM: d["em"]=1
            if k in spk: d["spk"]=spk[k]; d["brk"]=1
            if k in brk: d["brk"]=1
            ws.append(d)
    if cut is not None:
        a=cut; ws[0]["s"]=max(ws[0]["s"],cut)
    return dict(type="clip",start=a,end=b,words=ws,**kw)
FIN={"type":"card","dur":5.4,"logo":True,"lines":["Proteger a la infancia","empieza por escucharla."],"size":74,"y":0.56,
     "sub":"VE LA ENTREVISTA COMPLETA","sub_accent":True,"sub_size":32,"sub2":"centrodereflexionescriticas.com/entrevista","sub2_size":34}
if REEL=="1":
    items=[
     clip(310.3,315.5,lower=[W,ROL_W],lower_dur=5.0,fadein=False,fadeout=False),
     clip(339.03,345.33,cut=339.16,fix={339.05:"Planteas"},zoom=1.08,fadein=False,fadeout=False),
     clip(346.06,349.62,fix={349.37:"niños."},zoom=1.14,fadein=False),
     clip(444.15,451.3,fix={450.54:"derecho."},lower=[R,ROL_R],lower_dur=4.6),
     clip(457.58,465.15,drop={459.62},fix={457.62:"Si"}),
     clip(539.4,542.4,fix={539.42:"Está",541.90:"daño."}),
     clip(1310.2,1315.85,cut=1310.24),
     {"type":"card","dur":1.8,"lines":["¿Y su voz?"],"italic":True,"size":130},
     clip(885.38,890.6,fadeout=False),
     clip(893.36,897.6,cut=893.47,zoom=1.1,fadein=False),
     clip(1646.15,1649.24,cut=1646.3,fix={1648.91:"discursos."},spk={1646.19:R},fadeout=False),
     clip(1651.6,1653.0,cut=1651.7,fix={1652.51:"niña."},zoom=1.16,fadein=False),
     clip(906.3,910.58,cut=906.4,fix={906.38:"Basta",910.30:"niño."}),
     FIN,
    ]
else:
    items=[
     clip(1639.1,1649.24,cut=1639.14,fix={1639.11:"Planteas",1644.67:"Es",1648.91:"discursos."},spk={1643.19:R},
          lower=[W,ROL_W],lower_dur=3.9,fadein=False),
     {"type":"card","dur":1.8,"lines":["¿Y la niña?"],"italic":True,"size":130},
     clip(1651.6,1653.0,cut=1651.7,fix={1652.51:"niña."},zoom=1.16,spk={1651.63:R}),
     clip(1662.1,1670.9,cut=1662.34,drop={1668.23},fix={1666.19:"niña?",1668.31:"Esto"},spk={1666.87:W,1670.23:R},brk={1664.59},
          lower=[R,ROL_R],lower_dur=3.4),
     clip(1680.3,1682.38,cut=1680.44,fix={1680.31:"Basta"},fadeout=False),
     clip(1683.5,1690.8,cut=1683.6,drop={1684.23,1686.07,1686.95},fix={1690.39:"niño."},zoom=1.12,fadein=False),
     FIN,
    ]
json.dump({"logo":"/Users/hh/Documents/Codex/2026-10-05/weo/outputs/centroreflexion/public/logo-crc.png","items":items},open(OUT,"w"),ensure_ascii=False,indent=0)
tot=0
for it in items:
    d=it["dur"] if it["type"]=="card" else it["end"]-it["start"]; tot+=d
    print(f"{d:5.1f}s", it.get("lines") or " ".join(w["w"] for w in it["words"]))
print("total",round(tot,1))
