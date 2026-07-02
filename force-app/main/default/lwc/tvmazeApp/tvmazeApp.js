import { LightningElement } from 'lwc';

const TV_URL = 'https://api.tvmaze.com/search/shows?q=';
const PLACEHOLDER_IMG = 'https://via.placeholder.com/210x295?text=No+Image';

export default class TvmazeApp extends LightningElement {
    query = 'girls';
    shows = [];
    isLoading = false;
    timer;

    connectedCallback() {
        this.fetchTvShowData();
    }

    fetchTvShowData() {
        this.isLoading = true;

        fetch(TV_URL + encodeURIComponent(this.query))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Normalize data so the template never hits null fields
                this.shows = data.map(item => {
                    const show = item.show;
                    return {
                        id: show.id,
                        name: show.name,
                        premiered: show.premiered || 'Unknown',
                        ratingAverage: (show.rating && show.rating.average != null)
                            ? show.rating.average
                            : 'N/A',
                        imageUrl: (show.image && show.image.medium)
                            ? show.image.medium
                            : PLACEHOLDER_IMG
                    };
                });
            })
            .catch(error => {
                console.error('Error fetching TV shows:', error);
                this.shows = [];
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleChange(event) {
        this.query = event.target.value;
        window.clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.fetchTvShowData();
        }, 500);
    }

    get hasShows() {
        return this.shows && this.shows.length > 0;
    }
}