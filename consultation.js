const form = document.querySelector("[data-consult-form]");
const whatsappNumber = "2348166090745";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const message = [
    "Hello New Method, I want to consult about a project.",
    "",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone") || "Not provided"}`,
    `Project type: ${data.get("service")}`,
    `Timeline: ${data.get("timeline")}`,
    `Location: ${data.get("location")}`,
    "",
    `Project details: ${data.get("details")}`,
  ].join("\n");

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noreferrer");
});
