# PEteach — Portail de ressources

Portail statique responsive pour les enseignants d'éducation physique au secondaire. Les ressources sont chargées depuis Supabase; un jeu de secours local assure l'affichage si l'API est indisponible.

## Contenu

- `index.html` : structure et contenu du site
- `styles.css` : identité visuelle, responsive et accessibilité
- `app.js` : affichage, recherche, filtres et chargement Supabase
- `config.js` : URL Supabase et clé publishable publique
- `assets/favicon.svg` : icône PEteach

## Déploiement GitHub Pages

1. Dépôt GitHub public `PEteach/peteach-hub`.
2. Les fichiers du site sont à la racine du dépôt.
3. Dans GitHub : **Settings → Pages**.
4. Choisir **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis enregistrer.
5. Le site sera publié à `https://peteach.github.io/peteach-hub/` après la fin du déploiement.

Aucune compilation ni installation n'est nécessaire.

## Supabase

Projet : `peteach-hub`  
URL : `https://hxobbuynzitukmiqtdps.supabase.co`  
Table publique en lecture seule : `public.resources`

La table utilise RLS. Les rôles `anon` et `authenticated` peuvent lire uniquement les ressources actives. Les visiteurs ne peuvent pas ajouter, modifier ou supprimer des ressources depuis le site.

Pour ajouter ou modifier une ressource, ouvrir **Supabase → Table Editor → resources** et créer/modifier une ligne. Champs utiles :

- `title` : titre
- `description` : courte description
- `category` : catégorie (Badminton, Organisation, Pédagogie, etc.)
- `icon` : identifiant d'icône (trophy, users, medal, book-open, activity, dumbbell, clipboard)
- `url` : adresse HTTPS
- `display_order` : ordre d'affichage
- `is_active` : afficher/masquer la ressource

## Sécurité

`config.js` contient une clé publishable destinée à être exposée dans un client web. Ne jamais y mettre une clé `service_role`, une clé secrète ou un mot de passe. Les droits d'écriture doivent rester réservés à un processus administratif protégé.

## Personnalisation

Modifier les couleurs dans `:root` au début de `styles.css`. Ajouter des ressources dans Supabase plutôt que dans `app.js` afin de conserver une source de données centralisée.
