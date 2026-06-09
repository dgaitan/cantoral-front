import Image from "next/image";

interface LogoProps {
  size?: number;
  mono?: boolean;
  white?: boolean;
}

const LOGO_WIDTH = 379.45;
const LOGO_HEIGHT = 99.82;
const LOGO_ASPECT_RATIO = LOGO_WIDTH / LOGO_HEIGHT;

export function Logo({ size = 26, mono = false, white = false }: LogoProps) {
  const filter = white
    ? "brightness(0) saturate(100%) invert(1)"
    : mono
      ? "grayscale(1) brightness(0.3)"
      : undefined;
  const whiteImage = '/logo-white.svg';
  const imageSrc = white ? whiteImage : '/logo-full.svg';

  return (
    <Image
      src={imageSrc}
      alt="Cancionero Católico"
      width={Math.round(size * LOGO_ASPECT_RATIO)}
      height={size}
    />
  );
}
