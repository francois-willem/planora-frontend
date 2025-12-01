"use client"
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ 
  href = "/", 
  className = "", 
  size = "large",
  showLink = true,
  showText = false
}) {
  const sizeClasses = {
    small: "h-8 w-auto",
    medium: "h-12 w-auto", 
    large: "h-16 w-auto",
    xlarge: "h-24 w-auto"
  };

  const imageProps = {
    small: { width: 80, height: 32 },
    medium: { width: 120, height: 48 },
    large: { width: 160, height: 64 },
    xlarge: { width: 170, height: 100 }
  };

  const textSizes = {
    small: "text-lg",
    medium: "text-xl", 
    large: "text-2xl",
    xlarge: "text-3xl"
  };

  const logoElement = (
    <div className="flex items-center space-x-2">
      <div 
        className={`${sizeClasses[size]} ${className} flex-shrink-0`}
        style={{ minWidth: 0 }}
      >
        <Image
          src="/planora-logo.png"
          alt="Planora Logo"
          width={imageProps[size].width}
          height={imageProps[size].height}
          className="h-full w-auto object-contain"
          priority
          sizes="(max-width: 768px) 200px, 160px"
          style={{ 
            width: 'auto',
            height: '100%',
            maxWidth: 'none'
          }}
        />
      </div>
      {showText && (
        <h1 className={`font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent ${textSizes[size]}`}>
          Planora
        </h1>
      )}
    </div>
  );

  if (showLink) {
    return (
      <Link href={href} className="flex items-center hover:opacity-80 transition-opacity duration-200">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
