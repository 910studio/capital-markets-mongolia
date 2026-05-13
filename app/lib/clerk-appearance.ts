/**
 * Shared Clerk appearance config — pulls GrayUI tokens so SignIn / SignUp /
 * UserButton match the rest of the editorial design (sharp corners,
 * brand purple, Plus Jakarta + Newsreader, no SaaS rounding).
 *
 * Loose-typed (no @clerk/types import) — Clerk's `appearance` prop accepts
 * the shape structurally, and we get autocomplete via the component props.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#3E149C",         // --brand
    colorText: "#0C0A1D",            // --fg
    colorTextSecondary: "#44415A",   // --fg-2
    colorBackground: "#FFFFFF",      // --white
    colorInputBackground: "#FFFFFF",
    colorInputText: "#0C0A1D",
    colorDanger: "#DC2626",          // --neg
    colorSuccess: "#059669",         // --pos
    colorWarning: "#FCA311",         // --signal
    colorNeutral: "#7A7793",         // --fg-3
    fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-plus-jakarta-sans), system-ui, sans-serif",
    borderRadius: "2px",             // --card-r — GrayUI is sharp, no rounding
    spacingUnit: "1rem",
  },
  elements: {
    rootBox: "mx-auto",
    card: "shadow-none border border-border-s rounded-[var(--card-r)] bg-[var(--white)]",
    headerTitle: "font-display font-extrabold tracking-tight text-fg",
    headerSubtitle: "text-fg-3",
    socialButtonsBlockButton:
      "border border-border rounded-[var(--btn-r)] !text-fg hover:bg-surface transition-colors font-display font-semibold",
    socialButtonsBlockButtonText: "font-display font-semibold",
    dividerLine: "bg-border-s",
    dividerText: "text-fg-3 text-[10px] uppercase tracking-[0.18em] font-display font-bold",
    formFieldLabel: "font-display font-semibold text-[11px] uppercase tracking-[0.08em] text-fg-2",
    formFieldInput:
      "border border-border rounded-[var(--btn-r)] bg-[var(--white)] text-fg focus:border-brand focus:ring-0",
    formButtonPrimary:
      "bg-brand hover:bg-brand-h text-white rounded-[var(--btn-r)] font-display font-semibold normal-case shadow-none",
    footerActionText: "text-fg-3",
    footerActionLink: "text-brand hover:text-brand-h font-display font-semibold no-underline",
    identityPreview: "border border-border rounded-[var(--btn-r)] bg-surface",
    identityPreviewText: "text-fg",
    formFieldInputShowPasswordButton: "text-fg-3 hover:text-fg",
    formFieldErrorText: "text-neg text-xs",
    alert: "border border-border rounded-[var(--card-r)]",
    badge: "rounded-[var(--btn-r)] font-display font-bold uppercase tracking-[0.08em] text-[10px]",
    userPreviewMainIdentifier: "font-display font-semibold text-fg",
    userPreviewSecondaryIdentifier: "text-fg-3",
    userButtonPopoverCard:
      "shadow-lg border border-border-s rounded-[var(--card-r)] bg-[var(--white)]",
    userButtonPopoverActionButton:
      "font-display font-medium text-fg-2 hover:text-fg hover:bg-surface",
    userButtonPopoverActionButtonText: "font-display font-medium",
    userButtonPopoverFooter: "border-t border-border-s",
  },
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    showOptionalFields: false,
  },
};
