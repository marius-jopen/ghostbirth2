import React from "react";

// Very small markup: **word** -> <em className="twist"> (pure red)
//                    *word*   -> <em> (amber)
//                    \n       -> <br />
// Used for paragraph/title copy edited through Keystatic.
export function emph(input: string | null | undefined): React.ReactNode {
  if (!input) return null;
  const lines = input.split(/\r?\n/);
  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    let i = 0;
    let remaining = line;
    const push = (node: React.ReactNode) => parts.push(<React.Fragment key={`${lineIdx}-${i++}`}>{node}</React.Fragment>);

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
      if (boldMatch) {
        push(<em className="twist">{boldMatch[1]}</em>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }
      const emMatch = remaining.match(/^\*([^*]+)\*/);
      if (emMatch) {
        push(<em>{emMatch[1]}</em>);
        remaining = remaining.slice(emMatch[0].length);
        continue;
      }
      const next = remaining.search(/\*/);
      if (next === -1) {
        push(remaining);
        remaining = "";
      } else {
        push(remaining.slice(0, next));
        remaining = remaining.slice(next);
        // If none of the above matched, consume the lone *
        if (!/^\*\*[^*]+\*\*/.test(remaining) && !/^\*[^*]+\*/.test(remaining)) {
          push("*");
          remaining = remaining.slice(1);
        }
      }
    }

    return (
      <React.Fragment key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}
