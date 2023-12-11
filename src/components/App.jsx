import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Searchbar } from './Searchbar/Searchbar';
import { FetchImages } from './ImageApiService';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { MyLoader } from './Loader/Loader';

export const App = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const newImages = await FetchImages(query, page, 12);

        setImages((prevImages) => [...prevImages, ...newImages.hits]);
        setLoadMore(page < Math.ceil(newImages.totalHits / 12));
      } catch (error) {
        setError(error.message);
        setLoadMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    handleSearch();
  }, [query, page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearchbarSubmit = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchbarSubmit} />
      {isLoading && <MyLoader />}
      {error && <p>Error fetching images</p>}
      {images.length > 0 && <ImageGallery images={images} onSelect={handleImageSelect} />}
      {loadMore && <Button currentPage={page} onLoadMore={handleLoadMore} isLoading={isLoading} />}
      {selectedImage && <Modal image={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

App.propTypes = {
  images: PropTypes.array,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  page: PropTypes.number,
  query: PropTypes.string,
  selectedImage: PropTypes.object,
  loadMore: PropTypes.bool,
};

