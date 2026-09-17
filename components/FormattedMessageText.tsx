import React from "react";

interface FormattedMessageTextProps {
  text: string;
}

export function FormattedMessageText({ text }: FormattedMessageTextProps) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="leading-relaxed">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-semibold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}
