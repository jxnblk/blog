/** @jsxImportSource https://esm.sh/react@18.3.1 */
import { type ReactNode, SVGProps } from "https://esm.sh/react@18.3.1";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const Diagz = ({ size = 32, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M32 0 L0 32 L0 16 L16 0z M32 16 L32 32 L16 32z" />
  </svg>
);

export const Diag2 = ({ size = 32, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path
      d={`
        M8 0 L16 0 L0 16 L0 8 z
        M24 0 L 32 0 L0 32 L0 24 z
        M32 8 L32 16 L16 32 L8 32 z
        M32 24 L32 32 L24 32 z
      `}
    />
  </svg>
);

type TiledProps = IconProps & {
  children: ReactNode;
  offset?: number | string;
};

export const Tiled = ({
  size = 32,
  children,
  className = "",
  height = "100%",
  offset = 0,
  ...props
}: TiledProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height={height}
    className={className}
    fill="currentColor"
    {...props}
  >
    <defs>
      <pattern id="tile" patternUnits="userSpaceOnUse" width={size} height={size} x={offset}>
        {children}
      </pattern>
    </defs>
    <rect width="100%" height={height} fill="url(#tile)" />
  </svg>
);
