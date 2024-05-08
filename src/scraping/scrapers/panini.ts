import { ComicData, ComicScraper } from '../types';
import { load } from 'cheerio';
import { normalizePrice } from '../../utils';

/**
 * Represents a scraper for the Panini website.
 */
export class Panini implements ComicScraper {
    async scrape(url: string, content: string): Promise<ComicData> {
        try {
            const $ = load(content);
            const publisher = 'Panini';
            const isbn13 = '';
            const title = $('h1.page-title').text().trim();
            const price = $('.special-price .price').text().trim()
            const pages = $('[data-th="Quantidade de páginas"]').first().text().trim();
            const oldPrice = $('.old-price .price').text().trim()
            const synopsis = $('.product.overview').first().text().trim();
            const imageUrl = $('meta[property="og:image"]').attr('content');
            const isAvailable = $('#product-addtocart-button').length > 0

            return {
                title,
                publisher: publisher.replace(/.*?:([^;]*);.*/, '$1').trim(),
                url,
                offer: {
                    price: normalizePrice(price),
                    oldPrice: normalizePrice(oldPrice),
                    isAvailable
                },
                pages: Number(pages.match(/\d+/)?.slice(0, 1)) || undefined,
                synopsis: synopsis.replace(/[“”]/g, ''),
                isbn13,
                imageUrl,
                lastSuccessfulUpdateAt: new Date()
            }
        } catch (error) {
            console.error('Scraping error:', error);
            throw error;
        }
    }
}