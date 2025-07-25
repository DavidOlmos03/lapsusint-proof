import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useModal } from '../context/ModalContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function getImageUrl(image?: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/static')) return `http://localhost:8000${image}`;
  return `http://localhost:8000/static/${image.replace(/^\/?static\/?/, '')}`;
}

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(0, 255, 157, 0.1);
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 255, 157, 0.3);
    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.2);
  }
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 8px;
`;

const ProductTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const Price = styled.p`
  color: #00ff9d;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const AdminActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 12px;
`;

const AdminButton = styled.button`
  background: #181818;
  border: 1px solid #00ff9d;
  color: #00ff9d;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  &:hover {
    background: #00ff9d;
    color: #181818;
  }
`;

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const { openProductModal } = useModal();
  const { t } = useTranslation();

  const handleCardClick = () => {
    openProductModal(product);
  };

  return (
    <Card whileHover={{ scale: 1.03 }} onClick={handleCardClick}>
      <ProductImage src={getImageUrl(product.image_url)} alt={product.product_name} />
      <ProductTitle>{product.product_name}</ProductTitle>
      <Price>${product.price.toLocaleString('es-CO')}</Price>
      {isAdmin && (
        <AdminActions>
          <AdminButton onClick={e => { e.stopPropagation(); onEdit && onEdit(product); }}>
            <FaEdit /> {t('edit')}
          </AdminButton>
          <AdminButton onClick={e => { e.stopPropagation(); onDelete && onDelete(product); }}>
            <FaTrash /> {t('delete')}
          </AdminButton>
        </AdminActions>
      )}
    </Card>
  );
};

export default ProductCard;