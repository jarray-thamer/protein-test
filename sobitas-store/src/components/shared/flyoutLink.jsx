"use client"

import {useState} from "react";
import { AnimatePresence, motion } from "framer-motion";

const FlyoutLink = (props) => {
    const { children, FlyoutContent } = props;

    const [open, setOpen] = useState(false);
    const showFlyout = FlyoutContent && open
    return (
        <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="relative"
        >
            <>{children}</>
            <AnimatePresence>
                {showFlyout && (
                    <motion.div
                        initial={{opacity: 0 }}
                        animate={{opacity: 1 }}
                        exit={{opacity: 0 }}
                        style={{translateX: "-85%"}}
                        transition={{duration: 0.1, ease: "easeInOut"}}
                        className="absolute left-1/2 top-12 bg-white shadow-xl w-72"
                    >
                        <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent"/>
                        <FlyoutContent />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FlyoutLink;
