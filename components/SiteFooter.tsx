import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CONTACT_EMAIL } from "@/lib/projects";

export function SiteFooter({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <footer
      className={["site-footer", className].filter(Boolean).join(" ")}
      style={style}
    >
      <Link
        href="/"
        scroll={false}
        className="site-footer__mark-link site-footer__mark-link--left"
        aria-label="Back to Studio Romann home"
      >
        <Image
          className="site-footer__mark site-footer__mark--left"
          src="/footer/studio-footer.png"
          alt="STUDIO"
          width={1101}
          height={144}
          priority={false}
        />
      </Link>
      <div className="site-footer__meta">
        <span>New York City</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
      </div>
      <Link
        href="/"
        scroll={false}
        className="site-footer__mark-link site-footer__mark-link--right"
        aria-label="Back to Studio Romann home"
      >
        <Image
          className="site-footer__mark site-footer__mark--right"
          src="/footer/romann-footer.png"
          alt="ROMANN"
          width={1113}
          height={144}
          priority={false}
        />
      </Link>
    </footer>
  );
}
