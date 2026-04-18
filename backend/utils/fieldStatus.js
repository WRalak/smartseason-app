// Status determination logic:
// - Active: Planted or Growing stage, within normal timeline
// - At Risk: Planted/Growing stage but planting date > 30 days without progress, or Ready stage > 14 days
// - Completed: Harvested stage

export const computeFieldStatus = (field) => {
    const today = new Date();
    const plantingDate = new Date(field.planting_date);
    const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
    const stage = field.current_stage;

    // Completed fields
    if (stage === 'harvested') {
        return 'completed';
    }

    // At risk conditions
    if (stage === 'planted' && daysSincePlanting > 30) {
        return 'at_risk';
    }
    
    if (stage === 'growing' && daysSincePlanting > 60) {
        return 'at_risk';
    }
    
    if (stage === 'ready' && daysSincePlanting > 90) {
        return 'at_risk';
    }

    // Active by default
    return 'active';
};