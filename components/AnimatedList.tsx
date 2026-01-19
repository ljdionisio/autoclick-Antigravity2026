import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedListProps {
    children: React.ReactNode[];
    className?: string;
    staggerDelay?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
    children,
    className = '',
    staggerDelay = 0.05
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: 'easeOut' }
        }
    };

    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {React.Children.map(children, (child, index) => (
                <motion.div key={index} variants={itemVariants}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default AnimatedList;
