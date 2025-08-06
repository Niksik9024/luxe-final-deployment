# **App Name**: LUXE

## Core Features:

- Homepage UI: Display a homepage with hero banners, content grids for videos and photos, and model showcases.
- Galleries: Create dedicated galleries for videos and photos with filtering options (Sort By, Categories, Duration, Models).
- Model Pages: Showcase model index and individual portfolios with model details and content.
- Single Content: Develop single content pages (videos/photos) with related content recommendations. Use infinite scroll for recommendations.
- Responsiveness: Implement responsive layouts that adapt to desktop (1920x1080px) and mobile (375x667px) viewports.
- Thumbnails: Display thumbnails and enable hover-over effects for videos.
- Sticky Navigation Bar: Sticky Navigation Bar: Fixed top, z-index 1000, Height: 65px (desktop) / 60px (mobile), Background: Solid black with subtle box-shadow, Desktop Layout: Left: White SVG logo (links to homepage), Center: Navigation links (MODELS, VIDEOS, IMAGES), Right: Data Saver toggle, Search icon, Authentication element, Mobile Layout: Left: Hamburger menu icon + Logo, Right: Search icon + Authentication element, Full-screen overlay menu with: Data Saver toggle, navigation links, legal links, Authentication States: Logged out: \"SIGN IN\" button (white text, red background), Logged in: Profile icon with dropdown (Username, View Profile, Admin CMS if applicable, Sign Out)
- Universal Footer: Universal Footer: 4-column layout (desktop) / single-column stack (mobile), Columns: Company, Discover, Business, Legal, Bottom row: Copyright notice + social media icons
- Homepage Hero Banner Section: Homepage Hero Banner Section: Size: 1920x1080px (desktop) / 375x425px (mobile), Behavior: Conditional autoplay based on Data Saver setting, Content: 3-second static thumbnail → muted video teaser (if Data Saver OFF), Overlay: \"Watch Now\" button with dark gradient scrim, Interaction: Entire banner clickable, navigates to video page
- Homepage Top Videos Section: Homepage Top Videos Section: Layout: 3-column responsive grid (desktop) / 1-column stack (mobile), Cards: 6 total, lazy-loaded with skeleton placeholders, Card size: 630x353px (desktop) / 467x425px (mobile), Behavior: Hover autoplay (desktop) / scroll-into-view autoplay (mobile) before that there is thumbnail and once hover removed or not touched it comes back to thumbnail, Single Player Rule: Only one video plays at a time, Overlay: Scene title + model name (top-left, appears on video start)
- Homepage Promotional Banner Section: Homepage Promotional Banner Section: Size: 1920x800px (desktop) / 375x411px (mobile), Content: Static high-quality image, no video, Overlay: Call-to-action button (centered bottom), Lazy-loaded with skeleton placeholder, Interaction: Navigate to that particular image page or video page
- Homepage Featured Images Section: Homepage Featured Images Section: Layout: 6x1 grid (desktop) / 2x3 grid (mobile), Card size: 148x245px (desktop) / 196x326px (mobile), Content: Static images, randomized on each page load, Overlay: Model name (bottom-left, hover on desktop / permanent on mobile), Interaction: Navigate to that particular model video or image
- Homepage Latest Videos Section: Homepage Latest Videos Section: Identical to Top Videos section, Content: 6 most recent videos (reverse chronological), Additional: \"SHOW ALL VIDEOS\" button below grid
- Homepage Models Section: Homepage Models Section: Layout: 6x1 grid (desktop) / 2x3 grid (mobile), Card size: 320x565px (desktop) / 188x334px (mobile), Content: High-resolution model images, randomized selection, Overlay: Model name (always visible, bottom-left), Interaction: Navigate to model profile page
- Homepage Upcoming Scene Section: Homepage Upcoming Scene Section: Identical structure to Hero Banner, Performance: Aggressively lazy-loaded (zero impact on initial load)
- Videos Gallery Filter Bar: Videos Gallery Filter Bar: Dropdowns: Sort By (Latest, top videos , Most Viewed), Categories, Duration, Models, Full-width below header, Query parameters append to GET /api/scenes?type=video
- Videos Gallery Content Grid: Videos Gallery Content Grid: Uniform responsive grid, Exclusively video content cards, contains 12 videos in one page at bottom there pagination pages section that leads to page no 2 , then 3 then go on, Layout: 3-column responsive grid (desktop) / 1-column stack (mobile), Cards: 6 total, lazy-loaded with skeleton placeholders, Card size: 630x353px (desktop) / 467x425px (mobile), Behavior: Hover autoplay (desktop) / scroll-into-view autoplay (mobile) before that there is thumbnail and once hover removed or not touched it comes back to thumbnail, Single Player Rule: Only one video plays at a time, Scene title + model name (bottom, appears on below video permamently), Interaction: Navigate to that particular video page when clicked on any any video card
- Photos Gallery Filter Bar: Photos Gallery Filter Bar: Photo-specific filters: Sort By, Categories, Album Size, Models, Query parameters append to GET /api/scenes?type=photo
- Photos Gallery Content Grid: Photos Gallery Content Grid: Identical structure to videos page, Exclusively photo set cards, Interaction: Navigate to that particular image page when clicked on photo card
- Models Index Layout: Models Index Layout: Responsive grid of portrait model cards, Hover reveals model name, Clean, minimal design, contains 24 models in one page at bottom there pagination pages section that leads to page no 2 , then 3 then go on that contains more models, Layout: 6x1 grid (desktop) / 2x3 grid (mobile), Card size: 320x565px (desktop) / 188x334px (mobile), Content: High-resolution model images, randomized selection, Overlay: Model name (always visible, bottom-left), Interaction: Navigate to model profile page
- Single Model Portfolio Hero Section: Single Model Portfolio Hero Section: Panoramic hero image, Model name in large serif font
- Single Model Portfolio Filter Bar: Single Model Portfolio Filter Bar: Options: ALL, VIDEOS, PHOTOS, Updates content grid dynamically
- Single Model Portfolio Content Sections: Single Model Portfolio Content Sections: Model's video/photo content grid, Image albums section with thumbnails, Related models carousel, Interaction: Navigate to that particular content page when clicked on image leeads to particular image page same for video leads to particular video page
- Single Scene Page Video Player/Image Viewer: Single Scene Page Video Player/Image Viewer: Full-bleed, responsive design, Video: 16:9 ratio with quality controls, Photos: Hero image with full thumbnail grid below
- Single Scene Page Metadata Block: Single Scene Page Metadata Block: Scene title, model name (linked), date, description, tags, Centered, elegant typography
- Single Scene Page Related Content: Single Scene Page Related Content: Videos: Related scenes grid, Photos: Lightbox viewer for full album

## Style Guidelines:

- Primary color: Deep purple (#581845) to reflect sophistication.
- Background color: Light grey (#E8E2E7) to create a neutral backdrop.
- Accent color: Warm red (#900C3F) for highlighting calls to action.
- Body font: 'Inter', a sans-serif font, to ensure the body and headlines appear modern, machined, and objective.
- Headline font: 'Inter', a sans-serif font, to ensure the body and headlines appear modern, machined, and objective.
- Utilize a responsive grid system with 3-column layout on desktop and a single-column layout on mobile devices.
- Incorporate sticky navigation bar at the top of the page and a consistent footer across all pages.