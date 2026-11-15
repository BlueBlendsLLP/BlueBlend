import { Router, Request, Response } from 'express';
import { BACKEND_PRODUCTS, getProductById } from '../data/products.ts';

const router = Router();

// GET /api/products - list all courses & digital products
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: BACKEND_PRODUCTS.length,
    products: BACKEND_PRODUCTS,
  });
});

// GET /api/products/:id - get single product
router.get('/:id', (req: Request, res: Response) => {
  const product = getProductById(req.params.id);
  if (!product) {
    res.status(404).json({
      success: false,
      error: `Product with ID "${req.params.id}" not found`,
    });
    return;
  }
  res.status(200).json({
    success: true,
    product,
  });
});

export default router;
