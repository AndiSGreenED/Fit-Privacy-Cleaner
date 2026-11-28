const T = document.documentElement.lang === "en" ? {"badExt":"Please select a file with the .fit extension.","tooLarge":"The file is larger than 50 MB.","empty":"The selected file is empty.","fileSelected":"File selected. Choose what to remove below.","runtimeStarting":"Starting WebAssembly…","runtimeReady":"FIT processor ready. Your file is processed locally in this browser.","runtimeFailed":"FIT processor not ready: ","runtimeMissing":"The Blazor runtime file did not load.","runtimeTimeout":"Timed out while starting the WebAssembly runtime after 30 seconds.","componentMissing":"The FIT processor component was not initialized.","pingFailed":"The WebAssembly runtime did not respond to the connection test.","pingInvalid":"The FIT processor connection test returned an invalid response.","noDotNet":"The .NET JavaScript interface was not initialized.","notConnected":"The FIT processor is not connected yet.","fileRead":"The selected FIT file could not be read.","filePrepare":"The FIT file could not be prepared for local analysis.","analyzing":"Reading FIT data locally…","analysisTimeout":"The FIT processor did not respond within 60 seconds.","analysisError":"Analysis failed.","analysisSuccess":"Analysis complete. No data has been changed or uploaded.","readOnlyTitle":"What this analysis means","readOnlyText":"The original FIT file was only read. No information has been removed yet, and nothing has been sent to a server.","found":"Found in your file","notFound":"Not found in your file","noPrivate":"No GPS track points, start or finish locations, device details, profile information or app specific fields were found.","gpsLabel":"GPS track points","locationLabel":"Start and finish locations","deviceLabel":"Device and profile information","gpsFound":"GPS coordinates are present in recorded track points and reveal the route.","locationFound":"Stored start and finish coordinates are present in session or lap summaries.","deviceFound":"Device information is present, such as manufacturer, model, serial number or device ID.","profileFound":"Profile or file creator information is present. It can include names and contact identifiers.","developerFound":"Custom fields from apps or accessories are present. These may contain jump values and other app specific measurements.","cleanStarting":"Cleaning the FIT file locally and verifying the result…","cleaned":"The cleaned file has been created and verified locally. Nothing has been uploaded. Choose download or voluntary submission below.","gpsRemoved":"GPS track point coordinates removed: {count} fields.","gpsNone":"No GPS track point coordinates were found to remove.","locationRemoved":"Start and finish location coordinates removed: {count} fields.","deviceRemoved":"Device and profile information removed: {count} identifier fields.","developerRemoved":"App and custom fields removed: {count} values.","developerNone":"No app or custom field values were found to remove.","metadataRemoved":"Metadata messages removed in total: {count}.","downloadError":"The cleaned FIT file is not available yet.","submissionTooLarge":"The cleaned file is larger than 2 MB and cannot be submitted. You can still download it.","uploadStarting":"Sending the cleaned FIT file…","uploadSuccess":"Thank you. The cleaned FIT file has been sent to SurfsApp development.","uploadFailure":"The cleaned FIT file could not be submitted.","cleanError":"The file could not be cleaned. No download or upload was started.","previewIntro":"The selected categories will be removed.","previewNone":"No categories are selected. All other FIT data will be kept.","developerLabel":"App and custom fields","heartRateLabel":"Heart rate","powerLabel":"Power","cadenceLabel":"Cadence","heartRateRemoved":"Heart rate data removed: {count} fields.","powerRemoved":"Power data removed: {count} fields.","cadenceRemoved":"Cadence data removed: {count} fields.","noSelectedData":"No fields from the selected categories were found to remove.","sendIntro":"The cleaned FIT file is sent to SurfsApp only when you click the send button. Name and email are optional."} : {"badExt":"Bitte eine Datei mit der Endung .fit auswählen.","tooLarge":"Die Datei ist größer als 50 MB.","empty":"Die ausgewählte Datei ist leer.","fileSelected":"Datei ausgewählt. Wähle unten, was entfernt werden soll.","runtimeStarting":"WebAssembly wird gestartet …","runtimeReady":"FIT Prozessor bereit. Deine Datei wird lokal in diesem Browser verarbeitet.","runtimeFailed":"FIT Prozessor nicht bereit: ","runtimeMissing":"Die Blazor Laufzeitdatei wurde nicht geladen.","runtimeTimeout":"Zeitüberschreitung beim Start der WebAssembly Laufzeit nach 30 Sekunden.","componentMissing":"Die FIT Prozessor Komponente wurde nicht initialisiert.","pingFailed":"Die WebAssembly Laufzeit antwortet nicht auf den Verbindungstest.","pingInvalid":"Der Verbindungstest des FIT Prozessors lieferte eine ungültige Antwort.","noDotNet":"Die .NET JavaScript Schnittstelle wurde nicht initialisiert.","notConnected":"Der FIT Prozessor ist noch nicht verbunden.","fileRead":"Die ausgewählte FIT Datei konnte nicht gelesen werden.","filePrepare":"Die FIT Datei konnte nicht für die lokale Analyse vorbereitet werden.","analyzing":"FIT Daten werden lokal eingelesen …","analysisTimeout":"Der FIT Prozessor hat nach 60 Sekunden nicht geantwortet.","analysisError":"Die Analyse ist fehlgeschlagen.","analysisSuccess":"Analyse abgeschlossen. Es wurden noch keine Daten verändert oder übertragen.","readOnlyTitle":"Was diese Analyse bedeutet","readOnlyText":"Die Originaldatei wurde nur ausgelesen. Es wurden noch keine Informationen entfernt und nichts wurde an einen Server übertragen.","found":"In deiner Datei gefunden","notFound":"In deiner Datei nicht gefunden","noPrivate":"Es wurden keine GPS Trackpunkte, Start oder Zielstandorte, Geräteangaben, Profilinformationen oder App Zusatzfelder gefunden.","gpsLabel":"GPS Streckenverlauf","locationLabel":"Start und Zielstandorte","deviceLabel":"Geräte und Profilinformationen","gpsFound":"GPS Koordinaten sind in den aufgezeichneten Trackpunkten enthalten und zeigen den Streckenverlauf.","locationFound":"Gespeicherte Start und Zielkoordinaten sind in Session oder Rundeninformationen vorhanden.","deviceFound":"Geräteinformationen sind vorhanden, zum Beispiel Hersteller, Modell, Seriennummer oder Gerätekennung.","profileFound":"Profil oder Dateierstellerinformationen sind vorhanden. Dazu können Namen und Kontaktkennungen gehören.","developerFound":"Eigene Zusatzfelder von Apps oder Zubehör sind vorhanden. Darin können Sprungwerte und weitere app spezifische Messwerte stecken.","cleanStarting":"FIT Datei wird lokal bereinigt und das Ergebnis geprüft …","cleaned":"Die bereinigte Datei wurde lokal erstellt und geprüft. Es wurde nichts hochgeladen. Du kannst jetzt herunterladen oder die Datei freiwillig einsenden.","gpsRemoved":"GPS Koordinaten aus Trackpunkten entfernt: {count} Felder.","gpsNone":"Es wurden keine GPS Koordinaten in Trackpunkten zum Entfernen gefunden.","locationRemoved":"Start und Zielstandorte entfernt: {count} Koordinatenfelder.","deviceRemoved":"Geräte und Profilinformationen entfernt: {count} Kennungsfelder.","developerRemoved":"App und eigene Zusatzfelder entfernt: {count} Werte.","developerNone":"Es wurden keine App oder Zusatzfeldwerte zum Entfernen gefunden.","metadataRemoved":"Metadatennachrichten insgesamt entfernt: {count}.","downloadError":"Die bereinigte FIT Datei ist noch nicht verfügbar.","submissionTooLarge":"Die bereinigte Datei ist größer als 2 MB und kann nicht eingesendet werden. Du kannst sie weiterhin herunterladen.","uploadStarting":"Bereinigte FIT Datei wird übertragen …","uploadSuccess":"Danke. Die bereinigte FIT Datei wurde an die SurfsApp Entwicklung übermittelt.","uploadFailure":"Die bereinigte FIT Datei konnte nicht übermittelt werden.","cleanError":"Die Datei konnte nicht bereinigt werden. Es wurde kein Download und kein Upload gestartet.","previewIntro":"Die ausgewählten Bereiche werden entfernt.","previewNone":"Es ist keine Kategorie ausgewählt. Alle übrigen FIT Daten bleiben erhalten.","developerLabel":"App und eigene Zusatzfelder","heartRateLabel":"Herzfrequenz","powerLabel":"Leistung","cadenceLabel":"Kadenz","heartRateRemoved":"Herzfrequenzdaten entfernt: {count} Felder.","powerRemoved":"Leistungsdaten entfernt: {count} Felder.","cadenceRemoved":"Kadenzdaten entfernt: {count} Felder.","noSelectedData":"In den ausgewählten Kategorien wurden keine Felder zum Entfernen gefunden.","sendIntro":"Die bereinigte FIT Datei wird erst übertragen, wenn du auf „Bereinigte FIT Datei senden“ klickst. Name und E Mail sind optional."};
const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const fileCard = document.getElementById("fileCard");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const analyzeButton = document.getElementById("analyzeButton");
const cleanButton = document.getElementById("cleanButton");
const downloadButton = document.getElementById("downloadButton");
const resetButton = document.getElementById("resetButton");
const removeFileButton = document.getElementById("removeFile");
const removeDeviceInput = document.getElementById("removeDevice");
const removeGpsInput = document.getElementById("removeGps");
const removeLocationInput = document.getElementById("removeLocation");
const removeHeartRateInput = document.getElementById("removeHeartRate");
const removePowerInput = document.getElementById("removePower");
const removeCadenceInput = document.getElementById("removeCadence");
const removeDeveloperInput = document.getElementById("removeDeveloper");
const statusElement = document.getElementById("status");
const results = document.getElementById("results");
const statsElement = document.getElementById("stats");
const checksElement = document.getElementById("checks");
const runtimeStatusElement = document.getElementById("runtimeStatus");
const privacySection = document.getElementById("privacySection");
const cleanedPanel = document.getElementById("cleanedPanel");
const contributePanel = document.getElementById("contributePanel");
const donateForm = document.getElementById("donateForm");
const donateSportInput = document.getElementById("donateSport");
const sendFitButton = document.getElementById("sendFitButton");
const sendStatus = document.getElementById("sendStatus");
const FIT_SUBMISSION_API = "https://garmin-abruf.andigreen.workers.dev/api/fit-submissions";
let dotNetInterop = null;
window.fitCleanerInterop = {
  instance: null, waiter: null,
  set: function(instance) { this.instance = instance; if (this.waiter) { this.waiter(instance); this.waiter = null; } },
  wait: function() { if (this.instance) return Promise.resolve(this.instance); return new Promise(resolve => { this.waiter = resolve; }); }
};
let selectedFile = null;
let analysisComplete = false;
let cleanedBlob = null;
let cleanedFileName = "";
let runtimeAvailable = false;
let runtimeError = null;
const fitRuntimeReady = startFitRuntime();

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
function scrollToSection(element) {
  if (!element) return;
  window.requestAnimationFrame(function() {
    const top = element.getBoundingClientRect().top + window.pageYOffset - 18;
    const behavior = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: Math.max(0, top), behavior: behavior });
  });
}
function setStatus(message, type) {
  statusElement.textContent = message;
  statusElement.className = ("status " + (type || "")).trim();
}
function shortErrorMessage(error) {
  const message = (error && error.message) ? error.message : String(error);
  return message.split(/\r?\n/)[0].slice(0, 240);
}
function updatePrivacyPreview() {
  const selected = [];
  if (removeDeviceInput.checked) selected.push(T.deviceLabel);
  if (removeGpsInput.checked) selected.push(T.gpsLabel);
  if (removeLocationInput && removeLocationInput.checked) selected.push(T.locationLabel);
  if (removeHeartRateInput.checked) selected.push(T.heartRateLabel);
  if (removePowerInput.checked) selected.push(T.powerLabel);
  if (removeCadenceInput.checked) selected.push(T.cadenceLabel);
  if (removeDeveloperInput.checked) selected.push(T.developerLabel);
  document.getElementById("privacyPreviewText").textContent = selected.length ? T.previewIntro : T.previewNone;
  document.getElementById("privacyPreviewList").innerHTML = selected.map(function(item) {
    return '<span class="preview-tag">' + item + '</span>';
  }).join("");
}
async function withTimeout(promise, timeoutMs, timeoutMessage) {
  let timeoutId;
  try {
    return await Promise.race([Promise.resolve(promise), new Promise(function(_, reject) {
      timeoutId = setTimeout(function() { reject(new Error(timeoutMessage)); }, timeoutMs);
    })]);
  } finally { clearTimeout(timeoutId); }
}
async function invokeDotNet(methodName, args, timeoutMs, timeoutMessage) {
  if (!window.DotNet || typeof window.DotNet.invokeMethodAsync !== "function") throw new Error(T.noDotNet);
  if (!dotNetInterop || typeof dotNetInterop.invokeMethodAsync !== "function") throw new Error(T.notConnected);
  return withTimeout(dotNetInterop.invokeMethodAsync(methodName, ...args), timeoutMs, timeoutMessage);
}
async function startFitRuntime() {
  runtimeStatusElement.textContent = T.runtimeStarting;
  runtimeStatusElement.className = "status";
  try {
    if (!window.Blazor || typeof window.Blazor.start !== "function") throw new Error(T.runtimeMissing);
    await withTimeout(window.Blazor.start(), 30000, T.runtimeTimeout);
    dotNetInterop = await withTimeout(window.fitCleanerInterop.wait(), 15000, T.componentMissing);
    const ping = await invokeDotNet("Ping", [], 15000, T.pingFailed);
    if (ping !== "FIT_CLEANER_READY") throw new Error(T.pingInvalid);
    runtimeAvailable = true;
    runtimeError = null;
    runtimeStatusElement.textContent = T.runtimeReady;
    runtimeStatusElement.className = "status success";
    analyzeButton.disabled = !selectedFile || !runtimeAvailable;
    return true;
  } catch (error) {
    runtimeAvailable = false;
    runtimeError = error;
    console.error("FIT Cleaner startup failed", error);
    runtimeStatusElement.textContent = T.runtimeFailed + shortErrorMessage(error);
    runtimeStatusElement.className = "status error";
    analyzeButton.disabled = true;
    return false;
  }
}

