"use client";

import { motion } from "framer-motion";

export const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
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

export function MotionDiv({ children, className, delay = 0, ...props }: any) {
    return (
        <motion.div
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

export function MotionList({ children, className, ...props }: any) {
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

export function MotionItem({ children, className, ...props }: any) {
    return (
        <motion.div variants={fadeIn} className={className} {...props}>
            {children}
        </motion.div>
    );
}
