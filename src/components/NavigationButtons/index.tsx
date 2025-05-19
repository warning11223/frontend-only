import React from 'react';
import styles from "../../../styles/Slider.module.scss";

interface NavigationButtonsProps {
    handlePrev: () => void;
    handleNext: () => void;
    selectedSlideIndex: number;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({handlePrev, handleNext, selectedSlideIndex}) => {
    return (
        <div className={styles.navigationButtons}>
            <button
                onClick={handlePrev}
                className={selectedSlideIndex === 0 ? styles.disabledButton : ""}
            >
                <img src={`${import.meta.env.BASE_URL}icons/left.svg`} alt="arrow-left"/>
            </button>
            <button
                onClick={handleNext}
                className={selectedSlideIndex === 5 ? styles.disabledButton : ""}
            >
                <img src={`${import.meta.env.BASE_URL}icons/right.svg`} alt="arrow-right"/>
            </button>
        </div>
    );
};