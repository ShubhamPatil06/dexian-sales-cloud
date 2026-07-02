({
    doInit: function(component, event, helper) {
        // log to confirm recordId is arriving in Aura
        var recordId = component.get("v.recordId");
        console.log('artistSyncFormAura — recordId on init: ' + recordId);
    }
})