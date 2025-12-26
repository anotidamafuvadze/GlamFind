import { ImageSourcePropType } from "react-native";

export interface CardDetail {
  img: ImageSourcePropType;
}

/**
 * Carousel card metadata
 * - Maps carousel indices to image sources
 */

// TODO: Make sure all images are perfect
export const cardDetails: Record<number, CardDetail> = {
  0: { img: require("../../../assets/images/carousel/carousel-item-0.jpg") },
  1: { img: require("../../../assets/images/carousel/carousel-item-1.jpg") },
  2: { img: require("../../../assets/images/carousel/carousel-item-2.jpg") },
  3: { img: require("../../../assets/images/carousel/carousel-item-3.jpg") },
  4: { img: require("../../../assets/images/carousel/carousel-item-4.jpg") },
  5: { img: require("../../../assets/images/carousel/carousel-item-5.jpg") },
  6: { img: require("../../../assets/images/carousel/carousel-item-6.jpg") },
  7: { img: require("../../../assets/images/carousel/carousel-item-7.jpg") },
  8: { img: require("../../../assets/images/carousel/carousel-item-8.jpg") },
  9: { img: require("../../../assets/images/carousel/carousel-item-9.jpg") },
  10: { img: require("../../../assets/images/carousel/carousel-item-10.jpg") },
  11: { img: require("../../../assets/images/carousel/carousel-item-11.jpg") },
};
