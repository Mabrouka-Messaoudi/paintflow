# PaintFlow — Architecture

## 1. Vue d'ensemble

PaintFlow est une application Next.js unique qui sert à la fois le site marketing et l'application. Il n'y a pas de backend séparé : la logique serveur vit dans les Server Components et les Server Actions de Next.js, et Supabase fournit la base PostgreSQL, l'authentification, le temps réel et le stockage de fichiers.

```
Navigateur ──► Next.js (Vercel)
                 ├─ Server Components : lecture des données
                 ├─ Server Actions    : écritures validées par Zod
                 └─ Client Components : UI interactive, chat temps réel
                          │
                          ▼
                     Supabase
                 ├─ PostgreSQL + RLS
                 ├─ Auth (sessions en cookies)
                 ├─ Realtime (messages, présence)
                 └─ Storage (photos, PDF)
```

La sécurité repose sur la base : chaque requête part avec la session de l'utilisateur, et les politiques RLS décident de ce qu'il peut lire ou écrire. L'interface masque ce qui n'est pas pertinent, mais n'est jamais la barrière.

## 2. Structure du code

```
src/
├── app/
│   ├── (marketing)/            # site public, navbar marketing
│   │   ├── layout.tsx
│   │   ├── page.tsx            # /
│   │   └── pricing/            # /pricing
│   ├── (auth)/                 # écrans centrés, sans navigation
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (painter)/              # layout sidebar + bottom nav peintre
│   │   └── dashboard/          # /dashboard
│   │       ├── projects/       # /dashboard/projects, /dashboard/projects/[id]
│   │       ├── clients/
│   │       ├── quotes/
│   │       ├── payments/
│   │       ├── invoices/
│   │       ├── messages/
│   │       └── settings/
│   ├── client/                 # layout portail client
│   │   ├── dashboard/          # /client/dashboard
│   │   ├── projects/[id]/
│   │   ├── invoices/
│   │   └── messages/
│   └── auth/callback/          # retour des liens email Supabase
├── components/
│   ├── ui/                     # shadcn/ui, personnalisés
│   ├── marketing/
│   ├── dashboard/              # sidebar, mobile-nav, stat-card…
│   ├── projects/ quotes/ payments/ invoices/ chat/
│   └── shared/                 # empty-state, loading-state, error-state
├── lib/
│   ├── supabase/               # client.ts (navigateur), server.ts, proxy.ts
│   ├── validations/            # schémas Zod partagés formulaires/actions
│   ├── permissions/            # helpers de rôle côté serveur
│   └── utils/                  # format monétaire, dates, cn()
├── hooks/                      # use-realtime-messages, use-presence…
└── types/
    └── database.ts             # généré par `supabase gen types`
supabase/
├── migrations/                 # SQL versionné : tables, RLS, fonctions
└── seed.sql                    # données de démo
```

**Note par rapport à l'étape 1 de setup :** le groupe `(client)/portal` est remplacé par un vrai segment `client/`, pour obtenir les URLs `/client/...` prévues dans la spec.

## 3. Routing et contrôle d'accès

Trois niveaux, du plus large au plus strict :

1. **Proxy Next.js** (`proxy.ts` à la racine, l'ancien `middleware.ts`) : rafraîchit la session Supabase et redirige les visiteurs non connectés vers `/login` pour toute route `/dashboard/*` et `/client/*`.
2. **Layouts serveur** : `(painter)/layout.tsx` vérifie que le profil a le rôle `painter`, `client/layout.tsx` vérifie le rôle `client`. Sinon, redirection vers le bon espace.
3. **RLS PostgreSQL** : barrière finale. Même un appel direct à l'API Supabase avec un jeton valide ne renvoie que les lignes autorisées.

Après connexion : `painter` → `/dashboard`, `client` → `/client/dashboard`.

## 4. Accès aux données

- **Lecture** : dans les Server Components, via le client Supabase serveur (`lib/supabase/server.ts`) qui lit la session depuis les cookies.
- **Écriture** : uniquement via des Server Actions. Chaque action valide l'entrée avec le schéma Zod de `lib/validations/`, appelle Supabase avec la session de l'utilisateur, puis appelle `revalidatePath`.
- **Opérations sensibles** (numérotation des factures, acceptation d'un devis, création de conversation) : fonctions PostgreSQL appelées par `rpc()`, pour que la règle métier soit atomique et appliquée côté base.
- **Clé `service_role`** : réservée aux rares tâches d'administration côté serveur. Jamais importée dans un fichier client.
- **Types** : `supabase gen types typescript` régénère `types/database.ts` après chaque migration.

## 5. Authentification

Supabase Auth avec email + mot de passe, via `@supabase/ssr`. À l'inscription, un trigger PostgreSQL crée la ligne `profiles` avec le rôle choisi. Lorsqu'un client invité s'inscrit, une fonction relie son profil à la fiche `clients` portant le même email.

## 6. Temps réel

- **Messages** : abonnement Realtime aux insertions dans `messages` filtrées par `conversation_id`. RLS s'applique aussi aux événements Realtime.
- **Présence** : canal Realtime Presence par conversation pour l'indicateur « en ligne ».
- **Lu / non lu** : `conversation_members.last_read_at`, mis à jour à l'ouverture d'une conversation.

## 7. Fichiers

Buckets Supabase Storage **privés**. La base stocke le chemin du fichier (`storage_path`), jamais une URL publique. L'affichage passe par des URLs signées à durée courte, générées côté serveur après vérification des droits. Les PDF de factures sont générés côté serveur.

## 8. Environnements et déploiement

| Environnement | App | Supabase |
|---|---|---|
| Local | `npm run dev` | projet Supabase de dev (ou CLI locale) |
| Production | Vercel, branche `main` | projet Supabase de prod |

Les migrations SQL sont versionnées dans `supabase/migrations/` et appliquées de façon identique en dev et en prod. Chaque push sur GitHub déclenche une preview Vercel.
