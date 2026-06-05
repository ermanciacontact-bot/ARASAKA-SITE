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

Si le port 4321 est deja utilise:

```powershell
$env:PORT=4322; node server.js
```

## Pages disponibles

- `/` Accueil
- `/a-propos`
- `/services`
- `/matériaux`
- `/plans`
- `/galerie`
- `/contact`

## Contact

Le formulaire de contact envoie les données vers `/api/contact` et les enregistre dans:

```text
data/leads.jsonl
```

Il propose aussi un message WhatsApp prêt à envoyer au numéro:

```text
+33 6 52 83 11 60
```

## Modifier les contenus

Les textes, services, plans, matériaux et images sont dans:

```text
data/site-data.js
```

Les images utilisees sont des visuels d'illustration appeles depuis Unsplash. Pour un site final de production, remplacer progressivement ces images par des photos de vos propres réalisations ARASAKA.

