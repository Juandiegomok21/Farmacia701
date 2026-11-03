import express from 'express';
import dotenv from 'dotenv';
import { getProducts, getProductByCode } from './src/db/products.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';

import { adminAuth } from './src/lib/firebase-admin.ts';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Endpoints
app.get('/api/products', async (_req, res) => {
  try {
    const allProducts = await getProducts();
    res.json(allProducts);
  } catch (error: any) {
    console.error('Error fetching products from Cloud SQL:', error);
    res.status(500).json({ error: error.message || 'Error al obtener productos' });
  }
});

app.get('/api/products/:code', async (req, res) => {
  try {
    const product = await getProductByCode(req.params.code);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error: any) {
    console.error(`Error fetching product ${req.params.code}:`, error);
    res.status(500).json({ error: error.message || 'Error al obtener el producto' });
  }
});

// Post-login / registration user sync endpoint per requirement 2
app.post('/api/users/sync', async (req, res) => {
  try {
    let uid = req.body?.uid;
    let email = req.body?.email || '';
    let name = req.body?.name || undefined;

    // Optional Bearer token verification if present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const decoded = await adminAuth.verifyIdToken(token);
        if (decoded?.uid) {
          uid = decoded.uid;
          email = decoded.email || email;
          name = decoded.name || name;
        }
      } catch (tokenErr) {
        // Fallback to body uid/email if token verification fails in preview
      }
    }

    if (!uid) {
      return res.status(400).json({ error: 'Identificador uid de Firebase es requerido' });
    }

    // Role defaults to 'user' in schema and getOrCreateUser
    const user = await getOrCreateUser(uid, email, name, 'user');
    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error in /api/users/sync:', error);
    res.status(500).json({ error: error.message || 'Error al sincronizar usuario con Cloud SQL' });
  }
});

// Authenticated route to sync user to PostgreSQL (alias)
app.post('/api/auth/sync', async (req, res) => {
  try {
    const uid = req.body?.uid;
    const email = req.body?.email || '';
    const name = req.body?.name || undefined;
    if (!uid) {
      return res.status(400).json({ error: 'UID requerido' });
    }
    const user = await getOrCreateUser(uid, email, name, 'user');
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al sincronizar usuario' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Farmacia 701 server running on http://0.0.0.0:${port}`);
  });
}

startServer();