function resetAnalysis() {
  analysisComplete = false;
  cleanedBlob = null;
  cleanedFileName = "";
  results.classList.remove("visible");
  cleanedPanel.hidden = true;
  cleanButton.disabled = true;
  downloadButton.disabled = true;
  donateForm.reset();
  sendFitButton.disabled = true;
  sendStatus.textContent = "";
  sendStatus.className = "status";
  analyzeButton.disabled = !selectedFile || !runtimeAvailable;
}
function selectFile(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".fit")) { setStatus(T.badExt, "error"); return; }
  if (file.size > 50 * 1024 * 1024) { setStatus(T.tooLarge, "error"); return; }
  if (file.size === 0) { setStatus(T.empty, "error"); return; }
  selectedFile = file;
  fileName.textContent = file.name;
  fileSize.textContent = formatBytes(file.size);
  fileCard.classList.add("visible");
  resetAnalysis();
  setStatus(T.fileSelected, "success");
  scrollToSection(privacySection);
}
function clearFile() {
  selectedFile = null;
  fileInput.value = "";
  fileCard.classList.remove("visible");
  resetAnalysis();
  setStatus("", "");
  scrollToSection(document.getElementById("uploadSection"));
}
function fileToBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  return btoa(binary);
}
function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  const chunkSize = 0x8000;
  for (let offset = 0; offset < binary.length; offset += chunkSize) {
    const end = Math.min(binary.length, offset + chunkSize);
    for (let i = offset; i < end; i++) bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
async function sendFile(includeOptions) {
  const ready = await fitRuntimeReady;
  if (!ready) throw new Error(T.runtimeFailed + (runtimeError && runtimeError.message ? runtimeError.message : "Unknown startup error."));
  const fileBuffer = await selectedFile.arrayBuffer();
  if (!fileBuffer || fileBuffer.byteLength === 0) throw new Error(T.fileRead);
  const base64 = fileToBase64(fileBuffer);
  if (!base64) throw new Error(T.filePrepare);
  if (!includeOptions) {
    const json = await invokeDotNet("Analyze", [base64], 60000, T.analysisTimeout);
    return new Response(json, { headers: { "Content-Type": "application/json" } });
  }
  const cleanMethod = removeLocationInput ? "CleanV2" : "Clean";
  const cleanArguments = removeLocationInput ? [
    base64,
    removeGpsInput.checked,
    removeLocationInput.checked,
    removeDeviceInput.checked,
    removeHeartRateInput.checked,
    removePowerInput.checked,
    removeCadenceInput.checked,
    removeDeveloperInput.checked
  ] : [
    base64,
    removeGpsInput.checked,
    removeDeviceInput.checked,
    removeHeartRateInput.checked,
    removePowerInput.checked,
    removeCadenceInput.checked,
    removeDeveloperInput.checked
  ];
  const json = await invokeDotNet(cleanMethod, cleanArguments, 60000, T.analysisTimeout);
  const result = JSON.parse(json);
  const bytes = base64ToBytes(result.fileBase64);
  return new Response(bytes, { headers: {
    "Content-Type": "application/octet-stream",
    "X-Removed-Gps-Fields": String(result.removedGpsFields || 0),
    "X-Removed-Location-Fields": String(result.removedLocationFields || 0),
    "X-Removed-Identifier-Fields": String(result.removedIdentifierFields || 0),
    "X-Removed-Heart-Rate-Fields": String(result.removedHeartRateFields || 0),
    "X-Removed-Power-Fields": String(result.removedPowerFields || 0),
    "X-Removed-Cadence-Fields": String(result.removedCadenceFields || 0),
    "X-Removed-Metadata-Messages": String(result.removedMetadataMessages || 0),
    "X-Removed-Developer-Fields": String(result.removedDeveloperFields || 0)
  }});
}
function renderAnalysis(data) {
  const isEnglish = document.documentElement.lang === "en";
  const statItems = isEnglish ? [["Records",data.recordCount],["Laps",data.lapCount],["Sessions",data.sessionCount],["FIT messages",data.messageCount]] :
    [["Datensätze",data.recordCount],["Runden",data.lapCount],["Sessions",data.sessionCount],["FIT Nachrichten",data.messageCount]];
  statsElement.innerHTML = statItems.map(function(item) {
    return '<div class="stat"><strong>' + Number(item[1]).toLocaleString(isEnglish ? "en-US" : "de-DE") + '</strong><span>' + item[0] + '</span></div>';
  }).join("");
  const labels = isEnglish ? ["GPS track points","Start and finish locations","Heart rate","Power","Cadence","Speed","Device information","User profile","Developer fields"] :
    ["GPS Streckenverlauf","Start und Zielstandorte","Herzfrequenz","Leistung","Kadenz","Geschwindigkeit","Geräteinformationen","Benutzerprofil","Entwicklerfelder"];
  const signals = [[labels[0],data.hasGps],[labels[1],data.hasLocation],[labels[2],data.hasHeartRate],[labels[3],data.hasPower],[labels[4],data.hasCadence],[labels[5],data.hasSpeed],
    [labels[6],data.deviceInfoMessageCount>0],[labels[7],data.userProfileMessageCount>0],[labels[8],data.developerFieldCount>0]];
  checksElement.innerHTML = signals.map(function(item) {
    return '<span class="check ' + (item[1] ? "yes" : "") + '">' + (item[1] ? T.found : T.notFound) + " · " + item[0] + '</span>';
  }).join("");
  const findings = [];
  if (data.hasGps) findings.push(T.gpsFound);
  if (data.hasLocation) findings.push(T.locationFound);
  if (data.deviceInfoMessageCount > 0) findings.push(T.deviceFound);
  if (data.userProfileMessageCount > 0) findings.push(T.profileFound);
  if (data.developerFieldCount > 0) findings.push(T.developerFound);
  const findingHtml = findings.length ?
    findings.map(function(item) { return '<div class="analysis-item found"><strong>' + T.found + '</strong><span>' + item + '</span></div>'; }).join("") :
    '<div class="analysis-item clear"><strong>' + T.notFound + '</strong><span>' + T.noPrivate + '</span></div>';
  document.getElementById("analysisExplanation").innerHTML =
    '<div class="analysis-message"><strong>' + T.readOnlyTitle + '</strong><p>' + T.readOnlyText + '</p></div>' +
    '<div class="analysis-grid">' + findingHtml + '</div>';
  results.classList.add("visible");
  analysisComplete = true;
  cleanButton.disabled = false;
  scrollToSection(results);
}
function updateSendButton() {
  const tooLarge = cleanedBlob && cleanedBlob.size > 2 * 1024 * 1024;
  sendFitButton.disabled = !cleanedBlob || !donateSportInput.value || tooLarge;
  if (tooLarge) { sendStatus.textContent = T.submissionTooLarge; sendStatus.className = "status error"; }
  else if (!sendStatus.classList.contains("success")) { sendStatus.textContent = ""; sendStatus.className = "status"; }
}
function renderCleanedDetails(counts) {
  const items = [];
  if (removeGpsInput.checked) items.push(counts.gps > 0 ? T.gpsRemoved.replace("{count}", counts.gps) : T.gpsNone);
  if (removeLocationInput && removeLocationInput.checked) items.push(T.locationRemoved.replace("{count}", counts.location));
  if (removeDeviceInput.checked) items.push(T.deviceRemoved.replace("{count}", counts.identifiers));
  if (removeHeartRateInput.checked) items.push(T.heartRateRemoved.replace("{count}", counts.heartRate));
  if (removePowerInput.checked) items.push(T.powerRemoved.replace("{count}", counts.power));
  if (removeCadenceInput.checked) items.push(T.cadenceRemoved.replace("{count}", counts.cadence));
  if (removeDeveloperInput.checked) items.push(counts.developer > 0 ? T.developerRemoved.replace("{count}", counts.developer) : T.developerNone);
  if (!items.length) items.push(T.noSelectedData);
  document.getElementById("cleanedDetails").innerHTML = items.map(function(item) { return "<li>" + item + "</li>"; }).join("");
}
async function cleanSelectedFile() {
  if (!selectedFile || !analysisComplete || cleanButton.disabled) return;
  cleanButton.disabled = true;
  analyzeButton.disabled = true;
  setStatus(T.cleanStarting, "");
  try {
    const response = await sendFile(true);
    cleanedBlob = await response.blob();
    const baseName = selectedFile.name.replace(/\\.fit$/i, "");
    cleanedFileName = baseName + "_anonymized.fit";
    const counts = {
      gps:Number(response.headers.get("X-Removed-Gps-Fields")||0),
      location:Number(response.headers.get("X-Removed-Location-Fields")||0),
      identifiers:Number(response.headers.get("X-Removed-Identifier-Fields")||0),
      heartRate:Number(response.headers.get("X-Removed-Heart-Rate-Fields")||0),
      power:Number(response.headers.get("X-Removed-Power-Fields")||0),
      cadence:Number(response.headers.get("X-Removed-Cadence-Fields")||0),
      metadata:Number(response.headers.get("X-Removed-Metadata-Messages")||0),
      developer:Number(response.headers.get("X-Removed-Developer-Fields")||0)
    };
    renderCleanedDetails(counts);
    document.getElementById("cleanSummaryText").textContent = T.cleaned;
    cleanedPanel.hidden = false;
    downloadButton.disabled = false;
    updateSendButton();
    setStatus(T.cleaned, "success");
    scrollToSection(cleanedPanel);
  } catch(error) {
    cleanButton.disabled = false;
    setStatus(T.cleanError + " " + shortErrorMessage(error), "error");
  } finally {
    analyzeButton.disabled = !selectedFile || !runtimeAvailable;
  }
}
function downloadCleanedFile() {
  if (!cleanedBlob) { setStatus(T.downloadError, "error"); return; }
  const fileUrl = URL.createObjectURL(cleanedBlob);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = cleanedFileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(function() { URL.revokeObjectURL(fileUrl); }, 1000);
}
dropzone.addEventListener("click", function() { fileInput.click(); });
dropzone.addEventListener("keydown", function(event) {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInput.click(); }
});
fileInput.addEventListener("change", function() { selectFile(fileInput.files[0]); });
removeFileButton.addEventListener("click", clearFile);
resetButton.addEventListener("click", clearFile);
dropzone.addEventListener("dragover", function(event) { event.preventDefault(); dropzone.classList.add("dragover"); });
dropzone.addEventListener("dragleave", function(event) { event.preventDefault(); dropzone.classList.remove("dragover"); });
dropzone.addEventListener("drop", function(event) { event.preventDefault(); dropzone.classList.remove("dragover"); selectFile(event.dataTransfer.files[0]); });
[removeDeviceInput,removeGpsInput,removeLocationInput,removeHeartRateInput,removePowerInput,removeCadenceInput,removeDeveloperInput].filter(Boolean).forEach(function(input) {
  input.addEventListener("change", function() { updatePrivacyPreview(); if (analysisComplete) resetAnalysis(); });
});
updatePrivacyPreview();
analyzeButton.addEventListener("click", async function() {
  if (!selectedFile || analyzeButton.disabled) return;
  analyzeButton.disabled = true;
  cleanButton.disabled = true;
  setStatus(T.analyzing, "");
  try {
    const response = await sendFile(false);
    const data = await response.json();
    renderAnalysis(data);
    setStatus(T.analysisSuccess, "success");
  } catch(error) {
    resetAnalysis();
    setStatus(T.analysisError + " " + shortErrorMessage(error), "error");
  } finally {
    analyzeButton.disabled = !selectedFile || !runtimeAvailable;
    if (analysisComplete) cleanButton.disabled = false;
  }
});
cleanButton.addEventListener("click", cleanSelectedFile);
downloadButton.addEventListener("click", downloadCleanedFile);
document.getElementById("jumpToSendButton").addEventListener("click", function() {
  scrollToSection(contributePanel);
  document.getElementById("donateSport").focus({preventScroll:true});
});
donateSportInput.addEventListener("change", updateSendButton);
donateForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  if (!cleanedBlob || !donateForm.reportValidity()) return;
  const name = document.getElementById("donateName").value.trim();
  const contact = document.getElementById("donateContact").value.trim();
  if (cleanedBlob.size > 2 * 1024 * 1024) {
    sendStatus.textContent = T.submissionTooLarge;
    sendStatus.className = "status error";
    return;
  }
  sendFitButton.disabled = true;
  sendStatus.textContent = T.uploadStarting;
  sendStatus.className = "status";
  try {
    const form = new FormData();
    form.append("file", new File([cleanedBlob], cleanedFileName, {type:"application/octet-stream"}));
    form.append("cleaned","true");
    form.append("sport",document.getElementById("donateSport").value);
    form.append("comment",document.getElementById("donateComment").value.trim());
    form.append("name",name);
    form.append("contact",contact);
    form.append("website",document.getElementById("donateWebsite").value);
    const response = await fetch(FIT_SUBMISSION_API,{method:"POST",body:form});
    const result = await response.json().catch(function(){return {};});
    if(!response.ok) throw new Error(result.message||result.error||("HTTP "+response.status));
    sendStatus.textContent = T.uploadSuccess;
    sendStatus.className = "status success";
    sendStatus.setAttribute("data-submission-id",result.id||"");
  } catch(error) {
    sendStatus.textContent = T.uploadFailure + " " + shortErrorMessage(error);
    sendStatus.className = "status error";
    updateSendButton();
  }
});
