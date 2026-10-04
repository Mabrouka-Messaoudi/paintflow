# PaintFlow — Roadmap

Une phase n'est terminée que lorsque tous ses critères de validation passent. Chaque phase se termine par un commit propre et un push.

Contrôle commun à toutes les phases à partir de la phase 2 :

```bash
npm run lint && npx tsc --noEmit && npm run build
```

---

## Phase 0 — Spécification ✅ en cours
- [x] README.md, PROJECT_SPEC.md, ARCHITECTURE.md, DATABASE.md, DESIGN_SYSTEM.md, ROADMAP.md
- [ ] Documents relus et validés, commités dans le repo

## Phase 1 — Design system
- [ ] Polices Geist + Inter via `next/font`
- [ ] Tokens couleurs, rayons et ombres dans `globals.css`, mappés sur shadcn/ui
- [ ] Variantes Button et Badge (une par statut)
- [ ] Page interne `/styleguide` affichant couleurs, typographie et composants
- **Validation :** `/styleguide` conforme à DESIGN_SYSTEM.md à 1440 et 375 px

## Phase 2 — Setup projet
- [x] Next.js + TypeScript + Tailwind + shadcn/ui + Motion + Lucide
- [ ] Structure de dossiers conforme à ARCHITECTURE.md
- [ ] Projet Supabase créé, `@supabase/supabase-js` et `@supabase/ssr` installés, `.env.local` et `.env.example`
- [ ] Clients Supabase navigateur / serveur, proxy de session
- **Validation :** contrôle commun OK, connexion Supabase testée

## Phase 3 — Landing page
- [ ] Navbar (desktop + menu mobile)
- [ ] Hero avec mockup du dashboard
- [ ] Features (4 cartes)
- [ ] How it works (parcours animé Client → … → Completed)
- [ ] Dashboard preview
- [ ] CTA + Footer
- **Validation :** rendu correct aux 7 largeurs de test, animations désactivées avec reduced motion, score Lighthouse ≥ 90 (performance et accessibilité)

## Phase 4 — Authentification
- [ ] Register avec choix du rôle, Login, Logout
- [ ] Forgot / reset password, route `/auth/callback`
- [ ] Trigger `handle_new_user`
- [ ] Redirections par rôle, protection des routes
- **Validation :** un client ne peut pas ouvrir `/dashboard`, un peintre ne peut pas ouvrir `/client/dashboard`, un visiteur est renvoyé vers `/login`

## Phase 5 — Base de données
- [ ] Migrations : enums, tables, contraintes, index
- [ ] Vue `project_balances`, fonctions et triggers
- [ ] Politiques RLS sur toutes les tables + Storage
- [ ] `seed.sql` : 2 peintres, 4 clients, projets, devis, paiements
- [ ] Types TypeScript générés
- **Validation :** test d'isolement client A / client B réussi en appel direct à l'API

## Phase 6 — Dashboard peintre
- [ ] Layout sidebar + bottom nav
- [ ] Dashboard : 4 StatCards, graphique de revenus, projets récents
- [ ] Clients : liste, création, fiche, archivage
- [ ] Projets : liste, création, page détail avec onglets
- **Validation :** données réelles de la base, empty states pour un nouveau compte

## Phase 7 — Devis et paiements
- [ ] QuoteEditor avec lignes et calcul automatique
- [ ] Envoi, verrouillage, nouvelle version
- [ ] Acceptation / refus côté client via `accept_quote`
- [ ] Enregistrement des paiements, historique, PaymentProgress
- **Validation :** totaux justes au centime, un devis envoyé n'est plus modifiable, un seul devis accepté par projet

## Phase 8 — Factures
- [ ] Génération depuis un devis accepté, numérotation séquentielle
- [ ] Statut calculé, annulation
- [ ] PDF généré côté serveur, stocké, téléchargeable
- **Validation :** numéros sans trou ni doublon, PDF conforme au design

## Phase 9 — Portail client
- [ ] Dashboard client, projet, devis, paiements, factures
- [ ] Invitation par email et liaison du compte
- **Validation :** parcours complet invitation → inscription → acceptation du devis

## Phase 10 — Chat
- [ ] Liste des conversations, fil de messages
- [ ] Temps réel, présence, lu / non lu
- [ ] Pièces jointes (images, PDF, 10 Mo max)
- **Validation :** deux navigateurs (peintre + client) échangent en direct, aucun accès à une conversation d'un autre projet

## Phase 11 — Finitions UX
- [ ] Animations Motion selon DESIGN_SYSTEM.md
- [ ] Skeletons, empty states, error states, toasts
- [ ] Notifications in-app
- **Validation :** revue complète aux 7 largeurs de test

## Phase 12 — Production
- [ ] Revue sécurité (RLS, clés, Storage)
- [ ] Performance, SEO, métadonnées et Open Graph
- [ ] README final avec captures
- [ ] Déploiement Vercel + Supabase prod
- **Validation :** application en ligne, parcours complet testé en production
