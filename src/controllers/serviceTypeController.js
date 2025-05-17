import { validationResult } from 'express-validator';
import serviceTypeService from '../services/serviceTypeService.js';

// Create service type
const createServiceType = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, description } = req.body;
        const serviceType = await serviceTypeService.createServiceType({ name, description });
        res.status(201).json(serviceType);
    } catch (err) {
        res.status(500).json({ message: 'Error creating service type', error: err.message });
    }
};

// Get all service types
const getAllServiceTypes = async (req, res) => {
    try {
        const types = await serviceTypeService.getAllServiceTypes();
        res.json(types);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service types', error: err.message });
    }
};

// Update service type
const updateServiceType = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        const updated = await serviceTypeService.updateServiceType(req.params.id, {
            name,
            description,
            isActive
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating service type', error: err.message });
    }
};

// Delete service type
const deleteServiceType = async (req, res) => {
    try {
        await serviceTypeService.deleteServiceType(req.params.id);
        res.json({ message: 'Service type deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting service type', error: err.message });
    }
};

export default {
    createServiceType,
    getAllServiceTypes,
    updateServiceType,
    deleteServiceType
}; 