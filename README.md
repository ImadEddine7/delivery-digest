# Delivery Digest — Data Factory IT

Application web de reporting mensuel pour une IT Data Factory. Génère un digest partageable qui consolide le chiffre d'affaires, la couverture PO, le ratio offshore/onshore, les messages clés et le planning global.

## Fonctionnalités

- **Vue Digest** : page publique avec tous les blocs (CA, PO, offshore, messages, Gantt)
- **Administration** : saisie manuelle, import Excel, prévisualisation en temps réel
- **Persistance GitHub** : les données sont des fichiers JSON committés dans le repo
- **Mode local** : fonctionne sans token pour les démos
- **Import Excel** : glisser-déposer un .xlsx, mapping automatique des colonnes

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- react-router (hash routing, compatible GitHub Pages)
- zod (validation)
- SheetJS (parsing Excel)
- GitHub REST Contents API (persistance)

## Démarrage

```bash
npm install
npm run dev
```

## Configuration GitHub

1. Créer un [Fine-grained Personal Access Token](https://github.com/settings/tokens?type=beta) avec `Contents: read & write` sur ce repo
2. Dans l'app, aller dans Administration > Paramètres
3. Renseigner owner, repo, branche et token

## Déploiement

Le déploiement se fait automatiquement via GitHub Actions sur chaque push sur `main`. Activer GitHub Pages dans les paramètres du repo (source: GitHub Actions).

## Structure des données

Les données sont stockées dans `/data` :
- `data/index.json` — liste des périodes publiées
- `data/digests/YYYY-MM.json` — un fichier par mois
- `data/assets/YYYY-MM/` — images associées
