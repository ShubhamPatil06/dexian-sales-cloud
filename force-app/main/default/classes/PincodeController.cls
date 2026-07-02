public class PincodeController {
    @AuraEnabled(cacheable = true) 
    public static list<PincodeParser.PostOfficeDetails> getPincodes(String pincode){
        
        if(String.isBlank(pincode) || !pincode.isNumeric() || pincode.length() != 6){
           throw new AuraHandledException('Please enter a valid 6-digit pincode.');     
        }
        try{
            http h = new http();
            httprequest req=new httprequest();
            req.setMethod('GET');
            req.setEndpoint('https://api.postalpincode.in/pincode/'+pincode);
            //req.setTimeout(10000); // 10 second timeout
            httpResponse res=h.send(req);
            if (res.getStatusCode() != 200) {
                throw new AuraHandledException('API error: ' + res.getStatus());
            }
            list<PincodeParser> pincodeResponse = (list<PincodeParser>)JSON.deserialize(res.getBody(), list<PincodeParser>.class);
            
            // Null safety checks
            if (pincodeResponse == null || pincodeResponse.isEmpty()) {
                throw new AuraHandledException('No response from pincode API.');
            }
            if (pincodeResponse[0].Status == 'Error') {
                throw new AuraHandledException('Invalid pincode: ' + pincodeResponse[0].Message);
            }
            if (pincodeResponse[0].PostOffice == null || pincodeResponse[0].PostOffice.isEmpty()) {
                throw new AuraHandledException('No post offices found for this pincode.');
            }
            //Returing the pincode Response List
            return pincodeResponse[0].PostOffice;
            
        }catch(AuraHandledException e){
            // re-throw our own messages as-is
             throw e;
        }catch(Exception e){
            throw new AuraHandledException('Unexpected error: ' + e.getMessage());
        }  
    }
}