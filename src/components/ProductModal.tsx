import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import { CartProduct } from '../types';
import { useTranslation } from 'react-i18next';

const LICENSE_OPTIONS = [
  { value: 'one_week', labelKey: 'license_one_week', priceKey: 'price_one_week' },
  { value: 'one_month', labelKey: 'license_one_month', priceKey: 'price_one_month' },
  { value: 'three_months', labelKey: 'license_three_months', priceKey: 'price_three_months' },
  { value: 'lifetime', labelKey: 'license_lifetime', priceKey: 'price_lifetime' },
];

function getImageUrl(image?: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/static')) return `http://localhost:8000${image}`;
  return `http://localhost:8000/static/${image.replace(/^\/?static\/?/, '')}`;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: rgba(0, 0, 0, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 800px;
  width: 100%;
  position: relative;
  border: 1px solid rgba(0, 255, 157, 0.3);
  display: flex;
  gap: 30px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #00ff9d;
  }
`;

const ProductImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 15px;
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductTitle = styled.h2`
  color: white;
  font-size: 2rem;
  margin: 0;
`;

const Price = styled.p`
  color: #00ff9d;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
`;

const Description = styled.div`
  color: #ccc;
  line-height: 1.6;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 8px;
    font-size: 0.95rem;
  }
`;

const FeaturesList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const FeatureItem = styled.li`
  color: #fff;
  font-size: 1rem;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
`;

const SelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0 0 0;
  flex-wrap: wrap;
`;

const LicenseButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const LicenseButton = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? 'rgba(0,255,157,0.15)' : 'rgba(255,255,255,0.05)')};
  border: 2px solid ${({ selected }) => (selected ? '#00ff9d' : '#333')};
  color: ${({ selected }) => (selected ? '#00ff9d' : '#fff')};
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  min-width: 100px;
  &:hover {
    border-color: #00ff9d;
    background: rgba(0,255,157,0.08);
    color: #00ff9d;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const QuantityButton = styled.button`
  background: rgba(0, 255, 157, 0.2);
  border: 1px solid rgba(0, 255, 157, 0.3);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
  &:hover {
    background: rgba(0, 255, 157, 0.3);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 157, 0.3);
  color: white;
  text-align: center;
  width: 80px;
  height: 40px;
  border-radius: 8px;
  font-size: 1.1rem;
  &:focus {
    outline: none;
    border-color: #00ff9d;
  }
`;

const AddToCartButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: black;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
  }
`;

const ProductModal: React.FC = () => {
  const { t } = useTranslation();
  const { state: modalState, closeProductModal } = useModal();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [licenseType, setLicenseType] = useState('one_week');

  if (!modalState.selectedProduct) return null;

  function getCurrentPrice() {
    if (!modalState.selectedProduct) return 0;
    const key = LICENSE_OPTIONS.find((opt) => opt.value === licenseType)?.priceKey;
    if (key && Object.prototype.hasOwnProperty.call(modalState.selectedProduct, key)) {
      const value = (modalState.selectedProduct as any)[key];
      if (typeof value === 'number') {
        return value;
      }
    }
    return modalState.selectedProduct.price || 0;
  }

  const handleClose = () => {
    closeProductModal();
    setQuantity(1);
    setLicenseType('one_week');
  };

  const handleAddToCart = () => {
    if (!modalState.selectedProduct) return;
    const cartProduct: CartProduct = {
      ...modalState.selectedProduct,
      id: modalState.selectedProduct.id || '',
      keyType: licenseType,
      keyPrice: getCurrentPrice(),
    };
    addToCart(cartProduct, quantity);
    handleClose();
  };

  const imageUrl = getImageUrl(modalState.selectedProduct.image_url);
  const descriptionLines = (modalState.selectedProduct.description || '')
    .split(/\r?\n|\.|·|•|\*/g)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <AnimatePresence>
      {modalState.isProductModalOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={handleClose}>&times;</CloseButton>
            <ProductImage src={imageUrl} alt={modalState.selectedProduct.product_name} />
            <ProductInfo>
              <ProductTitle>{modalState.selectedProduct.product_name}</ProductTitle>
              <Price>${getCurrentPrice().toLocaleString('es-CO')}</Price>
              <Description>
                {descriptionLines.length > 0 && (
                  <ul>
                    {descriptionLines.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
                {modalState.selectedProduct.features && (
                  <FeaturesList>
                    {modalState.selectedProduct.features.map((feature, idx) => (
                      <FeatureItem key={idx}>{feature}</FeatureItem>
                    ))}
                  </FeaturesList>
                )}
              </Description>
              <SelectorRow>
                <LicenseButtonGroup>
                  {LICENSE_OPTIONS.map(opt => (
                    <LicenseButton
                      key={opt.value}
                      selected={licenseType === opt.value}
                      onClick={() => setLicenseType(opt.value)}
                      type="button"
                    >
                      {t(opt.labelKey)}
                    </LicenseButton>
                  ))}
                </LicenseButtonGroup>
                <QuantitySelector>
                  <QuantityButton onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</QuantityButton>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <QuantityButton onClick={() => setQuantity(q => q + 1)}>+</QuantityButton>
                </QuantitySelector>
              </SelectorRow>
              <AddToCartButton onClick={handleAddToCart}>
                {t('add_to_cart')}
              </AddToCartButton>
            </ProductInfo>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;