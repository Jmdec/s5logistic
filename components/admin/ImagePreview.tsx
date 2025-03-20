
const ImagePreview = ({ previewImages }: { previewImages: string[] }) => {
    return (
      <div className="mt-2">
        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-auto rounded shadow"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

export default ImagePreview