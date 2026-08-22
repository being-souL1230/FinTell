"use client";

import React from "react";

export function FormattedMarkdown({ content, className = "" }: { content: string; className?: string }) {
  if (!content) return null;

  // Flush any open list and return the <ul> node
  const flushList = (list: React.ReactNode[], key: string) => (
    <ul key={key} className="my-2 space-y-1.5 pl-1">
      {list}
    </ul>
  );

  // Inline parser: handles **bold**, *bold*, _italic_, `code`
  const parseInline = (text: string, baseKey: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let ki = 0;

    // Skip LaTeX math entirely — render as code-like monospace
    remaining = remaining.replace(/\\\[[\s\S]*?\\\]/g, (m) => `【MATH:${m}】`);
    remaining = remaining.replace(/\\\([\s\S]*?\\\)/g, (m) => `【IMATH:${m}】`);

    const TOKEN = /(\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__|_(.+?)_|`([^`]+?)`)/g;

    let lastIndex = 0;
    let match;
    while ((match = TOKEN.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(remaining.slice(lastIndex, match.index));
      }

      const full = match[0];
      if (full.startsWith("**") || full.startsWith("__")) {
        const inner = match[2] || match[4];
        parts.push(
          <strong key={`${baseKey}-b${ki++}`} className="font-bold text-slate-900">
            {inner}
          </strong>
        );
      } else if (full.startsWith("*") || full.startsWith("_")) {
        const inner = match[3] || match[5];
        parts.push(
          <em key={`${baseKey}-i${ki++}`} className="italic text-slate-700">
            {inner}
          </em>
        );
      } else if (full.startsWith("`")) {
        parts.push(
          <code key={`${baseKey}-c${ki++}`} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-emerald-700">
            {match[6]}
          </code>
        );
      }

      lastIndex = match.index + full.length;
    }

    if (lastIndex < remaining.length) {
      const tail = remaining.slice(lastIndex);
      // Render any captured math blocks as monospace
      if (tail.includes("【MATH:") || tail.includes("【IMATH:")) {
        const mathParts = tail.split(/(【(?:I?MATH):[\s\S]*?】)/g);
        mathParts.forEach((mp, mi) => {
          if (mp.startsWith("【MATH:") || mp.startsWith("【IMATH:")) {
            const inner = mp.replace(/【I?MATH:([\s\S]*?)】/, "$1");
            parts.push(
              <code key={`${baseKey}-math${mi}`} className="block my-1 rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-700 whitespace-pre-wrap">
                {inner}
              </code>
            );
          } else if (mp) {
            parts.push(mp);
          }
        });
      } else {
        parts.push(tail);
      }
    }

    return parts;
  };

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";

  const commitList = (idx: number) => {
    if (!inList || currentList.length === 0) return;
    if (listType === "ol") {
      elements.push(
        <ol key={`ol-${idx}`} className="my-2 space-y-1.5 pl-1 list-none">
          {currentList}
        </ol>
      );
    } else {
      elements.push(flushList(currentList, `ul-${idx}`));
    }
    currentList = [];
    inList = false;
  };

  lines.forEach((line, idx) => {
    const raw = line;
    const trimmed = raw.trim();

    // Empty line — commit any open list
    if (!trimmed) {
      commitList(idx);
      return;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      commitList(idx);
      elements.push(<hr key={`hr-${idx}`} className="my-3 border-slate-200" />);
      return;
    }

    // LaTeX block — show as monospace block
    if (trimmed.startsWith("\\[") || trimmed.startsWith("$$")) {
      commitList(idx);
      elements.push(
        <pre key={`math-${idx}`} className="my-2 overflow-x-auto rounded bg-slate-100 px-3 py-2 font-mono text-[10px] text-slate-700 whitespace-pre-wrap">
          {trimmed}
        </pre>
      );
      return;
    }

    // Headings: ####, ###, ##, #
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      commitList(idx);
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const headingClass =
        level === 1
          ? "mt-4 mb-1.5 text-sm font-black text-slate-900"
          : level === 2
          ? "mt-3.5 mb-1 text-[13px] font-extrabold text-slate-900"
          : level === 3
          ? "mt-3 mb-1 text-xs font-black uppercase tracking-wider text-slate-800"
          : "mt-2.5 mb-0.5 text-xs font-extrabold text-slate-800";
      elements.push(
        React.createElement(
          level <= 3 ? `h${level}` : "h4",
          { key: `h-${idx}`, className: headingClass },
          parseInline(text, `h-${idx}`)
        )
      );
      return;
    }

    // Bullet list: starts with - or * or • (even bare •)
    const bulletMatch = trimmed.match(/^([-*•])\s+(.*)/);
    // Also handle bare "•" at start with no space
    const bareBulletMatch = !bulletMatch && trimmed.startsWith("•") ? [null, "•", trimmed.slice(1).trim()] : null;
    const bm = bulletMatch || bareBulletMatch;
    if (bm) {
      if (inList && listType === "ol") commitList(idx);
      inList = true;
      listType = "ul";
      const text = bm[2] || "";
      currentList.push(
        <li key={`li-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed">
          <span className="mt-0.5 shrink-0 text-emerald-600 font-bold">•</span>
          <span className="min-w-0 flex-1 font-medium">{parseInline(text, `li-${idx}`)}</span>
        </li>
      );
      return;
    }

    // Numbered list: 1. 2. etc.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (inList && listType === "ul") commitList(idx);
      inList = true;
      listType = "ol";
      currentList.push(
        <li key={`li-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed">
          <span className="shrink-0 min-w-[1.25rem] font-bold text-emerald-700">{numMatch[1]}.</span>
          <span className="min-w-0 flex-1 font-medium">{parseInline(numMatch[2], `li-${idx}`)}</span>
        </li>
      );
      return;
    }

    // Regular paragraph — commit open list first
    commitList(idx);

    // "Bottom Line:" / "Note:" style callout paragraph
    const calloutMatch = trimmed.match(/^(Bottom Line|Note|Important|Tip|Warning|Summary)[:：](.*)/i);
    if (calloutMatch) {
      elements.push(
        <p key={`p-${idx}`} className="my-1.5 rounded border-l-2 border-emerald-400 bg-emerald-50 px-3 py-1.5 text-xs leading-relaxed">
          <strong className="font-black text-emerald-800">{calloutMatch[1]}:</strong>
          <span className="ml-1 font-medium text-slate-800">{parseInline(calloutMatch[2].trim(), `p-${idx}`)}</span>
        </p>
      );
      return;
    }

    elements.push(
      <p key={`p-${idx}`} className="my-1 text-xs leading-relaxed font-medium text-slate-800">
        {parseInline(trimmed, `p-${idx}`)}
      </p>
    );
  });

  // Commit any remaining open list
  commitList(lines.length);

  return <div className={`space-y-0.5 ${className}`}>{elements}</div>;
}
