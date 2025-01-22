"use cache";

import { getImages } from "./actions/image";
import HomeContent from "./components/home-content";
import { unstable_cacheLife as cacheLife } from 'next/cache'

export default async function Home() {
  cacheLife('days')
  const images = await getImages();

  return <HomeContent initialImages={images} />;
}
