# PaintFlow — Spécification produit

## 1. Vision

Un peintre indépendant gère aujourd'hui ses chantiers avec un carnet, des devis Word, des messages WhatsApp et des virements qu'il recoupe à la main. PaintFlow remplace tout cela par un seul outil : chaque chantier a son devis, ses paiements, ses factures, ses photos et sa conversation, au même endroit, visibles par le peintre et par son client.

Le produit doit avoir l'allure d'un vrai SaaS : minimaliste, premium, très soigné sur mobile, et réellement fonctionnel (données persistées, sécurité réelle, temps réel).

## 2. Rôles

**Painter** : propriétaire de son activité. Il crée ses clients, ses projets, ses devis, enregistre les paiements, émet les factures. Il ne voit que ses propres données.

**Client** : invité par un peintre. Il voit uniquement les projets où il est client, consulte et accepte/refuse les devis, suit son solde, télécharge ses factures et discute avec le peintre. Il ne peut rien modifier sur le plan financier.

Un compte a exactement un rôle, fixé à l'inscription. Le rôle n'est jamais modifiable par l'utilisateur lui-même.

## 3. Périmètre

### MVP (phases 0 à 10)

- Landing page marketing
- Inscription, connexion, déconnexion, mot de passe oublié
- Dashboard peintre : indicateurs, graphique de revenus, projets récents
- Clients : liste, création, fiche client, invitation par email
- Projets : liste, création, détail avec onglets (Overview, Quote, Payments, Invoices, Messages, Files)
- Devis : création avec lignes, calcul automatique, envoi, acceptation/refus par le client
- Paiements : enregistrement manuel, historique, montant restant, progression
- Factures : génération depuis un projet, statut, téléchargement PDF
- Portail client : projet, devis, paiements, factures, messages
- Chat temps réel par projet, avec pièces jointes (photos, PDF)

### Après le MVP

- Notifications email
- Paiement en ligne
- Analytics avancées
- Mode sombre
- Multi-devises et paramètres fiscaux par pays

## 4. Parcours principaux

### 4.1 Onboarding peintre
Inscription en tant que painter → complète son profil (nom commercial, téléphone) → arrive sur un dashboard vide avec un empty state qui l'invite à créer son premier client.

### 4.2 Client et projet
Le peintre crée un client (nom, email, téléphone, adresse). Le client existe tout de suite dans la base, même sans compte. Le peintre crée ensuite un projet rattaché à ce client. Une conversation est créée automatiquement pour chaque projet.

### 4.3 Invitation du client
Le peintre envoie une invitation. Le client reçoit un lien, crée son compte avec le même email, et son compte est relié à la fiche client existante. Il voit alors tous ses projets chez ce peintre.

### 4.4 Cycle de vie d'un devis
`draft` → `sent` → `accepted` | `declined` | `expired`

- Le peintre édite librement un devis en `draft`.
- À l'envoi, le devis devient `sent` et n'est plus modifiable. Pour corriger, le peintre crée une nouvelle version.
- Le client accepte ou refuse un devis `sent`. Un devis dont `valid_until` est dépassé passe en `expired`.
- Un seul devis `accepted` par projet. Son total devient le montant du projet.

### 4.5 Paiements
Le peintre enregistre chaque paiement reçu (montant, date, moyen, note). Le client voit l'historique en lecture seule.

- **Total du projet** = total du devis accepté
- **Payé** = somme des paiements
- **Restant** = total − payé
- **Progression** = payé / total

### 4.6 Factures
Le peintre génère une facture depuis un projet ayant un devis accepté. Le numéro est séquentiel par peintre (`INV-0001`, `INV-0002`…). Statut calculé à partir des paiements : `unpaid`, `partially_paid`, `paid`, plus `void` pour une facture annulée. Une facture émise n'est jamais supprimée, seulement annulée.

### 4.7 Chat
Une conversation par projet, entre le peintre et le client. Messages en temps réel, indicateur en ligne, statut lu/non lu, pièces jointes (images et PDF, 10 Mo max par fichier).

## 5. Règles métier

- Montants en `numeric(12,2)`, jamais en flottant.
- Devise par défaut : EUR, stockée sur le projet.
- Taxe : un taux en pourcentage par devis (défaut 0 %), le montant de taxe est calculé.
- Un peintre ne peut pas supprimer un client ayant des projets ; il peut l'archiver.
- Un paiement ne peut pas être négatif ni rendre le payé supérieur au total sans confirmation explicite.
- Toute règle d'accès est appliquée par la base (RLS), pas seulement par l'interface.

## 6. Exigences non fonctionnelles

- **Responsive** obligatoire, testé à 1440, 1280, 1024, 768, 430, 390 et 375 px.
- **Mobile** : sidebar remplacée par une bottom navigation ; tableaux remplacés par des cartes.
- **Sécurité** : RLS sur toutes les tables, fichiers privés servis par URL signée, clé `service_role` jamais côté navigateur.
- **Accessibilité** : contraste AA, navigation clavier, focus visible, `prefers-reduced-motion` respecté.
- **Qualité** : `lint`, `tsc` et `build` passent avant chaque merge.
