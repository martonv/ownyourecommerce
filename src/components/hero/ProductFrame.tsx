import type { ReactNode } from 'react';

/**
 * App window chrome for the hero demo (DESIGN.md §3 "Product frame").
 * 36px bar, three neutral dots, muted URL label, 16px radius, 1px border, product shadow.
 */
export default function ProductFrame({
  label = 'app.juniperworkshop.com',
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="hd-frame">
      <div className="hd-frame-bar">
        <span className="hd-frame-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="hd-frame-url">{label}</span>
      </div>
      <div className="hd-frame-body">{children}</div>
    </div>
  );
}
