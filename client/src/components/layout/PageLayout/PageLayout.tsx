import type { ReactNode } from "react";
import "./PageLayout.css";

interface PageLayoutProps {
  upper: ReactNode;
  lower?: ReactNode;
}

export default function PageLayout({ upper, lower }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <div className="page-upper">{upper}</div>
      {lower && <div className="page-lower">{lower}</div>}
    </div>
  );
}