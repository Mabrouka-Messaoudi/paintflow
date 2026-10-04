# PaintFlow — Base de données

PostgreSQL via Supabase. Toutes les tables sont dans le schéma `public`, avec RLS activé. Les clés primaires sont des `uuid` (`gen_random_uuid()`), les dates des `timestamptz` et les montants des `numeric(12,2)`.

## 1. Choix de conception

Corrections apportées au premier brouillon de schéma :

- **`clients` appartient à un peintre** (`painter_id`) et peut exister sans compte (`profile_id` nullable). Le peintre crée la fiche, puis le client la récupère en s'inscrivant.
- **`projects.client_id` référence `clients.id`**, pas `profiles.id`.
- **Pas de `total_amount` stocké sur le projet** : le total vient du devis accepté. Le solde est calculé dans une vue, ce qui évite les incohérences.
- **Lu / non lu porté par `conversation_members.last_read_at`** plutôt que `messages.read_at`, qui ne fonctionne qu'à deux.
- **Pièces jointes stockées par chemin** (`storage_path`), et rattachables à un message ou directement à un projet.
- **Numéro de facture unique par peintre**, généré par une fonction SQL.

## 2. Types énumérés

```sql
user_role       : 'painter' | 'client'
project_status  : 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
quote_status    : 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
invoice_status  : 'unpaid' | 'partially_paid' | 'paid' | 'void'
payment_method  : 'cash' | 'bank_transfer' | 'card' | 'cheque' | 'other'
```

## 3. Tables

### profiles
Un profil par utilisateur Supabase Auth.

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK, FK → `auth.users.id`, on delete cascade |
| email | text | not null, unique |
| full_name | text | not null |
| business_name | text | nullable, peintre uniquement |
| phone | text | |
| avatar_url | text | chemin Storage |
| role | user_role | not null |
| created_at | timestamptz | default now() |

### clients
Fiche client, propriété d'un peintre.

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| painter_id | uuid | not null, FK → profiles.id |
| profile_id | uuid | nullable, FK → profiles.id (compte client lié) |
| full_name | text | not null |
| email | text | not null |
| phone | text | |
| address | text | |
| archived_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

Unicité : `(painter_id, email)`.

### projects

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| painter_id | uuid | not null, FK → profiles.id |
| client_id | uuid | not null, FK → clients.id |
| name | text | not null |
| description | text | |
| address | text | adresse du chantier |
| status | project_status | default 'draft' |
| progress | smallint | 0–100, default 0 |
| currency | char(3) | default 'EUR' |
| start_date | date | |
| end_date | date | check end_date ≥ start_date |
| created_at | timestamptz | default now() |

### quotes

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | not null, FK → projects.id |
| number | text | ex. `Q-0003`, unique par peintre |
| status | quote_status | default 'draft' |
| tax_rate | numeric(5,2) | default 0, en % |
| subtotal | numeric(12,2) | calculé depuis quote_items |
| tax_amount | numeric(12,2) | calculé |
| total | numeric(12,2) | calculé |
| notes | text | |
| valid_until | date | |
| sent_at / accepted_at / declined_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

Index unique partiel : un seul devis `accepted` par projet.

### quote_items

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| quote_id | uuid | not null, FK → quotes.id, cascade |
| position | smallint | ordre d'affichage |
| description | text | not null |
| quantity | numeric(10,2) | > 0 |
| unit_price | numeric(12,2) | ≥ 0 |
| total | numeric(12,2) | generated: quantity × unit_price |

Un trigger recalcule `subtotal`, `tax_amount` et `total` du devis à chaque modification de ligne.

### payments

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | not null, FK → projects.id |
| amount | numeric(12,2) | > 0 |
| paid_at | date | not null |
| method | payment_method | not null |
| notes | text | |
| recorded_by | uuid | FK → profiles.id |
| created_at | timestamptz | default now() |

### invoices

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | not null, FK → projects.id |
| quote_id | uuid | FK → quotes.id (le devis accepté facturé) |
| invoice_number | text | `INV-0001`, unique par peintre |
| subtotal / tax_amount / total | numeric(12,2) | copiés du devis à l'émission |
| status | invoice_status | default 'unpaid' |
| issued_at | date | default current_date |
| due_date | date | |
| created_at | timestamptz | default now() |

Les montants sont figés à l'émission : une facture ne change pas si le devis bouge ensuite.

### conversations

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | not null, unique, FK → projects.id |
| created_at | timestamptz | default now() |

### conversation_members

