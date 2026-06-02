export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const INDENT = "  ";

const CODE_LABELS: Record<string, string> = {
  bash: "bash",
  cli: "bash",
  command: "bash",
  commands: "bash",
  css: "css",
  html: "html",
  javascript: "javascript",
  js: "javascript",
  json: "json",
  php: "php",
  sql: "sql",
  terminal: "bash",
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
};

function normalizeLanguageAlias(language: string | null) {
  const normalized = (language || "plaintext").trim().toLowerCase();

  return CODE_LABELS[normalized] || normalized || "plaintext";
}

function getCodeLanguageFromLabel(text: string) {
  const normalized = text
    .replace(/\u00a0/g, " ")
    .replace(/[:\uff1a]/g, "")
    .trim()
    .toLowerCase();

  return CODE_LABELS[normalized] || null;
}

function getCodeLanguageFromClass(element: Element) {
  const className = element.getAttribute("class") || "";
  const match = className.match(/(?:^|\s)language-([a-z0-9_-]+)/i);

  return normalizeLanguageAlias(match?.[1] || null);
}

function inferCodeLanguage(text: string) {
  const normalized = text.trim();

  if (/^\s*[{[]/.test(normalized) && /[}\]]\s*$/.test(normalized)) {
    return "json";
  }

  if (/<\?php|\bnamespace\s+App\\|\buse\s+Illuminate\\|\bpublic\s+function\b/.test(normalized)) {
    return "php";
  }

  if (/^\s*(npm|npx|pnpm|yarn|composer|php artisan|git|cd|cp|mv|rm|mkdir)\s+/i.test(normalized)) {
    return "bash";
  }

  if (/<[a-z][\s\S]*>/.test(normalized) && /<\/[a-z]+>/.test(normalized)) {
    return "html";
  }

  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\b[\s\S]+\b(FROM|INTO|TABLE|WHERE)\b/i.test(normalized)) {
    return "sql";
  }

  if (
    /\b(interface|type)\s+[A-Z]\w*/.test(normalized) ||
    /:\s*(string|number|boolean|void|Promise|React\.|HTMLElement|HTML\w+Element)\b/.test(normalized) ||
    /\b(as\s+HTMLElement|useState<|React\.FC|tsx)\b/.test(normalized)
  ) {
    return "typescript";
  }

  if (
    /\b(console\.log|setTimeout|function|const|let|var|return|import|export)\b/.test(normalized) ||
    /=>/.test(normalized)
  ) {
    return "javascript";
  }

  if (/[.#]?[a-zA-Z][\w-]*\s*\{[\s\S]*:[\s\S]*;?[\s\S]*\}/.test(normalized)) {
    return "css";
  }

  return "plaintext";
}

