import express from 'express';
import { body } from 'express-validator';
import { checkRole } from '../middlewares/auth.js';
import serviceTypeController from '../controllers/serviceTypeController.js';

const router = express.Router();

/**
 * @swagger
 * /api/service-types:
 *   post:
 *     summary: Create a new service type (Admin only)
 *     tags: [Service Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service type created successfully
 *       400:
 *         description: Validation error or service type already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.post('/',
    
    checkRole(['admin']),
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required')
    ],
    serviceTypeController.createServiceType
);

/**
 * @swagger
 * /api/service-types:
 *   get:
 *     summary: Get all active service types
 *     tags: [Service Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of service types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/',  serviceTypeController.getAllServiceTypes);

/**
 * @swagger
 * /api/service-types/{id}:
 *   put:
 *     summary: Update a service type (Admin only)
 *     tags: [Service Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service type updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Service type not found
 *       500:
 *         description: Server error
 */
router.put('/:id',  checkRole(['admin']), serviceTypeController.updateServiceType);

/**
 * @swagger
 * /api/service-types/{id}:
 *   delete:
 *     summary: Delete a service type (Admin only)
 *     tags: [Service Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service type deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Service type not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',  checkRole(['admin']), serviceTypeController.deleteServiceType);

export default router; 