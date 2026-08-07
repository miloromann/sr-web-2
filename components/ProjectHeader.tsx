import Link from "next/link";
import { content } from "@/lib/content";
import { mediaUrl } from "@/lib/media";
import type { Project } from "@/lib/projects";

export function ProjectHeader({ project }: { project: Project }) {
  const [aboutLabel, kindLabel, yearLabel] = content.labels.projectMeta;
  return (
    <header className="project-header">
      <Link
        href="/"
        scroll={false}
        className="project-header__logo-tile"
        aria-label={content.labels.aria.backHome}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="project-header__logo-img"
          src={mediaUrl("/brand/letter-r.svg")}
          alt=""
        />
      </Link>

      <div className="project-header__titles">
        <h1 className="project-header__title">{project.title}</h1>
        <p className="project-header__client">{project.client}</p>
      </div>

      <div className="project-header__meta">
        <div>
          <p className="project-header__label">{aboutLabel}</p>
          <p className="project-header__value">{project.about}</p>
        </div>
        <div className="project-header__kind">
          <p className="project-header__label">{kindLabel}</p>
          {project.kind.map((k) => (
            <p className="project-header__value" key={k}>
              {k}
            </p>
          ))}
        </div>
        <div className="project-header__year">
          <p className="project-header__label">{yearLabel}</p>
          <p className="project-header__value">{project.year}</p>
        </div>
      </div>
    </header>
  );
}
