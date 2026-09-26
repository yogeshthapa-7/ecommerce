const AuditLog = require('../models/AuditLog');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Return = require('../models/Return');
const Exchange = require('../models/Exchange');
const Customer = require('../models/Customer');
const Category = require('../models/Category');
const User = require('../models/User');

const modelMap = {
    Order,
    Product,
    Return,
    Exchange,
    Customer,
    Category,
    User,
};

const auditMiddleware = (entityType) => {
    return async (req, res, next) => {
        let oldEntity = null;

        if (req.method === 'PUT' || req.method === 'PATCH') {
            try {
                const Model = modelMap[entityType];
                if (Model && req.params.id) {
                    oldEntity = await Model.findById(req.params.id).lean();
                }
            } catch (e) {
                oldEntity = null;
            }
        }

        const originalSend = res.send.bind(res);

        res.send = async function (data) {
            await originalSend(data);

            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                try {
                    const method = req.method.toUpperCase();
                    let action = null;

                    if (method === 'POST') action = 'CREATE';
                    else if (method === 'PUT' || method === 'PATCH') {
                        const bodyStatus = req.body?.status;
                        if (bodyStatus === 'Approved') action = 'APPROVE';
                        else if (bodyStatus === 'Rejected') action = 'REJECT';
                        else if (bodyStatus === 'Cancelled') action = 'CANCEL';
                        else if (bodyStatus === 'Completed') action = 'COMPLETE';
                        else action = 'UPDATE';
                    }
                    else if (method === 'DELETE') action = 'DELETE';

                    if (!action) return;

                    const responseData = typeof data === 'string' ? JSON.parse(data) : data;
                    const entityId = req.params.id || responseData?._id || responseData?.id || '';

                    const actor = req.user;
                    const role = actor.role === 'user' ? 'user' : 'admin';

                    let entityName = '';
                    if (entityType === 'Order' && responseData?.orderId) entityName = responseData.orderId;
                    else if (entityType === 'Return' && responseData?.returnId) entityName = responseData.returnId;
                    else if (entityType === 'Exchange' && responseData?.exchangeId) entityName = responseData.exchangeId;
                    else if (responseData?.name) entityName = responseData.name;
                    else if (responseData?.customerName) entityName = responseData.customerName;
                    else if (responseData?.customer) entityName = typeof responseData.customer === 'string' ? responseData.customer : responseData.customer?.name || '';

                    let changes = null;
                    if (method === 'POST') {
                        changes = {
                            type: 'created',
                            values: responseData
                        };
                    } else if (method === 'PUT' || method === 'PATCH') {
                        const updatedFields = Object.keys(req.body || {});
                        changes = {
                            type: 'updated',
                            updatedFields,
                            oldValues: oldEntity || {},
                            newValues: req.body
                        };
                    } else if (method === 'DELETE') {
                        changes = {
                            type: 'deleted',
                            values: oldEntity || responseData
                        };
                    }

                    const descriptionMap = {
                        'Order': `${action} order`,
                        'Product': `${action} product`,
                        'Return': `${action} return`,
                        'Exchange': `${action} exchange`,
                        'Customer': `${action} customer`,
                        'Category': `${action} category`,
                        'User': `${action} user`,
                        'Stock': `${action} stock`
                    };

                    await AuditLog.create({
                        adminId: actor.id || actor._id,
                        adminName: `${actor.firstName || ''} ${actor.lastName || ''}`.trim() || actor.email,
                        adminEmail: actor.email,
                        role,
                        action,
                        entityType,
                        entityId: String(entityId),
                        entityName,
                        changes,
                        description: descriptionMap[entityType] || `${action} ${entityType.toLowerCase()}`,
                        ipAddress: req.ip || req.connection.remoteAddress
                    });
                } catch (auditError) {
                    console.error('Audit logging failed:', auditError);
                }
            }
        };

        next();
    };
};

module.exports = auditMiddleware;
