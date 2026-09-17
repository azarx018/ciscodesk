import { KeyboardEvent, useEffect, useRef, useState } from "react";
import "./Terminal.css";
import { Icon } from "../../icons/Icon";
import { Button } from "../../ui";

export interface TerminalLine {
  id: number;
  prompt: string;
  command: string;
  output: string;
}

export interface TerminalProps {
  prompt: string;
  suggestions: string[];
  onRun: (command: string) => Promise<string>;
}

let idCounter = 0;

/** Realistic Cisco CLI mock (§16, §19): input, history, clear, copy, suggestions. Never runs a real shell command. */
export function Terminal({ prompt, suggestions, onRun }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  async function submit(command: string) {
    if (!command.trim()) return;
    setRunning(true);
    const output = await onRun(command);
    setLines((prev) => [...prev, { id: ++idCounter, prompt, command, output }]);
    setInput("");
    setHistoryIndex(null);
    setRunning(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (lines.length === 0) return;
      const idx = historyIndex === null ? lines.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(lines[idx].command);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const idx = historyIndex + 1;
      if (idx >= lines.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(idx);
        setInput(lines[idx].command);
      }
    }
  }

  function handleClear() {
    setLines([]);
  }

  function handleCopy() {
    const text = lines.map((l) => `${l.prompt}${l.command}\n${l.output}`).join("\n\n");
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  return (
    <div className="cd-terminal">
      <div className="cd-terminal-toolbar">
        <span className="cd-terminal-toolbar-label">Session — {prompt.replace(/[#>]\s*$/, "")}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleCopy}>Copy</Button>
          <Button size="sm" variant="ghost" onClick={handleClear}>Clear</Button>
        </div>
      </div>

      <div className="cd-terminal-screen" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
        {lines.map((line) => (
          <div key={line.id} className="cd-terminal-line">
            <div><span className="cd-terminal-prompt">{line.prompt}</span>{line.command}</div>
            <pre className="cd-terminal-output">{line.output}</pre>
          </div>
        ))}
        <div className="cd-terminal-line">
          <span className="cd-terminal-prompt">{prompt}</span>
          <input
            ref={inputRef}
            className="cd-terminal-input"
            value={input}
            disabled={running}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            aria-label="Terminal command input"
          />
          {running && <span className="cd-terminal-cursor">▋</span>}
        </div>
      </div>

      <div className="cd-terminal-suggestions">
        <Icon.terminal size={13} />
        {suggestions.map((s) => (
          <button key={s} className="cd-terminal-suggestion" onClick={() => submit(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
