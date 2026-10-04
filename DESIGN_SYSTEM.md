# PaintFlow — Design System

## 1. Intention

Un outil professionnel qui respire. Inspiration : les portfolios produits modernes, minimalistes et premium, avec beaucoup d'espace blanc, une typographie forte, des grandes sections et des animations discrètes. Le design de PaintFlow est original : il reprend cet esprit, pas une page existante.

Le lien avec la peinture reste subtil : un fond légèrement chaud comme une toile apprêtée, et un accent terracotta. Pas d'éclaboussures ni de pinceaux décoratifs.

Trois règles :
1. **L'espace avant la décoration.** En cas de doute, on ajoute de l'espace, pas un élément.
2. **Une seule couleur d'accent par écran visible**, réservée à l'action principale ou à l'information clé.
3. **Le mouvement explique**, il ne décore pas.

## 2. Couleurs

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FAFAF7` | fond de page |
| `surface` | `#FFFFFF` | cartes, panneaux, modales |
| `surface-muted` | `#F3F2EE` | zones secondaires, hover de ligne |
| `foreground` | `#1C1B19` | texte principal |
| `muted-foreground` | `#6B6862` | texte secondaire, labels |
| `border` | `#E7E5E0` | bordures, séparateurs |
| `primary` | `#1C1B19` | boutons principaux (charcoal) |
| `primary-foreground` | `#FAFAF7` | texte sur primary |
| `accent` | `#C8553D` | terracotta : CTA marketing, éléments actifs, chiffres clés |
| `accent-soft` | `#F6E3DD` | fonds de badge, surlignage |
| `success` / `success-soft` | `#3F8F5F` / `#E4F2E8` | payé, accepté, terminé |
| `warning` / `warning-soft` | `#B7791F` / `#FBF1DC` | en attente, partiellement payé |
| `danger` / `danger-soft` | `#C2453B` / `#F8E1DF` | refusé, en retard, suppression |

Statuts → couleurs :
- `paid`, `accepted`, `completed` → success
- `partially_paid`, `sent`, `pending`, `in_progress` → warning
- `unpaid`, `declined`, `expired`, `cancelled` → danger
- `draft`, `void` → neutre (surface-muted)

Contraste : tout texte courant ≥ 4.5:1. L'accent terracotta sur blanc est réservé aux textes ≥ 18 px ou en gras, et aux boutons avec texte blanc.

Ces valeurs sont déclarées comme variables CSS dans `globals.css` et mappées sur les tokens shadcn/ui (`--background`, `--primary`, `--accent`…).

## 3. Typographie

| Rôle | Police | Chargement |
|---|---|---|
| Titres | **Geist** | `next/font` |
| Texte et interface | **Inter** | `next/font` |
| Chiffres (montants, tableaux) | Inter avec `tabular-nums` | — |

Échelle :

| Style | Desktop | Tablet | Mobile | Poids | Interligne / tracking |
|---|---|---|---|---|---|
| Display (hero) | 72 px | 56 px | 40 px | 600 | 1.05 / −0.03em |
| H1 | 48 px | 40 px | 32 px | 600 | 1.1 / −0.02em |
| H2 | 36 px | 30 px | 26 px | 600 | 1.15 / −0.02em |
| H3 | 24 px | 22 px | 20 px | 600 | 1.25 / −0.01em |
| Body large | 18 px | 18 px | 17 px | 400 | 1.6 |
| Body | 16 px | 16 px | 16 px | 400 | 1.55 |
| Small | 14 px | 14 px | 14 px | 400/500 | 1.5 |
| Caption / label | 12 px | 12 px | 12 px | 500, majuscules | 1.4 / +0.06em |

Les titres sont fluides avec `clamp()` entre les valeurs mobile et desktop.

## 4. Espacement et grille

