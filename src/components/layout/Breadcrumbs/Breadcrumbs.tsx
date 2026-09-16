import "./Breadcrumbs.css";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="cd-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="cd-breadcrumb-item">
            {item.href && !isLast ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span className={isLast ? "cd-breadcrumb-current" : undefined}>{item.label}</span>
            )}
            {!isLast && <span className="cd-breadcrumb-sep">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
