# ARASAKA - Site dynamique multi-pages

Site Node.js sans dépendance externe pour ARASAKA, prêt à lancer localement ou à déployer chez un hébergeur compatible Node.

## Lancer le site

```powershell
node server.js
```

Puis ouvrir:

```text
http://localhost:4321
```

Par défaut, le site local est accessible sans authentification. Pour activer une protection HTTP basique:

```powershell
$env:SITE_AUTH=1; node server.js
```

Identifiants par défaut quand la protection est activée:

```text
identifiant: arasaka
mot de passe: test123
```

Ces valeurs peuvent être remplacées avec `SITE_USERNAME` et `SITE_PASSWORD`.

Si le port 4321 est déjà utilisé:

```powershell
$env:PORT=4322; node server.js
```

## Pages disponibles

- `/` Accueil
- `/qui-sommes-nous`
- `/a-propos` Alias de la page Qui sommes-nous
- `/diaspora`
- `/realisations`
- `/services`
- `/materiaux`
- `/plans`
- `/galerie` Alias vers la page Nos réalisations
- `/contact`

## Contact

Le formulaire de contact envoie les données vers `/api/contact` et les enregistre dans:

```text
data/leads.jsonl
```

Si le serveur n'est pas lancé avec SMTP Gmail, la demande est enregistrée localement et le site affiche un message Gmail / WhatsApp prêt à envoyer:

```text
email: arasakaci.contact@gmail.com
+33 6 52 83 11 60
```

Pour activer l'envoi email SMTP via Gmail au moment de la soumission, lancer le site avec:

```powershell
.\start-with-gmail.ps1
```

Ce script démarre le site sur `http://localhost:4323` et demande le mot de passe d'application Google du compte ARASAKA CI.

## Modifier les contenus

Les textes, services, plans, matériaux et images sont dans:

```text
data/site-data.js
```

Les photos de la rubrique Nos réalisations sont dans:

```text
public/assets/images/portfolio
```

Les images utilisées sont des visuels d'illustration appelés depuis Unsplash. Pour un site final de production, remplacer progressivement ces images par des photos de vos propres réalisations ARASAKA.
