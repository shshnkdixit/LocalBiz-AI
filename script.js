
"use strict";

const $ = (selector) => document.querySelector(selector);

const form = $("#generator-form");
const generateBtn = $("#generate-btn");
const emptyState = $("#empty-state");
const loadingState = $("#loading-state");
const resultContent = $("#result-content");
const output = $("#output");
const resultTitle = $("#result-title");
const providerBadge = $("#provider-badge");
const toast = $("#toast");

let lastRequest = null;
let lastGeneratedText = "";
let creations = loadCreations();
let toastTimeout;

function loadCreations() {
  try {
    return JSON.parse(localStorage.getItem("localbiz-creations") || "[]");
  } catch {
    return [];
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

// Render plain AI text safely without allowing HTML injection.
function renderText(text) {
  output.replaceChildren();

  const lines = text.split(/\r?\n/);
  let list = null;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      list = null;
      return;
    }

    const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
    const bullet = trimmed.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);

    if (heading) {
      list = null;
      const h = document.createElement("h3");
      h.textContent = heading[1].replace(/\*\*/g, "");
      output.appendChild(h);
    } else if (bullet) {
      if (!list) {
        list = document.createElement("ul");
        output.appendChild(list);
      }
      const li = document.createElement("li");
      li.textContent = bullet[1].replace(/\*\*/g, "");
      list.appendChild(li);
    } else {
      list = null;
      const p = document.createElement("p");
      p.textContent = trimmed.replace(/\*\*/g, "");
      output.appendChild(p);
    }
  });
}

function getRequest() {
  const data = new FormData(form);

  return {
    business: String(data.get("business") || "").trim(),
    product: String(data.get("product") || "").trim(),
    audience: String(data.get("audience") || ""),
    tone: String(data.get("tone") || ""),
    tool: String(data.get("tool") || "listing"),
    extra: String(data.get("extra") || "").trim()
  };
}

function buildPrompt(data) {
  const tasks = {
    listing: `Write a compelling product listing with:
1. A catchy title
2. A clear, engaging description
3. Five key benefits
4. A call to action`,

    social: `Create three distinct social media captions, each with a different hook.
Include relevant hashtags and a call to action.
Keep each caption ready to copy and publish.`,

    ideas: `Suggest five realistic, low-cost growth ideas for this small business.
For each idea, explain the action, the intended audience, and a simple way to measure results.
Finish with the best idea to try first.`,

    pricing: `Suggest a practical pricing-validation strategy for this product.
Include a simple cost checklist, three possible pricing approaches, and a small experiment to test willingness to pay.
Do not invent actual market prices or claim profitability without cost data.`
  };

  return `You are LocalBiz AI, a practical assistant for small businesses.

BUSINESS: ${data.business}
PRODUCT: ${data.product}
TARGET AUDIENCE: ${data.audience}
WRITING STYLE: ${data.tone}
ADDITIONAL DETAILS: ${data.extra || "None provided"}

TASK:
${tasks[data.tool] || tasks.listing}

Instructions:
- Be specific, useful, and easy to understand.
- Use clear section headings.
- Never invent product certifications, reviews, guarantees, or factual claims.
- Label assumptions clearly.
- Do not claim you have conducted research or verified market demand.
- Focus on realistic advice for a small business.
- Return the finished content directly.`;
}

