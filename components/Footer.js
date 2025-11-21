'use client'
import Logo from './Logo';

export default function Footer({ 
  variant = "default",
  logoSize = "large",
  showLogo = true,
  showLogoText = true,
  className = "",
  customContent = null
}) {
  const variants = {
    default: {
      container: "py-12",
      background: "bg-slate-900 dark:bg-slate-950"
    },
    compact: {
      container: "py-8",
      background: "bg-slate-900 dark:bg-slate-950"
    },
    minimal: {
      container: "py-6",
      background: "bg-slate-800 dark:bg-slate-900"
    }
  };

  const currentVariant = variants[variant];

  return (
    <footer className={`${currentVariant.background} text-white ${currentVariant.container} ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {showLogo && (
            <div className="mb-4 md:mb-0">
              <Logo size={logoSize} showLink={false} showText={showLogoText} />
            </div>
          )}
          
          {customContent ? (
            customContent
          ) : (
            <div className="text-slate-400 dark:text-slate-500 text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} Planora. All rights reserved.</p>
              <p className="text-sm mt-1">Built with Next.js and Express</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
