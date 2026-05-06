"use client";

import { useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface MdxRendererProps {
  content: string;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-xl border border-[#1E293B] bg-[#0B0E14] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E293B] bg-[#131A2B]">
        <span className="text-xs text-slate-500 font-mono">{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[#10B981]" />
              <span className="text-[#10B981]">已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-slate-300 block whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-[#1E293B] text-[#F59E0B] font-mono text-sm">
      {children}
    </code>
  );
}

function renderContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Code blocks
    if (line.trim().startsWith("```")) {
      const language = line.trim().replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <CodeBlock key={key++} language={language} code={codeLines.join("\n")} />
      );
      continue;
    }

    // H3 heading
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={key++} className="text-lg font-bold text-slate-100 mt-8 mb-3">
          {renderInline(line.replace("### ", ""))}
        </h3>
      );
      i++;
      continue;
    }

    // H2 heading
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={key++} className="text-xl font-bold text-slate-100 mt-10 mb-4 pb-2 border-b border-[#1E293B]">
          {renderInline(line.replace("## ", ""))}
        </h2>
      );
      i++;
      continue;
    }

    // H1 heading
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={key++} className="text-2xl font-bold text-white mt-6 mb-4">
          {renderInline(line.replace("# ", ""))}
        </h1>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      nodes.push(<hr key={key++} className="my-8 border-[#1E293B]" />);
      i++;
      continue;
    }

    // Unordered list items
    if (line.match(/^[\s]*[-*]\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[\s]*[-*]\s/)) {
        listItems.push(lines[i].replace(/^[\s]*[-*]\s*/, ""));
        i++;
      }
      nodes.push(
        <ul key={key++} className="my-4 space-y-2 list-disc list-inside text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list items
    if (line.match(/^[\s]*\d+\.\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[\s]*\d+\.\s/)) {
        listItems.push(lines[i].replace(/^[\s]*\d+\.\s*/, ""));
        i++;
      }
      nodes.push(
        <ol key={key++} className="my-4 space-y-2 list-decimal list-inside text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].replace("> ", ""));
        i++;
      }
      nodes.push(
        <blockquote key={key++} className="my-6 pl-4 border-l-2 border-[#3B82F6] text-slate-400 italic">
          {quoteLines.map((ql, idx) => (
            <p key={idx} className={idx > 0 ? "mt-2" : ""}>{renderInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Regular paragraph - collect consecutive text lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("##") &&
      !lines[i].startsWith("###") &&
      !lines[i].match(/^[\s]*[-*]\s/) &&
      !lines[i].match(/^[\s]*\d+\.\s/) &&
      !lines[i].startsWith("> ") &&
      lines[i].trim() !== "---"
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      const text = paraLines.join("\n");
      nodes.push(
        <p key={key++} className="my-3 text-slate-300 leading-relaxed">
          {renderInline(text)}
        </p>
      );
    }
  }

  return nodes;
}

function renderInline(text: string): React.ReactNode {
  // Split on inline elements and interleave
  const parts: React.ReactNode[] = [];
  // Match: **bold**, `code`, *italic* (but not **)
  const regex = /(\*\*(.+?)\*\*)|(`([^`]+)`)|(?<!\*)\*([^*]+)\*(?!\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // **bold**
      parts.push(
        <strong key={key++} className="font-bold text-slate-100">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // `code`
      parts.push(<InlineCode key={key++}>{match[4]}</InlineCode>);
    } else if (match[5]) {
      // *italic*
      parts.push(
        <em key={key++} className="italic text-slate-400">
          {match[5]}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function MdxRenderer({ content }: MdxRendererProps) {
  const rendered = useMemo(() => renderContent(content), [content]);

  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-base">{rendered}</div>
    </div>
  );
}
