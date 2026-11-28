# Veröffentlichung des FIT Privacy Cleaners

## Website und FIT Verarbeitung

Die Website wird über GitHub Pages veröffentlicht. Das GitHub Actions Workflow baut zusätzlich den Browser Prozessor mit .NET WebAssembly und kopiert dessen Laufzeitdateien in die Veröffentlichung.

Einmalig in den Repository Einstellungen unter **Settings → Pages** als Quelle **GitHub Actions** auswählen.

Die Website lautet:

https://andisgreened.github.io/Fit-Privacy-Cleaner/

Nach jeder Änderung an `frontend`, `browser` oder `backend/FitFileProcessor.cs` baut GitHub Actions den Browser Prozessor und veröffentlicht die Website automatisch.

## Datenverarbeitung

Analyse und Bereinigung erfolgen lokal im Browser mit dem offiziellen Garmin FIT SDK für .NET. Es ist dafür kein API Server und kein Cloudflare Workers Paid Tarif erforderlich. Die FIT Datei wird für Analyse und Bereinigung nicht an einen Server übertragen.

Erst wenn ein Nutzer nach erfolgreicher Bereinigung auf „Bereinigte FIT Datei senden“ klickt, wird die bereinigte Ausgabedatei an den bestehenden SurfsApp Worker übertragen. Der Klick ist die ausdrückliche Einsendehandlung. Name und Kontakt E Mail sind optional.

Der Upload verwendet:

`https://garmin-abruf.andigreen.workers.dev/api/fit-submissions`

Maximale Dateigröße für Einsendungen: 2 MB. Die Datei wird im vorhandenen SurfsApp D1 Speicher abgelegt und ist ausschließlich im Betreiberbereich der SurfsApp Web App abrufbar.

## Build und Tests

GitHub Actions führt folgende Prüfungen aus:

1. Build des vorhandenen .NET Backend Projekts.
2. FIT Bereinigungstests mit erzeugten Testdateien.
3. Build des .NET WebAssembly Prozessors.
4. Veröffentlichung der statischen Website über GitHub Pages.

Das Backend Projekt bleibt für lokale Entwicklung und Tests im Repository. Für den veröffentlichten Cleaner wird es nicht als Server betrieben.

## Noch erforderliche Live Prüfung

Nach erfolgreichem GitHub Pages Deployment eine echte FIT Datei analysieren und bereinigen. Anschließend eine bereinigte Datei freiwillig einsenden und in der SurfsApp Web App unter „Entwicklung“ herunterladen. Zusätzlich mit einem normalen SurfsApp Nutzer prüfen, dass die Einsendungsliste und die Dateien nicht erreichbar sind.
