import requests
from bs4 import BeautifulSoup
import json
from datetime import date, timedelta
import time
import os
import random


def add_one_month(dt):
    """
    Calculates the first day of the next month from a given date.
    """
    year = dt.year
    month = dt.month
    
    if month == 12:
        return date(year + 1, 1, 1)
    else:
        return date(year, month + 1, 1)
    


def get_article_links_for_date(current_date):
    """
    Fetches all unique article links from the Tagesschau archive page for a given date.
    """
    archive_url = f"https://www.tagesschau.de/archiv?datum={current_date.strftime('%Y-%m-%d')}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(archive_url, headers=headers)
        response.raise_for_status()  # Will raise an HTTPError for bad responses (4xx or 5xx)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching archive page for {current_date}: {e}")
        return []

    soup = BeautifulSoup(response.content, 'html.parser')
    links = set()
    # This selector targets the teaser links in the main content area.
    for link in soup.select('div.teaser-right a'):
        href = link.get('href')
        if href and href.startswith('/'):
            full_url = "https://www.tagesschau.de" + href
            links.add(full_url)
    return list(links)

def scrape_article_content(article_url, article_date):
    """
    Scrapes the headline, sub-headline, paragraphs, and image captions from a single article page.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(article_url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching article {article_url}: {e}")
        return None

    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract headline
    headline_tag = soup.find('h1', class_='article-head__headline')
    headline = headline_tag.get_text(strip=True) if headline_tag else "No headline found"

    # Extract sub-headline (often the first paragraph in the story text)
    sub_headline_tag = soup.find('p', class_='article-head__shorttext')
    sub_headline = sub_headline_tag.get_text(strip=True) if sub_headline_tag else ""

    # Extract paragraphs
    paragraphs = []
    story_div = soup.find_all('p', class_='textabsatz')
    for p in story_div:
        paragraphs.append(p.get_text(strip=True))

    # Extract image captions
    #captions = []
    #for figure in soup.find_all('figure'):
        #caption_tag = figure.find('p', class_='caption')
        #if caption_tag:
            #captions.append(caption_tag.get_text(strip=True))

    return {
        "url": article_url,
        "date": article_date.strftime('%Y-%m-%d'),
        "headline": headline,
        "sub_headline": sub_headline,
        "paragraphs": paragraphs,
    }

def main():
    """
    Main function to iterate through dates, scrape articles, and save to a JSON file.
    """
    start_date = date(2007, 1, 1)
    end_date = date(2026, 3, 16)
    all_articles = []
    
    output_filename = 'tagesschau_articles.json'

    # Load existing data if the file already exists
    if os.path.exists(output_filename):
        with open(output_filename, 'r', encoding='utf-8') as f:
            try:
                all_articles = json.load(f)
                print(f"Loaded {len(all_articles)} existing articles from {output_filename}.")
            except json.JSONDecodeError:
                print(f"Warning: {output_filename} is not a valid JSON file. Starting fresh.")
                all_articles = []

    current_date = start_date
    while current_date <= end_date:
        print(f"Processing date: {current_date.strftime('%Y-%m-%d')}")
        
        article_links = get_article_links_for_date(current_date)
        
        if not article_links:
            print(f"No articles found for {current_date}.")
        else:
            print(f"Found {len(article_links)} articles for {current_date}.")
        
        article_links = random.sample(article_links, 1)
        for link in article_links:
            # Check if the article has already been scraped
            if any(article['url'] == link for article in all_articles):
                print(f"Skipping already scraped article: {link}")
                continue

            article_data = scrape_article_content(link, current_date)
            if article_data:
                all_articles.append(article_data)
                print(f"  -> Scraped: {article_data['headline']}")
            
            # Polite delay to avoid overwhelming the server
            time.sleep(0) # 1-second delay between article requests

        # Save progress after each day
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(all_articles, f, ensure_ascii=False, indent=4)
        
        print(f"Saved {len(all_articles)} total articles to {output_filename}.")
        
        # Move to the next month
        current_date = add_one_month(current_date)        
        time.sleep(2)

    print("\nScraping complete.")
    print(f"Total articles saved: {len(all_articles)}")

if __name__ == "__main__":
    main()
