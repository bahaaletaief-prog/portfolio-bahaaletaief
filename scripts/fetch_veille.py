#!/usr/bin/env python3
"""Lit les flux RSS de veille et écrit veille.json (liste d'articles triés du plus récent au plus ancien)."""
import json, re, sys, hashlib, html, urllib.request
from email.utils import parsedate_to_datetime
from datetime import datetime, timezone
import xml.etree.ElementTree as ET

FEEDS = [
    ("CERT-FR · alertes", "https://www.cert.ssi.gouv.fr/alerte/feed/"),
    ("CERT-FR · actualités", "https://www.cert.ssi.gouv.fr/actualite/feed/"),
    ("CNIL", "https://www.cnil.fr/fr/rss.xml"),
    ("LeMagIT", "https://www.lemagit.fr/rss/ContentSyndication.xml"),
    ("IT-Connect", "https://www.it-connect.fr/feed/"),
    ("ZDNet", "https://www.zdnet.fr/feeds/rss/actualites/"),
    ("Le Monde Informatique", "https://www.lemondeinformatique.fr/flux-rss/thematique/securite/rss.xml"),
]
PER_FEED = 6
KEEP = 50
# mots qui rattachent un article au sujet de veille (collectivités)
LOCAL = re.compile(r"collectivit|mairie|commune|territori|h[oô]pital|service public|secteur public|ran[çc]ongiciel|ransomware|NIS ?2", re.I)
CYBER = re.compile(r"s[ée]curit|cyber|vuln|faille|attaque|ran[çc]ongiciel|ransomware|phishing|hame[çc]onnage|piratage|fuite|CVE|malware|RGPD|NIS", re.I)

def text(s, n):
    s = html.unescape(html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).replace("\xa0", " ")
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s if len(s) <= n else s[: n - 1].rsplit(" ", 1)[0] + "…"

def parse_date(s):
    if not s:
        return None
    try:
        d = parsedate_to_datetime(s)
    except Exception:
        try:
            d = datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=timezone.utc)
    return d.astimezone(timezone.utc)

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "portfolio-veille/1.0 (+RSS)"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()

def items_of(raw):
    root = ET.fromstring(raw)
    ns = {"a": "http://www.w3.org/2005/Atom"}
    out = []
    for it in root.iter("item"):
        out.append((it.findtext("title"), it.findtext("link"), it.findtext("pubDate") or it.findtext("{http://purl.org/dc/elements/1.1/}date"), it.findtext("description")))
    for it in root.findall(".//a:entry", ns):
        link = it.find("a:link", ns)
        out.append((it.findtext("a:title", namespaces=ns), link.get("href") if link is not None else None, it.findtext("a:updated", namespaces=ns) or it.findtext("a:published", namespaces=ns), it.findtext("a:summary", namespaces=ns)))
    return out

articles, failed = [], []
for source, url in FEEDS:
    try:
        n = 0
        for title, link, date, desc in items_of(fetch(url)):
            link = (link or "").strip()
            if not title or not link.startswith("https://"):
                continue
            d = parse_date(date)
            t, s = text(title, 180), text(desc, 240)
            # sources généralistes : ne garder que la sécurité
            if source in ("ZDNet", "IT-Connect", "LeMagIT") and not CYBER.search(t + " " + s):
                continue
            articles.append({
                "id": hashlib.sha1(link.encode()).hexdigest()[:16],
                "source": source, "title": t, "link": link, "summary": s,
                "date": d.strftime("%Y-%m-%dT%H:%M:%SZ") if d else None,
                "local": bool(LOCAL.search(t + " " + s)),
            })
            n += 1
            if n >= PER_FEED:
                break
    except Exception as e:
        failed.append(f"{source}: {type(e).__name__}")

seen, uniq = set(), []
for a in sorted(articles, key=lambda a: a["date"] or "", reverse=True):
    if a["id"] not in seen:
        seen.add(a["id"]); uniq.append(a)
out = {"updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "articles": uniq[:KEEP], "failed": failed}
path = sys.argv[1] if len(sys.argv) > 1 else "veille.json"
if not out["articles"]:
    sys.exit("aucun article récupéré : fichier conservé")
try:
    old = json.load(open(path, encoding="utf-8"))
    if [x["id"] for x in old.get("articles", [])] == [x["id"] for x in out["articles"]]:
        print("aucun nouvel article : fichier conservé"); sys.exit(0)
except (OSError, ValueError):
    pass
json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(out["articles"]), "articles ;", "échecs :", failed or "aucun")
