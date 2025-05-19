import React from 'react';
import styles from "../../../styles/Slider.module.scss";

interface NavigationDotsProps {
    pointsCoordinates: {
        left: string;
        top: string;
    }[];
    selectedSlideIndex: number;
    handlePointClick: (index: number) => void;
}

export const NavigationDots: React.FC<NavigationDotsProps> = ({ pointsCoordinates, selectedSlideIndex, handlePointClick }) => {
    return (
        <div className={styles.sliderPagination}>
            {pointsCoordinates.map((_, index) => (
                <div
                    key={index}
                    className={`${styles.paginationDot} ${index === selectedSlideIndex ? styles.active : ''}`}
                    onClick={() => handlePointClick(index)}
                />
            ))}
        </div>
    );
};