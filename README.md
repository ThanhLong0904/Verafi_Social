# Verafi Social

A decentralized social media application built with Next.js, Supabase, and Shelby Protocol.

## Tech Stack

- **Next.js 16**: React framework with App Router
- **Supabase**: Database and metadata storage
- **Shelby Protocol**: Decentralized file storage and Aptos wallet authentication
- **Aptos Blockchain**: Underlying blockchain for Shelby Protocol
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

## Features

- ✅ Aptos wallet authentication via Shelby Protocol
- ✅ Upload images/videos to Shelby decentralized storage
- ✅ Store post metadata in Supabase
- ✅ Real-time feed with posts from database
- ✅ Post details with comments system
- ✅ User profiles with blob management
- ✅ Like/Unlike posts functionality
- ✅ Comment on posts
- ✅ Follow/Unfollow users
- ✅ Responsive design with Vietnamese localization

## Project Structure

```
verafi-social/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   │   └── login/         # Login page
│   ├── (main)/            # Main app routes
│   │   ├── page.tsx       # Main feed page
│   │   ├── post/[id]/     # Post detail
│   │   ├── profile/[id]/  # User profile
│   │   ├── create/        # Create post modal
│   │   ├── explore/       # Explore page
│   │   ├── activity/      # Activity feed
│   │   └── search/        # Search functionality
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       ├── upload/        # File upload to Shelby
│       ├── posts/         # Posts CRUD operations
│       └── users/         # User management
├── components/             # React components
│   ├── upload/            # File upload components
│   ├── post/              # Post-related components
│   │   ├── Feed.tsx       # Main feed (real data)
│   │   ├── PostCard.tsx   # Individual post display
│   │   └── PostDetail.tsx # Post detail view
│   ├── profile/           # Profile components
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx     # Navigation bar
│   │   └── BottomNav.tsx  # Mobile bottom navigation
│   └── AccountBlobs.tsx   # User's Shelby blobs viewer
├── hooks/                 # Custom React hooks
│   ├── useUploadFile.tsx  # Shelby file upload
│   └── useSubmitFileToChain.tsx # Blockchain registration
├── lib/                   # Utilities and clients
│   ├── utils.ts           # Helper functions (Vietnamese time format)
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Authentication utilities
│   └── shelby.ts          # Shelby Protocol client
├── utils/                 # Additional utilities
│   ├── client.ts          # Shelby/Aptos clients
│   └── encodeFile.ts      # File encoding utilities
├── types/                 # TypeScript type definitions
├── packages/ui/           # UI component library
└── supabase/              # Database schema and migrations
    └── migrations/
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.development` file:

