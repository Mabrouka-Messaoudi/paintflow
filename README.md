# PaintFlow

Plateforme SaaS de gestion pour peintres professionnels et leurs clients : projets, devis, paiements, factures et chat en temps réel, réunis dans un seul espace.

Le peintre pilote son activité depuis un dashboard. Le client suit son chantier, valide ses devis, voit ce qu'il a payé et ce qu'il reste à payer, et échange avec le peintre sans passer par WhatsApp ou des PDF envoyés par mail.

## Stack

| Couche | Technologie |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Style | Tailwind CSS + shadcn/ui |
| Icônes / animations | Lucide React / Motion (`motion/react`) |
| Formulaires | React Hook Form + Zod |
| Graphiques | Recharts |
| Backend | Supabase : PostgreSQL, Auth, Realtime, Storage |
| Sécurité des données | Row Level Security (RLS) PostgreSQL |
| Déploiement | Vercel (app) + Supabase (backend) |

## Documentation

| Document | Contenu |
|---|---|
| [PROJECT_SPEC.md](./PROJECT_SPEC.md) | Vision, rôles, fonctionnalités, parcours utilisateurs, règles métier |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Structure du code, routing, accès aux données, auth, realtime |
| [DATABASE.md](./DATABASE.md) | Schéma, relations, vues, politiques RLS, stockage |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Couleurs, typographie, espacements, composants, animations, responsive |
| [ROADMAP.md](./ROADMAP.md) | Les 13 phases (0 à 12) et leurs critères de validation |

## Démarrage local

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev                   # http://localhost:3000
```

Variables attendues :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=    # serveur uniquement, jamais exposée au client
```

## Scripts

```bash
npm run dev        # développement
npm run lint       # ESLint
npx tsc --noEmit   # vérification TypeScript
npm run build      # build de production
```

## Statut

Projet en cours de construction, phase par phase. Voir [ROADMAP.md](./ROADMAP.md).
