import React from 'react';

interface SkeletonProps {
    variant?: 'text' | 'card' | 'button' | 'circle';
    className?: string;
    width?: string;
    height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    className = '',
    width,
    height
}) => {
    const baseClasses = 'skeleton rounded';

    const variantClasses = {
        text: 'h-4 w-full',
        card: 'h-24 w-full rounded-lg',
        button: 'h-10 w-24 rounded-md',
        circle: 'h-10 w-10 rounded-full'
    };

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

interface SkeletonGroupProps {
    count?: number;
    variant?: SkeletonProps['variant'];
    className?: string;
    gap?: string;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
    count = 3,
    variant = 'text',
    className = '',
    gap = 'gap-3'
}) => {
    return (
        <div className={`flex flex-col ${gap} ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} variant={variant} />
            ))}
        </div>
    );
};

export default Skeleton;
