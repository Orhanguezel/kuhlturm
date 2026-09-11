import requests,bs4,concurrent.futures,json,time,datetime,urllib.parse,xml.etree.ElementTree as ET,pathlib,hashlib,collections
ROOT=pathlib.Path('/home/orhan/Documents/Projeler/Ensotek')
HEAD={'User-Agent':'Ensotek-readonly-site-audit/1.0'}
def fetch(url):
 t=time.monotonic()
 try:
  r=requests.get(url,headers=HEAD,timeout=25)
  d={'url':url,'status':r.status_code,'final':r.url,'seconds':round(time.monotonic()-t,3),'bytes':len(r.content),'content_type':r.headers.get('content-type',''),'chain':[{'url':x.url,'status':x.status_code,'location':x.headers.get('location')} for x in r.history],'headers':{k:v for k,v in r.headers.items() if k.lower() in ['x-robots-tag','cache-control','content-security-policy','strict-transport-security','x-frame-options','x-content-type-options']}}
  if 'text/html' not in d['content_type']:d['text']=r.text[:100000];return d
  s=bs4.BeautifulSoup(r.content,'html.parser')
  d.update(title=s.title.get_text(' ',strip=True) if s.title else '',lang=s.html.get('lang') if s.html else '',canonical=[x.get('href') for x in s.select('link[rel="canonical"]')],alternates=[{'lang':x.get('hreflang'),'url':x.get('href')} for x in s.select('link[hreflang]')],description=[x.get('content') for x in s.select('meta[name="description"]')],robots=[x.get('content') for x in s.select('meta[name="robots"]')],h1=[x.get_text(' ',strip=True) for x in s.select('h1')],links=sorted(set(urllib.parse.urljoin(r.url,x['href']).split('#')[0] for x in s.select('a[href]') if not x['href'].startswith(('mailto:','tel:','javascript:','#')))),images=[{'src':urllib.parse.urljoin(r.url,x.get('src','')),'alt':x.get('alt')} for x in s.select('img')],jsonld=[x.get_text() for x in s.select('script[type="application/ld+json"]')],forms=[{'action':x.get('action'),'fields':[{'tag':y.name,'type':y.get('type'),'name':y.get('name'),'id':y.get('id'),'required':y.has_attr('required')} for y in x.select('input,textarea,select')]} for x in s.select('form')])
  for x in s.select('script,style,noscript,header,footer,nav'):x.decompose()
  main=s.select_one('main') or s
  d['text']=main.get_text(' ',strip=True);d['text_hash']=hashlib.sha256(d['text'].encode()).hexdigest();d['words']=len(d['text'].split())
  return d
 except Exception as e:return {'url':url,'status':0,'error':str(e),'seconds':round(time.monotonic()-t,3)}
def run(repo,base,locales):
 out=ROOT/repo/'docs/audit/2026-09-09';out.mkdir(parents=True,exist_ok=True)
 sm=fetch(base+'/sitemap.xml');rb=fetch(base+'/robots.txt');ll=fetch(base+'/llms.txt')
 urls=[]
 try:urls=[x.text for x in ET.fromstring(sm['text']).findall('{*}url/{*}loc')]
 except Exception:pass
 (out/'sitemap.xml').write_text(sm.get('text',''));(out/'robots.txt').write_text(rb.get('text',''))
 known={};queue=set(urls)|{base+'/'+l for l in locales}|{base+'/'+l+p for l in locales for p in ['/codex-audit-nonexistent-20260909','/legal/codex-audit-nonexistent-20260909','/contact','/offer','/blog']}
 hosts={urllib.parse.urlsplit(base).hostname,urllib.parse.urlsplit(base).hostname.replace('www.','')}
 for round_ in range(4):
  batch=sorted(queue-set(known))[:max(0,1200-len(known))]
  if not batch:break
  with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
   for d in pool.map(fetch,batch):known[d['url']]=d
  queue=set()
  for d in known.values():
   for u in d.get('links',[])+[x['url'] for x in d.get('alternates',[])]:
    p=urllib.parse.urlsplit(u)
    if p.hostname in hosts and not p.query and not any(p.path.startswith(x) for x in ['/api','/_next','/uploads']) and not p.path.lower().endswith(('.jpg','.png','.pdf','.webp','.svg','.zip')):queue.add(u)
  (out/'crawl.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'base':base,'sitemap_urls':urls,'sitemap_status':sm['status'],'robots':rb,'llms':ll,'pages':list(known.values()),'remaining':sorted(queue-set(known))},ensure_ascii=False,indent=2))
  print(repo,'round',round_,'sitemap',len(urls),'crawled',len(known),'pending',len(queue-set(known)),flush=True)
run('kompozit','https://www.karbonkompozit.com.tr',['tr','en'])
run('kuhlturm','https://kuhlturm.com',['de','en'])
