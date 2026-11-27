# FIT Privacy Cleaner

Eine Webanwendung zum Prüfen und gezielten Anonymisieren von Garmin FIT Aktivitätsdateien.

## Website

Nach Aktivierung von GitHub Pages ist die Website erreichbar unter:

https://andisgreened.github.io/Fit-Privacy-Cleaner/

Die Oberfläche ist für Desktop und Mobilgeräte gestaltet. Sie unterstützt Dateiauswahl, Drag and Drop, Analyse, gezielte Bereinigung und Download.

## Funktionen

- Echtes Lesen der FIT Nachrichten und Felder statt pauschaler Annahmen.
- Anzeige von Datensätzen, Runden, Sessions sowie GPS, Herzfrequenz, Leistung, Kadenz und Geschwindigkeit.
- Entfernen von Gerätekennungen, Seriennummern, Hersteller und Produktangaben sowie Software und Hardwareversionen.
- Entfernen von Geräteinformationen und Benutzerprofilnachrichten.
- Entfernen von GPS Koordinaten in allen erkannten FIT Feldern, einschließlich Track, Start und Ziel.
- Entfernen von Entwicklerfeldern, da deren Inhalt durch Drittanbieter frei definiert werden kann und nicht zuverlässig als unkritisch eingestuft werden kann.
- Neuaufbau der FIT Datei mit dem offiziellen Garmin FIT SDK.
- Prüfung der Eingabedatei und erneutes Einlesen der Ausgabedatei einschließlich FIT Prüfsumme.
- Direkter Download. Die Anwendung legt keine dauerhaften Upload Dateien oder Datensätze an.

## Datenschutzoptionen

Standardmäßig werden Geräte und Profildaten entfernt. GPS bleibt zunächst erhalten, damit die Aktivitätskarte nicht ungefragt verloren geht. Wer eine Strecke veröffentlichen möchte, sollte prüfen, ob Start und Ziel Rückschlüsse auf Wohnort oder Arbeitsplatz zulassen. Mit der Option **GPS Koordinaten entfernen** werden die Koordinaten vollständig entfernt. Die Karte und die Streckenansicht sind dann nicht mehr verfügbar.

Auch nach der Bereinigung kann eine Aktivität durch Zeitpunkt, Streckenverlauf, Leistungswerte oder andere ungewöhnliche Merkmale wiedererkennbar sein. Der Cleaner verspricht deshalb keine vollständige Anonymität. Die Originaldatei wird nicht verändert.

## Architektur

- Website: GitHub Pages aus dem Ordner `frontend`.
- API: Cloudflare Worker `fit-privacy-cleaner-api`.
- Verarbeitung: .NET 10 ASP.NET Core in einem Cloudflare Container.
- FIT Bibliothek: Garmin FIT C# SDK 21.222.0.
- Uploadlimit: 50 MB.
- FIT Verarbeitung im Arbeitsspeicher.

Die Website und die API sind getrennt. GitHub Pages stellt nur die statische Oberfläche bereit. Die FIT Verarbeitung erfolgt im .NET Backend.

## Cloudflare API bereitstellen

Die einmalige Verbindung von GitHub zu Cloudflare Workers Builds ist in [DEPLOYMENT.md](DEPLOYMENT.md) beschrieben. Nach der Verbindung baut und veröffentlicht Cloudflare den Container bei Änderungen auf `main`.

Die Website verwendet als API Adresse:

`https://fit-privacy-cleaner-api.andigreen.workers.dev`

Diese Adresse muss nach dem ersten Cloudflare Deployment unter `/api/health` erreichbar sein.

## Lokal starten

Voraussetzung ist das .NET 10 SDK.

~~~powershell
dotnet restore backend/FitPrivacyCleaner.csproj
dotnet run --project backend/FitPrivacyCleaner.csproj
~~~

Die von ASP.NET Core angezeigte lokale Adresse im Browser öffnen.

## Mit Docker starten

Im Repository Stammverzeichnis:

~~~powershell
docker build -t fit-privacy-cleaner .
docker run --rm -p 8080:8080 fit-privacy-cleaner
~~~

Danach http://localhost:8080 öffnen.

## API

- GET /api/health prüft, ob der Dienst läuft.
- POST /api/analyze erwartet ein Multipart Feld namens file.
- POST /api/anonymize erwartet file, removeGps und removeDeviceAndProfileData.

Die beiden Bereinigungsoptionen werden als true oder false übertragen. Das Ergebnis von POST /api/anonymize ist eine FIT Datei als Download.

## Prüfung

GitHub Actions baut das .NET Projekt bei Pushes auf main und codex/** sowie bei Pull Requests und führt einen FIT Rundlauftest mit Prüfsummenprüfung aus. Für eine fachliche Freigabe müssen zusätzlich echte FIT Dateien unterschiedlicher Geräte und Sportarten mit der Anwendung bereinigt und die Ergebnisse in Garmin Connect oder einem anderen FIT kompatiblen Werkzeug geprüft werden.

## Garmin FIT SDK

Die Anwendung verwendet das offizielle Garmin FIT C# SDK (Garmin.FIT.Sdk 21.222.0). Es gelten die Lizenzbedingungen des FIT Protocol SDK von Garmin. Details und aktuelle Versionen: https://developer.garmin.com/fit/get-the-sdk/
