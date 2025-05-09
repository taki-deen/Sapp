const express = require('express');
const { body } = require('express-validator');
const { auth, checkRole } = require('../middlewares/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - serviceType
 *         - description
 *         - location
 *         - scheduledTime
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated order ID
 *         customerId:
 *           type: string
 *           description: ID of the customer who created the order
 *         workerId:
 *           type: string
 *           description: ID of the assigned worker
 *         serviceType:
 *           type: string
 *           description: Type of service requested
 *         description:
 *           type: string
 *           description: Detailed description of the service request
 *         location:
 *           type: string
 *           description: Service location
 *         scheduledTime:
 *           type: string
 *           format: date-time
 *           description: Scheduled time for the service
 *         status:
 *           type: string
 *           enum: [pending, accepted, in-progress, completed, cancelled]
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new service request (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceType
 *               - description
 *               - location
 *               - scheduledTime
 *             properties:
 *               serviceType:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Customer access only
 */
router.post('/',
    auth,
    checkRole(['customer']),
    [
        body('serviceType').notEmpty().withMessage('Service type is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('location').notEmpty().withMessage('Location is required'),
        body('scheduledTime').notEmpty().withMessage('Scheduled time is required')
    ],
    orderController.createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all service requests (role-based)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders based on user role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single service request by ID
 *     tags: [Orders]
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
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/:id', auth, orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update service request status (Worker or Admin)
 *     tags: [Orders]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, in-progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Worker/Admin access only
 *       404:
 *         description: Order not found
 */
router.put('/:id/status', auth, checkRole(['worker', 'admin']), orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/assign:
 *   put:
 *     summary: Assign a worker to a request (Worker accepts job)
 *     tags: [Orders]
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
 *         description: Worker assigned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Worker access only
 *       404:
 *         description: Order not found
 */
router.put('/:id/assign', auth, checkRole(['worker']), orderController.assignWorker);

/**
 * @swagger
 * /api/orders/{id}/rate:
 *   put:
 *     summary: Customer rates worker after completion
 *     tags: [Orders]
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
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Customer access only
 *       404:
 *         description: Order not found
 */
router.put('/:id/rate', auth, checkRole(['customer']), [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
], orderController.rateWorker);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete a service request (Admin or owner)
 *     tags: [Orders]
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
 *         description: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Owner access only
 *       404:
 *         description: Order not found
 */
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router; 