| Colonne | Type | Contraintes |
|---|---|---|
| conversation_id | uuid | FK → conversations.id, cascade |
| profile_id | uuid | FK → profiles.id |
| last_read_at | timestamptz | nullable |

PK : `(conversation_id, profile_id)`.

### messages

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| conversation_id | uuid | not null, FK → conversations.id |
| sender_id | uuid | not null, FK → profiles.id |
| content | text | nullable si pièce jointe seule |
| created_at | timestamptz | default now() |

### attachments

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | not null, FK → projects.id |
| message_id | uuid | nullable, FK → messages.id |
| uploaded_by | uuid | FK → profiles.id |
| storage_path | text | not null |
| file_name | text | not null |
| mime_type | text | image/jpeg, image/png, image/webp, application/pdf |
| size_bytes | integer | ≤ 10 485 760 |
| created_at | timestamptz | default now() |

### notifications

| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| recipient_id | uuid | not null, FK → profiles.id |
| type | text | `quote_sent`, `quote_accepted`, `payment_recorded`, `new_message`… |
| payload | jsonb | ids et libellés utiles à l'affichage |
| read_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

## 4. Relations

```
profiles (painter) 1──n clients 1──n projects
profiles (client)  1──n clients            (via profile_id, un client peut avoir plusieurs peintres)
projects 1──n quotes 1──n quote_items
projects 1──n payments
projects 1──n invoices
projects 1──1 conversations 1──n messages 1──n attachments
conversations n──n profiles   (via conversation_members)
profiles 1──n notifications
```

## 5. Vue de solde

```sql
project_balances (project_id, total, paid, remaining, paid_percent)
```

`total` = total du devis accepté (0 sinon), `paid` = somme des paiements, `remaining` = total − paid. La vue est créée avec `security_invoker = true` pour que la RLS des tables sous-jacentes s'applique.

## 6. Fonctions SQL

| Fonction | Rôle |
|---|---|
| `handle_new_user()` | trigger sur `auth.users` : crée le profil avec le rôle choisi |
| `link_client_account()` | relie un nouveau compte client aux fiches `clients` de même email |
| `is_project_member(project_id)` | vrai si l'utilisateur est le peintre ou le client du projet |
| `accept_quote(quote_id)` | vérifie que l'appelant est le client, que le devis est `sent` et valide, puis l'accepte |
| `next_invoice_number(painter_id)` | numéro séquentiel sans doublon |
| `recalc_quote_totals()` | trigger sur `quote_items` |

## 7. Politiques RLS

Principe : **un peintre ne voit que ce qui lui appartient, un client ne voit que les projets dont il est le client.** Aucune politique de type « si painter, tout voir ».

| Table | Peintre | Client |
|---|---|---|
| profiles | lit/modifie son profil ; lit les profils de ses clients | lit/modifie son profil ; lit le profil de ses peintres |
| clients | CRUD où `painter_id = auth.uid()` | lecture où `profile_id = auth.uid()` |
| projects | CRUD sur ses projets | lecture des projets où il est le client |
| quotes, quote_items | CRUD sur les devis de ses projets ; modification seulement en `draft` | lecture des devis non-`draft` de ses projets ; acceptation via `accept_quote()` uniquement |
| payments | CRUD sur ses projets | lecture seule |
| invoices | création/lecture/annulation sur ses projets | lecture seule |
| conversations, messages | membres uniquement : lecture + insertion avec `sender_id = auth.uid()` | idem |
| attachments | membres du projet : lecture + upload | idem |
| notifications | ses propres notifications | idem |

Test d'acceptation obligatoire : un client A connecté ne doit obtenir **aucune ligne** en interrogeant les projets, devis, paiements, factures ou messages d'un client B, y compris par appel direct à l'API Supabase.

## 8. Stockage

| Bucket | Contenu | Accès |
|---|---|---|
| `avatars` | photos de profil | privé, URL signée |
| `project-files` | photos et documents de chantier, pièces jointes du chat | privé, chemin `{project_id}/{uuid}-{nom}` |
| `invoices` | PDF générés | privé, chemin `{project_id}/{invoice_number}.pdf` |

Les politiques Storage reprennent `is_project_member()` sur le premier segment du chemin.

## 9. Index

`clients(painter_id)`, `projects(painter_id)`, `projects(client_id)`, `quotes(project_id)`, `payments(project_id)`, `invoices(project_id)`, `messages(conversation_id, created_at desc)`, `notifications(recipient_id, read_at)`.
