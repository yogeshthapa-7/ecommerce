const AuditLog = require('../models/AuditLog');

const auditMiddleware = (entityType) => {
    return async (req, res, next) => {
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

                    const admin = req.user;
                    let entityName = '';
                    if (entityType === 'Order' && responseData?.orderId) entityName = responseData.orderId;
                    else if (entityType === 'Return' && responseData?.returnId) entityName = responseData.returnId;
                    else if (entityType === 'Exchange' && responseData?.exchangeId) entityName = responseData.exchangeId;
                    else if (responseData?.name) entityName = responseData.name;
                    else if (responseData?.customerName) entityName = responseData.customerName;
                    else if (responseData?.customer) entityName = typeof responseData.customer === 'string' ? responseData.customer : responseData.customer?.name || '';

                    let changes = null;
                    if (method === 'PUT' || method === 'PATCH') {
                        changes = {
                            updatedFields: Object.keys(req.body || {}),
                            newValues: req.body
                        };
                    }

                    const descriptionMap = {
                        'Order': `${action} order`,
                        'Product': `${action} product`,
                        'Return': `${action} return`,
                        'Exchange': `${action} exchange`,
                        'Customer': `${action} customer`,
                        'Category': `${action} category`,
                        'User': `${action} user`
                    };

                    await AuditLog.create({
                        adminId: admin.id || admin._id,
                        adminName: `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email,
                        adminEmail: admin.email,
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
