export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-4">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className="text-text-primary uppercase tracking-[0.22em]"
            style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 100, fontSize: '15px' }}
          >
            DIVEMOTOR
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="text-xs text-text-muted">Vehicle Showroom AI</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span>© 2026 Divemotor · Grupo Kaufmann</span>
          <div className="h-3 w-px bg-border hidden sm:block" />
          <span>Powered by NanoBanana AI</span>
        </div>
      </div>
    </footer>
  )
}
