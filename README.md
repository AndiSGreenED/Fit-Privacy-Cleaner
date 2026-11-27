# FIT Privacy Cleaner

Eine Webanwendung zum Prüfen und gezielten Anonymisieren von Garmin FIT Aktivitätsdateien.

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

## Technik

- .NET 10 ASP.NET Core
- Garmin FIT C# SDK über NuGet (Garmin.FIT.Sdk)
- Statische Oberfläche ohne JavaScript Framework
- FIT Verarbeitung im Arbeitsspeicher
- Uploadlimit: 50 MB

Das Garmin FIT SDK unterstützt das Dekodieren und Kodieren von FIT Dateien. Die Python Variante des SDK unterstützt dagegen nur das Dekodieren. Deshalb verwendet diese Anwendung die C# Variante.

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
docker build -f backend/Dockerfile -t fit-privacy-cleaner .
docker run --rm -p 8080:8080 fit-privacy-cleaner
~~~

Danach http://localhost:8080 öffnen.

## API

- GET /api/health prüft, ob der Dienst läuft.
- POST /api/analyze erwartet ein Multipart Feld namens file.
- POST /api/anonymize erwartet file, removeGps und removeDeviceAndProfileData.

Die beiden Bereinigungsoptionen werden als true oder false übertragen. Das Ergebnis von POST /api/anonymize ist eine FIT Datei als Download.

## Betrieb im Internet

Für einen öffentlichen Betrieb müssen HTTPS, Upload Rate Limits, Schutz vor automatisiertem Missbrauch und geeignete Server Ressourcen zusätzlich eingerichtet werden. Die Anwendung enthält bewusst keine Benutzerkonten und keine dauerhafte Dateiablage. Das allein ersetzt keine Sicherheitsprüfung der Hostingumgebung.

## Prüfung

GitHub Actions baut das .NET Projekt bei Pushes auf main und codex/** sowie bei Pull Requests. Für eine fachliche Validierung müssen zusätzlich echte FIT Testdateien aus verschiedenen Geräten und Sportarten verarbeitet und die Ergebnisse in Garmin Connect oder einem anderen FIT kompatiblen Werkzeug geprüft werden.

## Garmin FIT SDK

Die Anwendung verwendet das offizielle Garmin FIT C# SDK (Garmin.FIT.Sdk). Es gelten die Lizenzbedingungen des FIT Protocol SDK von Garmin. Details und aktuelle Versionen: https://developer.garmin.com/fit/get-the-sdk/
