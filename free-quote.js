const quoteForm = document.querySelector("[data-quote-form]");
const quoteFiles = document.querySelector("[data-quote-files]");
const selectedFiles = document.querySelector("[data-selected-files]");
const whatsappOption = document.querySelector("[data-whatsapp-option]");
const whatsappNumber = "2348166090745";
const quoteEmailAddress = "newmethod9999@yahoo.com";
const labelWidth = 27;

const getValue = (value, fallback = "Not provided") => {
  const text = `${value || ""}`.trim();
  return text || fallback;
};

const quoteLine = (label, value, fallback = "Not provided") => {
  return `${label.padEnd(labelWidth, " ")}: ${getValue(value, fallback)}`;
};

const formatFileSize = (size) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const renderSelectedFiles = () => {
  const files = [...quoteFiles.files];
  selectedFiles.replaceChildren();

  if (!files.length) {
    const empty = document.createElement("span");
    empty.textContent = "No inspiration files selected yet.";
    selectedFiles.append(empty);
    return;
  }

  files.forEach((file) => {
    const chip = document.createElement("span");
    chip.className = "file-chip";
    chip.textContent = `${file.name} - ${formatFileSize(file.size)}`;
    selectedFiles.append(chip);
  });
};

const buildQuoteMessage = (format = "plain") => {
  const data = new FormData(quoteForm);
  const files = [...quoteFiles.files].map((file) => file.name);
  const attachmentLines = files.length
    ? [
        quoteLine("Selected file(s)", files.join(", ")),
        "I will share the selected files separately if needed.",
      ]
    : [quoteLine("Selected file(s)", "No inspiration files selected yet.")];
  const detailLines = [
    quoteLine("Name", data.get("name")),
    quoteLine("Phone", data.get("phone")),
    "",
    quoteLine("Project type", data.get("service")),
    quoteLine("Timeline", data.get("timeline")),
    quoteLine("Estimated budget", data.get("budget"), "Not specified"),
    quoteLine("Location", data.get("location")),
    "",
    quoteLine("Measurement status", data.get("measurementStatus")),
    quoteLine("Measurements / size clues", data.get("measurements"), "Not provided yet"),
    quoteLine("Project stage", data.get("projectStage")),
    quoteLine("Property type", data.get("propertyType")),
    quoteLine("Scope clue", data.get("scopeClue")),
    quoteLine("Preferred finish/material", data.get("finish"), "Not specified"),
    quoteLine("Current site condition", data.get("siteCondition")),
    "",
    "Project Description:",
    getValue(data.get("details"), "Not provided"),
    "",
    "Inspiration Files:",
    ...attachmentLines,
  ];

  if (format === "whatsapp") {
    return [
      "*NEW METHOD FREE QUOTE REQUEST*",
      "",
      "```",
      ...detailLines,
      "```",
      "",
      "Please review and reply with quote guidance as soon as possible.",
    ].join("\n");
  }

  return [
    "NEW METHOD FREE QUOTE REQUEST",
    "",
    ...detailLines,
    "",
    "Please review and reply with quote guidance as soon as possible.",
  ].join("\n");
};

const sendQuoteDirectly = () => {
  const message = buildQuoteMessage();
  const subject = "New Method Free Quote Request";
  window.location.href = `mailto:${quoteEmailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
};

const openWhatsAppQuote = () => {
  const message = buildQuoteMessage("whatsapp");
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noreferrer");
};

quoteFiles.addEventListener("change", renderSelectedFiles);

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendQuoteDirectly();
});

whatsappOption.addEventListener("click", () => {
  if (!quoteForm.reportValidity()) return;
  openWhatsAppQuote();
});
