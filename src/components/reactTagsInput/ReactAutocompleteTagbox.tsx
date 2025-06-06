import React, { useRef, useState } from "react";
import styles from "./reactTagsInput.module.css";

interface ReactTagsInputProps {
  tags?: string[];
  options?: string[];
  onChange?: (tags: string[]) => void;
  limit?: number;
  placeholder?: string;
  containerStyle?: React.CSSProperties;
  className?: string;
}

const FONT_FAMILY =
  "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif";

export default function ReactAutocompleteTagbox(props: ReactTagsInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const tags = props.tags || [];
  const options = props.options || [];
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = options
    ? options.filter(
        (o) =>
          o.toLowerCase().includes(input.toLowerCase()) && !tags.includes(o)
      )
    : [];
  const addTag = (tag: string) => {
    if (
      tag &&
      (!props.limit || tags.length < props.limit) &&
      // If options exist, restrict to options
      (options.length > 0 ? options.includes(tag) : true) &&
      !tags.includes(tag)
    ) {
      props.onChange?.([...tags, tag]);
      setInput("");
      setHighlight(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      options &&
      ["ArrowDown", "ArrowUp"].includes(e.key) &&
      suggestions.length
    ) {
      e.preventDefault();
      setHighlight((h) =>
        e.key === "ArrowDown"
          ? (h + 1) % suggestions.length
          : (h - 1 + suggestions.length) % suggestions.length
      );
    } else if (options && e.key === "Enter" && suggestions.length) {
      e.preventDefault();
      addTag(suggestions[highlight]);
    } else if (
      (e.key === "Enter" || e.key === "," || e.key === " ") &&
      !tags.includes(input.trim()) &&
      (!props.limit || tags.length < props.limit) &&
      // If options exist, restrict to options
      (options.length > 0 ? options.includes(input.trim()) : true)
    ) {
      e.preventDefault();
      addTag(input.trim());
    } else if (
      (e.key === "Backspace" || e.key === "Delete") &&
      !input &&
      tags.length
    ) {
      props.onChange?.(tags.slice(0, -1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(() => e.target.value);
    setHighlight(0);
  };

  const handleOptionClick = (option: string) => addTag(option);

  const showPlaceholder = !tags.length && !input && !focused;

  return (
    <div style={{ fontFamily: FONT_FAMILY, width: "inherit" }}>
      <div
        className={[styles.tagsContainer, props.className]
          .filter(Boolean)
          .join(" ")}
        style={props.containerStyle}
        tabIndex={-1}
        onClick={() => inputRef.current?.focus()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {tags.map((tag, idx) => (
          <span className={styles.badge} key={tag + idx}>
            <span className={styles.badgeText}>{tag}</span>
            <button
              className={styles.removeBtn}
              tabIndex={-1}
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                props.onChange?.(tags.filter((_, i) => i !== idx));
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={styles.inputTag}
          style={{ fontFamily: FONT_FAMILY }}
          autoComplete="off"
          spellCheck={false}
        />
        {showPlaceholder && (
          <span className={styles.placeholder}>
            {props.placeholder || "Type and press ENTER to add tags..."}
          </span>
        )}
        {options && focused && input && suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((option, idx) => (
              <li
                key={option}
                className={
                  idx === highlight
                    ? styles.suggestionActive
                    : styles.suggestion
                }
                onMouseDown={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlight(idx)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      {props.limit && (
        <span
          className={`${styles.limitWarning} ${
            tags.length === props.limit ? styles.limitReached : ""
          }`}
        >
          {`Limit used: ${tags.length}/${props.limit}`}
        </span>
      )}
    </div>
  );
}
