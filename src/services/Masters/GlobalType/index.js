import { apiFetch } from '../../api';

export const getGlobalType = (globalTypeId) => {
    return apiFetch(`/globaltype/search`, {
        method: 'POST',
        body: JSON.stringify(globalTypeId)
    });
};

export const saveGlobalType = (globalTypeId, payload) => {
    return apiFetch(`/globaltype/save?GlobalTypeMasterID=${globalTypeId}`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