- Base 4 px. Valeurs usuelles : 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Sections marketing : 128 px vertical desktop, 96 px tablet, 64 px mobile.
- Conteneur : largeur max 1200 px ; marges latérales 32 px desktop, 24 px tablet, 16 px mobile.
- Dashboard : grille de 12 colonnes, gouttière 24 px ; cartes de stats en 4 colonnes desktop, 2 tablet, 1 ou 2 mobile.

## 5. Formes et élévation

| Token | Valeur | Usage |
|---|---|---|
| `radius-sm` | 8 px | inputs, badges |
| `radius-md` | 12 px | boutons |
| `radius-lg` | 16 px | cartes |
| `radius-xl` | 24 px | grandes cartes marketing, mockups |
| `radius-full` | 9999 px | avatars, pills |

Ombres très légères, la bordure fait l'essentiel du travail :
- `shadow-sm` : `0 1px 2px rgb(28 27 25 / 0.04)`
- `shadow-md` : `0 4px 16px rgb(28 27 25 / 0.06)` (hover de carte, dropdowns)
- `shadow-lg` : `0 24px 48px rgb(28 27 25 / 0.08)` (modales, mockup du hero)

## 6. Mouvement (Motion)

| Usage | Animation | Durée | Courbe |
|---|---|---|---|
| Entrée de section | fade + translateY 16 px, au scroll, une seule fois | 500 ms | `[0.22, 1, 0.36, 1]` |
| Cartes en liste | même entrée, décalage 60 ms entre éléments | 400 ms | idem |
| Hover de carte | translateY −2 px + `shadow-md` | 200 ms | ease-out |
| Tap de bouton | scale 0.98 | 100 ms | ease-out |
| Modale / sheet | fade + scale 0.96 → 1 / slide | 250 ms | spring doux |
| Chiffres clés | comptage animé à l'apparition | 800 ms | ease-out |
| Barres de progression | largeur de 0 à la valeur | 700 ms | ease-out |

Règles : jamais plus de 600 ms pour un élément d'interface, aucune animation en boucle hors indicateurs de chargement, et désactivation complète avec `prefers-reduced-motion`.

## 7. Composants

Base shadcn/ui, restylée avec les tokens ci-dessus :

- **Actions** : Button (primary, secondary, ghost, outline, destructive, accent), DropdownMenu, Tooltip
- **Formulaires** : Input, Textarea, Select, Label, Form (React Hook Form + Zod)
- **Affichage** : Card, Badge (une variante par statut), Avatar, Progress, Tabs, Table, DataTable, Chart (Recharts)
- **Superpositions** : Dialog, Sheet, Toast
- **Navigation** : Navbar marketing, Sidebar, MobileNav (bottom navigation)
- **États** : EmptyState, LoadingState (skeletons), ErrorState

Composants métier : StatCard, ProjectCard, QuoteEditor, QuoteLineItem, PaymentProgress, InvoicePreview, ChatThread, MessageBubble, FileDrop.

## 8. Responsive

| Breakpoint | Largeur | Comportement principal |
|---|---|---|
| `sm` | ≥ 640 px | — |
| `md` | ≥ 768 px | grilles 2 colonnes |
| `lg` | ≥ 1024 px | sidebar visible, bottom nav masquée |
| `xl` | ≥ 1280 px | grilles 3–4 colonnes |
| `2xl` | ≥ 1440 px | largeur max atteinte |

Mobile first. Sous `lg` :
- Sidebar → bottom navigation (peintre : Home, Projects, Messages, More ; client : Home, Project, Messages, Invoices)
- Tableaux → listes de cartes
- Chat → liste des conversations et fil sur deux écrans séparés
- Zones tactiles ≥ 44 × 44 px

Largeurs de test : 1440, 1280, 1024, 768, 430, 390, 375.

## 9. Accessibilité

Focus visible sur tout élément interactif (anneau 2 px `accent`), navigation clavier complète, libellés sur toutes les icônes seules, statuts jamais signalés par la couleur seule (toujours un libellé), langue de la page déclarée.
