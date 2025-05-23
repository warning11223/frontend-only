import gsap from "gsap";
import {Navigation} from "swiper/modules";
import React, {useEffect, useRef} from 'react';
import {Swiper, SwiperSlide} from "swiper/react";

import styles from "../../../styles/Slider.module.scss"

interface Props {
    isAnimating: boolean,
    width: number,
    slides: Array<{
        id: number;
        title: string;
        text: string;
    }>,
}

const BottomCarousel: React.FC<Props> = ({isAnimating, slides, width}) => {
    const heightValue = width <= 768 ? "192.2px" : "216px";

    const swiperContainerRef = useRef<HTMLDivElement>(null);

    // Анимация при изменении isAnimating
    useEffect(() => {
        if (swiperContainerRef.current) {
            if (isAnimating) {
                gsap.to(swiperContainerRef.current, {
                    opacity: 0,
                    y: 30,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(swiperContainerRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.3
                });
            }
        }
    }, [isAnimating]);

    return (
        <div
            className={styles.swiperContainer}
            ref={swiperContainerRef}
            style={{
                visibility: isAnimating ? 'hidden' : 'visible',
                height: isAnimating ? heightValue : 'auto',
                pointerEvents: isAnimating ? 'none' : 'auto'
            }}
        >
            {!isAnimating && (
                <>
                    <div className={`${styles.swiperButtonPrev} custom-prev-button`}>
                        <img src={`${import.meta.env.BASE_URL}icons/left.svg`} alt="arrow-left"/>
                    </div>
                    <div className={`${styles.swiperButtonNext} custom-next-button`}>
                        <img src={`${import.meta.env.BASE_URL}icons/right.svg`} alt="arrow-right"/>
                    </div>


                    {width <= 768 && (
                        <p className={styles.mobile}>Наука</p>
                    )}

                    <Swiper
                        spaceBetween={50}
                        className={styles.bottomSlider}
                        navigation={{
                            prevEl: '.custom-prev-button',
                            nextEl: '.custom-next-button',
                        }}
                        modules={[Navigation]}
                        breakpoints={{
                            320: {
                                slidesPerView: 1.5,
                                spaceBetween: 20
                            },
                            540: {
                                slidesPerView: 2,
                                spaceBetween: 30
                            },
                            768: {
                                slidesPerView: 2.5,
                                spaceBetween: 40
                            },
                            1024: {
                                slidesPerView: 3.5,
                                spaceBetween: 50
                            }
                        }}>
                        {slides.map(slide => (
                            <SwiperSlide
                                className={styles.bottomSliderSlide}
                                key={slide.id}>
                                <p className={styles.bottomSliderSlideTitle}>{slide.title}</p>
                                <p className={styles.bottomSliderSlideText}>{slide.text}</p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </div>
    );
};

export default BottomCarousel;