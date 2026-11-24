# Portfolio — Bahaa Letaief · BTS SIO SISR

Site du portfolio : **https://bahaaletaief-prog.github.io/portfolio-bahaaletaief/**

Étudiant en 2ᵉ année de BTS SIO option SISR à MyDigitalSchool Montpellier, en alternance à la Mairie de Saint-Clément-de-Rivière.

Le site est un seul fichier HTML, CSS et JavaScript, sans framework. Le sommaire est un câble RJ45 en norme T568B : chaque fil mène à une page. On y trouve 6 fiches de réalisation, le tableau de synthèse E5 et une veille sur la cybersécurité des collectivités.

## Fichiers

```
index.html                    le site
veille.json                   articles de veille affichés par le site
scripts/fetch_veille.py       lit les flux RSS (CERT-FR, CNIL, LeMagIT, IT-Connect, ZDNet, Le Monde Informatique)
.github/workflows/veille.yml  relance la lecture toutes les 4 heures et enregistre les nouveaux articles
```

## Mise en ligne (GitHub Pages)

1. **Settings → Pages → Build and deployment → Deploy from a branch**, branche `main`, dossier `/ (root)`.
2. **Settings → Actions → General → Workflow permissions → Read and write permissions**, pour que la veille puisse enregistrer `veille.json`.
3. **Actions → Mise à jour de la veille → Run workflow** pour une première mise à jour.

## Voir le site en local

Le fil de veille lit `veille.json` : il faut un petit serveur web.

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.
