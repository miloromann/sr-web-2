import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { content, CONTACT_EMAIL } from "@/lib/content";

export function SiteFooter({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const footer = content.footer;
  return (
    <footer
      className={["site-footer", className].filter(Boolean).join(" ")}
      style={style}
    >
      <Link
        href="/"
        scroll={false}
        className="site-footer__mark-link site-footer__mark-link--left"
        aria-label={content.labels.aria.backHome}
      >
        <Image
          className="site-footer__mark site-footer__mark--left"
          src={footer.assets.studio}
          alt={footer.leftMarkAlt}
          width={1101}
          height={144}
          priority={false}
        />
      </Link>
      <div className="site-footer__meta">
        <span>{footer.location}</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>{footer.contactLabel}</a>
      </div>
      <Link
        href="/"
        scroll={false}
        className="site-footer__mark-link site-footer__mark-link--right"
        aria-label={content.labels.aria.backHome}
      >
        <Image
          className="site-footer__mark site-footer__mark--right"
          src={footer.assets.romann}
          alt={footer.rightMarkAlt}
          width={1113}
          height={144}
          priority={false}
        />
      </Link>
    </footer>
  );
}
