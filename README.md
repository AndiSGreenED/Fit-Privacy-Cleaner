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
- Entfernen von Entwicklerfeldern, da deren Inhalt durch Drittanbieter frei definiert werden kann und nicht zuverlässig als unkritisch eingestuft werden kann.
- Neuaufbau der FIT Datei mit dem offiziellen Garmin FIT SDK.
- Prüfung der Eingabedatei und erneutes Einlesen der Ausgabedatei einschließlich FIT Prüfsumme.
- Analyse und Bereinigung vollständig lokal im Browser. FIT Dateien werden für diese Verarbeitung nicht an einen Server übertragen.
- Direkter Download. Die Anwendung legt keine dauerhaften Upload Dateien oder Datensätze an.

## Datenschutzoptionen

Standardmäßig werden Geräte und Profildaten entfernt. GPS bleibt zunächst erhalten, damit die Aktivitätskarte nicht ungefragt verloren geht. Wer eine Strecke veröffentlichen möchte, sollte prüfen, ob Start und Ziel Rückschlüsse auf Wohnort oder Arbeitsplatz zulassen. Mit der Option **GPS Koordinaten entfernen** werden die Koordinaten vollständig entfernt. Die Karte und die Streckenansicht sind dann nicht mehr verfügbar.

Auch nach der Bereinigung kann eine Aktivität durch Zeitpunkt, Streckenverlauf, Leistungswerte oder andere ungewöhnliche Merkmale wiedererkennbar sein. Der Cleaner verspricht deshalb keine vollständige Anonymität. Die Originaldatei wird nicht verändert.

## FIT Beiträge für die SurfsApp Entwicklung

Nach erfolgreicher Bereinigung kann die bereinigte Datei freiwillig an die SurfsApp Entwicklung gesendet werden. Die Einsendung benötigt eine ausdrückliche Zustimmung. GPS Daten bleiben enthalten, sofern sie nicht beim Bereinigen entfernt wurden. Die übermittelte Datei wird im bestehenden SurfsApp Speicher abgelegt und ist nur im geschützten Tab „Entwicklung“ für den Betreiber abrufbar.

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
