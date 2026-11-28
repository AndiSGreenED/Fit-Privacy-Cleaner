const T = ;
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
const statusElement = document.getElementById("status");
const results = document.getElementById("results");
const statsElement = document.getElementById("stats");
const checksElement = document.getElementById("checks");
const runtimeStatusElement = document.getElementById("runtimeStatus");
const appVersionElement = document.getElementById("appVersion");
const appBuildElement = document.getElementById("appBuild");
const privacySection = document.getElementById("privacySection");
const cleanedPanel = document.getElementById("cleanedPanel");
const contributePanel = document.getElementById("contributePanel");
const donateForm = document.getElementById("donateForm");
const donateConsent = document.getElementById("donateConsent");
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
  if (removeDeviceInput.checked) selected.push(T.deviceLabel || "Device and profile information");
  if (removeGpsInput.checked) selected.push(T.gpsLabel);
  selected.push(document.documentElement.lang === "en" ? "Developer fields (always)" : "Entwicklerdaten (immer)");
  document.getElementById("privacyPreviewText").textContent = removeDeviceInput.checked || removeGpsInput.checked ? T.previewIntro : T.previewNone;
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
async function loadVersion() {
  try {
    const response = await fetch("/Fit-Privacy-Cleaner/version.json?release=1.1.0", { cache: "no-store" });
    if (!response.ok) throw new Error("Version metadata not available");
    const version = await response.json();
    appVersionElement.textContent = version.version || "unknown";
    appBuildElement.textContent = (version.build || "unknown") + (version.run ? " · Run " + version.run : "");
  } catch (_) { appBuildElement.textContent = "Build unknown"; }
}
loadVersion();
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
  const json = await invokeDotNet("Clean", [base64, removeGpsInput.checked, removeDeviceInput.checked], 60000, T.analysisTimeout);
  const result = JSON.parse(json);
  const bytes = base64ToBytes(result.fileBase64);
  return new Response(bytes, { headers: {
    "Content-Type": "application/octet-stream",
    "X-Removed-Gps-Fields": String(result.removedGpsFields || 0),
    "X-Removed-Identifier-Fields": String(result.removedIdentifierFields || 0),
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
  const labels = isEnglish ? ["GPS coordinates","Heart rate","Power","Cadence","Speed","Device information","User profile","Developer fields"] :
    ["GPS Koordinaten","Herzfrequenz","Leistung","Kadenz","Geschwindigkeit","Geräteinformationen","Benutzerprofil","Entwicklerfelder"];
  const signals = [[labels[0],data.hasGps],[labels[1],data.hasHeartRate],[labels[2],data.hasPower],[labels[3],data.hasCadence],[labels[4],data.hasSpeed],
    [labels[5],data.deviceInfoMessageCount>0],[labels[6],data.userProfileMessageCount>0],[labels[7],data.developerFieldCount>0]];
  checksElement.innerHTML = signals.map(function(item) {
    return '<span class="check ' + (item[1] ? "yes" : "") + '">' + (item[1] ? T.found : T.notFound) + " · " + item[0] + '</span>';
  }).join("");
  const findings = [];
  if (data.hasGps) findings.push(T.gpsFound);
  if (data.deviceInfoMessageCount > 0) findings.push(T.deviceFound);
  if (data.userProfileMessageCount > 0) findings.push(T.profileFound);
  if (data.developerFieldCount > 0) findings.push(T.developerFound);
  const findingHtml = findings.length ?
    findings.map(function(item) { return '<div class="analysis-item found"><strong>' + T.found + '</strong><span>' + item + '</span></div>'; }).join("") :
    '<div class="analysis-item clear"><strong>' + T.notFound + '</strong><span>' + T.noPrivate + '</span></div>';
  const metrics = [];
  if (data.hasHeartRate) metrics.push(isEnglish ? "heart rate" : "Herzfrequenz");
  if (data.hasPower) metrics.push(isEnglish ? "power" : "Leistung");
  if (data.hasCadence) metrics.push(isEnglish ? "cadence" : "Kadenz");
  if (data.hasSpeed) metrics.push(isEnglish ? "speed" : "Geschwindigkeit");
  const kept = metrics.length ? T.metricsText + metrics.join(", ") + "." : T.metricsText + (isEnglish ? "the available record, lap and session data." : "die vorhandenen Datensatz, Runden und Sessiondaten.");
  document.getElementById("analysisExplanation").innerHTML =
    '<div class="analysis-message"><strong>' + T.readOnlyTitle + '</strong><p>' + T.readOnlyText + '</p></div>' +
    '<div class="analysis-grid">' + findingHtml + '</div>' +
    '<div class="analysis-kept"><strong>' + T.metricsLabel + '</strong><p>' + kept + '</p></div>';
  results.classList.add("visible");
  analysisComplete = true;
  cleanButton.disabled = false;
  scrollToSection(results);
}
function updateSendButton() {
  const tooLarge = cleanedBlob && cleanedBlob.size > 2 * 1024 * 1024;
  sendFitButton.disabled = !cleanedBlob || !donateConsent.checked || tooLarge;
  if (tooLarge) { sendStatus.textContent = T.submissionTooLarge; sendStatus.className = "status error"; }
  else if (!sendStatus.classList.contains("success")) { sendStatus.textContent = ""; sendStatus.className = "status"; }
}
function renderCleanedDetails(counts) {
  const items = [];
  if (removeGpsInput.checked) items.push(counts.gps > 0 ? T.gpsRemoved.replace("{count}", counts.gps) : T.gpsNone);
  else items.push(T.gpsKept);
  if (removeDeviceInput.checked) items.push(T.deviceRemoved.replace("{count}", counts.identifiers).replace("{messages}", counts.metadata));
  else items.push(T.deviceKept);
  items.push(counts.developer > 0 ? T.developerRemoved.replace("{count}", counts.developer) : T.developerNone);
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
      identifiers:Number(response.headers.get("X-Removed-Identifier-Fields")||0),
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
[removeDeviceInput,removeGpsInput].forEach(function(input) {
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
donateConsent.addEventListener("change", updateSendButton);
document.getElementById("donateSport").addEventListener("change", updateSendButton);
donateForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  if (!cleanedBlob || !donateForm.reportValidity()) return;
  if (!donateConsent.checked) {
    sendStatus.textContent = T.consentNeeded;
    sendStatus.className = "status error";
    return;
  }
  const name = document.getElementById("donateName").value.trim();
  const contact = document.getElementById("donateContact").value.trim();
  if (!name && !contact) {
    sendStatus.textContent = T.contactNeeded;
    sendStatus.className = "status error";
    document.getElementById("donateName").focus();
    return;
  }
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
    donateConsent.checked = false;
    sendStatus.setAttribute("data-submission-id",result.id||"");
  } catch(error) {
    sendStatus.textContent = T.uploadFailure + " " + shortErrorMessage(error);
    sendStatus.className = "status error";
    updateSendButton();
  }
});
