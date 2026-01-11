import React, { useEffect, useRef } from 'react';
import { View, ScrollView, ViewStyle, ImageStyle } from 'react-native';

// Local imports
import { cardDetails } from './CarouselConfig';
import CarouselItem from './CarouselItem';

type AutoplayCarouselProps = {
  style: {
    container: ViewStyle;
    track: ViewStyle;
    card: ViewStyle & {
      width: number;
      marginRight: number;
      image: ImageStyle;
    };
    speed: number;
  };
};

/**
 * AutoplayCarousel component
 * - Horizontally scrolling carousel with continuous auto-play animation
 */
export default function AutoplayCarousel({ style }: AutoplayCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const cards = Object.keys(cardDetails).map(
    key => cardDetails[Number(key) as keyof typeof cardDetails],
  );

  const VISIBLE_COUNT = cards.length;
  const RESET_THRESHOLD =
    VISIBLE_COUNT * (style.card.width + style.card.marginRight);

  // Continuous auto-scroll effect
  useEffect(() => {
    const speed = style.speed;

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      offsetRef.current += speed * delta;

      // Reset position when reaching threshold
      if (offsetRef.current >= RESET_THRESHOLD) {
        offsetRef.current -= RESET_THRESHOLD;
      }

      scrollRef.current?.scrollTo({
        x: offsetRef.current,
        animated: false,
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTimestampRef.current = null;
    };
  }, [
    style.card.width,
    style.card.marginRight,
    RESET_THRESHOLD,
    style.speed,
  ]);

  return (
    <View style={style.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.track}
      >
        {/* Original Card Set */}
        {cards.map((card, index) => (
          <CarouselItem
            key={`original-${index}`}
            imgSource={card.img}
            style={style.card}
          />
        ))}

        {/* Duplicate Card Set (for seamless looping) */}
        {cards.map((card, index) => (
          <CarouselItem
            key={`duplicate-${index}`}
            imgSource={card.img}
            style={style.card}
          />
        ))}
      </ScrollView>
    </View>
  );
}
