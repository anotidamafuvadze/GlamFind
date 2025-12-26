import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ScrollView as RNScrollView,
  ViewStyle,
} from 'react-native';
import { cardDetails } from './CarouselConfig';
import CarouselItem from './CarouselItem';

/**
 * AutoplayCarousel
 * - Horizontally scrolling carousel with continuous auto-play animation
 */

type AutoplayCarouselProps = {
  style: ViewStyle | any;
};
export default function AutoplayCarousel({ style }: AutoplayCarouselProps) {
  const cards = Object.keys(cardDetails).map(
    key => cardDetails[Number(key) as keyof typeof cardDetails],
  );

  const scrollRef = useRef<RNScrollView | null>(null);
  const offsetRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const VISIBLE_COUNT = cards.length;

  // Continuous auto-scroll effect
  useEffect(() => {
    const speed = style.speed;

    function step(timestamp: number) {
      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;
      offsetRef.current += speed * delta;

      const resetThreshold =
        VISIBLE_COUNT *
        (style.carouselCard.width + style.carouselCard.marginRight);
      if (offsetRef.current >= resetThreshold) {
        offsetRef.current -= resetThreshold;
      }

      scrollRef.current?.scrollTo({ x: offsetRef.current, animated: false });
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTimestampRef.current = null;
    };
  }, [style.carouselCard.width, style.carouselCard.marginRight, VISIBLE_COUNT]);

  return (
    <View style={style.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.carouselTrack}
      >
        {/* Original card set */}
        {cards.map((card, index) => (
          <CarouselItem
            key={`original-${index}`}
            imgSource={card.img}
            style={style.carouselCard}
          />
        ))}

        {/* Duplicate card set */}
        {cards.map((card, index) => (
          <CarouselItem
            key={`duplicate-${index}`}
            imgSource={card.img}
            style={style.carouselCard}
          />
        ))}
      </ScrollView>
    </View>
  );
}
