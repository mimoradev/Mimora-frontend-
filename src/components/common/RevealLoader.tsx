import { motion } from 'framer-motion';

interface RevealLoaderProps {
    isLoading: boolean;
}

/**
 * A splash screen using the provided Mimora branding image asset.
 * The reveal animation shrinks this overlay away to show the app beneath.
 */
export const RevealLoader = ({ isLoading }: RevealLoaderProps) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                backgroundColor: '#F5A3B5', // Lighter pink matching the design
                pointerEvents: isLoading ? 'auto' : 'none',
                overflow: 'hidden',
            }}
            initial={{ clipPath: 'circle(150% at 50% 50%)' }}
            animate={{
                clipPath: isLoading
                    ? 'circle(150% at 50% 50%)'
                    : 'circle(0% at 50% 50%)',
            }}
            transition={{
                duration: 1.8,
                ease: [0.65, 0, 0.35, 1],
            }}
        >
            {/* Container to keep text and logo grouped together */}
            <div className="flex flex-col items-center">
                {/* "Welcome to" text - close to the logo */}

                {/* Use the provided image asset for the branding */}
                <motion.img
                    src="/info/landing/443d6909a040c5bf3abdba7e5190edcaa39816eb (1).webp"
                    alt="Mimora"
                    className="w-[250px] md:w-[350px] lg:w-[450px] h-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                />
            </div>
        </motion.div>
    );
};
