import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X } from "lucide-react";

export interface MediaItemType {
  id: number;
  type: "image" | "video";
  title: string;
  desc: string;
  url: string;
  span: string;
}

interface MediaItemProps {
  item: MediaItemType;
  className?: string;
  onClick?: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ item, className, onClick }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    if (item.type !== "video") return;
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => setIsInView(e.isIntersecting)),
      { root: null, rootMargin: "50px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [item.type]);

  useEffect(() => {
    if (item.type !== "video") return;
    const el = videoRef.current;
    if (!el) return;
    let mounted = true;
    const play = async () => {
      if (!isInView || !mounted) return;
      try {
        if (el.readyState >= 3) {
          setIsBuffering(false);
          await el.play();
        } else {
          setIsBuffering(true);
          await new Promise<void>((resolve) => {
            el.oncanplay = () => resolve();
          });
          if (mounted) {
            setIsBuffering(false);
            await el.play();
          }
        }
      } catch (err) {
        console.warn("Video playback failed:", err);
      }
    };
    if (isInView) play();
    else el.pause();
    return () => {
      mounted = false;
    };
  }, [isInView, item.type]);

  if (item.type === "video") {
    return (
      <div className={`relative overflow-hidden ${className ?? ""}`} onClick={onClick}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          src={item.url}
        />
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={item.url}
      alt={item.title}
      loading="lazy"
      className={`h-full w-full object-cover ${className ?? ""}`}
      onClick={onClick}
    />
  );
};

interface GalleryModalProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[];
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          layoutId={`media-${selectedItem.id}`}
          className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-[16/10] w-full">
            <MediaItem item={selectedItem} className="h-full w-full" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-6 md:p-8">
              <h3 className="pointer-events-auto font-serif text-2xl text-background md:text-3xl">
                {selectedItem.title}
              </h3>
              <p className="pointer-events-auto mt-1 text-sm text-background/85 md:text-base">
                {selectedItem.desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Draggable dock */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.1}
          initial={dockPosition}
          animate={dockPosition}
          onDragEnd={(_e, info: PanInfo) => {
            setDockPosition((prev) => ({
              x: prev.x + info.offset.x,
              y: prev.y + info.offset.y,
            }));
          }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 touch-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-end gap-2 rounded-2xl bg-background/85 px-3 py-2 shadow-2xl backdrop-blur-md">
            {mediaItems.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                style={{
                  zIndex:
                    selectedItem.id === item.id ? 30 : mediaItems.length - index,
                }}
                className={`relative flex h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg sm:h-11 sm:w-11 md:h-12 md:w-12 ${
                  selectedItem.id === item.id
                    ? "ring-2 ring-accent shadow-lg"
                    : "hover:ring-2 hover:ring-foreground/30"
                }`}
                initial={{ rotate: index % 2 === 0 ? -10 : 10 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.15 : 1,
                  rotate:
                    selectedItem.id === item.id
                      ? 0
                      : index % 2 === 0
                        ? -10
                        : 10,
                  y: selectedItem.id === item.id ? -6 : 0,
                }}
                whileHover={{
                  scale: 1.25,
                  rotate: 0,
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
              >
                <MediaItem item={item} className="h-full w-full" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface InteractiveBentoGalleryProps {
  mediaItems: MediaItemType[];
  title?: string;
  description?: string;
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({
  mediaItems,
  title,
  description,
}) => {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [items, setItems] = useState<MediaItemType[]>(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h3 className="font-serif text-2xl text-foreground md:text-3xl">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-2 text-sm text-foreground/70 md:text-base">
              {description}
            </p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
            className="grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[140px] sm:gap-4 md:auto-rows-[170px] md:grid-cols-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                variants={{
                  hidden: { y: 40, scale: 0.95, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                    },
                  },
                }}
                whileHover={{ scale: 1.02 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_e, info) => {
                  setIsDragging(false);
                  const moveDistance = info.offset.x + info.offset.y;
                  if (Math.abs(moveDistance) > 50) {
                    const newItems = [...items];
                    const draggedItem = newItems[index];
                    const targetIndex =
                      moveDistance > 0
                        ? Math.min(index + 1, items.length - 1)
                        : Math.max(index - 1, 0);
                    newItems.splice(index, 1);
                    newItems.splice(targetIndex, 0, draggedItem);
                    setItems(newItems);
                  }
                }}
                onClick={() => !isDragging && setSelectedItem(item)}
                className={`group relative cursor-grab overflow-hidden rounded-2xl bg-background shadow-[0_15px_40px_-20px_rgba(15,23,42,0.35)] active:cursor-grabbing ${item.span}`}
              >
                <MediaItem item={item} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:p-5">
                  <h4 className="font-serif text-base text-background md:text-lg">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-background/85 md:text-sm">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveBentoGallery;
