import { createGlobalState } from "react-hooks-global-state";

const initialState = { 
  photoId: null as string | null,
  viewedImageIndex: null as number | null 
};

const { useGlobalState } = createGlobalState(initialState);

export const useLastViewedPhoto = () => {
  const [photoId, setPhotoId] = useGlobalState("photoId");
  const [viewedImageIndex, setViewedImageIndex] = useGlobalState("viewedImageIndex");

  return {
    photoId,
    setPhotoId,
    viewedImageIndex,
    setViewedImageIndex
  };
};
