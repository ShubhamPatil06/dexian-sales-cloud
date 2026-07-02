import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin }  from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import syncArtist from '@salesforce/apex/ArtistSyncController.syncArtist';
import getArtist  from '@salesforce/apex/ArtistSyncController.getArtist';

export default class ArtistSyncForm extends NavigationMixin(LightningElement) {

    @api recordId;

    @track artistName     = '';
    @track isLoading      = false;
    @track errorMessage   = null;
    @track syncResult     = null;
    @track existingRecord = null;
    @track resolvedRecordId = null; // final recordId used by the component

    // ── READ recordId FROM URL if @api recordId is null ──
    // When rendered as a full-page button override,
    // force:hasRecordId doesn't inject recordId.
    // CurrentPageReference gives us the URL state instead.
    @wire(CurrentPageReference)
    pageRef(ref) {
        if (ref) {
            // full page edit URL pattern:
            // /lightning/r/Music_Artist__c/{recordId}/edit
            const urlRecordId = ref?.attributes?.recordId;
            if (urlRecordId) {
                this.resolvedRecordId = urlRecordId;
            } else if (this.recordId) {
                this.resolvedRecordId = this.recordId;
            }
        }
    }

    // ── WIRE: load existing record once resolvedRecordId is set
    @wire(getArtist, { recordId: '$resolvedRecordId' })
    wiredArtist({ data, error }) {
        if (!this.resolvedRecordId) return;

        if (data) {
            this.existingRecord = data;
            this.artistName     = data.Name;
        } else if (error) {
            console.error('Error loading artist:', error);
        }
    }

    // ── COMPUTED PROPERTIES ───────────────────────────────
    get saveButtonLabel() {
        return this.resolvedRecordId
            ? 'Re-sync with Spotify'
            : 'Save & Sync';
    }

    get isSaveDisabled() {
        return !this.artistName || this.artistName.trim() === '';
    }

    // ── EVENT HANDLERS ────────────────────────────────────
    handleNameChange(event) {
        this.artistName   = event.target.value;
        this.errorMessage = null;
    }

    async handleSaveAndSync() {
        this.isLoading    = true;
        this.errorMessage = null;
        this.syncResult   = null;

        try {
            const result = await syncArtist({
                artistName : this.artistName,
                recordId   : this.resolvedRecordId || null
            });

            if (result.isSuccess) {
                this.syncResult = result;
                setTimeout(() => {
                    this[NavigationMixin.Navigate]({
                        type       : 'standard__recordPage',
                        attributes : {
                            recordId      : result.recordId,
                            objectApiName : 'Music_Artist__c',
                            actionName    : 'view'
                        }
                    });
                }, 2000);
            } else {
                this.errorMessage = result.errorMessage
                    || 'Sync failed. Please try a different artist name.';
            }

        } catch (error) {
            this.errorMessage = error.body?.message
                || 'An unexpected error occurred. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }

    handleCancel() {
        if (this.resolvedRecordId) {
            this[NavigationMixin.Navigate]({
                type       : 'standard__recordPage',
                attributes : {
                    recordId      : this.resolvedRecordId,
                    objectApiName : 'Music_Artist__c',
                    actionName    : 'view'
                }
            });
        } else {
            this[NavigationMixin.Navigate]({
                type       : 'standard__objectPage',
                attributes : {
                    objectApiName : 'Music_Artist__c',
                    actionName    : 'list'
                }
            });
        }
    }
}