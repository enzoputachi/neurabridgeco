import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30" role="contentinfo">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                NeuraBridge
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting retail investors with trusted market experts.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">
              Platform
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/experts"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Experts
                </Link>
              </li>
              <li>
                <Link
                  to="/insights"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Public Insights
                </Link>
              </li>
              <li>
                <Link
                  to="/auth?mode=signup&role=expert"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Become an Expert
                </Link>
              </li>
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">
              Markets
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/experts?market=stocks"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Stocks
                </Link>
              </li>
              <li>
                <Link
                  to="/experts?market=crypto"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Crypto
                </Link>
              </li>
              <li>
                <Link
                  to="/experts?market=forex"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forex
                </Link>
              </li>
              <li>
                <Link
                  to="/experts?market=commodities"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Commodities
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">
              Legal
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Disclaimer:</strong> NeuraBridge is an educational platform only.
              The content provided by experts on this platform does not constitute
              financial advice, investment recommendations, or trading signals. All
              insights are for informational and educational purposes only. You should
              consult with a licensed financial advisor before making any investment
              decisions. NeuraBridge does not execute trades or manage portfolios. Past
              performance is not indicative of future results.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NeuraBridge. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Educational content only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
