import json
from playwright.sync_api import sync_playwright, expect

# Seed data with valid image URLs from the main seed file
seed_data_string = """
{
    "users": [
        { "id": "admin_user", "name": "Admin User", "email": "admin@example.com", "password": "password", "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop", "role": "admin", "favorites": [], "watchHistory": [] }
    ],
    "videos": [
        { "id": "video_1", "title": "Monochrome Dreams", "description": "An artistic exploration of light and shadow in high fashion.", "image": "https://images.unsplash.com/photo-1587502537104-605039215763?q=80&w=1280&h=720&auto=format&fit=crop", "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "models": ["Alina"], "tags": ["fashion", "cinematic", "black & white"], "keywords": ["monochrome", "dreams", "alina"], "date": "2025-08-16T10:09:30.388Z", "status": "Published", "isFeatured": true },
        { "id": "video_2", "title": "Urban Canvas", "description": "The city streets become a runway in this dynamic fashion film.", "image": "https://images.unsplash.com/photo-1505692952047-4a6931de4575?q=80&w=1280&h=720&auto=format&fit=crop", "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "models": ["Elena", "Sophia"], "tags": ["fashion", "urban", "lifestyle"], "keywords": ["urban", "canvas", "elena", "sophia"], "date": "2025-08-15T10:09:30.388Z", "status": "Published", "isFeatured": true }
    ],
    "galleries": [
        { "id": "gallery_1", "title": "Collection A", "description": "An exclusive look into Collection A, featuring stunning visuals and unique concepts.", "image": "https://picsum.photos/1280/720?random=0", "album": ["https://images.unsplash.com/photo-1611601322175-804153535543?q=80&w=800&h=1200&auto=format&fit=crop"], "models": ["Alina"], "tags": ["fashion", "art"], "keywords": ["gallery 1", "alina", "fashion"], "date": "2025-08-17T10:09:30.388Z", "status": "Published" }
    ],
    "models": [
        { "id": "model_1", "name": "Alina", "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&h=1200&auto=format&fit=crop", "description": "Alina's ethereal look has graced the covers of numerous international fashion magazines." }
    ]
}
"""

def run(playwright):
    browser = playwright.chromium.launch()
    seed_data = json.loads(seed_data_string)

    storage_state = {
        "origins": [{
            "origin": "http://localhost:3001",
            "localStorage": [
                {"name": "users", "value": json.dumps(seed_data['users'])},
                {"name": "videos", "value": json.dumps(seed_data['videos'])},
                {"name": "galleries", "value": json.dumps(seed_data['galleries'])},
                {"name": "models", "value": json.dumps(seed_data['models'])},
                {"name": "session_user_id", "value": "admin_user"},
                {"name": "luxe_access_granted", "value": "true"},
                {"name": "db_seeded", "value": "true"}
            ]
        }]
    }

    context = browser.new_context(storage_state=storage_state)
    page = context.new_page()
    page.set_viewport_size({"width": 1920, "height": 1080})

    print("Capturing final preview screenshot...")
    page.goto("http://localhost:3001/")
    expect(page.locator("body")).to_be_visible(timeout=10000)
    # Wait for images to load
    page.wait_for_load_state('networkidle')
    page.screenshot(path="jules-scratch/verification/final_preview.png", full_page=True)

    print("Screenshot captured.")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