```env
# Shelby Protocol Configuration
NEXT_PUBLIC_SHELBY_API_URL=https://api.shelbynet.shelby.xyz
NEXT_PUBLIC_SHELBY_API_KEY=your_shelby_api_key
NEXT_PUBLIC_SPONSOR_ACCOUNT_ADDRESS=your_sponsor_account_address

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Setup Supabase Database

1. Create a project on [Supabase](https://supabase.com)
2. Run the migrations:

```bash
# Using Supabase CLI
supabase db push
```

Or manually copy content from `supabase/migrations/` files and run in Supabase SQL Editor.

Required tables:

- `users` - User profiles and wallet addresses
- `posts` - Post metadata with Shelby file references
- `likes` - Post likes
- `comments` - Post comments
- `follows` - User follow relationships

### 4. Setup Shelby Protocol

1. Get API key from Shelby Protocol
2. Configure sponsor account for gas fees (APT tokens required)
3. Ensure proper network configuration (ShelbyNet)

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### File Upload Flow

1. **File Selection**: User selects image/video in create post modal
2. **Encoding**: File is encoded using Clay Codes for redundancy
3. **Blockchain Registration**: File commitment is submitted to Aptos blockchain via Shelby
4. **Storage Upload**: Actual file data is uploaded to Shelby decentralized storage
5. **Metadata Storage**: Post metadata (caption, Shelby URL, etc.) is saved to Supabase
6. **Feed Display**: Posts appear in main feed with proper Shelby blob URLs

### Data Flow

- **Authentication**: Aptos wallet connection via Shelby Protocol
- **File Storage**: Shelby Protocol (decentralized, blockchain-based)
- **Metadata**: Supabase (relational database for social features)
- **URLs**: Shelby blob URLs format: `/shelby/v1/blobs/{account}/{blobName}`

### Key Components

- **Feed.tsx**: Main feed displaying real posts from Supabase (no mock data)
- **AccountBlobs.tsx**: Personal file library showing user's Shelby blobs
- **MediaUpload.tsx**: Handle complete upload flow (encoding → blockchain → storage)
- **PostCard.tsx**: Individual post display with Vietnamese relative time

## Database Schema

### Users

- `id`: UUID (primary key)
- `wallet_address`: TEXT (unique, Aptos wallet address)
- `username`: TEXT (unique, optional)
- `display_name`: TEXT (optional)
- `avatar_url`: TEXT (optional)
- `bio`: TEXT (optional)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### Posts

- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `shelby_file_id`: TEXT (unique identifier for Shelby)
- `shelby_file_url`: TEXT (full Shelby blob URL)
- `file_type`: TEXT ('image' | 'video')
- `caption`: TEXT (optional)
- `created_at`: TIMESTAMPTZ (for chronological sorting)
- `updated_at`: TIMESTAMPTZ

### Likes

- `id`: UUID (primary key)
- `post_id`: UUID (foreign key to posts)
- `user_id`: UUID (foreign key to users)
- `created_at`: TIMESTAMPTZ

### Comments

- `id`: UUID (primary key)
- `post_id`: UUID (foreign key to posts)
- `user_id`: UUID (foreign key to users)
- `content`: TEXT
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### Follows

- `id`: UUID (primary key)
- `follower_id`: UUID (foreign key to users)
- `following_id`: UUID (foreign key to users)
- `created_at`: TIMESTAMPTZ

## API Routes

### Authentication

- `POST /api/auth/login` - Login with Aptos wallet address
- `GET /api/auth/login` - Check authentication status
- `POST /api/auth/logout` - Logout user

### Posts

- `GET /api/posts` - Get all posts (reverse chronological order, real data)
- `GET /api/posts/[id]` - Get specific post by ID
- `DELETE /api/posts/[id]` - Delete post (owner only)
- `POST /api/posts/[id]/like` - Like a post
- `DELETE /api/posts/[id]/like` - Unlike a post
- `GET /api/posts/[id]/comments` - Get post comments
- `POST /api/posts/[id]/comments` - Create new comment

### Users

- `GET /api/users/[id]` - Get user profile
- `GET /api/users/[id]/follow` - Check if following user
- `POST /api/users/[id]/follow` - Follow a user
- `DELETE /api/users/[id]/follow` - Unfollow a user

### Upload

- `POST /api/upload` - Save post metadata to Supabase (after successful Shelby upload)

## Important Notes

### Wallet Requirements

- Install a compatible Aptos wallet (Petra, Martian, etc.)
- Ensure wallet has APT tokens for transaction fees
- Shelby Protocol uses sponsor accounts for gas fees

### Shelby Protocol Integration

- **Correct blob URL format**: `https://api.shelbynet.shelby.xyz/shelby/v1/blobs/{account}/{blobName}`
- **Upload endpoint**: `PUT /shelby/v1/blobs/{account}/{blobName}`
- Files are encoded with Clay Codes for redundancy and availability
- Requires Aptos blockchain transaction for file registration

### Development Notes

- Main feed uses real data from Supabase (no hardcoded mock data)
- Posts sorted by `created_at` in descending order (newest first)
- Time display uses Vietnamese relative format ("5 phút trước", "Hôm qua")
- AccountBlobs.tsx shows personal file library, separate from main feed
- Proper error handling for Shelby sync delays

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## License

MIT
