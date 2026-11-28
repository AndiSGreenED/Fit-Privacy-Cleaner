# FIT Privacy Cleaner

Eine Webanwendung zum Prüfen und gezielten Anonymisieren von Garmin FIT Aktivitätsdateien.

## Website

https://andisgreened.github.io/Fit-Privacy-Cleaner/

Die Oberfläche unterstützt Dateiauswahl, Drag and Drop, Analyse, gezielte Bereinigung und Download.

## Funktionen

- Echtes Lesen der FIT Nachrichten und Felder statt pauschaler Annahmen.
- Anzeige von Datensätzen, Runden, Sessions sowie GPS, Herzfrequenz, Leistung, Kadenz und Geschwindigkeit.
- Entfernen von Gerätekennungen, Seriennummern, Hersteller und Produktangaben sowie Software und Hardwareversionen.
- Entfernen von Geräteinformationen und Benutzerprofilnachrichten.
- Entfernen von GPS Koordinaten in allen erkannten FIT Feldern, einschließlich Track, Start und Ziel.
- Eigene App und Entwicklerfelder einschließlich Sprungwerten und benutzerdefinierten Messwerten bleiben standardmäßig erhalten. Sie können bei Bedarf separat entfernt werden.
- Optionale Entfernung von Herzfrequenz, Leistung und Kadenz einschließlich der zugehörigen Durchschnitts und Maximalwerte.
- Neuaufbau der FIT Datei mit dem offiziellen Garmin FIT SDK.
- Prüfung der Eingabedatei und erneutes Einlesen der Ausgabedatei einschließlich FIT Prüfsumme.
- Analyse und Bereinigung vollständig lokal im Browser. FIT Dateien werden für diese Verarbeitung nicht an einen Server übertragen.
- Separater Download oder freiwillige Einsendung der bereinigten FIT Datei an die SurfsApp Entwicklung. Es wird nichts automatisch übertragen.

## Datenschutzoptionen

Standardmäßig werden Geräte und Profildaten entfernt. GPS bleibt zunächst erhalten, damit die Aktivitätskarte nicht ungefragt verloren geht. Herzfrequenz, Leistung und Kadenz können einzeln entfernt werden. Eigene App Felder und Entwicklerdaten bleiben standardmäßig erhalten. Dazu können Sprunghöhe, Sprunganzahl, Halsenwerte und weitere app spezifische Messwerte gehören. Nur wenn **App und eigene Zusatzfelder entfernen** eingeschaltet wird, entfernt der Cleaner diese Werte und ihre Definitionen. Mit **GPS Koordinaten entfernen** werden die Koordinaten vollständig entfernt. Die Karte und die Streckenansicht sind dann nicht mehr verfügbar.

Auch nach der Bereinigung kann eine Aktivität durch Zeitpunkt, Streckenverlauf, Leistungswerte oder andere ungewöhnliche Merkmale wiedererkennbar sein. Der Cleaner verspricht deshalb keine vollständige Anonymität. Die Originaldatei wird nicht verändert.

## FIT Beiträge für die SurfsApp Entwicklung

Nach erfolgreicher Bereinigung kann die bereinigte Datei an die SurfsApp Entwicklung gesendet werden. Erst der Klick auf **Bereinigte FIT Datei senden** startet die Übertragung. Die Originaldatei wird nicht gesendet. Sportart ist erforderlich, Name und Kontakt E Mail sind optional. Name und E Mail werden getrennt von der FIT Datei gespeichert. GPS Daten bleiben enthalten, sofern sie nicht beim Bereinigen entfernt wurden. Die übermittelte Datei wird im bestehenden SurfsApp Speicher abgelegt und ist nur im geschützten Tab „Entwicklung“ für den Betreiber abrufbar.

Maximale Größe einer Einsendung: 2 MB. Die Einsendungen werden nicht automatisch gelöscht. Der Betreiber kann sie im Tab „Entwicklung“ herunterladen und löschen.

## Architektur

- Website: GitHub Pages aus dem Ordner `frontend`.
- FIT Verarbeitung: .NET 10 WebAssembly direkt im Browser.
- FIT Bibliothek: Garmin FIT C# SDK 21.222.0.
- Für Analyse und Bereinigung wird kein API Server benötigt.
- Das Senden freiwilliger FIT Beiträge erfolgt über den bestehenden SurfsApp Worker und die vorhandene D1 Datenbank.

Die bestehende ASP.NET Core Anwendung unter `backend` bleibt für lokale Entwicklung und Tests erhalten. Der veröffentlichte Cleaner betreibt dafür keinen Server und benötigt keinen kostenpflichtigen Container Dienst.

## Veröffentlichung und Tests

GitHub Actions veröffentlicht die statische Website und den WebAssembly Prozessor gemeinsam über GitHub Pages. Das Workflow baut zusätzlich das Backend und den Browser Prozessor und führt FIT Bereinigungstests mit erzeugten Dateien aus.

Details zur Veröffentlichung und zum freiwilligen Upload stehen in [DEPLOYMENT.md](DEPLOYMENT.md).

## Lokal starten

Voraussetzung ist das .NET 10 SDK.

Das Backend kann lokal gestartet werden:

~~~powershell
dotnet restore backend/FitPrivacyCleaner.csproj
dotnet run --project backend/FitPrivacyCleaner.csproj
~~~

Die von ASP.NET Core angezeigte lokale Adresse im Browser öffnen. Für den veröffentlichten Browser Prozessor werden die Dateien aus dem Projekt `browser` über das Pages Workflow gebaut.

## Garmin FIT SDK

Die Anwendung verwendet das offizielle Garmin FIT C# SDK (Garmin.FIT.Sdk 21.222.0). Es gelten die Lizenzbedingungen des FIT Protocol SDK von Garmin. Details und aktuelle Versionen: https://developer.garmin.com/fit/get-the-sdk/
