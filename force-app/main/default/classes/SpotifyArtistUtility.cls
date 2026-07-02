public with sharing class SpotifyArtistUtility {
    // ─────────────────────────────────────────────────────
    // INNER CLASS: strongly-typed result returned to
    // both Batch and LWC Controller. Zero DML here —
    // caller owns all record operations.
    // ─────────────────────────────────────────────────────
    public class ArtistSyncResult {
        public Boolean isSuccess        { get; set; }
        public String  externalId       { get; set; } // artists.items[0].id
        public String  syncedName       { get; set; } // artists.items[0].name
        public String  artistType       { get; set; } // artists.items[0].type
        public String  spotifyUri       { get; set; } // artists.items[0].uri
        public String  spotifyUrl       { get; set; } // external_urls.spotify
        public String  apiReferenceUrl  { get; set; } // artists.items[0].href
        public String  imageLargeUrl    { get; set; } // images[0].url (640px)
        public String  imageMediumUrl   { get; set; } // images[1].url (320px)
        public String  imageSmallUrl    { get; set; } // images[2].url (160px)
        public String  rawResponse      { get; set; } // full JSON body for log
        public String  errorMessage     { get; set; } // populated on failure
        public Integer httpStatusCode   { get; set; }

        public ArtistSyncResult() {
            this.isSuccess = false; // fail-safe default
        }
    }

    // ─────────────────────────────────────────────────────
    // INNER CLASSES: mirrors Spotify Search API response
    // structure exactly so JSON.deserialize() works cleanly
    // ─────────────────────────────────────────────────────
    public class SpotifySearchResponse {
        public ArtistWrapper artists { get; set; }
    }

    public class ArtistWrapper {
        public List<ArtistItem> items { get; set; }
    }

    public class ArtistItem {
        public String            id            { get; set; }
        public String            name          { get; set; }
        public String            type          { get; set; }
        public String            uri           { get; set; }
        public String            href          { get; set; }
        public ExternalUrls      external_urls { get; set; }
        public List<ArtistImage> images        { get; set; }
    }

    public class ExternalUrls {
        public String spotify { get; set; }
    }

    public class ArtistImage {
        public String  url    { get; set; }
        public Integer height { get; set; }
        public Integer width  { get; set; }
    }

    // ─────────────────────────────────────────────────────
    // MAIN METHOD: single entry point called by both
    // ArtistSyncBatch (Flow 1) and LWC Controller (Flow 2)
    // artistName = Music_Artist__c.Name entered by user
    // ─────────────────────────────────────────────────────
    public static ArtistSyncResult syncArtist(String artistName) {

        ArtistSyncResult result = new ArtistSyncResult();

        try {
            // 1. BUILD REQUEST
            // urlEncode handles spaces, special chars
            // e.g. "AC/DC" → "AC%2FDC", "The Beatles" → "The+Beatles"
            String encodedName = EncodingUtil.urlEncode(artistName, 'UTF-8');
            String endpoint    = 'callout:Spotify_Web_API/v1/search'
                               + '?q='         + encodedName
                               + '&type=artist'
                               + '&limit=1';

            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            req.setTimeout(10000); // 10s × 10 records = 100s max
                                   // safely under 120s cumulative limit

            // 2. SEND CALLOUT
            // Named Credential auto-attaches Authorization: Bearer {token}
            Http         http = new Http();
            HttpResponse res  = http.send(req);

            // 3. ALWAYS CAPTURE RAW RESPONSE FIRST
            // Even on failure we want body stored in Response_Payload__c
            // so debugging production failures takes minutes, not hours
            result.httpStatusCode = res.getStatusCode();
            result.rawResponse    = res.getBody();

            // 4. HANDLE NON-200 RESPONSES
            if (res.getStatusCode() != 200) {
                result.errorMessage = 'HTTP ' + res.getStatusCode()
                                    + ': '    + res.getBody();
                return result;
            }

            // 5. DESERIALIZE JSON INTO TYPED INNER CLASSES
            SpotifySearchResponse parsed =
                (SpotifySearchResponse) JSON.deserialize(
                    res.getBody(),
                    SpotifySearchResponse.class
                );

            // 6. VALIDATE: Spotify returned at least one artist
            if (parsed.artists          == null
             || parsed.artists.items    == null
             || parsed.artists.items.isEmpty()) {
                result.errorMessage = 'No artist found for: ' + artistName;
                return result;
            }

            // 7. EXTRACT ALL FIELDS FROM RESPONSE
            ArtistItem artist       = parsed.artists.items[0];
            result.externalId       = artist.id;
            result.syncedName       = artist.name;
            result.artistType       = artist.type;
            result.spotifyUri       = artist.uri;
            result.apiReferenceUrl  = artist.href;

            // safely navigate nested external_urls object
            if (artist.external_urls != null) {
                result.spotifyUrl = artist.external_urls.spotify;
            }

            // images array: [0]=640px, [1]=320px, [2]=160px
            // null-safe checks since image count could vary
            if (artist.images != null && artist.images.size() > 0) {
                result.imageLargeUrl  = artist.images[0].url;
            }
            if (artist.images != null && artist.images.size() > 1) {
                result.imageMediumUrl = artist.images[1].url;
            }
            if (artist.images != null && artist.images.size() > 2) {
                result.imageSmallUrl  = artist.images[2].url;
            }

            result.isSuccess = true;

        } catch (Exception e) {
            // catches network timeouts, JSON parse failures,
            // unexpected nulls — error stored for log record
            result.errorMessage = e.getMessage();
        }

        return result;
    }
}