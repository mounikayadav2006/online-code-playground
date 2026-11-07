(function () {
  "use strict";

  var htmlEl = document.getElementById("htmlCode");
  var cssEl = document.getElementById("cssCode");
  var jsEl = document.getElementById("jsCode");
  var preview = document.getElementById("preview");
  var statusEl = document.getElementById("status");
  var errorBox = document.getElementById("errorBox");
  var runBtn = document.getElementById("runBtn");
  var resetBtn = document.getElementById("resetBtn");
  var sampleBtn = document.getElementById("sampleBtn");

  var SAMPLE_HTML = [
    '<div class="card">',
    "  <h1>Hello, Playground!</h1>",
    "  <p>Click the button to change the colour and count clicks.</p>",
    '  <button id="magicBtn">Click me</button>',
    '  <p id="counter">Clicks: 0</p>',
    "</div>"
  ].join("\n");

  var SAMPLE_CSS = [
    "body {",
    "  margin: 0;",
    "  min-height: 100vh;",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  background: #0f172a;",
    "  font-family: Arial, sans-serif;",
    "}",
    "",
    ".card {",
    "  background: #1e293b;",
    "  color: #f1f5f9;",
    "  padding: 32px 40px;",
    "  border-radius: 14px;",
    "  text-align: center;",
    "  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);",
    "}",
    "",
    "button {",
    "  background: #38bdf8;",
    "  color: #0f172a;",
    "  border: none;",
    "  padding: 10px 22px;",
    "  border-radius: 8px;",
    "  font-size: 16px;",
    "  font-weight: bold;",
    "  cursor: pointer;",
    "}",
    "",
    "button:hover {",
    "  opacity: 0.85;",
    "}"
  ].join("\n");

  var SAMPLE_JS = [
    "var count = 0;",
    "var colors = ['#38bdf8', '#f472b6', '#facc15', '#4ade80', '#fb923c'];",
    "var button = document.getElementById('magicBtn');",
    "var counter = document.getElementById('counter');",
    "",
    "button.addEventListener('click', function () {",
    "  count++;",
    "  counter.textContent = 'Clicks: ' + count;",
    "  button.style.background = colors[count % colors.length];",
    "});",
    "",
    "console.log('Sample code is running!');"
  ].join("\n");

  var BLANK_DOC =
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>" +
    "body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;" +
    "background:#ffffff;color:#6b7280;font-family:Arial,sans-serif;text-align:center;padding:16px}" +
    "</style></head><body><p>Your output will appear here.<br>Write some code and click <b>Run</b>.</p></body></html>";

  /* Script injected into the preview so runtime errors can be shown in the main page. */
  var ERROR_REPORTER =
    "<script>" +
    "window.addEventListener('error',function(e){" +
    "parent.postMessage({source:'playground-error',message:(e.message||'Script error')+" +
    "(e.lineno?' (line '+e.lineno+')':'')},'*');});" +
    "window.addEventListener('unhandledrejection',function(e){" +
    "parent.postMessage({source:'playground-error',message:'Unhandled promise rejection: '+" +
    "(e.reason&&e.reason.message?e.reason.message:e.reason)},'*');});" +
    "<\/script>";

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = "status" + (kind ? " " + kind : "");
  }

  function showError(message) {
    errorBox.textContent = "Error: " + message;
    errorBox.hidden = false;
    setStatus("Error in your code", "err");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  /* Combine the three editors into one complete HTML document. */
  function buildDocument(html, css, js) {
    var safeCss = css.replace(/<\/style/gi, "<\\/style");
    var safeJs = js.replace(/<\/script/gi, "<\\/script");
    return (
      "<!DOCTYPE html><html><head><meta charset=\"utf-8\">" +
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
      ERROR_REPORTER +
      "<style>" + safeCss + "</style></head><body>" +
      html +
      "<script>" + safeJs + "<\/script>" +
      "</body></html>"
    );
  }

  function runCode() {
    clearError();
    var doc = buildDocument(htmlEl.value, cssEl.value, jsEl.value);
    preview.srcdoc = doc;
    setStatus("Output updated at " + new Date().toLocaleTimeString(), "ok");
  }

  function clearPreview() {
    preview.srcdoc = BLANK_DOC;
  }

  function resetAll() {
    htmlEl.value = "";
    cssEl.value = "";
    jsEl.value = "";
    clearError();
    clearPreview();
    setStatus("Editors cleared", "");
    htmlEl.focus();
  }

  function loadSample() {
    htmlEl.value = SAMPLE_HTML;
    cssEl.value = SAMPLE_CSS;
    jsEl.value = SAMPLE_JS;
    runCode();
    setStatus("Sample loaded and executed", "ok");
  }

  /* Messages sent from the sandboxed preview (runtime errors). */
  window.addEventListener("message", function (event) {
    if (event.source !== preview.contentWindow) {
      return;
    }
    var data = event.data;
    if (data && data.source === "playground-error") {
      showError(String(data.message));
    }
  });

  runBtn.addEventListener("click", runCode);
  resetBtn.addEventListener("click", resetAll);
  sampleBtn.addEventListener("click", loadSample);

  /* Per-editor Clear buttons. */
  var clearButtons = document.querySelectorAll("[data-clear]");
  Array.prototype.forEach.call(clearButtons, function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-clear"));
      target.value = "";
      target.focus();
    });
  });

  /* Keyboard helpers inside editors: Ctrl/Cmd + Enter runs, Tab inserts two spaces. */
  [htmlEl, cssEl, jsEl].forEach(function (editor) {
    editor.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
        return;
      }
      if (event.key === "Tab" && !event.shiftKey) {
        event.preventDefault();
        var start = editor.selectionStart;
        var end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + "  " + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
      }
    });
  });

  clearPreview();
})();
