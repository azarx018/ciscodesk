import "./ErrorState.css";
import { Button } from "../Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * Standard failure surface for a data-driven view. Message should
 * name the real simulated failure (e.g. "Device unreachable"),
 * never a generic "Something went wrong".
 */
export function ErrorState({ title = "Couldn't load this data", message, onRetry }: ErrorStateProps) {
  return (
    <div className="cd-error-state" role="alert">
      <div className="cd-error-title">{title}</div>
      <div className="cd-error-message">{message}</div>
      {onRetry && (
        <Button size="sm" onClick={onRetry} className="cd-error-retry">
          Retry
        </Button>
      )}
    </div>
  );
}
