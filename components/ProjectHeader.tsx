"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="project-header">
      <Link
        href="/"
        scroll={false}
        className="project-header__logo-tile"
        aria-label="Back to Studio Romann home"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="project-header__logo-img"
          src="/brand/letter-r.svg"
          alt=""
        />
      </Link>

      <div className="project-header__titles">
        <h1 className="project-header__title">{project.title}</h1>
        <p className="project-header__client">{project.client}</p>
      </div>

      <div className="project-header__meta">
        <div>
          <p className="project-header__label">About</p>
          <p className="project-header__value">{project.about}</p>
        </div>
        <div className="project-header__kind">
          <p className="project-header__label">Kind</p>
          {project.kind.map((k) => (
            <p className="project-header__value" key={k}>
              {k}
            </p>
          ))}
        </div>
        <div className="project-header__year">
          <p className="project-header__label">Year</p>
          <p className="project-header__value">{project.year}</p>
        </div>
      </div>
    </header>
  );
}
