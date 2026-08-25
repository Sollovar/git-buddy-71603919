import { motion } from "motion/react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";

const ease = [0.22, 1, 0.36, 1] as const;

const productLinks = [
  { label: "Depth", href: "#platform" },
  { label: "Routing", href: "#platform" },
  { label: "Coverage", href: "#platform" },
  { label: "Desk", href: "#platform" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Blog", href: "#" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
];

const socialLinks = [
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
  { label: "Email", icon: Mail, href: "#" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-flex items-center gap-2.5">
              <img src={logoMark} alt="Vellum" width={32} height={32} className="h-8 w-8" />
              <span className="font-display text-base font-semibold tracking-tight">Vellum</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A premium order book terminal for desks that read liquidity first.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground/60 transition-colors hover:border-bronze/40 hover:text-bronze"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
              Product
            </h4>
            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
              Company
            </h4>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
              Legal
            </h4>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Vellum Markets. All rights reserved.</span>
          <span>Market data is indicative. Not investment advice.</span>
        </div>
      </div>
    </footer>
  );
}
