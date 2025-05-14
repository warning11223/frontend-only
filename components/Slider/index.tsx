import 'swiper/css';
import gsap from 'gsap';
import "../../styles/Slider.scss";
import BottomCarousel from "../BottomCarousel";
import React, {useRef, useState, useEffect} from 'react';
import {slidesByOption} from "../../src/models/slides.ts";
import {useWindowWidth} from "../../utils/useWindowWidth.ts";

const Slider: React.FC = () => {
    const circleRef = useRef<HTMLDivElement>(null);
    const pointsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    const width = useWindowWidth();

    // Индекс выбранного слайда (от 0 до 5)
    const [selectedSlideIndex, setSelectedSlideIndex] = useState(5);
    // Отслеживание анимации
    const [isAnimating, setIsAnimating] = useState(false);

    const points = [1, 2, 3, 4, 5, 6];
    const pointsCount = points.length;

    // Угол для активной точки (справа сверху)
    //const activeAngle = -60;

    // Вычисляем координаты точек на круге
    const radius = width <= 1440 ? 215 : 265;
    const pointsCoordinates = points.map((_, index) => {
        const angleDeg = index * 360 / pointsCount;
        const angleRad = angleDeg * Math.PI / 180;
        return {
            left: `calc(50% + ${radius * Math.cos(angleRad)}px)`,
            top: `calc(50% + ${radius * Math.sin(angleRad)}px)`,
        };
    });

    const slides = slidesByOption[selectedSlideIndex] || [];

    const [firstYear, setFirstYear] = useState(slides[0]?.title); // Пример значения года
    const [lastYear, setLastYear] = useState(slides[slides.length - 1]?.title);

    const leftNumberRef = useRef<HTMLParagraphElement>(null);
    const rightNumberRef = useRef<HTMLParagraphElement>(null);
    const prevFirstYear = useRef<number | null>(null);
    const prevLastYear = useRef<number | null>(null);

    useEffect(() => {
        if (slides) {
            setFirstYear(slides[0]?.title);
            setLastYear(slides[slides.length - 1]?.title);
        }
    }, [slides])

    useEffect(() => {
        const currentFirstYear = parseInt(firstYear || '0', 10);
        const currentLastYear = parseInt(lastYear || '0', 10);

        if (
            prevFirstYear.current !== null &&
            prevLastYear.current !== null &&
            leftNumberRef.current &&
            rightNumberRef.current
        ) {
            // Анимируем первый год
            gsap.fromTo(
                leftNumberRef.current,
                {
                    innerText: prevFirstYear.current,
                    opacity: 1
                },
                {
                    innerText: currentFirstYear,
                    duration: 0.8,
                    ease: 'power1.inOut',
                    snap: {innerText: 1},
                    onUpdate: function () {
                        if (leftNumberRef.current) {
                            leftNumberRef.current.textContent = Math.floor(parseFloat(this.targets()[0].innerText)).toString();
                        }
                    }
                }
            );

            // Анимируем второй год
            gsap.fromTo(
                rightNumberRef.current,
                {
                    innerText: prevLastYear.current,
                    opacity: 1
                },
                {
                    innerText: currentLastYear,
                    duration: 0.8,
                    ease: 'power1.inOut',
                    snap: {innerText: 1},
                    onUpdate: function () {
                        if (rightNumberRef.current) {
                            rightNumberRef.current.textContent = Math.floor(parseFloat(this.targets()[0].innerText)).toString();
                        }
                    }
                }
            );
        } else if (leftNumberRef.current && rightNumberRef.current) {
            leftNumberRef.current.textContent = currentFirstYear.toString();
            rightNumberRef.current.textContent = currentLastYear.toString();
        }

        prevFirstYear.current = currentFirstYear;
        prevLastYear.current = currentLastYear;
    }, [firstYear, lastYear]);

    // // Начальное положение круга, чтобы активная точка была справа сверху
    // const getRotationForSlide = (slideIndex: number) => {
    //     return activeAngle - (slideIndex * (360 / pointsCount));
    // };

    // Устанавливаем начальный поворот круга
    // useEffect(() => {
    //     if (circleRef.current) {
    //         const initialRotation = getRotationForSlide(selectedSlideIndex);
    //         gsap.set(circleRef.current, {rotation: initialRotation});
    //
    //         pointsRef.current.forEach((pointRef) => {
    //             if (pointRef) {
    //                 gsap.set(pointRef, {rotation: -initialRotation});
    //             }
    //         });
    //     }
    // }, []);

    // Функция для определения кратчайшего пути вращения
    const getShortestRotationPath = (from: number, to: number) => {
        const fromAngle = (from * 360 / pointsCount) % 360;
        const toAngle = (to * 360 / pointsCount) % 360;

        const clockwiseDiff = (fromAngle - toAngle + 360) % 360;

        const counterClockwiseDiff = (toAngle - fromAngle + 360) % 360;

        if (clockwiseDiff < counterClockwiseDiff) {
            return {
                direction: 'clockwise',
                steps: Math.round(clockwiseDiff / (360 / pointsCount))
            };
        } else {
            return {
                direction: 'counterclockwise',
                steps: Math.round(counterClockwiseDiff / (360 / pointsCount))
            };
        }
    };

    // Вращение круга по часовой стрелке
    const rotateClockwise = (steps: number) => {
        if (!circleRef.current || isAnimating) return;

        setIsAnimating(true);

        const currentRotation = gsap.getProperty(circleRef.current, "rotation") as number || 0;

        const targetRotation = currentRotation - (steps * 360 / pointsCount);

        gsap.to(circleRef.current, {
            rotation: targetRotation,
            duration: 0.5 * Math.min(steps, 3),
            ease: "power1.inOut",
            onComplete: () => {
                setIsAnimating(false);
            }
        });

        // Противоположное вращение для точек
        pointsRef.current.forEach((pointRef) => {
            if (pointRef) {
                const currentPointRotation = gsap.getProperty(pointRef, "rotation") as number || 0;
                gsap.set(pointRef, {
                    rotation: currentPointRotation + (steps * 360 / pointsCount),
                    duration: 0.5 * Math.min(steps, 3),
                    ease: "power1.inOut",
                });
            }
        });

        setSelectedSlideIndex((prev) => (prev + steps) % pointsCount);
    };

    // Вращение против часовой стрелки
    const rotateCounterClockwise = (steps: number) => {
        if (!circleRef.current || isAnimating) return;

        setIsAnimating(true);

        const currentRotation = gsap.getProperty(circleRef.current, "rotation") as number || 0;

        const targetRotation = currentRotation + (steps * 360 / pointsCount);

        gsap.to(circleRef.current, {
            rotation: targetRotation,
            duration: 0.5 * Math.min(steps, 3),
            ease: "power1.inOut",
            onComplete: () => {
                setIsAnimating(false);
            }
        });

        pointsRef.current.forEach((pointRef) => {
            if (pointRef) {
                const currentPointRotation = gsap.getProperty(pointRef, "rotation") as number || 0;
                gsap.set(pointRef, {
                    rotation: currentPointRotation - (steps * 360 / pointsCount),
                    duration: 0.5 * Math.min(steps, 3),
                    ease: "power1.inOut",
                });
            }
        });

        setSelectedSlideIndex((prev) => (prev - steps + pointsCount) % pointsCount);
    };

    // Обработчик клика на точку
    const handlePointClick = (index: number) => {
        if (index === selectedSlideIndex || isAnimating) return;

        // Определяем оптимальный путь вращения
        const path = getShortestRotationPath(index, selectedSlideIndex);

        if (path.direction === 'clockwise') {
            rotateClockwise(path.steps);
        } else {
            rotateCounterClockwise(path.steps);
        }
    };

    const handlePrev = () => {
        if (isAnimating) return;
        rotateCounterClockwise(1);
    };

    const handleNext = () => {
        if (isAnimating) return;
        rotateClockwise(1);
    };

    // Массив ссылок на все точки
    const pointRefs = useRef<(HTMLDivElement | null)[]>([]);

    return (
        <div className="slider-wrapper">
            <div className="timeline-slider-container">
                <div className="slider-title">
                    <p>Исторические <br/> даты</p>
                </div>

                <div className="circle-container">
                    <div className="active-years">
                        <p ref={leftNumberRef} className="left-number">{firstYear}</p>
                        <p ref={rightNumberRef} className="right-number">{lastYear}</p>
                    </div>

                    <div
                        ref={circleRef}
                        className="timeline-circle"
                    >
                        {pointsCoordinates.map((coords, index) => {
                            const isActive = index === selectedSlideIndex;

                            return (
                                <div
                                    key={index}
                                    ref={el => {
                                        pointsRef.current[index] = el;
                                        pointRefs.current[index] = el;
                                    }}
                                    className={isActive ? 'active-point' : 'circle-point'}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        left: coords.left,
                                        top: coords.top,
                                        transform: 'translate(-50%, -50%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onClick={() => handlePointClick(index)}
                                    onMouseEnter={() => setHoveredPoint(index)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                >
                                    {(isActive || hoveredPoint === index) && (
                                        <div className={isActive ? "circle-with-number" : "circle-with-number-hover"}>
                                            {isActive && !isAnimating && (
                                                <p className="circle-with-number-desc">Наука</p>
                                            )}
                                            {index + 1}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="center-line horizontal-line"></div>
                    <div className="center-line vertical-line"></div>
                </div>

                <div className="navigation-buttons-wrapper">
                    <div className="mobile-carousel">
                        <BottomCarousel
                            isAnimating={isAnimating}
                            slides={slides}
                            width={width}
                        />
                    </div>
                    <p className="amount">
                        {`0${selectedSlideIndex + 1}/06`}
                    </p>

                    <div className="navigation-buttons">
                        <button onClick={handlePrev}>
                            <img src="/icons/left.svg" alt="arrow-left"/>
                        </button>
                        <button onClick={handleNext}>
                            <img src="/icons/right.svg" alt="arrow-right"/>
                        </button>
                    </div>

                    <div className="slider-pagination">
                        {pointsCoordinates.map((_, index) => (
                            <div
                                key={index}
                                className={`pagination-dot ${index === selectedSlideIndex ? 'active' : ''}`}
                                onClick={() => handlePointClick(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="pc-carousel">
                <BottomCarousel
                    isAnimating={isAnimating}
                    slides={slides}
                    width={width}
                />
            </div>
        </div>
    );
};

export default Slider;