function demoGenerate(data) {
  const product = data.product;
  const business = data.business;
  const audience = data.audience;

  if (data.tool === "social") {
    return `## Caption 1 — Meet your new favourite

Discover something special from ${business}!

${product}

Made with your needs in mind. Take a closer look and tell us what you think.

#SmallBusiness #ShopLocal #${business.replace(/[^a-z0-9]/gi, "")}

## Caption 2 — Why you'll love it

Looking for something that fits your lifestyle?

Explore ${product} from ${business}. Your next favourite might be just one click away.

#NewFinds #SmallBusinessLove #DiscoverMore

## Caption 3 — Let's connect

We created ${product} with ${audience.toLowerCase()} in mind.

Have a question? Drop us a message and let's help you find the right fit.

#CustomerFirst #SupportSmallBusiness

Note: These are starter captions. Verify product claims and add your actual store link before publishing.`;
  }

  if (data.tool === "ideas") {
    return `## 5 practical growth ideas for ${business}

### 1. Talk to five potential customers
Ask what matters most to them when choosing a product like yours.

### 2. Improve your product photos
Use clear lighting and multiple angles to show the product accurately.

### 3. Publish useful social content
Show how the product works, who it helps, and what makes it different.

### 4. Test a limited offer
Try a small, time-limited offer and compare enquiries or sales against your normal results.

### 5. Ask customers for feedback
After a purchase, ask what they liked and what could be improved.

## Best first step
Start by interviewing five people in your target audience: ${audience}. Record their problems and use their feedback to improve your offer.

## How to measure progress
Track enquiries, clicks, conversion rate, repeat purchases, and customer feedback.

These are suggestions to test, not guaranteed growth results.`;
  }

  if (data.tool === "pricing") {
    return `## Pricing strategy for ${business}

### 1. Understand your costs
List materials, packaging, labour, shipping, payment fees, and other overheads.

### 2. Compare three approaches
- Cost-based: Start with your total unit cost and a target margin.
- Competitor-informed: Research comparable products and document differences.
- Value-based: Ask customers which benefits matter and what alternatives they consider.

### 3. Run a willingness-to-pay test
Interview 5–10 potential customers. Present clearly defined product options and ask which they would actually consider buying.

### 4. Measure real behaviour
Where appropriate, test genuine offers at different price points and track purchases, not just likes or survey responses.

### 5. Make the decision
Compare unit economics, conversion rates, and customer feedback before choosing a price.

No price can be recommended confidently without your costs, market, and competitor data.`;
  }

  return `## ${product}

### Product description
Discover ${product}, brought to you by ${business}. Designed with ${audience.toLowerCase()} in mind, this offering gives you an opportunity to find a product that fits your needs.

${data.extra ? `### Additional details\n${data.extra}\n` : ""}
### Why consider it?
- A clear description of what you're offering.
- Product information that customers can evaluate.
- An opportunity to communicate your brand's personality.
- Details that help customers decide whether it suits their needs.
- A straightforward way to learn more about your product.

### Call to action
Interested in learning more? Contact ${business} for product details and availability.

### Before publishing
Add verified specifications, actual product benefits, pricing, delivery information, and your store link. Replace general statements with genuine differentiators.`;
}

async function generateWithOllama(data) {
  const base = $("#ollama-url").value.trim().replace(/\/+$/, "");
  const model = $("#model").value.trim();

  if (!base || !model) {
    throw new Error("Enter a valid Ollama address and model name.");
  }

  const response = await fetch(`${base}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: buildPrompt(data),
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama returned HTTP ${response.status}. Check that the server and model are running.`);
  }

  const result = await response.json();

  if (!result.response || !result.response.trim()) {
    throw new Error("The model returned an empty response. Please try again.");
  }

  return result.response.trim();
}

function showLoading(isLoading) {
  generateBtn.disabled = isLoading;
  generateBtn.innerHTML = isLoading
    ? "<span>✦</span> Generating..."
    : '<span>✦</span> Generate with AI <span class="button-arrow">→</span>';

  emptyState.classList.toggle("hidden", isLoading || Boolean(lastGeneratedText));
  loadingState.classList.toggle("hidden", !isLoading);
  resultContent.classList.add("hidden");
}

function displayResult(text, source) {
  lastGeneratedText = text;
  renderText(text);

  const titles = {
    listing: "Your product listing is ready.",
    social: "Your social content is ready.",
    ideas: "Your growth plan is ready.",
    pricing: "Your pricing strategy is ready."
  };

  resultTitle.textContent = titles[lastRequest.tool] || "Your creation is ready.";
  providerBadge.textContent = source === "ollama"
    ? `LOCAL MODEL · ${$("#model").value.trim()}`
    : "DEMO MODE · SAMPLE CONTENT";

  loadingState.classList.add("hidden");
  emptyState.classList.add("hidden");
  resultContent.classList.remove("hidden");
  generateBtn.disabled = false;
  generateBtn.innerHTML = '<span>✦</span> Generate with AI <span class="button-arrow">→</span>';
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  lastRequest = getRequest();

  if (!lastRequest.business || !lastRequest.product) {
    showToast("Please enter your business name and product.");
    return;
  }

  showLoading(true);

  try {
    const provider = $("#provider").value;
    let text;

    if (provider === "ollama") {
      text = await generateWithOllama(lastRequest);
      displayResult(text, "ollama");
    } else {
      // Demo mode creates example content without calling an AI model.
      await new Promise(resolve => setTimeout(resolve, 550));
      text = demoGenerate(lastRequest);
      displayResult(text, "demo");
    }
  } catch (error) {
    loadingState.classList.add("hidden");
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span>✦</span> Generate with AI <span class="button-arrow">→</span>';

    emptyState.classList.toggle("hidden", Boolean(lastGeneratedText));
    resultContent.classList.toggle("hidden", !lastGeneratedText);

    showToast(error.message || "Something went wrong. Please try again.");
  }
});

// Keep the tool selection visually in sync with the radio buttons.
document.querySelectorAll(".tool-option input").forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelectorAll(".tool-option").forEach((option) => {
      option.classList.toggle("selected", option.querySelector("input").checked);
    });
  });
});

$("#copy-btn").addEventListener("click", async () => {
  if (!lastGeneratedText) return;

  try {
    await navigator.clipboard.writeText(lastGeneratedText);
    showToast("Content copied to clipboard!");
  } catch {
    // Fallback for browsers without clipboard permission.
    const textarea = document.createElement("textarea");
    textarea.value = lastGeneratedText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    textarea.remove();
    showToast(copied ? "Content copied!" : "Copy failed. Please select the text manually.");
  }
});

$("#save-btn").addEventListener("click", () => {
  if (!lastGeneratedText || !lastRequest) return;

  const item = {
    id: Date.now(),
    title: lastRequest.business + " — " + lastRequest.tool,
    tool: lastRequest.tool,
    content: lastGeneratedText,
    createdAt: new Date().toLocaleString()
  };

  creations.unshift(item);

  // Avoid exhausting browser local storage.
  creations = creations.slice(0, 50);

  try {
    localStorage.setItem("localbiz-creations", JSON.stringify(creations));
    showToast("Creation saved to this browser!");
  } catch {
    creations.shift();
    showToast("Could not save. Browser storage may be full.");
  }
});

$("#regenerate-btn").addEventListener("click", () => {
  if (!lastRequest) {
    showToast("Create something first.");
    return;
  }

  // Resubmit through the same validation and provider flow.
  form.requestSubmit();
});

function showView(view) {
  const isHistory = view === "history";
  $("#create-view").classList.toggle("hidden", isHistory);
  $("#history-view").classList.toggle("hidden", !isHistory);
  $("#breadcrumb-title").textContent = isHistory ? "My creations" : "AI Studio";

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  if (isHistory) renderHistory();
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

$("#back-to-studio").addEventListener("click", () => {
  showView("create");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function renderHistory() {
  const container = $("#history-list");
  container.replaceChildren();

  if (!creations.length) {
    const message = document.createElement("div");
    message.className = "history-item";
    message.textContent = "No saved creations yet. Generate some content and click Save.";
    container.appendChild(message);
    return;
  }

  creations.forEach((item) => {
    const card = document.createElement("article");
    card.className = "history-item";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const date = document.createElement("small");
    date.textContent = item.createdAt;
    date.style.color = "#8d9ab4";

    const preview = document.createElement("p");
    preview.textContent = item.content.slice(0, 260) +
      (item.content.length > 260 ? "..." : "");

    const open = document.createElement("button");
    open.className = "secondary-btn";
    open.textContent = "View creation";
    open.addEventListener("click", () => {
      lastGeneratedText = item.content;
      lastRequest = {
        business: item.title.split(" — ")[0],
        tool: item.tool
      };
      displayResult(item.content, "demo");
      showView("create");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const remove = document.createElement("button");
    remove.className = "secondary-btn";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      creations = creations.filter(entry => entry.id !== item.id);
      try {
        localStorage.setItem("localbiz-creations", JSON.stringify(creations));
        renderHistory();
        showToast("Creation deleted.");
      } catch {
        showToast("Could not update browser storage.");
      }
    });

    card.append(title, date, preview, open, remove);
    container.appendChild(card);
  });
}

$("#provider").addEventListener("change", () => {
  const isOllama = $("#provider").value === "ollama";
  $("#ollama-settings").classList.toggle("hidden", !isOllama);
  $("#connection-status").textContent = "";
});

$("#test-connection").addEventListener("click", async () => {
  const base = $("#ollama-url").value.trim().replace(/\/+$/, "");
  const status = $("#connection-status");
  status.textContent = "Checking connection...";

  try {
    const response = await fetch(`${base}/api/tags`);

    if (!response.ok) {
      throw new Error("Ollama responded with an error.");
    }

    const data = await response.json();
    const models = (data.models || []).map(model => model.name);
    const selectedModel = $("#model").value.trim();

    if (models.length && !models.some(name =>
      name === selectedModel || name.startsWith(selectedModel + ":")
    )) {
      status.textContent = "Connected, but the selected model was not found. Available: " + models.join(", ");
      return;
    }

    status.textContent = models.length
      ? "Connected! Available models: " + models.join(", ")
      : "Connected, but no models were found. Download a model first.";
  } catch {
    status.textContent = "Connection failed. Start Ollama and check browser access/CORS settings.";
  }
});

$("#setup-link").addEventListener("click", (event) => {
  event.preventDefault();
  $("#setup").scrollIntoView({ behavior: "smooth", block: "center" });
  $("#provider").focus();
});

showView("create");
