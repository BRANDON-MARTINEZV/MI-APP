import { useState } from 'react';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const images = [
  {
    src: 'https://picsum.photos/id/1015/600/400',
    width: 4,
    height: 3,
  },
  {
    src: 'https://picsum.photos/id/1016/600/400',
    width: 4,
    height: 3,
  },
  {
    src: 'https://picsum.photos/id/1018/600/400',
    width: 4,
    height: 3,
  },
];

function MyGallery() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (_, { index }) => {
    setCurrentImage(index);
    setIsOpen(true);
  };

  return (
    <>
      <Gallery
        photos={images}
        onClick={openLightbox}
        margin={10}
        renderImage={({ photo }) => (
          <img
            {...photo}
            src={photo.src}
            loading="lazy"
            alt=""
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        )}
      />
      {isOpen && (
        <Lightbox
          mainSrc={images[currentImage].src}
          nextSrc={images[(currentImage + 1) % images.length].src}
          prevSrc={images[(currentImage + images.length - 1) % images.length].src}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setCurrentImage((currentImage + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setCurrentImage((currentImage + 1) % images.length)
          }
        />
      )}
    </>
  );
}

export default MyGallery;
