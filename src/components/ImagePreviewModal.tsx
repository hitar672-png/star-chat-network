import { X } from "lucide-react";

interface Props {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal = ({ imageUrl, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[200] flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-foreground bg-card/50 rounded-full p-2">
        <X className="w-6 h-6" />
      </button>
      <img
        src={imageUrl}
        alt="صورة الملف الشخصي"
        className="max-w-[90vw] max-h-[80vh] rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImagePreviewModal;
