import * as React from "react";

type LogoMarkProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export function LogoMark({ size = 64, ...props }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 768 768"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        d="M384 224C384 312.366 312.366 384 224 384M384 224C384 312.366 455.634 384 544 384M384 224L384 64M384 224L544 224M224 384C312.366 384 384 455.634 384 544M224 384H64M224 384L224 224M544 384C455.634 384 384 455.634 384 544M544 384V544M544 384L704 384M384 544V704M384 544H224M544 544C544 632.366 472.366 704 384 704M544 544C632.366 544 704 472.366 704 384M384 704C295.634 704 224 632.366 224 544M224 544C135.634 544 64 472.366 64 384M64 384C64 295.634 135.634 224 224 224M224 224C224 135.634 295.634 64 384 64M384 64C472.366 64 544 135.634 544 224M544 224C632.366 224 704 295.634 704 384"
        stroke="currentColor"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default LogoMark;


