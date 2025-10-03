"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRoutes = void 0;
const express_1 = __importDefault(require("express"));
const assetService_1 = require("../services/assetService");
const router = express_1.default.Router();
exports.assetRoutes = router;
// GET /api/assets - Get all assets with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const activeOnly = req.query.activeOnly !== 'false';
        const result = await assetService_1.AssetService.getAllAssets(page, limit, activeOnly);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/assets/total - Get total asset value
router.get('/total', async (req, res) => {
    try {
        const activeOnly = req.query.activeOnly !== 'false';
        const result = await assetService_1.AssetService.getTotalAssetValue(activeOnly);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/assets/type/:type - Get assets by type
router.get('/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const activeOnly = req.query.activeOnly !== 'false';
        const result = await assetService_1.AssetService.getAssetsByType(type, activeOnly);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/assets/:id - Get asset by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await assetService_1.AssetService.getAssetById(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Asset not found') {
            res.status(404).json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// POST /api/assets - Create new asset
router.post('/', async (req, res) => {
    try {
        const { name, type, currentValue, dateAcquired, description } = req.body;
        const result = await assetService_1.AssetService.createAsset({
            name,
            type: type,
            currentValue,
            dateAcquired: new Date(dateAcquired),
            description
        });
        if (result.success) {
            res.status(201).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// PUT /api/assets/:id - Update asset
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.dateAcquired) {
            updateData.dateAcquired = new Date(updateData.dateAcquired);
        }
        const result = await assetService_1.AssetService.updateAsset(id, updateData);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Asset not found') {
            res.status(404).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// DELETE /api/assets/:id - Delete asset (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await assetService_1.AssetService.deleteAsset(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Asset not found') {
            res.status(404).json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
//# sourceMappingURL=assetRoutes.js.map