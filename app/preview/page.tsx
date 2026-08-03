import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layout preview — Studio Romann",
};

export default function PreviewPage() {
  return (
    <main className="compare">
      <header className="compare__header">
        <h1>Studio Romann — layout compare</h1>
        <p>
          Left: desktop (3 across) · Right: mobile (2 across). Opening skipped so
          you can compare the grid.
        </p>
      </header>

      <div className="compare__frames">
        <section className="compare__panel">
          <div className="compare__label">Desktop — 3 across · 1280px</div>
          <div className="compare__frame compare__frame--desktop">
            <iframe
              title="Desktop preview"
              src="/?skipOpening=1"
              width={1280}
              height={900}
            />
          </div>
        </section>

        <section className="compare__panel">
          <div className="compare__label">Mobile — 2 across · 390px</div>
          <div className="compare__frame compare__frame--mobile">
            <iframe
              title="Mobile preview"
              src="/?skipOpening=1"
              width={390}
              height={844}
            />
          </div>
        </section>
      </div>

      <style>{`
        .compare {
          min-height: 100vh;
          background: #111;
          color: #eee;
          padding: 24px 20px 40px;
          font-family: Inter, Helvetica, Arial, sans-serif;
        }
        .compare__header {
          max-width: 1800px;
          margin: 0 auto 20px;
        }
        .compare__header h1 {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 500;
        }
        .compare__header p {
          margin: 0;
          opacity: 0.7;
          font-size: 14px;
        }
        .compare__frames {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          align-items: flex-start;
          max-width: 1800px;
          margin: 0 auto;
        }
        .compare__panel {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .compare__label {
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          opacity: 0.65;
        }
        .compare__frame {
          background: #000;
          border: 1px solid #333;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        }
        .compare__frame iframe {
          display: block;
          border: 0;
          background: #0c0c0c;
        }
        .compare__frame--desktop {
          width: min(100%, 1280px);
        }
        .compare__frame--desktop iframe {
          width: 1280px;
          max-width: 100%;
          height: 900px;
          transform-origin: top left;
        }
        .compare__frame--mobile {
          width: 390px;
        }
        .compare__frame--mobile iframe {
          width: 390px;
          height: 844px;
        }
      `}</style>
    </main>
  );
}
