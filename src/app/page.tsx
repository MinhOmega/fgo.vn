import { getImages } from "./actions/image";
import HomeContent from "./components/home-content";

export const revalidate = 3600;

export default async function Home() {
  const images = await getImages();
  
  return <HomeContent initialImages={images} />;
}