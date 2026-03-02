import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";

export const useFormatAIResponse = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const theme = {
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    accent: darkMode ? "#818cf8" : "#6366f1",
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6366f1",
  };

  // Custom component overrides for markdown rendering
  const components = {
    h1: ({ children }) => (
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: theme.accent,
          margin: "1.5rem 0 0.75rem 0",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: "700",
          color: theme.accent,
          margin: "1.25rem 0 0.5rem 0",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: "800",
          color: theme.accent,
          margin: "1.25rem 0 0.75rem 0",
          fontFamily: "'Roboto Mono', monospace",
          letterSpacing: "0.5px",
          borderBottom: `2px solid ${theme.accent}`,
          paddingBottom: "0.5rem",
        }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p
        style={{
          fontSize: "0.78rem",
          color: theme.text,
          margin: "0.5rem 0",
          lineHeight: "1.6",
        }}
      >
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul
        style={{
          margin: "0.5rem 0",
          paddingLeft: "1.5rem",
          fontSize: "0.78rem",
        }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{
          margin: "0.5rem 0",
          paddingLeft: "1.5rem",
          fontSize: "0.78rem",
        }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li
        style={{
          color: theme.text,
          margin: "0.25rem 0",
          lineHeight: "1.6",
        }}
      >
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong
        style={{
          color: theme.accent,
          fontWeight: "700",
        }}
      >
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em
        style={{
          color: theme.textSecondary,
          fontStyle: "italic",
        }}
      >
        {children}
      </em>
    ),
    hr: () => (
      <hr
        style={{
          border: "none",
          height: "1px",
          background: theme.textSecondary,
          opacity: 0.3,
          margin: "1rem 0",
        }}
      />
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: `3px solid ${theme.accent}`,
          paddingLeft: "1rem",
          margin: "0.5rem 0",
          color: theme.textSecondary,
          fontSize: "0.78rem",
          fontStyle: "italic",
        }}
      >
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code
        style={{
          background: darkMode ? "#334155" : "#f1f5f9",
          padding: "0.125rem 0.375rem",
          borderRadius: "3px",
          fontFamily: "'Courier New', monospace",
          color: theme.accent,
          fontSize: "0.72rem",
        }}
      >
        {children}
      </code>
    ),
  };

  // Function to format markdown text using react-markdown
  const formatPrediction = (text) => {
    if (!text) return null;

    // Preprocess text to handle escaped characters and ensure proper formatting
    let processedText = text
      .replace(/\\\$/g, "$") // Unescape dollar signs
      .replace(/\\n/g, "\n") // Convert escaped newlines to actual newlines
      .replace(/\n\n\n+/g, "\n\n"); // Normalize multiple newlines

    return (
      <div
        style={{
          fontSize: "0.78rem",
          lineHeight: "1.6",
          color: theme.text,
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        <ReactMarkdown components={components}>{processedText}</ReactMarkdown>
      </div>
    );
  };

  return { formatPrediction, theme };
};
