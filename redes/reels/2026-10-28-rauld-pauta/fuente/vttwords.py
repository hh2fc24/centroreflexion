import re,sys,json
txt=open(sys.argv[1],encoding='utf-8').read()
def ts(s):
    h,m,r=s.split(':'); return int(h)*3600+int(m)*60+float(r)
words={}
for b in txt.split('\n\n'):
    m=re.search(r'(\d\d:\d\d:\d\d\.\d+) --> (\d\d:\d\d:\d\d\.\d+)',b)
    if not m: continue
    for l in b.split('\n'):
        if '<c>' not in l: continue
        st=ts(m[1])
        first=re.match(r'^([^<]+)<',l)
        if first: words[round(st,2)]=first[1].strip()
        for t,w in re.findall(r'<(\d\d:\d\d:\d\d\.\d+)><c>([^<]*)</c>',l):
            words[round(ts(t),2)]=w.strip()
items=sorted(words.items())
out=[]
for i,(t,w) in enumerate(items):
    e=items[i+1][0] if i+1<len(items) else t+0.4
    out.append({"w":w,"s":t,"e":min(e,t+1.0)})
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False)
a,b=float(sys.argv[3]),float(sys.argv[4])
lt=None;line=[]
for o in out:
    if a<=o['s']<=b:
        if lt is None or o['s']-lt>=6:
            if line: print(' '.join(line))
            line=[f"\n[{o['s']:.1f}]"]; lt=o['s']
        line.append(f"{o['w']}|{o['s']:.2f}")
print(' '.join(line))
