"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZThlMGRkIi8+PC9zdmc+";
export default function ProgressiveImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false); const [failed, setFailed] = useState(false);
  const { className = "", onLoad, onError, ...rest } = props;
  return <Image {...rest} src={failed ? blurDataURL : props.src} placeholder="blur" blurDataURL={blurDataURL} quality={75} className={`${className} progressive-image ${loaded ? "image-ready" : "image-pending"}`} onLoad={e=>{setLoaded(true);onLoad?.(e);}} onError={e=>{setFailed(true);setLoaded(true);onError?.(e);}} />;
}
