# Portfolio — Bahaa Letaief · BTS SIO SISR

Site portfolio statique (HTML / CSS / JavaScript, sans dépendance) pour l'épreuve du BTS SIO option SISR.

- 2025 – 2027 : BTS SIO SISR, MyDigitalSchool Montpellier
- 02/2026 – 07/2026 : stage à la Mairie de Saint-Clément-de-Rivière
- 2026 – 2027 : alternance à la Mairie de Saint-Clément-de-Rivière

## Structure

```
index.html            page unique (profil, parcours, mairie, réalisations, compétences, veille, contact)
assets/css/style.css  styles (thème clair / sombre automatique + bouton)
assets/js/main.js     menu mobile, terminal animé, filtre des réalisations, animations
```

## Voir le site en local

Ouvrir `index.html` dans un navigateur.

## Mettre le site en ligne avec GitHub Pages

1. Fusionner cette branche dans `main`.
2. Sur GitHub : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site sera disponible sur `https://bahaaletaief-prog.github.io/portfolio-bahaaletaief/`.

## Modifier le contenu

Tout le texte se trouve dans `index.html`, une section par bloc (`<!-- ============ MAIRIE ============ -->`, etc.).
Pour ajouter une réalisation, dupliquer un bloc `<article class="project" data-cat="...">`
(`data-cat` : `mairie`, `ecole` ou `perso`) et ajouter la ligne correspondante dans le tableau de synthèse.
