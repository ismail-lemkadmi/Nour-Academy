Nour Academy — Portail d’inscription

Projet individuel YouCode Nador · Brief 3 · Partie 1.

Un parent peut rechercher des cours, préparer sa sélection et obtenir un récapitulatif d’inscription depuis son navigateur. L’interface est en français et prévue pour mobile et ordinateur.

## Liens du projet

- [Dépôt GitHub](https://github.com/ismail-lemkadmi/Nour-Academy)
- [Site GitHub Pages](https://ismail-lemkadmi.github.io/Nour-Academy/)
- [Board Jira NOUR](https://ismaillemkadmi.atlassian.net/jira/software/projects/NOUR/boards/35?filter=&groupBy=none)
- [Maquette Figma](https://www.figma.com/design/gVhTiRhgeLab22WQU1L2s9/Nour-Academy?node-id=0-1)

## Lancer le projet

1. Télécharger ou cloner le dépôt et ouvrir le dossier dans VS Code.
2. Ouvrir `index.html` avec l’extension **Live Server**.

On peut également ouvrir directement `index.html` dans un navigateur récent. Aucun paquet à installer et aucune compilation ne sont nécessaires. Live Server reste pratique pendant le développement.

## Structure

```text
Nour-Academy/
├── index.html
├── src/
│   └── style.css
├── js/
│   ├── courses.js
│   └── script.js
└── README.md
```

HTML sémantique, CSS natif et Vanilla JavaScript : aucun framework, CDN, serveur ou appel à une API externe. `courses.js` contient les données ; `script.js` gère l’affichage et les interactions. Les deux scripts sont chargés dans cet ordre avec `defer`.

## Fonctionnement

- **US1 — Catalogue :** 12 cours générés depuis JavaScript, avec niveau, matière, centre, horaire, places et prix mensuel en MAD. Un cours complet reste visible avec son bouton désactivé.
- **US2 — Filtres :** le niveau **et** la matière doivent correspondre. Le compteur, l’état sans résultat et la réinitialisation suivent les filtres.
- **US3 — Sélection :** un `Set` conserve les identifiants sans doublon. Un seul listener délégué sur le catalogue gère l’ajout et le retrait. Le récapitulatif propose aussi le retrait et calcule le total mensuel.
- **US4 — Formulaire :** validation en direct des informations du parent et de l’élève, du téléphone marocain, de l’e-mail, du mot de passe, de sa confirmation et du consentement. Chaque champ dispose d’un message associé et d’un état `aria-invalid`.
- **US5 — Récapitulatif :** la soumission bloque les erreurs et focalise la sélection vide ou le premier champ invalide. Un dossier valide reçoit un numéro généré par `crypto.randomUUID()`. Le formulaire et la sélection sont ensuite réinitialisés ; le récapitulatif reste affiché.

### Règles de validation

- Noms : 2 à 80 caractères, lettres Unicode, espaces, apostrophes ou tirets.
- Mobile marocain : `06` ou `07` + 8 chiffres ; ou `+2126` ou `+2127` + 8 chiffres. Les espaces sont retirés pour la vérification.
- E-mail : contrôle du format, avec rejet des points consécutifs et d’une partie locale commençant ou finissant par un point. Il ne vérifie pas l’existence de la boîte mail.
- Mot de passe : 8 à 128 caractères, dont une majuscule, un chiffre et un caractère spécial. La confirmation doit être identique.
- Niveau et consentement obligatoires.

## Données de démonstration

Utiliser uniquement des données fictives. L’application ne transmet ni n’enregistre les données saisies et n’utilise pas de stockage persistant. Le récapitulatif reste dans la page jusqu’à son remplacement ou à son rechargement/fermeture : il ne constitue pas un envoi au secrétariat. Les mots de passe n’apparaissent jamais dans ce récapitulatif. Le back-office relève de la Partie 2.

## Checklist de recette manuelle

Les cases suivantes sont à exécuter sur la version finale ; elles ne constituent pas un compte rendu de tests déjà réussis.

### US1

- [ ] Les 12 cours s’affichent depuis le tableau JavaScript, avec leurs informations et prix en MAD.
- [ ] `Anglais — 2e Bac`, à zéro place, affiche `Complet` et ne peut pas être ajouté.
- [ ] La page reste lisible de 360 à 1440 px, sans débordement horizontal.

### US2

- [ ] Sans filtre : 12 cours ; niveau seul : 3 cours par niveau ; Mathématiques seul : 4 cours.
- [ ] `Collège + SVT` affiche 1 cours ; `Primaire + Physique-chimie` affiche zéro résultat et un message clair.
- [ ] `Réinitialiser` rétablit les deux filtres vides et les 12 cours.

### US3

- [ ] Ajouter Mathématiques et Physique-chimie de 2e Bac donne 2 cours et **700 MAD**.
- [ ] Retirer un de ces cours depuis sa carte ou le récapitulatif donne 1 cours et **350 MAD**, sans doublon.
- [ ] Changer/réinitialiser les filtres, y compris vers zéro résultat, conserve la sélection et le total.
- [ ] Tab et Entrée permettent les actions ; le focus reste utilisable après une suppression.

### US4

- [ ] Au chargement, aucun champ intact n’est en erreur. Quitter un champ obligatoire vide affiche une erreur précise.
- [ ] Téléphones `0612345678`, `0712345678` et `+212612345678` acceptés ; `0512345678` et un numéro incomplet refusés.
- [ ] E-mail incorrect et mot de passe incomplet refusés ; `Exemple1!` respecte les critères du mot de passe.
- [ ] Modifier le mot de passe réévalue sa confirmation. Un consentement non coché reste invalide.
- [ ] Messages reliés aux champs, `aria-invalid` et styles reflètent leur état ; les mots de passe sont masqués à l’écran.

### US5

- [ ] Sans cours, la validation affiche l’erreur de sélection et la focalise ; avec des champs incorrects, elle focalise le premier champ invalide.
- [ ] Une soumission valide affiche les bonnes identités, coordonnées, cours, total et numéro de dossier ; aucun mot de passe.
- [ ] Après succès : formulaire vide, consentement décoché, sélection à zéro ; récapitulatif conservé et titre focalisé.
- [ ] Tester une soumission par Entrée depuis un champ : aucune erreur ne réapparaît après le reset.
- [ ] Une deuxième soumission valide reçoit un numéro différent. Le numéro reste lisible à 360 px.
- [ ] La soumission ne recharge pas la page et ne place pas les données dans l’URL.

## Publication GitHub Pages

1. Fusionner la PR validée dans `main`.
2. Dans **Settings → Pages**, choisir **Deploy from a branch**.
3. Sélectionner **main** et **/(root)**, puis enregistrer.
4. Conserver `index.html` à la racine et les chemins relatifs `src/style.css`, `js/courses.js`, `js/script.js`.
5. Après le déploiement réussi, ouvrir le lien public et vérifier le catalogue, les styles et une inscription fictive complète.

## Organisation

Une user story par ticket Jira, avec ses critères d’acceptation : **À faire → En cours → En revue → Terminé**. La clé du ticket figure dans la branche `feature/<clé>-<description>`, les commits et la PR correspondante. Les états des tickets et PR doivent refléter leur avancement réel.
