import Link from "next/link";

export default function NotFound() {
  return (
    <div className="content-max flex min-h-screen items-center justify-center py-24">
      <div className="text-center">
        {/* 404 number */}
        <div
          className="font-display text-4xl font-extrabold leading-none tracking-hero sm:text-[5rem]"
          style={{
            background: "var(--grad-accent)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>

        {/* Label */}
        <div className="label mt-4 mb-3">PAGE NOT FOUND</div>

        {/* Description */}
        <p className="mx-auto max-w-[400px] text-sm text-fg-2 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or head back to the dashboard.
        </p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/insights" className="btn btn-secondary">
            Browse Insights
          </Link>
        </div>

      </div>
    </div>
  );
}