function looksLikeLegacyCodeText(text: string) {
  const normalized = text.trim();

  if (!normalized) {
    return false;
  }

  if (/^\s*(npm|npx|pnpm|yarn|composer|php artisan|git|cd|cp|mv|rm|mkdir)\s+/i.test(normalized)) {
    return true;
  }

  if (/^\s*(&lt;|<)[a-z][\s\S]*(&gt;|>)/i.test(normalized)) {
    return true;
  }

  if (/^\s*[.#]?[a-zA-Z][\w-]*\s*\{[\s\S]*:[\s\S]*\}/.test(normalized)) {
    return true;
  }

  if (normalized.length < 90) {
    return false;
  }

  const codeSignals = [
    /console\.log\s*\(/,
    /setTimeout\s*\(/,
    /function\s+\w+\s*\(/,
    /\b(const|let|var|return|import|export)\s+/,
    /\b(interface|type|class)\s+\w+/,
    /\bpublic\s+function\b/,
    /=>/,
    /;\s*(console|setTimeout|function|const|let|var|return)\b/,
    /<\?php/,
    /&lt;[a-z][\s\S]*&gt;/,
    /<[a-z][\s\S]*>/,
    /[.#]?[a-zA-Z][\w-]*\s*\{[\s\S]*:[\s\S]*\}/,
  ];
  const commentCount = (normalized.match(/(^|\s)\/\//g) || []).length;

  return codeSignals.some((pattern) => pattern.test(normalized)) || (
    commentCount >= 2 && /[;{}()=]|\b(console|function|const|let|var|setTimeout|return)\b/.test(normalized)
  );
}

function prepareCodeText(text: string) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function compactCodeText(text: string) {
  return prepareCodeText(text)
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCodeLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isOpeningMarkupTag(line: string) {
  return /^<([a-z][\w:-]*)(?:\s[^>]*)?>$/i.test(line) && !/\/>$/.test(line);
}

function isClosingMarkupTag(line: string) {
  return /^<\/[a-z][\w:-]*>$/i.test(line);
}

function indentLines(lines: string[]) {
  let level = 0;

  return lines
    .map((rawLine) => rawLine.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^(}|\]|\)|},|];|\);)/.test(line) || isClosingMarkupTag(line)) {
        level = Math.max(level - 1, 0);
      }

      const indented = `${INDENT.repeat(level)}${line}`;

      if (
        /(\{|\[|\()$/.test(line) ||
        /=>\s*\{$/.test(line) ||
        isOpeningMarkupTag(line)
      ) {
        level += 1;
      }

      return indented;
    })
    .join("\n");
}

function formatHtmlCodeText(text: string) {
  const tokens = compactCodeText(text).match(/<\/?[^>]+>|[^<]+/g) || [];
  let level = 0;
  const lines: string[] = [];

  tokens.forEach((token) => {
    const value = token.trim();

    if (!value) {
      return;
    }

    const isClosing = /^<\//.test(value);
    const isSelfClosing = /\/>$/.test(value) || /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(value);
    const isOpening = /^<[a-z][\w:-]*/i.test(value) && !isClosing && !isSelfClosing;

    if (isClosing) {
      level = Math.max(level - 1, 0);
    }

    lines.push(`${INDENT.repeat(level)}${value}`);

    if (isOpening) {
      level += 1;
    }
  });

  return normalizeCodeLines(lines.join("\n"));
}

function formatCssCodeText(text: string) {
  const lines = compactCodeText(text)
    .replace(/\s*\{\s*/g, " {\n")
    .replace(/;\s*/g, ";\n")
    .replace(/\s*\}\s*/g, "\n}\n")
    .split("\n");

  return normalizeCodeLines(indentLines(lines));
}

function formatScriptCodeText(text: string) {
  const lines = compactCodeText(text)
    .replace(/\s+(\/\/\s*)/g, "\n$1")
    .replace(/\s+(\/\*\s?)/g, "\n$1")
    .replace(/\s+(import\s+)/g, "\n$1")
    .replace(/\s+(export\s+)/g, "\n$1")
    .replace(/\s+(interface\s+\w+)/g, "\n$1")
    .replace(/\s+(type\s+\w+)/g, "\n$1")
    .replace(/\s+(class\s+\w+)/g, "\n$1")
    .replace(/\s+(function\s+\w+\s*\()/g, "\n$1")
    .replace(/;\s*/g, ";\n")
    .replace(/\{\s*/g, "{\n")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/>\s+</g, ">\n<")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n");

  return normalizeCodeLines(indentLines(lines));
}

function formatJsonCodeText(text: string) {
  const prepared = prepareCodeText(text);

  try {
    return JSON.stringify(JSON.parse(prepared), null, 2);
  } catch {
    return normalizeCodeLines(indentLines(compactCodeText(prepared)
      .replace(/,\s*/g, ",\n")
      .replace(/\{\s*/g, "{\n")
      .replace(/\[\s*/g, "[\n")
      .replace(/\s*\}/g, "\n}")
      .replace(/\s*\]/g, "\n]")
      .split("\n")));
  }
}

function formatSqlCodeText(text: string) {
  return normalizeCodeLines(compactCodeText(text)
    .replace(/\s+(FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|VALUES|SET)\s+/gi, "\n$1 ")
    .replace(/\s+(AND|OR)\s+/gi, "\n  $1 ")
    .replace(/,\s*/g, ",\n  "));
}

function formatBashCodeText(text: string) {
  return normalizeCodeLines(compactCodeText(text)
    .replace(/\s+(?=(npm|npx|pnpm|yarn|composer|php artisan|git|cd|cp|mv|rm|mkdir)\s+)/gi, "\n"));
}

function formatPlainCodeText(text: string) {
  const prepared = prepareCodeText(text);

  if (prepared.includes("\n")) {
    return normalizeCodeLines(prepared);
  }

  return compactCodeText(prepared);
}

function formatCodeText(text: string, language: string) {
  const normalizedLanguage = normalizeLanguageAlias(language);

  if (normalizedLanguage === "html") {
    return formatHtmlCodeText(text);
  }

  if (normalizedLanguage === "css") {
    return formatCssCodeText(text);
  }

  if (["javascript", "typescript", "php"].includes(normalizedLanguage)) {
    return formatScriptCodeText(text);
  }

  if (normalizedLanguage === "json") {
    return formatJsonCodeText(text);
  }

  if (normalizedLanguage === "sql") {
    return formatSqlCodeText(text);
  }

  if (normalizedLanguage === "bash") {
    return formatBashCodeText(text);
  }

  return formatPlainCodeText(text);
}

function createCodeBlock(doc: Document, text: string, language: string) {
  const pre = doc.createElement("pre");
  const code = doc.createElement("code");

  code.className = `language-${normalizeLanguageAlias(language)}`;
  code.textContent = formatCodeText(text, language);
  pre.appendChild(code);

  return pre;
}

function isBlankElement(element: Element | null) {
  return Boolean(element && !element.textContent?.replace(/\u00a0/g, " ").trim() && !element.querySelector("img"));
}

function isCodeBoundary(element: Element | null) {
  if (!element) {
    return true;
  }

  if (/^H[1-6]$/i.test(element.tagName) || element.tagName.toLowerCase() === "pre") {
    return true;
  }

  if (element.querySelector("img, figure, table, pre, code")) {
    return true;
  }

  return Boolean(getCodeLanguageFromLabel(element.textContent || ""));
}

function normalizeExistingCodeBlocks(doc: Document) {
  let changed = false;

  doc.body.querySelectorAll("pre code").forEach((code) => {
    const currentText = code.textContent || "";
    const currentLanguage = getCodeLanguageFromClass(code);
    const language = currentLanguage === "plaintext" ? inferCodeLanguage(currentText) : currentLanguage;
    const formattedText = formatCodeText(currentText, language);
    const nextClassName = `language-${normalizeLanguageAlias(language)}`;

    if (code.textContent !== formattedText) {
      code.textContent = formattedText;
      changed = true;
    }

    if (code.getAttribute("class") !== nextClassName) {
      code.setAttribute("class", nextClassName);
      changed = true;
    }
  });

  return changed;
}

export function normalizeLegacyCodeParagraphs(content: string) {
  if (!content || typeof DOMParser === "undefined") {
    return content;
  }

  const doc = new DOMParser().parseFromString(content, "text/html");
  let changed = normalizeExistingCodeBlocks(doc);

  doc.body.querySelectorAll("p").forEach((paragraph) => {
    const language = getCodeLanguageFromLabel(paragraph.textContent || "");

    if (!language) {
      return;
    }

    let next = paragraph.nextElementSibling;

    while (isBlankElement(next)) {
      next = next?.nextElementSibling || null;
    }

    if (!next || isCodeBoundary(next)) {
      return;
    }

    const codeText = next.textContent || "";

    if (!codeText.trim()) {
      return;
    }

    next.replaceWith(createCodeBlock(doc, codeText, language));
    changed = true;
  });

  doc.body.querySelectorAll("p").forEach((paragraph) => {
    if (paragraph.querySelector("img, figure, table, pre, code")) {
      return;
    }

    const text = paragraph.textContent || "";

    if (!looksLikeLegacyCodeText(text)) {
      return;
    }

    const language = inferCodeLanguage(text);

    paragraph.replaceWith(createCodeBlock(doc, text, language));
    changed = true;
  });

  if (normalizeExistingCodeBlocks(doc)) {
    changed = true;
  }

  return changed ? doc.body.innerHTML : content;
}
