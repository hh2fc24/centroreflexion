"use client";

import { motion } from "framer-motion";
import * as React from "react";
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";

export const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    },
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const scaleOnHover = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
};

type MotionDivProps = ComponentPropsWithRef<typeof motion.div> & { delay?: number };

export const MotionDiv = React.forwardRef<HTMLDivElement, MotionDivProps>(
    ({ children, className, delay = 0, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                transition={{ delay }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
MotionDiv.displayName = "MotionDiv";

type MotionListProps = ComponentPropsWithoutRef<typeof motion.div>;

export function MotionList({ children, className, ...props }: MotionListProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

type MotionItemProps = ComponentPropsWithoutRef<typeof motion.div>;

export function MotionItem({ children, className, ...props }: MotionItemProps) {
    return (
        <motion.div variants={fadeIn} className={className} {...props}>
            {children}
        </motion.div>
    );
}
