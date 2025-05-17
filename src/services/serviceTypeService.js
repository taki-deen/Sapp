import ServiceType from '../models/ServiceType.js';

// Create service type
const createServiceType = async (serviceTypeData) => {
    const { name, description } = serviceTypeData;
    const exists = await ServiceType.findOne({ name });
    if (exists) throw new Error('Service type already exists');
    
    const serviceType = new ServiceType({ name, description });
    return await serviceType.save();
};

// Get all service types
const getAllServiceTypes = async () => {
    return await ServiceType.find({ isActive: true });
};

// Update service type
const updateServiceType = async (id, updateData) => {
    const updated = await ServiceType.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );
    if (!updated) throw new Error('Service type not found');
    return updated;
};

// Delete service type
const deleteServiceType = async (id) => {
    const deleted = await ServiceType.findByIdAndDelete(id);
    if (!deleted) throw new Error('Service type not found');
};

export default {
    createServiceType,
    getAllServiceTypes,
    updateServiceType,
    deleteServiceType
}; 