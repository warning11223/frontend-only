import styles from "../../../styles/Slider.module.scss";
import React, {useRef, useState} from "react";

interface PointCoordinates {
    left: string;
    top: string;
}

interface SliderCircleProps {
    leftNumberRef: React.RefObject<HTMLParagraphElement | null>;
    rightNumberRef: React.RefObject<HTMLParagraphElement | null>;
    firstYear: string | number;
    lastYear: string | number;
    circleRef: React.RefObject<HTMLDivElement | null>;
    pointsCoordinates: PointCoordinates[];
    selectedSlideIndex: number;
    pointsRef: {
        current: (HTMLDivElement | null)[]
    };
    handlePointClick: (index: number) => void;
    isAnimating: boolean;
}


export const SliderCircle: React.FC<SliderCircleProps> = ({
                                 leftNumberRef,
                                 rightNumberRef,
                                 firstYear,
                                 lastYear,
                                 circleRef,
                                 pointsCoordinates,
                                 selectedSlideIndex,
                                 pointsRef,
                                 handlePointClick,
                                 isAnimating
}) => {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    // Массив ссылок на все точки
    const pointRefs = useRef<(HTMLDivElement | null)[]>([]);

    return (
        <div className={styles.circleContainer}>
            <div className={styles.activeYears}>
                <p ref={leftNumberRef} className={styles.leftNumber}>{firstYear}</p>
                <p ref={rightNumberRef} className={styles.rightNumber}>{lastYear}</p>
            </div>

            <div
                ref={circleRef}
                className={styles.timelineCircle}
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
                            className={`${isActive ? styles.activePoint : styles.circlePoint} ${styles.defaultPoint}`}
                            style={{
                                left: coords.left,
                                top: coords.top,
                            }}
                            onClick={() => handlePointClick(index)}
                            onMouseEnter={() => setHoveredPoint(index)}
                            onMouseLeave={() => setHoveredPoint(null)}
                        >
                            {(isActive || hoveredPoint === index) && (
                                <div
                                    className={`${isActive ? styles.circleWithNumber : styles.circleWithNumberHover}`}>
                                    {isActive && !isAnimating && (
                                        <p className={styles.circleWithNumberDesc}>Наука</p>
                                    )}
                                    {index + 1}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={`${styles.centerLine} ${styles.horizontalLine}`}></div>
            <div className={`${styles.centerLine} ${styles.verticalLine}`}></div>
        </div>
    );
};