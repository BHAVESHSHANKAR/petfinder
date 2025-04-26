import React, { useState, useEffect } from 'react';
import { Carousel, Image, Spin } from 'antd';
import { motion } from 'framer-motion';
import styles from './PetCarousel.module.css';

const PetCarousel = () => {
  const [loading, setLoading] = useState(true);

  // Array of pet images using reliable direct URLs
  const petImages = [
    {
      url: 'https://unsplash.com/photos/brown-cat-on-wooden-floor-usTb7ZMa6QI',
      alt: 'Dog with tilted head',
      caption: 'Curious and playful companion'
    },
    {
      url: 'https://source.unsplash.com/featured/?cat,kitten',
      alt: 'Cat with green eyes',
      caption: 'Elegant and mysterious feline'
    },
    {
      url: 'https://source.unsplash.com/featured/?puppy,golden',
      alt: 'Golden retriever puppy',
      caption: 'Loyal friend for life'
    },
    {
      url: 'https://source.unsplash.com/featured/?dog,outdoor',
      alt: 'Happy dog outdoors',
      caption: 'Adventure buddy ready for action'
    },
    {
      url: 'https://source.unsplash.com/featured/?cat,relaxing',
      alt: 'Cat relaxing',
      caption: 'Master of relaxation'
    },
    {
      url: 'https://source.unsplash.com/featured/?corgi,dog',
      alt: 'Corgi dog',
      caption: 'Small dog with a big personality'
    },
    {
      url: 'https://source.unsplash.com/featured/?cat,dog,together',
      alt: 'Cat and dog together',
      caption: 'Unlikely friendships are the best'
    },
    {
      url: 'https://source.unsplash.com/featured/?kitten,playing',
      alt: 'Kitten playing',
      caption: 'Playful and full of energy'
    },
    {
      url: 'https://source.unsplash.com/featured/?dog,ball',
      alt: 'Dog with ball',
      caption: 'Always ready to play fetch'
    },
    {
      url: 'https://source.unsplash.com/featured/?cat,hiding',
      alt: 'Cat hiding',
      caption: 'Finding the perfect hiding spot'
    }
  ];

  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  return (
    <div className={styles.carouselSection}>
      <div className={styles.carouselBackground}></div>
      <motion.div 
        className={styles.carouselContainer}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
            <p>Loading amazing pet photos...</p>
          </div>
        ) : (
          <Carousel
            autoplay
            effect="fade"
            dots={true}
            pauseOnHover
            className={styles.carousel}
            autoplaySpeed={3000}
            dotPosition="bottom"
          >
            {petImages.map((image, index) => (
              <div key={index} className={styles.carouselSlide}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    preview={false}
                    fallback="https://placehold.co/600x400/FFD8CC/333333?text=Pet+Image"
                    className={styles.carouselImage}
                    placeholder={
                      <div className={styles.imagePlaceholder}>
                        <Spin />
                      </div>
                    }
                  />
                  <div className={styles.imageCaption}>
                    <h3>{image.caption}</h3>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )}
        <div className={styles.carouselText}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Our Furry Friends Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Every pet deserves love, care, and a forever home. Browse through our gallery of adorable companions.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default PetCarousel;
